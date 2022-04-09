/**
 * A cache of resources to avoid loading the same module twice. This is important
 * because Webpack dynamic imports only expose an asynchronous API for loading
 * modules, so to be able to access already-loaded modules synchronously we
 * must have stored the previous result somewhere.
 */
import { isNil } from 'swiss-knife-utils'
import { ResourceLoader } from './RoutingTypes'
import React from 'react'

const resourceMap = new Map<string, RouteResource>()

type GetResourceFromLoader<Loader extends ResourceLoader> =
  ReturnType<Loader> extends Promise<{ default: infer R }>
    ? R extends React.ComponentType
      ? R
      : never
    : never

/**
 * A generic resource: given some method to asynchronously load a value - the loader()
 * argument - it allows accessing the state of the resource.
 */
export class RouteResource<Loader extends ResourceLoader = ResourceLoader> {
  _error: Error | null
  _loader: Loader
  _promise: Promise<any> | null
  public _result: GetResourceFromLoader<Loader> | null

  constructor(loader: Loader) {
    this._error = null
    this._loader = loader
    this._promise = null
    this._result = null
  }

  /**
   * Loads the resource if necessary.
   */
  load() {
    let promise = this._promise
    if (promise == null) {
      promise = this._loader()
        .then((result) => {
          this._result = result?.default as GetResourceFromLoader<Loader>
          return result
        })
        .catch((error) => {
          this._error = error
          throw error
        })
      this._promise = promise
    }
    return promise
  }

  /**
   * Returns the result, if available. This can be useful to check if the value
   * is resolved yet.
   */
  get(): React.ComponentProps<GetResourceFromLoader<Loader>> | void {
    if (this._result !== null) {
      return this._result
    }
  }

  /**
   * This is the key method for integrating with React Suspense. Read will:
   * - "Suspend" if the resource is still pending (currently implemented as
   *   throwing a Promise, though this is subject to change in future
   *   versions of React)
   * - Throw an error if the resource failed to load.
   * - Return the data of the resource if available.
   */
  read(): GetResourceFromLoader<Loader> {
    if (this._result !== null) {
      return this._result
    } else if (this._error !== null) {
      throw this._error
    } else {
      throw this._promise
    }
  }
}

/**
 * A helper method to create a resource, intended for dynamically loading code.
 *
 * Example:
 * ```
 *    // Before rendering, ie in an event handler:
 *    const resource = JSResource('Foo', () => import('./Foo.js));
 *    resource.load();
 *
 *    // in a React component:
 *    const Foo = resource.read();
 *    return <Foo ... />;
 * ```
 *
 * @param {*} moduleId A globally unique identifier for the resource used for caching
 * @param {*} loader A method to load the resource's data if necessary
 */
export function cacheRouteResource<
  Loader extends ResourceLoader = ResourceLoader
>(moduleId: string, loader: Loader): RouteResource<Loader> {
  let resource = resourceMap.get(moduleId) as RouteResource<Loader>

  if (isNil(resource)) {
    resource = new RouteResource<Loader>(loader)
    resourceMap.set(moduleId, resource)
  }

  return resource
}

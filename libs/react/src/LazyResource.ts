import { GetResourceFromLoader, ResourceLoader } from './RoutingTypes'
import React from 'react'
import { isNil } from 'swiss-knife-utils'

export class LazyResource<Loader extends ResourceLoader = ResourceLoader> {
  static cache = new Map<string | number, LazyResource>()

  private error: Error | null = null
  private promise: Promise<any> | null = null
  private loader: Loader

  public result: GetResourceFromLoader<Loader> | null = null

  constructor(resourceId: string | number, loader: Loader) {
    this.loader = loader

    const cachedResource = LazyResource.cache.get(resourceId)

    if (!isNil(cachedResource)) {
      if (process.env['NODE_ENV'] !== 'production') {
        console.info(
          `LazyResource: Resource id "${resourceId}" is already in resource cache.`
        )
      }

      return cachedResource as LazyResource<Loader>
    }

    LazyResource.cache.set(resourceId, this)
  }

  private async startLoading(): Promise<ReturnType<Loader> | void> {
    try {
      const result = await this.loader()
      this.result = result?.default as GetResourceFromLoader<Loader>
      return result
    } catch (error) {
      this.error = error as Error
    }
  }

  /**
   * Loads the resource if necessary.
   */
  public load(): Promise<ReturnType<Loader>> {
    if (isNil(this.promise)) {
      this.promise = this.startLoading()
    }

    return this.promise
  }

  /**
   * Returns the result, if available. This can be useful to check if the value
   * is resolved yet.
   */
  public get(): React.ComponentProps<GetResourceFromLoader<Loader>> | void {
    if (!isNil(this.result)) {
      return this.result
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
  public read(): GetResourceFromLoader<Loader> {
    if (!isNil(this.result)) {
      return this.result
    } else if (!isNil(this.error)) {
      throw this.error
    } else {
      throw this.promise
    }
  }
}

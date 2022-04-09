import { MatchedRoute, RouteConfig } from 'react-router-config'
import { Location } from 'history'
import { RouteResource } from './RouteResource'
import React, { JSXElementConstructor } from 'react'

export type ResourceLoader<
  T extends React.ComponentType = React.ComponentType<any>
> = () => Promise<{ default: T }>

export type GetResourceFromLoader<Loader extends ResourceLoader> =
  ReturnType<Loader> extends Promise<{
    default: infer R
  }>
    ? R extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
      ? R
      : never
    : never

export interface RouterEntryData<Params = Record<string, unknown>> {
  children?: React.ReactNode
  component: RouteResource
  prepared: Params
  routeData: MatchedRelayRoute['match']
}

export interface RouterEntry {
  location: Location
  entries: RouterEntryData[]
}

export interface RelayRouteConfig<
  Resource extends RouteResource = RouteResource,
  Params = Record<string, string>
> extends Omit<RouteConfig, 'component' | 'routes'> {
  component: Resource
  prepare: (
    params: Params
  ) => Resource extends RouteResource<infer R>
    ? React.ComponentProps<GetResourceFromLoader<R>>
    : never
  routes?: RelayRouteConfig[]
}

export interface MatchedRelayRoute extends Omit<MatchedRoute<{}>, 'route'> {
  route: RelayRouteConfig
}

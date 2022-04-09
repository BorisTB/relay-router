import { LazyResource } from './LazyResource'
import { GetResourceFromLoader, ResourceLoader } from './RoutingTypes'
import React from 'react'

type PathSymbol = '/' | '?' | '(' | ')'

type CleanParamName<Param extends string> =
  Param extends `${infer P}${PathSymbol}${string}`
    ? CleanParamName<P>
    : Param extends `${PathSymbol}${infer P}`
    ? CleanParamName<P>
    : Param

type SeparateParams<Params extends string> =
  Params extends `${infer P1}:${infer P2}`
    ? CleanParamName<P1> | SeparateParams<P2>
    : Params

type GetParamNamesFromPath<Path extends string> = Path extends `${
  | '/'
  | ''}:${infer R}`
  ? SeparateParams<R>
  : never

type GetPathParams<Path extends string> = Record<
  GetParamNamesFromPath<Path>,
  string
>

interface SubRoute {
  path?: string
  exact?: boolean
  module?: RouteModule
}

interface RoutesMap {
  [key: string]: SubRoute
}

export interface RouteModuleConfig<
  Loader extends ResourceLoader = ResourceLoader,
  Path extends string = string
> {
  path?: Path
  component?: LazyResource<Loader>
  prepare?: (
    params: GetPathParams<Path>
  ) => React.ComponentProps<GetResourceFromLoader<Loader>>
  routes?: RoutesMap
}

export class RouteModule<
  Loader extends ResourceLoader = ResourceLoader,
  Path extends string = string
> {
  private config: RouteModuleConfig<Loader, Path> = {}

  constructor(config: RouteModuleConfig<Loader, Path>) {
    this.config = config
  }

  public prepare(): void {
    this.config.prepare
  }
}

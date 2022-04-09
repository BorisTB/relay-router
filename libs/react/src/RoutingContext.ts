import React, { useContext } from 'react'
import { BrowserHistory } from 'history'
import { RouterEntry } from './RoutingTypes'

export interface RoutingContextValue {
  history: BrowserHistory
  get: () => RouterEntry
  preload: (pathname: string) => void
  preloadCode: (pathname: string) => void
  subscribe: (cb: (entry: RouterEntry) => void) => () => void
}

export const RoutingContext = React.createContext<RoutingContextValue>(
  {} as RoutingContextValue
)

export function useRoutingContext(): RoutingContextValue {
  return useContext(RoutingContext)
}

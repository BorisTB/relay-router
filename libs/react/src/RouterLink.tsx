import React, { useCallback } from 'react'
import { useRoutingContext } from './RoutingContext'
import { isFunction } from 'swiss-knife-utils'

export interface RouterLinkProps extends React.ComponentPropsWithRef<'a'> {
  to: string
}

export const RouterLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(
  ({ children, to, onClick, onMouseDown, onMouseEnter, ...props }, ref) => {
    const router = useRoutingContext()

    const changeRoute = useCallback<React.MouseEventHandler>(
      (event) => {
        event.preventDefault()
        router.history.push(to)
      },
      [to, router]
    )

    const preloadRouteCode = useCallback(() => {
      router.preloadCode(to)
    }, [to, router])

    const preloadRoute = useCallback(() => {
      router.preload(to)
    }, [to, router])

    const handleOnClick = useCallback<React.MouseEventHandler>(
      (...args) => {
        changeRoute(...args)

        if (isFunction(onClick)) {
          onClick(...args)
        }
      },
      [onClick, changeRoute]
    )

    const handleMouseEnter = useCallback<React.MouseEventHandler>(
      (...args) => {
        preloadRouteCode()

        if (isFunction(onMouseEnter)) {
          onMouseEnter(...args)
        }
      },
      [onMouseEnter, preloadRouteCode]
    )

    const handleMouseDown = useCallback<React.MouseEventHandler>(
      (...args) => {
        preloadRoute()

        if (isFunction(onMouseDown)) {
          onMouseDown(...args)
        }
      },
      [onMouseDown, preloadRoute]
    )

    return (
      <a
        {...props}
        href={to}
        onClick={handleOnClick}
        onMouseEnter={handleMouseEnter}
        onMouseDown={handleMouseDown}
        ref={ref}>
        {children}
      </a>
    )
  }
)

RouterLink.displayName = 'RouterLink'

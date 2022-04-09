import React from 'react'

export interface RouteErrorBoundaryProps {
  children?: React.ReactNode
}

/**
 * A reusable component for handling errors in a React (sub)tree.
 */
export class RouteErrorBoundary extends React.Component<
  RouteErrorBoundaryProps,
  { error: Error | null }
> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return {
      error
    }
  }

  override render() {
    if (this.state.error != null) {
      return (
        <div>
          <div>Error: {this.state.error.message}</div>
          <div>
            <pre>{JSON.stringify(this.state.error, null, 2)}</pre>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

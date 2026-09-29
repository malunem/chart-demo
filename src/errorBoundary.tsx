import { Component } from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

/**
 * Renders a generic alert if there is an error in child components
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false }

  /**
   * Returns the state with the error: `hasError: true` and the Error itself
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  /**
   * Renders the alert if there is an error, otherwise renders child component as usual
   */
  override render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger" role="alert">
          Something went wrong!
        </div>
      )
    }
    return this.props.children
  }
}

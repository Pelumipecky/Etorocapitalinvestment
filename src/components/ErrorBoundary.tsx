import React from 'react'

type Props = { children: React.ReactNode }
type State = { hasError: boolean; error?: Error }

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console and allow dev server overlay to show
    // Developers can replace this with a monitoring service.
    // eslint-disable-next-line no-console
    console.error('Uncaught error in render:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, background: '#fff3f3', color: '#611', minHeight: '100vh' }}>
          <h1>Something went wrong</h1>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{String(this.state.error)}</pre>
        </div>
      )
    }

    return this.props.children
  }
}

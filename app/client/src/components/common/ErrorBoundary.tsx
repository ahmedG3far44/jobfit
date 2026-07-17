import { Component, type ReactNode, type ErrorInfo } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md">
            {this.state.error.message || 'An unexpected error occurred'}
          </p>
          <Button
            onClick={() => {
              this.setState({ error: null })
              window.location.reload()
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload page
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

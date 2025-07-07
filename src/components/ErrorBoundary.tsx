import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-600 mb-4">
            An error occurred while rendering this component.
          </p>
          {this.state.error && (
            <details className="bg-red-100 p-3 rounded">
              <summary className="cursor-pointer text-red-700 font-medium">
                Error details
              </summary>
              <pre className="mt-2 text-sm text-red-600 overflow-auto">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
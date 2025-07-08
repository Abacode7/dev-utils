import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Icons } from '../styles/icons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { 
      hasError: true, 
      error,
      errorId
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props;
    
    // Log error details
    console.group('🚨 Error Boundary Caught Error');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();

    // Store error info for debugging
    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (onError) {
      try {
        onError(error, errorInfo);
      } catch (handlerError) {
        console.error('Error in custom error handler:', handlerError);
      }
    }

    // Report to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId,
    };

    console.log('Error report prepared:', errorReport);
  };

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    } else {
      window.location.reload();
    }
  };

  private copyErrorInfo = () => {
    const { error, errorInfo, errorId } = this.state;
    const errorDetails = {
      errorId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => alert('Error details copied to clipboard'))
      .catch(() => console.error('Failed to copy error details'));
  };

  public render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      const { error, errorId } = this.state;
      const canRetry = this.retryCount < this.maxRetries;

      if (fallback) {
        return fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
          <div className="max-w-lg w-full bg-surface-primary rounded-xl shadow-lg border border-border-primary p-8">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mb-4">
                <Icons.Alert size={32} className="text-error-600" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-text-secondary">
                We encountered an unexpected error. Don't worry, we're on it!
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && error && (
              <div className="mb-6 p-4 bg-error-50 rounded-lg border border-error-200">
                <h3 className="font-semibold text-error-800 mb-2">
                  Development Error Details:
                </h3>
                <p className="text-sm text-error-700 font-mono break-all">
                  {error.message}
                </p>
                {errorId && (
                  <p className="text-xs text-error-600 mt-2">
                    Error ID: {errorId}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-3">
              {canRetry && (
                <button
                  onClick={this.handleRetry}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Try Again ({this.maxRetries - this.retryCount} attempts left)
                </button>
              )}
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-neutral-100 text-neutral-700 py-3 px-4 rounded-lg hover:bg-neutral-200 transition-colors font-medium"
              >
                Refresh Page
              </button>

              {process.env.NODE_ENV === 'development' && (
                <button
                  onClick={this.copyErrorInfo}
                  className="w-full bg-neutral-50 text-neutral-600 py-2 px-4 rounded-lg hover:bg-neutral-100 transition-colors text-sm"
                >
                  Copy Error Details
                </button>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-border-primary text-center">
              <p className="text-sm text-text-tertiary">
                If this problem persists, please contact support with Error ID: {errorId}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
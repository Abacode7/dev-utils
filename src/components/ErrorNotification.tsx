import React from 'react';
import { Alert, AlertTitle, AlertDescription } from './ui';
import { Icons } from '../styles/icons';
import { AppError } from '../hooks/useErrorHandler';
import { Button } from './ui';

interface ErrorNotificationProps {
  errors: AppError[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errors,
  onDismiss,
  onClearAll,
}) => {
  if (errors.length === 0) return null;

  const getErrorIcon = (type: AppError['type']) => {
    switch (type) {
      case 'security':
        return Icons.Alert;
      case 'network':
        return Icons.Link;
      case 'validation':
        return Icons.Info;
      case 'parse':
        return Icons.X;
      case 'system':
        return Icons.Settings;
      default:
        return Icons.Alert;
    }
  };

  const getErrorVariant = (type: AppError['type']) => {
    switch (type) {
      case 'security':
      case 'system':
        return 'destructive' as const;
      case 'validation':
        return 'warning' as const;
      case 'network':
      case 'parse':
        return 'info' as const;
      default:
        return 'default' as const;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed top-4 right-4 z-notification max-w-md space-y-2">
      {errors.length > 1 && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs"
          >
            Clear All ({errors.length})
          </Button>
        </div>
      )}
      
      {errors.map((error) => {
        const IconComponent = getErrorIcon(error.type);
        return (
          <Alert
            key={error.id}
            variant={getErrorVariant(error.type)}
            className="relative animate-slide-in"
          >
            <IconComponent size={16} />
            <div className="flex-1">
              <AlertTitle className="flex items-center justify-between">
                <span className="capitalize">{error.type} Error</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs opacity-70">
                    {formatTimestamp(error.timestamp)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDismiss(error.id)}
                    className="h-6 w-6"
                  >
                    <Icons.X size={12} />
                  </Button>
                </div>
              </AlertTitle>
              <AlertDescription>
                <div className="space-y-1">
                  <p>{error.message}</p>
                  {error.details && (
                    <p className="text-xs opacity-80 font-mono">
                      {error.details}
                    </p>
                  )}
                  {error.component && (
                    <p className="text-xs opacity-60">
                      Component: {error.component}
                    </p>
                  )}
                </div>
              </AlertDescription>
            </div>
          </Alert>
        );
      })}
    </div>
  );
};

export default ErrorNotification;
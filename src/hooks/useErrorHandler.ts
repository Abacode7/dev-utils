import { useCallback, useState } from 'react';

export interface AppError {
  id: string;
  type: 'validation' | 'network' | 'parse' | 'security' | 'system';
  message: string;
  details?: string;
  timestamp: number;
  component?: string;
  action?: string;
}

export const useErrorHandler = () => {
  const [errors, setErrors] = useState<AppError[]>([]);

  const createError = useCallback((
    type: AppError['type'],
    message: string,
    details?: string,
    component?: string,
    action?: string
  ): AppError => ({
    id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    message,
    details,
    timestamp: Date.now(),
    component,
    action,
  }), []);

  const addError = useCallback((error: Omit<AppError, 'id' | 'timestamp'>) => {
    const newError = createError(error.type, error.message, error.details, error.component, error.action);
    setErrors(prev => [newError, ...prev.slice(0, 4)]); // Keep only last 5 errors
    
    // Auto-remove non-critical errors after 5 seconds
    if (error.type !== 'security' && error.type !== 'system') {
      setTimeout(() => {
        setErrors(prev => prev.filter(e => e.id !== newError.id));
      }, 5000);
    }
    
    return newError;
  }, [createError]);

  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const handleValidationError = useCallback((field: string, message: string, component?: string) => {
    return addError({
      type: 'validation',
      message: `${field}: ${message}`,
      component,
      action: 'validation'
    });
  }, [addError]);

  const handleNetworkError = useCallback((error: Error, component?: string, action?: string) => {
    return addError({
      type: 'network',
      message: 'Network request failed',
      details: error.message,
      component,
      action
    });
  }, [addError]);

  const handleParseError = useCallback((error: Error, component?: string, action?: string) => {
    return addError({
      type: 'parse',
      message: 'Failed to parse data',
      details: error.message,
      component,
      action
    });
  }, [addError]);

  const handleSecurityError = useCallback((message: string, details?: string, component?: string) => {
    return addError({
      type: 'security',
      message,
      details,
      component,
      action: 'security_violation'
    });
  }, [addError]);

  const handleSystemError = useCallback((error: Error, component?: string, action?: string) => {
    return addError({
      type: 'system',
      message: 'System error occurred',
      details: error.message,
      component,
      action
    });
  }, [addError]);

  return {
    errors,
    addError,
    removeError,
    clearErrors,
    handleValidationError,
    handleNetworkError,
    handleParseError,
    handleSecurityError,
    handleSystemError,
  };
};
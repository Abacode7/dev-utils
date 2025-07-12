import React, { Suspense, lazy } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';

interface LazyRouteProps {
  component: React.LazyExoticComponent<React.ComponentType<unknown>>;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

const LazyRoute: React.FC<LazyRouteProps> = ({
  component: Component,
  fallback,
  errorFallback,
}) => {
  const defaultFallback = (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-text-secondary">Loading...</p>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback || defaultFallback}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};

// Lazy-loaded page components
export const LazyHome = lazy(() => import('../pages/Home'));
export const LazyJsonValidator = lazy(() => import('../pages/JsonValidator'));
export const LazyJsonMinifier = lazy(() => import('../pages/JsonMinifier'));
export const LazyJWTDecoder = lazy(() => import('../pages/JWTDecoder'));
export const LazyJasyptEncryption = lazy(() => import('../pages/JasyptEncryption'));

export default LazyRoute;
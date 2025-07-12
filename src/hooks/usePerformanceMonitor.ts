import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
  rerenderCount: number;
}

export const usePerformanceMonitor = (componentName: string, enabled = process.env.NODE_ENV === 'development') => {
  const renderCountRef = useRef(0);
  const startTimeRef = useRef<number>(0);
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const startTime = performance.now();
    startTimeRef.current = startTime;
    renderCountRef.current += 1;

    // Measure render time after DOM update
    const timeoutId = setTimeout(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      const metric: PerformanceMetrics = {
        renderTime,
        componentName,
        timestamp: Date.now(),
        rerenderCount: renderCountRef.current,
      };

      setMetrics(prev => [metric, ...prev.slice(0, 9)]); // Keep last 10 metrics

      // Log slow renders (>16ms for 60fps)
      if (renderTime > 16) {
        console.warn(`🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }

      // Log excessive rerenders
      if (renderCountRef.current > 10) {
        console.warn(`🔄 Excessive rerenders in ${componentName}: ${renderCountRef.current} times`);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  });

  const getAverageRenderTime = () => {
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, metric) => sum + metric.renderTime, 0) / metrics.length;
  };

  const getSlowRenderCount = () => {
    return metrics.filter(metric => metric.renderTime > 16).length;
  };

  return {
    metrics,
    renderCount: renderCountRef.current,
    averageRenderTime: getAverageRenderTime(),
    slowRenderCount: getSlowRenderCount(),
  };
};

// Performance monitoring for specific operations
export const useOperationPerformance = () => {
  const [operations, setOperations] = useState<Record<string, number>>({});

  const measureOperation = async <T>(
    operationName: string,
    operation: () => Promise<T> | T
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const endTime = performance.now();
      const duration = endTime - startTime;

      setOperations(prev => ({
        ...prev,
        [operationName]: duration
      }));

      // Log slow operations (>100ms)
      if (duration > 100) {
        console.warn(`🐌 Slow operation detected: ${operationName} took ${duration.toFixed(2)}ms`);
      }

      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.error(`❌ Operation failed: ${operationName} after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  };

  return {
    operations,
    measureOperation,
  };
};

// Memory usage monitoring
export const useMemoryMonitor = (interval = 5000) => {
  const [memoryInfo, setMemoryInfo] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!('memory' in performance)) return;

    const updateMemoryInfo = () => {
      const memory = (performance as unknown as Record<string, unknown>).memory as Record<string, number>;
      setMemoryInfo(memory);

      // Log memory warnings
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;
      const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;
      const usagePercent = (usedMB / limitMB) * 100;

      if (usagePercent > 80) {
        console.warn(`🧠 High memory usage: ${usedMB.toFixed(1)}MB (${usagePercent.toFixed(1)}%)`);
      }
    };

    updateMemoryInfo();
    const intervalId = setInterval(updateMemoryInfo, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return memoryInfo;
};

// Bundle size monitoring
export const useBundleAnalyzer = () => {
  const [bundleInfo, setBundleInfo] = useState<Record<string, number>>({});

  useEffect(() => {
    // Estimate module sizes based on performance entries
    const resourceEntries = performance.getEntriesByType('resource');

    const sizes: Record<string, number> = {};
    
    resourceEntries.forEach(entry => {
      if (entry.name.includes('.js') || entry.name.includes('.css')) {
        const name = entry.name.split('/').pop() || 'unknown';
        sizes[name] = (entry as PerformanceResourceTiming).transferSize || 0;
      }
    });

    setBundleInfo(sizes);
  }, []);

  return bundleInfo;
};
import * as Sentry from '@sentry/nextjs';

export function trackPerformance(name: string, fn: () => Promise<any>) {
  const start = performance.now();
  
  return fn().finally(() => {
    const duration = performance.now() - start;
    Sentry.addBreadcrumb({
      category: 'performance',
      message: `${name} took ${duration}ms`,
      level: 'info',
    });
    
    if (duration > 1000) { // Log slow operations (over 1 second)
      console.warn(`Performance warning: ${name} took ${duration}ms`);
    }
  });
}

export function measurePerformance(name: string) {
  const start = performance.now();
  
  return {
    end: () => {
      const duration = performance.now() - start;
      Sentry.addBreadcrumb({
        category: 'performance',
        message: `${name} took ${duration}ms`,
        level: 'info',
      });
      return duration;
    }
  };
} 
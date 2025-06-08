"use client"

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

// This is a simple Sentry Error Boundary component.
// For a more robust solution, consider using Sentry.ErrorBoundary from '@sentry/react' directly,
// or building a more custom one based on React's Error Boundaries.

interface SentryErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function SentryErrorBoundary({ children, fallback }: SentryErrorBoundaryProps) {
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      Sentry.captureException(error.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // You can implement a more sophisticated error boundary here
  // based on React's componentDidCatch or getDerivedStateFromError
  // For simplicity, we'll let Sentry capture unhandled errors at the window level.
  // For React components, React's own error boundary behavior is generally preferred.
  // Sentry provides an <ErrorBoundary> component for this:
  // import { ErrorBoundary } from '@sentry/react';
  // return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;

  return <>{children}</>;
} 
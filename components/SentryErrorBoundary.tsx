"use client"

import * as Sentry from '@sentry/nextjs';
import { ErrorBoundary } from '@sentry/react';
import { ErrorDialog } from '@/components/ui/ErrorDialog';

// This is a simple Sentry Error Boundary component.
// For a more robust solution, consider using Sentry.ErrorBoundary from '@sentry/react' directly,
// or building a more custom one based on React's Error Boundaries.

interface SentryErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function SentryErrorBoundary({ children, fallback }: SentryErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => {
        const err = error as any;
        return (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.5)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            role="alertdialog"
            aria-modal="true"
          >
            <ErrorDialog
              open={true}
              onClose={resetError}
              code={err.name || 'INTERNAL_ERROR'}
              message={err.message || 'Something went wrong.'}
              details={err.stack}
            />
          </div>
        );
      }}
    >
      {children}
    </ErrorBoundary>
  );
} 
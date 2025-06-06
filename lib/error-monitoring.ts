import * as Sentry from '@sentry/nextjs';

export const initSentry = () => {
  if (typeof window === 'undefined') return;

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: ['localhost', 'taboracademy.com'],
      }),
    ],
  });
};

export const captureError = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    extra: context,
  });
};

export const setUserContext = (userId: string, email: string, role: string) => {
  Sentry.setUser({
    id: userId,
    email: email,
    role: role,
  });
};

export const clearUserContext = () => {
  Sentry.setUser(null);
};

export const startTransaction = (name: string, op: string) => {
  return Sentry.startTransaction({
    name,
    op,
  });
};
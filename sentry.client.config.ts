import * as Sentry from "@sentry/nextjs";
import { BrowserTracing } from "@sentry/integrations";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  integrations: [
    new BrowserTracing({
      tracePropagationTargets: ['localhost', 'taboracademy.com'],
    }),
  ],
});
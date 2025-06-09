// This file configures the Sentry Node.js SDK for use with Next.js
// applications.
// https://sentry.io/docs/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampler: (samplingContext) => {
    if (samplingContext.transactionContext && samplingContext.transactionContext.op === 'http.server') {
      return 0.1;
    }
    return 0.05;
  },

  debug: process.env.NODE_ENV === 'development',
});

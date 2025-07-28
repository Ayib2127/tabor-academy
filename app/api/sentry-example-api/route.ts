import { NextResponse } from "next/server";
import { handleApiError } from '@/lib/utils/error-handling';

export const dynamic = "force-dynamic";
class SentryExampleAPIError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "SentryExampleAPIError";
  }
}
// A faulty API route to test Sentry's error monitoring
export function GET() {
  try {
    throw new SentryExampleAPIError("This error is raised on the backend called by the example page.");
  } catch (error) {
    console.error('Sentry Example API error:', error);
    const apiError = handleApiError(error);
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: 500 });
  }
}

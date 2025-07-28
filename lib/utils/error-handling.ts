import { NextRequest, NextResponse } from 'next/server';
import { PostgrestError } from '@supabase/supabase-js';

export type ApiError = {
  code: string;
  message: string;
  details?: any;
};

export class EnrollmentRequiredError extends Error {
  code = 'ENROLLMENT_REQUIRED';
  details?: any;
  constructor(message: string = 'You must enroll in this course to access its content.', details?: any) {
    super(message);
    this.details = details;
  }
}

export class ValidationError extends Error {
  code = 'VALIDATION_ERROR';
  details?: any;
  constructor(message: string, details?: any) {
    super(message);
    this.details = details;
  }
}

export class AuthError extends Error {
  code = 'AUTH_REQUIRED';
  constructor(message: string = 'Please log in to continue.') {
    super(message);
  }
}

export class ForbiddenError extends Error {
  code = 'FORBIDDEN';
  constructor(message: string = 'You do not have permission to access this resource.') {
    super(message);
  }
}

export class NotFoundError extends Error {
  code = 'NOT_FOUND';
  constructor(message: string = 'The requested resource was not found.') {
    super(message);
  }
}

export class ResourceConflictError extends Error {
  code = 'RESOURCE_CONFLICT';
  details?: any;
  constructor(message: string = 'A conflict occurred with the requested resource.', details?: any) {
    super(message);
    this.details = details;
  }
}

export class PaymentError extends Error {
  code = 'PAYMENT_ERROR';
  details?: any;
  constructor(message: string = 'A payment error occurred.', details?: any) {
    super(message);
    this.details = details;
  }
}

export function handleApiError(error: unknown): ApiError {
  if (
    error instanceof EnrollmentRequiredError ||
    error instanceof ValidationError ||
    error instanceof AuthError ||
    error instanceof ForbiddenError ||
    error instanceof NotFoundError ||
    error instanceof ResourceConflictError ||
    error instanceof PaymentError
  ) {
    return {
      code: error.code,
      message: error.message,
      details: (error as any).details,
    };
  }

  if (error instanceof Error) {
    // Map common error messages to codes
    if (/not authenticated|user not found/i.test(error.message)) {
      return { code: 'AUTH_REQUIRED', message: 'Please log in to continue.' };
    }
    if (/course not found/i.test(error.message)) {
      return { code: 'NOT_FOUND', message: 'The requested course was not found.' };
    }
    if (/enrollment required|not enrolled/i.test(error.message)) {
      return { code: 'ENROLLMENT_REQUIRED', message: 'You must enroll in this course to access its content.' };
    }
    // ...add more mappings as needed
    return {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong. Please try again or contact support.',
    };
  }

  if (typeof error === 'object' && error !== null) {
    const pgError = error as PostgrestError;
    if ('code' in pgError && 'message' in pgError) {
      return {
        code: pgError.code || 'DB_ERROR',
        message: 'A database error occurred. Please try again.',
      };
    }
  }

  return {
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred. Please try again.',
  };
}

export function createErrorResponse(error: unknown) {
  const apiError = handleApiError(error);
  return NextResponse.json(
    { error: apiError.message, code: apiError.code, details: apiError.details },
    { status: 200 }
  );
}

export function handleAuthError(error: any, request: NextRequest) {
  console.error('Auth error:', error.message);
  return NextResponse.next();
}

export function handleNoSession(req: NextRequest) {
  const protectedRoutes = ['/dashboard', '/dashboard/instructor', '/dashboard/admin'];
  
  if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    if (!req.nextUrl.pathname.startsWith('/api/')) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  return NextResponse.next();
}

export function handleMiddlewareError(error: any, request: NextRequest) {
  console.error('Middleware error:', error);
  return NextResponse.next();
} 
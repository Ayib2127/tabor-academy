import { NextRequest, NextResponse } from 'next/server';
import { PostgrestError } from '@supabase/supabase-js';
import { trackPerformance } from './performance';

export type ApiError = {
  code: string;
  message: string;
  details?: any;
};

export class ForbiddenError extends Error {
  code = 'FORBIDDEN';
  constructor(message: string = 'Access forbidden.') {
    super(message);
  }
}

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

export class ResourceConflictError extends Error {
  code = 'RESOURCE_CONFLICT';
  details?: any;
  constructor(message: string = 'Resource conflict occurred.', details?: any) {
    super(message);
    this.details = details;
  }
}

export class PaymentError extends Error {
  code = 'PAYMENT_ERROR';
  details?: any;
  constructor(message: string = 'Payment processing failed.', details?: any) {
    super(message);
    this.details = details;
  }
}

export class NotFoundError extends Error {
  code = 'NOT_FOUND';
  constructor(message: string = 'Resource not found.') {
    super(message);
  }
}

export class RateLimitError extends Error {
  code = 'RATE_LIMIT_EXCEEDED';
  constructor(message: string = 'Too many requests. Please try again later.') {
    super(message);
  }
}

export class ServerError extends Error {
  code = 'INTERNAL_SERVER_ERROR';
  constructor(message: string = 'An internal server error occurred.') {
    super(message);
  }
}

// Enhanced error handler with performance tracking
export async function handleApiError(
  error: unknown,
  operation: string = 'API operation'
): Promise<ApiError> {
  return trackPerformance(`Error handling for ${operation}`, async () => {
    console.error(`API Error in ${operation}:`, error);

    if (error instanceof EnrollmentRequiredError) {
      return {
        code: error.code,
        message: error.message,
        details: error.details,
      };
    }

    if (error instanceof ValidationError) {
      return {
        code: error.code,
        message: error.message,
        details: error.details,
      };
    }

    if (error instanceof AuthError) {
      return {
        code: error.code,
        message: error.message,
      };
    }

    if (error instanceof ResourceConflictError) {
      return {
        code: error.code,
        message: error.message,
        details: error.details,
      };
    }

    if (error instanceof PaymentError) {
      return {
        code: error.code,
        message: error.message,
        details: error.details,
      };
    }

    if (error instanceof NotFoundError) {
      return {
        code: error.code,
        message: error.message,
      };
    }

    if (error instanceof RateLimitError) {
      return {
        code: error.code,
        message: error.message,
      };
    }

    if (error instanceof ServerError) {
      return {
        code: error.code,
        message: error.message,
      };
    }

    // Handle Supabase errors
    if (error && typeof error === 'object' && 'code' in error) {
      const supabaseError = error as PostgrestError;
      return {
        code: supabaseError.code || 'DATABASE_ERROR',
        message: supabaseError.message || 'Database operation failed',
        details: supabaseError.details,
      };
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network connection failed. Please check your internet connection.',
      };
    }

    // Default error
    return {
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  });
}

// Enhanced response handler with performance tracking
export async function createApiResponse<T>(
  data: T | null,
  error: ApiError | null = null,
  operation: string = 'API operation'
): Promise<NextResponse> {
  return trackPerformance(`Response creation for ${operation}`, async () => {
    if (error) {
      const statusCode = getStatusCodeFromError(error.code);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  });
}

// Helper function to determine HTTP status code from error code
function getStatusCodeFromError(errorCode: string): number {
  switch (errorCode) {
    case 'AUTH_REQUIRED':
      return 401;
    case 'ENROLLMENT_REQUIRED':
      return 403;
    case 'VALIDATION_ERROR':
      return 400;
    case 'NOT_FOUND':
      return 404;
    case 'RESOURCE_CONFLICT':
      return 409;
    case 'RATE_LIMIT_EXCEEDED':
      return 429;
    case 'PAYMENT_ERROR':
      return 402;
    case 'DATABASE_ERROR':
      return 500;
    case 'NETWORK_ERROR':
      return 503;
    case 'INTERNAL_SERVER_ERROR':
      return 500;
    default:
      return 500;
  }
}

// Error recovery utilities
export function createErrorRecoveryHandler<T>(
  fallbackValue: T,
  maxRetries: number = 3
) {
  return async (operation: () => Promise<T>, retryCount: number = 0): Promise<T> => {
    try {
      return await operation();
    } catch (error) {
      if (retryCount < maxRetries) {
        console.warn(`Retrying operation (${retryCount + 1}/${maxRetries}):`, error);
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        return createErrorRecoveryHandler(fallbackValue, maxRetries)(operation, retryCount + 1);
      }
      
      console.error('Operation failed after max retries, using fallback value:', error);
      return fallbackValue;
    }
  };
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
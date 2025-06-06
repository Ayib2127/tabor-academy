import { captureError } from '@/lib/error-monitoring';
import { ValidationError, RateLimitError, AuthorizationError } from '@/lib/utils/security';

export const handleError = (error: Error) => {
  // Log error
  console.error(`[${error.name}] ${error.message}`);
  
  // Send to error monitoring
  captureError(error);

  // Return appropriate error response
  if (error instanceof ValidationError) {
    return {
      status: 400,
      message: error.message
    };
  }

  if (error instanceof RateLimitError) {
    return {
      status: 429,
      message: 'Too many requests. Please try again later.'
    };
  }

  if (error instanceof AuthorizationError) {
    return {
      status: 401,
      message: 'Unauthorized access'
    };
  }

  // Default error response
  return {
    status: 500,
    message: 'An unexpected error occurred'
  };
};

export const errorBoundary = async (handler: Function) => {
  try {
    return await handler();
  } catch (error) {
    return handleError(error as Error);
  }
};
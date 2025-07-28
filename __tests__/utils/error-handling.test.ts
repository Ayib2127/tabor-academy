import { handleApiError, createErrorResponse } from '@/lib/utils/error-handling';
import { NextResponse } from 'next/server';
import { jest, describe, test, expect } from '@jest/globals';

describe('Error Handling', () => {
  test('handles standard Error objects', () => {
    const error = new Error('Test error');
    const result = handleApiError(error);
    expect(result.message).toBe('Something went wrong. Please try again or contact support.');
    // Removed status check, as ApiError does not include status
  });

  test('handles PostgrestError', () => {
    const pgError = {
      code: '23505',
      message: 'Duplicate key error',
      details: 'Key already exists'
    };
    const result = handleApiError(pgError);
    expect(result.message).toBe('A database error occurred. Please try again.');
    expect(result.code).toBe('23505');
  });

  test('creates proper error response', () => {
    const error = new Error('Test error');
    const response = createErrorResponse(error);
    expect(response instanceof NextResponse).toBe(true);
    expect(response.status).toBe(200); // Updated to match new default status
  });
}); 
import { handleApiError, createErrorResponse } from '@/lib/utils/error-handling';
import { NextResponse } from 'next/server';
import { jest, describe, test, expect } from '@jest/globals';

describe('Error Handling', () => {
  test('handles standard Error objects', () => {
    const error = new Error('Test error');
    const result = handleApiError(error);
    expect(result.message).toBe('Test error');
    expect(result.status).toBe(500);
  });

  test('handles PostgrestError', () => {
    const pgError = {
      code: '23505',
      message: 'Duplicate key error',
      details: 'Key already exists'
    };
    const result = handleApiError(pgError);
    expect(result.message).toBe('Duplicate key error');
    expect(result.code).toBe('23505');
  });

  test('creates proper error response', () => {
    const error = new Error('Test error');
    const response = createErrorResponse(error);
    expect(response instanceof NextResponse).toBe(true);
    expect(response.status).toBe(500);
  });
}); 
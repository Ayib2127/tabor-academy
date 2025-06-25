import { GET } from '@/app/api/courses/[id]/enrollments/route';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest } from 'next/server';
import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { User, AuthResponse, Session } from '@supabase/supabase-js';

// Mock Supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn().mockImplementation(() => Promise.resolve({
        data: { user: null, session: null },
        error: null
      }))
    },
    from: jest.fn()
  }))
}));

describe('Enrollments API', () => {
  let mockRequest: NextRequest;
  
  beforeEach(() => {
    mockRequest = new NextRequest('http://localhost:3000/api/courses/123/enrollments');
  });

  test('returns 401 for unauthenticated users', async () => {
    const mockSupabase = createRouteHandlerClient({ cookies: {} });
    (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null, session: null },
      error: new Error('Not authenticated')
    } as unknown as AuthResponse);

    const response = await GET(mockRequest, { params: { id: '123' } });
    expect(response.status).toBe(401);
  });

  test('returns 404 for non-existent course', async () => {
    const mockSupabase = createRouteHandlerClient({ cookies: {} });
    (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'user123' }, session: null },
      error: null
    } as unknown as AuthResponse);

    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: new Error('Course not found')
      })
    });

    const response = await GET(mockRequest, { params: { id: '123' } });
    expect(response.status).toBe(404);
  });
}); 
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/api';

// In-memory rate limit map (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, user: any, supabase: any) => Promise<NextResponse>
) {
  try {
    const { session, supabase } = await getAuthenticatedUser();

    // Enforce rate limiting for all environments
    const clientId = session.user?.id || 'unknown';
    if (!checkRateLimit(clientId)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    return await handler(request, session.user, supabase);
  } catch (error: any) {
    console.error('Auth middleware error:', error);

    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const window = 60000; // 1 minute
  const limit = 100; // requests per minute

  const entry = rateLimitMap.get(clientId) || { count: 0, timestamp: now };

  if (now - entry.timestamp > window) {
    rateLimitMap.set(clientId, { count: 1, timestamp: now });
    return true;
  }

  if (entry.count < limit) {
    rateLimitMap.set(clientId, { count: entry.count + 1, timestamp: entry.timestamp });
    return true;
  }

  return false;
} 
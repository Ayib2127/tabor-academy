import { NextRequest, NextResponse } from 'next/server';
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';

// In-memory rate limit map (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 100; // 100 requests per minute

export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, user: any, supabase: any) => Promise<Response>
) {
  try {
    const supabase = await createApiSupabaseClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    // Rate limiting (by user id)
    const clientId = session.user.id || 'unknown';
    if (!checkRateLimit(clientId)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    // Call the actual handler
    return await handler(request, session.user, supabase);
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(clientId) || { count: 0, timestamp: now };
  if (now - entry.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(clientId, { count: 1, timestamp: now });
    return true;
  }
  if (entry.count < RATE_LIMIT_MAX) {
    rateLimitMap.set(clientId, { count: entry.count + 1, timestamp: entry.timestamp });
    return true;
  }
  return false;
} 
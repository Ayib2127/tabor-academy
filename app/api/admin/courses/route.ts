import { NextRequest, NextResponse } from 'next/server';
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';

export const dynamic = 'force-dynamic';

// GET: List all courses (all statuses)
export async function GET(request: NextRequest): Promise<NextResponse<any>> {
  const supabase = await createApiSupabaseClient();
  // Authenticate admin
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();
  if (!userProfile || userProfile.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }
  // Fetch all courses with instructor info
  const { data, error } = await supabase
    .from('courses')
    .select(`
      id, title, description, category, level, content_type, status, created_at, updated_at,
      users!courses_instructor_id_fkey (
        full_name, email, avatar_url
      )
    `)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ courses: data });
} 
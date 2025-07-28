import { NextRequest, NextResponse } from 'next/server';
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { handleApiError, ForbiddenError } from '@/lib/utils/error-handling';

export const dynamic = 'force-dynamic';

// GET: List all courses (all statuses)
export async function GET(request: NextRequest): Promise<NextResponse<any>> {
  try {
    const supabase = await createApiSupabaseClient();
    // Authenticate admin
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new ForbiddenError('Unauthorized');
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();
    if (!userProfile || userProfile.role !== 'admin') {
      throw new ForbiddenError('Admin access required');
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
    if (error) throw error;
    return NextResponse.json({ courses: data });
  } catch (error) {
    console.error('Admin Courses API error:', error);
    const apiError = handleApiError(error);
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'FORBIDDEN' ? 403 : 500 });
  }
} 
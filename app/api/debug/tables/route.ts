import { NextResponse } from 'next/server';
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { cookies } from 'next/headers';
import { handleApiError, ForbiddenError } from '@/lib/utils/error-handling';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = await createApiSupabaseClient(cookieStore);

    // Check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new ForbiddenError('Unauthorized');
    }

    // Get all table names
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      throw tablesError;
    }

    // Check if course_modules table exists
    const courseModulesExists = tables?.some(t => t.table_name === 'course_modules');
    
    // Check if module_lessons table exists
    const moduleLessonsExists = tables?.some(t => t.table_name === 'module_lessons');

    // If course_modules exists, try to get its structure
    let courseModulesStructure = null;
    if (courseModulesExists) {
      const { data: structure, error: structureError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_schema', 'public')
        .eq('table_name', 'course_modules')
        .order('ordinal_position');

      if (!structureError) {
        courseModulesStructure = structure;
      }
    }

    // Try to get a sample of courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title, instructor_id')
      .eq('instructor_id', user.id)
      .limit(5);

    return NextResponse.json({
      tables: tables?.map(t => t.table_name),
      courseModulesExists,
      moduleLessonsExists,
      courseModulesStructure,
      sampleCourses: courses,
      coursesError: coursesError?.message,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Debug Tables API error:', error);
    const apiError = handleApiError(error);
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'FORBIDDEN' ? 403 : 500 });
  }
} 
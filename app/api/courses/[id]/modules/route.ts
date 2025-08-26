import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ValidationError, ForbiddenError, handleApiError } from '@/lib/utils/error-handling';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const courseId = params.id;
  try {
    const supabase = await createSupabaseServerClient();
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new ForbiddenError('Unauthorized');
    }
    const { data: modules, error: modulesError } = await supabase
      .from('course_modules')
      .select('id, title, order')
      .eq('course_id', courseId)
      .order('order', { ascending: true });
    if (modulesError) {
      throw modulesError;
    }
    const modulesWithLessons = await Promise.all(
      (modules || []).map(async (module) => {
        // Fetch lessons for this module
        const { data: lessons, error: lessonsError } = await supabase
          .from('module_lessons')
          .select('id, title, order, content, duration, is_published, type')
          .eq('module_id', module.id)
          .order('order', { ascending: true });
        if (lessonsError) {
          throw lessonsError;
        }
        // Fetch progress for all lessons in this module for the current user
        const lessonIds = (lessons || []).map((l) => l.id);
        let progressMap: Record<string, boolean> = {};
        if (lessonIds.length > 0) {
          const { data: progressRows, error: progressError } = await supabase
            .from('progress')
            .select('lesson_id, completed')
            .in('lesson_id', lessonIds)
            .eq('user_id', user.id);
          if (!progressError && progressRows) {
            progressMap = progressRows.reduce((acc, row) => {
              acc[row.lesson_id] = row.completed;
              return acc;
            }, {} as Record<string, boolean>);
          }
        }
        // Attach completed property to each lesson
        const lessonsWithCompletion = (lessons || []).map((lesson) => ({
          ...lesson,
          completed: !!progressMap[lesson.id],
        }));
        return {
          ...module,
          lessons: lessonsWithCompletion,
        };
      })
    );
    return NextResponse.json(modulesWithLessons);
  } catch (error) {
    console.error('Error fetching course modules:', error);
    const apiError = handleApiError(error);
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'VALIDATION_ERROR' ? 400 : apiError.code === 'FORBIDDEN' ? 403 : 500 });
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    const courseId = params.id;
    const supabase = await createSupabaseServerClient();
    const { title, order } = await request.json();
    if (!title) {
      throw new ValidationError('Module title is required');
    }
    const { data: newModule, error } = await supabase
      .from('course_modules')
      .insert([
        {
          course_id: courseId,
          title,
          order: order ?? 0,
        },
      ])
      .select()
      .single();
    if (error) {
      throw error;
    }
    return NextResponse.json({ ...newModule, lessons: [] }, { status: 201 });
  } catch (error) {
    console.error('Error creating module:', error);
    const apiError = handleApiError(error);
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'VALIDATION_ERROR' ? 400 : apiError.code === 'FORBIDDEN' ? 403 : 500 });
  }
}
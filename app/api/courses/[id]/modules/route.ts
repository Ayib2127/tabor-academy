import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(req: Request, context: Promise<{ params: { id: string } }>) {
  const { params } = await context;
  const courseId = params.id;
  try {
    const supabase = await createSupabaseServerClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    return NextResponse.json({ error: 'Failed to fetch course modules', details: error.message || error }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: Promise<{ params: { id: string } }>) {
  const { params } = await context;
  try {
    const courseId = params.id;
    const supabase = await createSupabaseServerClient();
    const { title, order } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Module title is required' }, { status: 400 });
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
    return NextResponse.json({ error: 'Failed to create module' }, { status: 500 });
  }
}
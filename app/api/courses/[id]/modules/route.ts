import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;
    const supabase = createSupabaseServerClient();

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
        const { data: lessons, error: lessonsError } = await supabase
          .from('module_lessons')
          .select('id, title, order, content, duration, is_published, type')
          .eq('module_id', module.id)
          .order('order', { ascending: true });

        if (lessonsError) {
          throw lessonsError;
        }

        return {
          ...module,
          lessons: lessons || [],
        };
      })
    );

    return NextResponse.json(modulesWithLessons);
  } catch (error) {
    console.error('Error fetching course modules:', error);
    return NextResponse.json({ error: 'Failed to fetch course modules', details: error.message || error }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;
    const supabase = createSupabaseServerClient();
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
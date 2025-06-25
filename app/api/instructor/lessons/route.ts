import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const bodySchema = z.object({
  content: z.any(), // Tiptap JSON content
  type: z.enum(['text', 'video', 'quiz']).optional(),
  title: z.string().optional(),
  is_published: z.boolean().optional(),
});

export async function PATCH(req: Request, context: Promise<{ params: { id: string } }>) {
  const { params } = await context;
  const lessonId = params.id;
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parse = bodySchema.safeParse(body);
    
    if (!parse.success) {
      return NextResponse.json({ 
        error: 'Invalid body', 
        details: parse.error.issues 
      }, { status: 400 });
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Only include fields that are provided
    if (parse.data.content !== undefined) {
      updateData.content = parse.data.content;
    }
    if (parse.data.type !== undefined) {
      updateData.type = parse.data.type;
    }
    if (parse.data.title !== undefined) {
      updateData.title = parse.data.title;
    }
    if (parse.data.is_published !== undefined) {
      updateData.is_published = parse.data.is_published;
    }

    // Ensure user owns the lesson via instructor_id check
    const { data: lesson, error: fetchError } = await supabase
      .from('module_lessons')
      .select(`
        *,
        module:course_modules!inner(
          course:courses!inner(instructor_id)
        )
      `)
      .eq('id', lessonId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!lesson || lesson.module.course.instructor_id !== session.user.id) {
      return NextResponse.json({ error: 'Lesson not found or access denied' }, { status: 404 });
    }

    // Update the lesson
    const { error: updateError } = await supabase
      .from('module_lessons')
      .update(updateData)
      .eq('id', lessonId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Lesson updated successfully',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Error updating lesson:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
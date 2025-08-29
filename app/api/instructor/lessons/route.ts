import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ValidationError, ForbiddenError, handleApiError } from '@/lib/utils/error-handling';

const bodySchema = z.object({
  content: z.any(), // Tiptap JSON content
  type: z.enum(['text', 'video', 'quiz']).optional(),
  title: z.string().optional(),
  is_published: z.boolean().optional(),
});

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const lessonId = params.id;
  const supabase = await createApiSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new ForbiddenError('Unauthorized');
  }

  try {
    const body = await req.json();
    const parse = bodySchema.safeParse(body);
    if (!parse.success) {
      throw new ValidationError('Invalid body', parse.error.issues);
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
      throw fetchError;
    }

    if (!lesson || lesson.module.course.instructor_id !== session.user.id) {
      throw new ForbiddenError('Lesson not found or access denied');
    }

    // Update the lesson
    const { error: updateError } = await supabase
      .from('module_lessons')
      .update(updateData)
      .eq('id', lessonId);

    if (updateError) {
      throw updateError;
    }

    // Hybrid logic: If is_published is set to true and parent course is published, flag course for review
    if (parse.data.is_published === true) {
      // Get parent course status and id
      const courseId = lesson.module?.course?.id;
      if (courseId) {
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('id, status, title')
          .eq('id', courseId)
          .maybeSingle();
        if (!courseError && courseData && courseData.status === 'published') {
          // Set course status to pending_review
          await supabase
            .from('courses')
            .update({ status: 'pending_review' })
            .eq('id', courseData.id);
          // Notify all admins
          const { data: admins, error: adminError } = await supabase
            .from('users')
            .select('id')
            .eq('role', 'admin');
          if (!adminError && admins && admins.length > 0) {
            const notifications = admins.map((admin: any) => ({
              user_id: admin.id,
              type: 'course_status_change',
              title: 'Course Needs Review',
              message: `Course "${courseData.title}" requires review due to a newly published lesson by the instructor.`,
              data: { course_id: courseData.id },
            }));
            await supabase.from('notifications').insert(notifications);
          }
        }
      } // else: no courseId, do nothing
    }

    return NextResponse.json({
      success: true,
      message: 'Lesson updated successfully',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Error updating lesson:', error);
    const apiError = await handleApiError(error);
    return NextResponse.json({
      code: apiError.code,
      error: apiError.message,
      details: apiError.details,
    }, { status: apiError.code === 'VALIDATION_ERROR' ? 400 : apiError.code === 'FORBIDDEN' ? 403 : 500 });
  }
}

export async function POST(req: Request) {
  const supabase = await createApiSupabaseClient();

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new ForbiddenError('Unauthorized');
  }

  try {
    const body = await req.json();
    console.log('[LESSON API] Incoming POST body:', JSON.stringify(body, null, 2));
    const {
      module_id,
      title,
      type,
      content,
      order,
      duration,
      is_published,
      attemptsAllowed, // <-- Add this to destructure from body
      questionType,    // <-- Add this if your frontend sends it
      // ...add other fields as needed
    } = body;

    // Default attempts mapping
    const DEFAULT_ATTEMPTS = {
      true_false: 1,
      multiple_choice: 2,
      short_answer: 3,
    };

    // Validation
    const errors = [];
    if (!module_id || typeof module_id !== 'string') errors.push('module_id (string) is required');
    if (!title || typeof title !== 'string') errors.push('title (string) is required');
    if (!type || !['text', 'video', 'quiz', 'assignment'].includes(type)) errors.push('type (text, video, quiz, assignment) is required');
    if (order === undefined || typeof order !== 'number') errors.push('order (number) is required');
    // content can be empty, but must be present
    if (content === undefined) errors.push('content is required');

    if (errors.length > 0) {
      console.error('[LESSON API] Validation errors:', errors);
      throw new ValidationError('Validation failed', errors);
    }

    let quizId = null;
    let quiz = null;

    if (type === 'quiz') {
      // Determine attemptsAllowed: instructor value or default by questionType
      const attempts =
        attemptsAllowed !== undefined
          ? attemptsAllowed
          : (questionType && DEFAULT_ATTEMPTS[questionType]) || 1;

      // Create the quiz
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .insert({
          title,
          passing_score: 70,            // <-- snake_case
          attemptsallowed: attempts,    // <-- already fixed
          shuffle_questions: false,     // <-- snake_case
          show_correct_answers: true,   // <-- snake_case
          show_explanations: true,      // <-- snake_case
          questions: [],                // <-- if this is a JSON/array column
        })
        .select()
        .single();
      if (quizError) {
        throw quizError;
      }
      quizId = quizData.id;
      quiz = quizData;
    }

    // Insert the lesson
    const { data: lesson, error: lessonError } = await supabase
      .from('module_lessons')
      .insert({
        module_id,
        title,
        type,
        content,
        order,
        duration,
        is_published,
        quiz_id: quizId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // ...add other fields as needed
      })
      .select()
      .single();

    if (lessonError) {
      throw lessonError;
    }

    return NextResponse.json({ lesson, quiz });
  } catch (error: any) {
    console.error('[LESSON API] Error creating lesson:', error, error?.stack);
    const apiError = await handleApiError(error);
    return NextResponse.json({
      code: apiError.code,
      error: apiError.message,
      details: apiError.details,
    }, { status: apiError.code === 'VALIDATION_ERROR' ? 400 : apiError.code === 'FORBIDDEN' ? 403 : 500 });
  }
}
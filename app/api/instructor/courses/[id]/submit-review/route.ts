import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request, context: Promise<{ params: { id: string } }>) {
  const { params } = await context;
  const courseId = params.id;
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify the instructor owns this course and it's in draft status
    const { data: course, error: fetchError } = await supabase
      .from('courses')
      .select('id, title, status, instructor_id, content_type')
      .eq('id', courseId)
      .eq('instructor_id', session.user.id)
      .single();

    if (fetchError || !course) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 });
    }

    // Check if course is in a state that can be submitted for review
    if (!['draft', 'rejected'].includes(course.status)) {
      return NextResponse.json({ 
        error: `Cannot submit course for review. Current status: ${course.status}` 
      }, { status: 400 });
    }

    // Validate that the course has content before submission
    const { data: modules, error: modulesError } = await supabase
      .from('course_modules')
      .select(`
        id,
        title,
        module_lessons (
          id,
          title,
          content,
          type,
          is_published
        )
      `)
      .eq('course_id', courseId);

    if (modulesError) {
      return NextResponse.json({ error: 'Failed to validate course content' }, { status: 500 });
    }

    // Check if course has at least one module with content
    if (!modules || modules.length === 0) {
      return NextResponse.json({ 
        error: 'Course must have at least one module before submission' 
      }, { status: 400 });
    }

    // Check if course has at least one lesson with content
    const hasContentfulLessons = modules.some(module => 
      module.module_lessons && module.module_lessons.length > 0 &&
      module.module_lessons.some((lesson: any) => lesson.content && lesson.content !== null)
    );

    if (!hasContentfulLessons) {
      return NextResponse.json({ 
        error: 'Course must have at least one lesson with content before submission' 
      }, { status: 400 });
    }

    // Update course status to pending_review
    const { error: updateError } = await supabase
      .from('courses')
      .update({
        status: 'pending_review',
        updated_at: new Date().toISOString(),
        // Clear any previous review data
        reviewed_by: null,
        reviewed_at: null,
        rejection_reason: null,
      })
      .eq('id', courseId);

    if (updateError) {
      console.error('Error submitting course for review:', updateError);
      return NextResponse.json({ error: 'Failed to submit course for review' }, { status: 500 });
    }

    // Log the activity
    try {
      await supabase.rpc('log_activity', {
        p_type: 'course_submission',
        p_user_id: session.user.id,
        p_course_id: courseId,
        p_action_description: `submitted course "${course.title}" for review`
      });
    } catch (logError) {
      console.error('Error logging activity:', logError);
      // Don't fail the operation if logging fails
    }

    return NextResponse.json({
      success: true,
      message: 'Course submitted for review successfully',
      course: {
        id: course.id,
        title: course.title,
        status: 'pending_review',
        content_type: course.content_type,
      },
      workflow: {
        currentStatus: 'pending_review',
        nextStep: 'Wait for admin approval. You will be notified of the decision.',
        canEdit: false,
        estimatedReviewTime: '2-3 business days',
      }
    });

  } catch (error: any) {
    console.error('Submit for review error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message,
    }, { status: 500 });
  }
}
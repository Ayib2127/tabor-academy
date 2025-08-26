import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const statusUpdateSchema = z.object({
  status: z.enum(['published', 'needs_changes', 'rejected']),
  feedback: z.string().optional(),
  rejection_reason: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: courseId } = await params;

  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Check authentication
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (userError || userProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Parse and validate request body
    const body = await req.json();
    const { status, feedback, rejection_reason } = statusUpdateSchema.parse(body);

    // Get the course to verify it exists and is pending review
    const { data: course, error: fetchError } = await supabase
      .from('courses')
      .select('id, title, status, instructor_id')
      .eq('id', courseId)
      .single();

    if (fetchError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.status !== 'pending_review') {
      return NextResponse.json({ 
        error: `Cannot update course with status: ${course.status}` 
      }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {
      status,
      reviewed_by: session.user.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (status === 'published') {
      updateData.is_published = true;
      updateData.published_at = new Date().toISOString();
      updateData.rejection_reason = null; // Clear any previous rejection reason
    } else {
      updateData.is_published = false;
      if (rejection_reason) {
        updateData.rejection_reason = rejection_reason;
      }
    }

    // Update the course
    const { error: updateError } = await supabase
      .from('courses')
      .update(updateData)
      .eq('id', courseId);

    if (updateError) {
      console.error('Error updating course status:', updateError);
      return NextResponse.json({ error: 'Failed to update course status' }, { status: 500 });
    }

    // If published, also publish all lessons in the course
    if (status === 'published') {
      // Get module IDs for this course
      const { data: modules } = await supabase
        .from('course_modules')
        .select('id')
        .eq('course_id', courseId);

      if (modules && modules.length > 0) {
        const moduleIds = modules.map(m => m.id);
        
        const { error: lessonsError } = await supabase
          .from('module_lessons')
          .update({ is_published: true })
          .in('module_id', moduleIds);

        if (lessonsError) {
          console.error('Error publishing lessons:', lessonsError);
          // Don't fail the entire operation, but log the error
        }
      }
    }

    // TODO: Send notification to instructor about the decision
    // This could be implemented with email notifications or in-app notifications

    // Log the admin action for audit purposes
    console.log(`Admin ${session.user.id} updated course ${courseId} to ${status}`);

    return NextResponse.json({
      success: true,
      message: status === 'published' 
        ? 'Course approved and published successfully'
        : 'Course status updated with feedback sent to instructor',
      course: {
        id: course.id,
        title: course.title,
        status,
        is_published: updateData.is_published,
      },
      review: {
        status,
        reviewed_by: session.user.id,
        reviewed_at: updateData.reviewed_at,
        feedback,
        rejection_reason,
      }
    });

  } catch (error: any) {
    console.error('Course status update error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Invalid request data',
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message,
    }, { status: 500 });
  }
}
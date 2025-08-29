import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const reviewSchema = z.object({
  action: z.enum(['approve', 'reject']),
  rejection_reason: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: courseId } = await params;
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify user is admin
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
    const { action, rejection_reason } = reviewSchema.parse(body);

    // Validate rejection reason if rejecting
    if (action === 'reject' && (!rejection_reason || rejection_reason.trim().length < 10)) {
      return NextResponse.json({ 
        error: 'Rejection reason is required and must be at least 10 characters' 
      }, { status: 400 });
    }

    // Get the course to verify it exists and is pending review
    const { data: course, error: fetchError } = await supabase
      .from('courses')
      .select('id, title, status, instructor_id, content_type')
      .eq('id', courseId)
      .single();

    if (fetchError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.status !== 'pending_review') {
      return NextResponse.json({ 
        error: `Cannot review course with status: ${course.status}` 
      }, { status: 400 });
    }

    // Prepare update data based on action
    const updateData: any = {
      reviewed_by: session.user.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (action === 'approve') {
      updateData.status = 'published';
      updateData.is_published = true;
      updateData.rejection_reason = null; // Clear any previous rejection reason
    } else {
      updateData.status = 'rejected';
      updateData.is_published = false;
      updateData.rejection_reason = rejection_reason;
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

    // If approved, also publish all lessons in the course
    if (action === 'approve') {
      // First get the module IDs
      const { data: moduleIds, error: moduleError } = await supabase
        .from('course_modules')
        .select('id')
        .eq('course_id', courseId);

      if (moduleError) {
        console.error('Error fetching module IDs:', moduleError);
      } else if (moduleIds && moduleIds.length > 0) {
        const { error: lessonsError } = await supabase
          .from('module_lessons')
          .update({ is_published: true })
          .in('module_id', moduleIds.map(m => m.id));

        if (lessonsError) {
          console.error('Error publishing lessons:', lessonsError);
          // Don't fail the entire operation, but log the error
        }
      }
    }

    // TODO: Send notification to instructor about the decision
    // This could be implemented with email notifications or in-app notifications

    // Log the admin action for audit purposes
    console.log(`Admin ${session.user.id} ${action}d course ${courseId} (${course.title})`);

    return NextResponse.json({
      success: true,
      message: action === 'approve' 
        ? 'Course approved and published successfully'
        : 'Course rejected with feedback sent to instructor',
      course: {
        id: course.id,
        title: course.title,
        status: updateData.status,
        content_type: course.content_type,
        is_published: updateData.is_published,
      },
      review: {
        action,
        reviewed_by: session.user.id,
        reviewed_at: updateData.reviewed_at,
        rejection_reason: action === 'reject' ? rejection_reason : null,
      }
    });

  } catch (error: any) {
    console.error('Course review error:', error);
    
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
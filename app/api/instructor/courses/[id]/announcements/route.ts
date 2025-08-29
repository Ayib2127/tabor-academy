import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ValidationError, ForbiddenError, handleApiError } from '@/lib/utils/error-handling';

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
});

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const courseId = params.id;

  try {
    const supabase = await createApiSupabaseClient();

    // Check authentication
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new ForbiddenError('Unauthorized');
    }

    const instructorId = session.user.id;

    // Verify course ownership
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, instructor_id')
      .eq('id', courseId)
      .eq('instructor_id', instructorId)
      .single();

    if (courseError || !course) {
      throw new ForbiddenError('Course not found or access denied');
    }

    // Parse and validate request body
    let title, message;
    try {
    const body = await req.json();
      ({ title, message } = announcementSchema.parse(body));
    } catch (err) {
      throw new ValidationError('Invalid request data', err instanceof z.ZodError ? err.errors : undefined);
    }

    // Create announcement record
    const { data: announcement, error: announcementError } = await supabase
      .from('course_announcements')
      .insert({
        course_id: courseId,
        instructor_id: instructorId,
        title,
        message,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (announcementError) {
      throw announcementError;
    }

    // Get all students enrolled in the course
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('user_id')
      .eq('course_id', courseId);

    if (enrollmentsError) {
      console.error('Error fetching enrollments:', enrollmentsError);
      return NextResponse.json({ 
        warning: 'Announcement created but notifications may not have been sent to all students',
        announcement
      });
    }

    // Create notifications for all enrolled students
    if (enrollments && enrollments.length > 0) {
      const notifications = enrollments.map(enrollment => ({
        user_id: enrollment.user_id,
        type: 'course_announcement',
        title,
        message,
        course_id: courseId,
        created_by: instructorId,
        created_at: new Date().toISOString(),
        read: false,
      }));

      const { error: notificationsError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (notificationsError) {
        console.error('Error creating notifications:', notificationsError);
        return NextResponse.json({ 
          warning: 'Announcement created but notifications may not have been sent to all students',
          announcement
        });
      }
    }

    // Log the activity
    try {
      await supabase.rpc('log_activity', {
        p_type: 'announcement',
        p_user_id: instructorId,
        p_course_id: courseId,
        p_action_description: `posted announcement: "${title}"`
      });
    } catch (logError) {
      console.error('Error logging activity:', logError);
      // Don't fail the operation if logging fails
    }

    return NextResponse.json({
      success: true,
      message: 'Announcement created and notifications sent to enrolled students',
      announcement,
      studentsNotified: enrollments?.length || 0,
    });

  } catch (error: any) {
    console.error('Course announcement API error:', error);
    const apiError = await handleApiError(error);
    return NextResponse.json({
      code: apiError.code,
      error: apiError.message,
      details: apiError.details,
    }, { status: apiError.code === 'VALIDATION_ERROR' ? 400 : apiError.code === 'FORBIDDEN' ? 403 : 500 });
  }
}
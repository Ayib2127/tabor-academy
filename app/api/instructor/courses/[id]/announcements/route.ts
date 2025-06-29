import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
});

export async function POST(
  req: Request,
  context: Promise<{ params: { id: string } }>
) {
  const { params } = await context;
  const courseId = params.id;

  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Check authentication
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 });
    }

    // Parse and validate request body
    const body = await req.json();
    const { title, message } = announcementSchema.parse(body);

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
      console.error('Error creating announcement:', announcementError);
      return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
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
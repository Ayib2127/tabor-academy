import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ValidationError, ForbiddenError, handleApiError } from '@/lib/utils/error-handling';

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new ForbiddenError('Unauthorized');
    }

    // Get user role
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = userProfile?.role || 'student';

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type');
    const courseId = searchParams.get('courseId');

    // Build query
    let query = supabase
      .from('calendar_events')
      .select('*')
      .or(`user_id.eq.${user.id},instructor_id.eq.${user.id},student_id.eq.${user.id}`);

    // Add filters
    if (startDate && endDate) {
      query = query.gte('start_date', startDate).lte('end_date', endDate);
    }

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    if (courseId) {
      query = query.eq('course_id', courseId);
    }

    // Execute query
    const { data: events, error } = await query.order('start_date', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({ events: events || [] });
  } catch (error) {
    console.error('Calendar API error:', error);
    const apiError = handleApiError(error);
    return NextResponse.json({
      code: apiError.code,
      error: apiError.message,
      details: apiError.details,
    }, { status: apiError.code === 'FORBIDDEN' ? 403 : 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new ForbiddenError('Unauthorized');
    }

    const body = await request.json();
    const {
      title,
      description,
      startDate,
      endDate,
      type,
      location,
      meetingLink,
      color,
      priority,
      participants,
      courseId,
      instructorId,
      studentId,
      notifications,
      recurring,
    } = body;

    // Validate required fields
    if (!title || !startDate || !endDate || !type) {
      throw new ValidationError('Missing required fields');
    }

    // Create event
    const { data: event, error } = await supabase
      .from('calendar_events')
      .insert({
        title,
        description,
        start_date: startDate,
        end_date: endDate,
        type,
        location,
        meeting_link: meetingLink,
        color: color || '#4ECDC4',
        priority: priority || 'medium',
        participants: participants || [],
        user_id: user.id,
        course_id: courseId,
        instructor_id: instructorId,
        student_id: studentId,
        notifications: notifications || {
          email: true,
          push: true,
          sms: false,
          minutesBefore: 15,
        },
        recurring: recurring || null,
        status: 'scheduled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Calendar API error:', error);
    const apiError = handleApiError(error);
    return NextResponse.json({
      code: apiError.code,
      error: apiError.message,
      details: apiError.details,
    }, { status: apiError.code === 'VALIDATION_ERROR' ? 400 : apiError.code === 'FORBIDDEN' ? 403 : 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new ForbiddenError('Unauthorized');
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      throw new ValidationError('Event ID is required');
    }

    // Check if user owns the event
    const { data: existingEvent } = await supabase
      .from('calendar_events')
      .select('user_id, instructor_id, student_id')
      .eq('id', id)
      .single();

    if (!existingEvent) {
      throw new ValidationError('Event not found');
    }

    const canEdit = existingEvent.user_id === user.id || 
                   existingEvent.instructor_id === user.id || 
                   existingEvent.student_id === user.id;

    if (!canEdit) {
      throw new ForbiddenError('Not authorized to edit this event');
    }

    // Update event
    const { data: event, error } = await supabase
      .from('calendar_events')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Calendar API error:', error);
    const apiError = handleApiError(error);
    return NextResponse.json({
      code: apiError.code,
      error: apiError.message,
      details: apiError.details,
    }, { status: apiError.code === 'VALIDATION_ERROR' ? 400 : apiError.code === 'FORBIDDEN' ? 403 : 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new ForbiddenError('Unauthorized');
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      throw new ValidationError('Event ID is required');
    }

    // Check if user owns the event
    const { data: existingEvent } = await supabase
      .from('calendar_events')
      .select('user_id, instructor_id, student_id')
      .eq('id', id)
      .single();

    if (!existingEvent) {
      throw new ValidationError('Event not found');
    }

    const canDelete = existingEvent.user_id === user.id || 
                     existingEvent.instructor_id === user.id || 
                     existingEvent.student_id === user.id;

    if (!canDelete) {
      throw new ForbiddenError('Not authorized to delete this event');
    }

    // Delete event
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Calendar API error:', error);
    const apiError = handleApiError(error);
    return NextResponse.json({
      code: apiError.code,
      error: apiError.message,
      details: apiError.details,
    }, { status: apiError.code === 'VALIDATION_ERROR' ? 400 : apiError.code === 'FORBIDDEN' ? 403 : 500 });
  }
} 
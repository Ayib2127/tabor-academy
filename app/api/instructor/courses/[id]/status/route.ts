import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// GET endpoint to check course status
export async function GET(req: Request, context: Promise<{ params: { id: string } }>) {
  const { params } = await context;
  const courseId = params.id;
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get course status and review information
    const { data: course, error: fetchError } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        status,
        content_type,
        is_published,
        rejection_reason,
        reviewed_at,
        instructor_id,
        users!courses_reviewed_by_fkey (
          full_name,
          email
        )
      `)
      .eq('id', courseId)
      .single();

    if (fetchError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if user has permission to view this course status
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const isOwner = course.instructor_id === session.user.id;
    const isAdmin = userProfile?.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Determine workflow information based on status
    let workflowInfo = {};
    
    switch (course.status) {
      case 'draft':
        workflowInfo = {
          currentStatus: 'draft',
          nextStep: 'Complete your course content and submit for review',
          canEdit: isOwner,
          canSubmitForReview: isOwner,
          canPublish: false,
        };
        break;
      
      case 'pending_review':
        workflowInfo = {
          currentStatus: 'pending_review',
          nextStep: 'Waiting for admin review',
          canEdit: false,
          canSubmitForReview: false,
          canPublish: false,
          estimatedReviewTime: '2-3 business days',
        };
        break;
      
      case 'published':
        workflowInfo = {
          currentStatus: 'published',
          nextStep: 'Course is live and available to students',
          canEdit: isOwner, // Can edit but changes may require re-approval
          canSubmitForReview: false,
          canPublish: false,
          publishedAt: course.reviewed_at,
          reviewedBy: course.users?.full_name,
        };
        break;
      
      case 'rejected':
        workflowInfo = {
          currentStatus: 'rejected',
          nextStep: 'Address feedback and resubmit for review',
          canEdit: isOwner,
          canSubmitForReview: isOwner,
          canPublish: false,
          rejectionReason: course.rejection_reason,
          reviewedAt: course.reviewed_at,
          reviewedBy: course.users?.full_name,
        };
        break;
    }

    return NextResponse.json({
      course: {
        id: course.id,
        title: course.title,
        status: course.status,
        content_type: course.content_type,
        is_published: course.is_published,
      },
      workflow: workflowInfo,
      review: {
        rejection_reason: course.rejection_reason,
        reviewed_at: course.reviewed_at,
        reviewed_by: course.users?.full_name,
      }
    });

  } catch (error: any) {
    console.error('Get course status error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message,
    }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import * as Sentry from '@sentry/nextjs';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse<any>> {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Check for authenticated user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    
    const courseId = formData.get('courseId') as string;
    const courseTitle = formData.get('courseTitle') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const currency = formData.get('currency') as string;
    const paymentMethod = formData.get('paymentMethod') as string;
    const paymentMethodName = formData.get('paymentMethodName') as string;
    const accountNumber = formData.get('accountNumber') as string;
    const transactionId = formData.get('transactionId') as string;
    const paymentProof = formData.get('paymentProof') as File;

    // Validate required fields
    if (!courseId || !amount || !paymentMethod || !transactionId || !paymentProof) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Validate course exists and user is not already enrolled
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, price, instructor_id')
      .eq('id', courseId)
      .eq('is_published', true)
      .single();

    if (courseError || !course) {
      return NextResponse.json({ 
        error: 'Course not found or not published' 
      }, { status: 404 });
    }

    // Check if user is already enrolled
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('course_id', courseId)
      .maybeSingle();

    if (existingEnrollment) {
      return NextResponse.json({ 
        error: 'You are already enrolled in this course' 
      }, { status: 400 });
    }

    // Check if user is trying to enroll in their own course
    if (course.instructor_id === session.user.id) {
      return NextResponse.json({ 
        error: 'You cannot enroll in your own course' 
      }, { status: 400 });
    }

    // Validate payment amount
    if (Math.abs(amount - course.price) > 0.01) {
      return NextResponse.json({ 
        error: 'Payment amount does not match course price' 
      }, { status: 400 });
    }

    // Check for duplicate transaction ID
    const { data: existingPayment } = await supabase
      .from('ethiopian_payments')
      .select('id')
      .eq('transaction_id', transactionId)
      .eq('payment_method', paymentMethod)
      .maybeSingle();

    if (existingPayment) {
      return NextResponse.json({ 
        error: 'This transaction ID has already been used' 
      }, { status: 400 });
    }

    // Upload payment proof file
    const fileExtension = paymentProof.name.split('.').pop();
    const fileName = `payment-proof-${session.user.id}-${courseId}-${Date.now()}.${fileExtension}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, paymentProof, {
        contentType: paymentProof.type,
        upsert: false
      });

    if (uploadError) {
      console.error('File upload error:', uploadError);
      return NextResponse.json({ 
        error: 'Failed to upload payment proof' 
      }, { status: 500 });
    }

    // Create Ethiopian payment record
    const { data: paymentRecord, error: paymentError } = await supabase
      .from('ethiopian_payments')
      .insert({
        user_id: session.user.id,
        course_id: courseId,
        course_title: courseTitle,
        amount,
        currency,
        payment_method: paymentMethod,
        payment_method_name: paymentMethodName,
        account_number: accountNumber,
        transaction_id: transactionId,
        payment_proof_url: uploadData.path,
        status: 'pending_verification',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment record creation error:', paymentError);
      
      // Clean up uploaded file if payment record creation fails
      await supabase.storage
        .from('payment-proofs')
        .remove([fileName]);

      return NextResponse.json({ 
        error: 'Failed to create payment record' 
      }, { status: 500 });
    }

    // Send notification to admin (you can implement email/webhook here)
    try {
      await notifyAdminOfNewPayment(paymentRecord);
    } catch (notificationError) {
      console.warn('Failed to send admin notification:', notificationError);
    }

    // Track the payment submission
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'ethiopian_payment_submitted',
          properties: {
            course_id: courseId,
            course_title: courseTitle,
            amount,
            currency,
            payment_method: paymentMethod,
            user_id: session.user.id
          }
        })
      });
    } catch (analyticsError) {
      console.warn('Analytics tracking failed:', analyticsError);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment submitted successfully. You will receive course access within 24 hours after verification.',
      payment_id: paymentRecord.id,
      status: 'pending_verification'
    });

  } catch (error: any) {
    console.error('Ethiopian payment submission error:', error);
    Sentry.captureException(error);
    return NextResponse.json({ 
      error: 'An unexpected error occurred' 
    }, { status: 500 });
  }
}

async function notifyAdminOfNewPayment(paymentRecord: any) {
  // This function would send notifications to admins about new payments
  // You can implement email notifications, Slack webhooks, etc.
  
  console.log('New Ethiopian payment submitted:', {
    id: paymentRecord.id,
    user_id: paymentRecord.user_id,
    course_id: paymentRecord.course_id,
    amount: paymentRecord.amount,
    payment_method: paymentRecord.payment_method_name,
    transaction_id: paymentRecord.transaction_id
  });

  // Example: Send webhook to admin dashboard
  /*
  try {
    await fetch(process.env.ADMIN_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'new_ethiopian_payment',
        data: paymentRecord
      })
    });
  } catch (error) {
    console.error('Admin webhook failed:', error);
  }
  */
} 
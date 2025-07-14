import { NextRequest, NextResponse } from 'next/server';
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import * as Sentry from '@sentry/nextjs';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse<any>> {
  const supabase = await createApiSupabaseClient();

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
    if (paymentMethod === 'stripe' || paymentMethod === 'card') {
      if (Math.abs(amount - course.price) > 0.01) {
        return NextResponse.json({ 
          error: 'Payment amount does not match course price' 
        }, { status: 400 });
      }
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

    // Upload payment proof file to Cloudinary
    const fileExtension = paymentProof.name.split('.').pop();
    const fileName = `payment-proof-${session.user.id}-${courseId}-${Date.now()}.${fileExtension}`;
    const arrayBuffer = await paymentProof.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let cloudinaryResult;
    try {
      cloudinaryResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'tabor_academy/payment',
            public_id: fileName,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(buffer);
      });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return NextResponse.json({
        error: 'Failed to upload payment proof',
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
        payment_proof_url: cloudinaryResult.secure_url,
        status: 'pending_verification',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment record creation error:', paymentError);
      
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
  // Fetch all admin users
  const supabase = await createApiSupabaseClient();
  const { data: admins, error } = await supabase
    .from('users')
    .select('id, full_name, email')
    .eq('role', 'admin');
  if (error) {
    console.error('Failed to fetch admins for notification:', error);
    return;
  }
  if (!admins || admins.length === 0) return;
  // Create a notification for each admin
  const notifications = admins.map((admin: any) => ({
    user_id: admin.id,
    type: 'system_alert',
    title: 'New Local Payment Submitted',
    message: `A new Ethiopian/local payment for course "${paymentRecord.course_title}" requires verification.`,
    data: {
      payment_id: paymentRecord.id,
      user_id: paymentRecord.user_id,
      course_id: paymentRecord.course_id,
      amount: paymentRecord.amount,
      currency: paymentRecord.currency,
      payment_method: paymentRecord.payment_method_name,
      transaction_id: paymentRecord.transaction_id,
      payment_proof_url: paymentRecord.payment_proof_url
    },
    read: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
  const { error: notifError } = await supabase
    .from('notifications')
    .insert(notifications);
  if (notifError) {
    console.error('Failed to create admin notifications:', notifError);
  }
} 
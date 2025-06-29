import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import * as Sentry from '@sentry/nextjs';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest): Promise<NextResponse<any>> {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { session_id } = await request.json();

    if (!session_id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Session ID is required' 
      }, { status: 400 });
    }

    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Check if enrollment already exists for this payment reference
    const { data: existingEnrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select(`
        id,
        course_id,
        payment_reference,
        courses (
          id,
          title
        )
      `)
      .eq('user_id', session.user.id)
      .eq('payment_reference', session_id)
      .maybeSingle();

    if (enrollmentError) {
      console.error('Error checking enrollment:', enrollmentError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to verify enrollment status' 
      }, { status: 500 });
    }

    if (existingEnrollment) {
      // Payment already processed and enrollment created
      return NextResponse.json({
        success: true,
        message: 'Payment already verified and enrollment completed',
        course_id: existingEnrollment.course_id,
        course_title: existingEnrollment.courses?.title,
        enrollment_id: existingEnrollment.id
      });
    }

    // Verify payment with Stripe
    const paymentVerification = await verifyStripePayment(session_id);

    if (!paymentVerification.success) {
      return NextResponse.json({
        success: false,
        error: paymentVerification.error || 'Payment verification failed'
      }, { status: 400 });
    }

    // Extract course information from payment metadata
    const { course_id, user_id, amount, currency } = paymentVerification.data;

    // Verify that the payment is for the current user
    if (user_id !== session.user.id) {
      return NextResponse.json({
        success: false,
        error: 'Payment verification failed: User mismatch'
      }, { status: 400 });
    }

    // Get course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, price')
      .eq('id', course_id)
      .single();

    if (courseError || !course) {
      return NextResponse.json({
        success: false,
        error: 'Course not found'
      }, { status: 404 });
    }

    // Verify payment amount matches course price
    if (Math.abs(amount - course.price) > 0.01) { // Allow for small floating point differences
      return NextResponse.json({
        success: false,
        error: 'Payment amount does not match course price'
      }, { status: 400 });
    }

    // Create enrollment
    const { data: enrollment, error: createEnrollmentError } = await supabase
      .from('enrollments')
      .insert({
        user_id: session.user.id,
        course_id,
        enrolled_at: new Date().toISOString(),
        payment_reference: session_id,
        payment_amount: amount,
        payment_currency: currency,
        payment_provider: 'stripe'
      })
      .select()
      .single();

    if (createEnrollmentError) {
      console.error('Error creating enrollment:', createEnrollmentError);
      return NextResponse.json({
        success: false,
        error: 'Failed to create enrollment'
      }, { status: 500 });
    }

    // Track successful enrollment
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'course_enrolled',
          properties: {
            course_id,
            course_title: course.title,
            price: amount,
            currency,
            user_id: session.user.id,
            payment_provider: 'stripe',
            payment_reference: session_id
          }
        })
      });
    } catch (analyticsError) {
      console.warn('Analytics tracking failed:', analyticsError);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and enrollment completed successfully',
      course_id,
      course_title: course.title,
      enrollment_id: enrollment.id
    });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    Sentry.captureException(error);
    return NextResponse.json({
      success: false,
      error: 'An unexpected error occurred during payment verification'
    }, { status: 500 });
  }
}

async function verifyStripePayment(session_id: string) {
  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid' && session.status === 'complete') {
      return {
        success: true,
        provider: 'stripe',
        data: {
          course_id: session.metadata?.course_id,
          user_id: session.metadata?.user_id,
          amount: (session.amount_total || 0) / 100, // Convert from cents
          currency: (session.currency || 'USD').toUpperCase(),
          reference: session_id
        }
      };
    }

    return {
      success: false,
      error: `Payment not completed. Status: ${session.payment_status}`,
      provider: 'stripe'
    };

  } catch (error: any) {
    console.error('Stripe verification error:', error);
    return {
      success: false,
      error: 'Stripe verification failed',
      provider: 'stripe'
    };
  }
} 
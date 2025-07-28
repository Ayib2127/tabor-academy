import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import * as Sentry from '@sentry/nextjs';
import Stripe from 'stripe';
import { handleApiError, ValidationError } from '@/lib/utils/error-handling';

export const dynamic = 'force-dynamic';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(request: NextRequest): Promise<NextResponse<any>> {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    
    if (!signature) {
      console.error('No Stripe signature found in webhook headers');
      throw new ValidationError('No signature provided');
    }

    // Verify webhook signature
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error('Stripe webhook signature verification failed:', err.message);
      throw new ValidationError('Invalid signature');
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        return await processStripeWebhook(event.data.object as Stripe.Checkout.Session);
      
      case 'payment_intent.succeeded':
        console.log('Payment intent succeeded:', event.data.object.id);
        break;
      
      case 'payment_intent.payment_failed':
        console.log('Payment intent failed:', event.data.object.id);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    Sentry.captureException(error);
    const apiError = handleApiError(error);
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'VALIDATION_ERROR' ? 400 : 500 });
  }
}

async function processStripeWebhook(session: Stripe.Checkout.Session): Promise<NextResponse> {
  try {
    // Only process completed payments
    if (session.payment_status !== 'paid') {
      console.log('Ignoring non-paid checkout session');
      return NextResponse.json({ message: 'Webhook received' });
    }

    const {
      id: session_id,
      amount_total,
      currency,
      customer_email,
      metadata
    } = session;

    if (!metadata || !metadata.course_id || !metadata.user_id) {
      console.error('Missing required metadata in Stripe session');
      throw new ValidationError('Missing metadata');
    }

    const {
      course_id,
      user_id,
      course_title
    } = metadata;

    return await createEnrollmentFromPayment({
      reference: session_id,
      amount: (amount_total || 0) / 100, // Convert from cents
      currency: currency || 'usd',
      customer_email: customer_email || '',
      course_id,
      user_id,
      course_title,
      provider: 'stripe'
    });

  } catch (error) {
    console.error('Stripe webhook processing error:', error);
    throw error;
  }
}

async function createEnrollmentFromPayment({
  reference,
  amount,
  currency,
  customer_email,
  course_id,
  user_id,
  course_title,
  provider
}: {
  reference: string;
  amount: number;
  currency: string;
  customer_email: string;
  course_id: string;
  user_id: string;
  course_title: string;
  provider: string;
}): Promise<NextResponse> {
  const supabase = await createSupabaseServerClient();

  try {
    // Check if enrollment already exists (prevent duplicate processing)
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user_id)
      .eq('course_id', course_id)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing enrollment:', checkError);
      throw new ValidationError('Failed to check enrollment status');
    }

    if (existingEnrollment) {
      console.log('Enrollment already exists, skipping creation');
      return NextResponse.json({ message: 'Enrollment already exists' });
    }

    // Create the enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .insert({
        user_id,
        course_id,
        enrolled_at: new Date().toISOString(),
        payment_reference: reference,
        payment_amount: amount,
        payment_currency: currency.toUpperCase(),
        payment_provider: provider
      })
      .select()
      .single();

    if (enrollmentError) {
      console.error('Error creating enrollment:', enrollmentError);
      throw new ValidationError('Failed to create enrollment');
    }

    // Log successful payment
    console.log(`Payment successful: ${reference} - User ${user_id} enrolled in course ${course_id}`);

    // Track enrollment event
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'course_enrolled',
          properties: {
            course_id,
            course_title,
            price: amount,
            currency: currency.toUpperCase(),
            user_id,
            payment_provider: provider,
            payment_reference: reference
          }
        })
      });
    } catch (analyticsError) {
      console.warn('Analytics tracking failed:', analyticsError);
    }

    // Send congratulations email (non-blocking)
    try {
      // Import dynamically to avoid circular dependencies
      const { sendEnrollmentCongratulationsEmail } = await import('@/lib/email/resend');
      sendEnrollmentCongratulationsEmail({
        userEmail: customer_email,
        userName: customer_email.split('@')[0], // If you have full name, use it
        courseTitle: course_title,
      }).catch((e) => console.warn('Failed to send congratulations email:', e));
    } catch (emailError) {
      console.warn('Failed to send congratulations email:', emailError);
    }

    return NextResponse.json({ 
      message: 'Enrollment created successfully',
      enrollment_id: enrollment.id 
    });

  } catch (error: any) {
    console.error('Error creating enrollment from payment:', error);
    Sentry.captureException(error);
    throw error;
  }
}

async function sendEnrollmentConfirmationEmail({
  user_id,
  course_id,
  course_title,
  customer_email,
  amount,
  currency
}: {
  user_id: string;
  course_id: string;
  course_title: string;
  customer_email: string;
  amount: number;
  currency: string;
}) {
  // This would integrate with your email service (SendGrid, Mailgun, etc.)
  // For now, we'll just log the action
  console.log(`Enrollment confirmation email should be sent to ${customer_email} for course: ${course_title}`);
  
  // Example implementation with a hypothetical email service:
  /*
  await emailService.send({
    to: customer_email,
    template: 'enrollment_confirmation',
    data: {
      course_title,
      amount,
      currency,
      course_url: `${process.env.NEXT_PUBLIC_SITE_URL}/courses/${course_id}`,
      dashboard_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
    }
  });
  */
} 
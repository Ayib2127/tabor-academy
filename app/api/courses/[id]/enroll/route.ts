import { NextRequest, NextResponse } from 'next/server';
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import * as Sentry from '@sentry/nextjs';
import Stripe from 'stripe';
import { handleApiError, ForbiddenError, ValidationError, ResourceConflictError, NotFoundError, PaymentError } from '@/lib/utils/error-handling';

export const dynamic = 'force-dynamic';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<any>> {
  const supabase = await createApiSupabaseClient();
  const { id: courseId } = await params;

  try {
    // 1. Check for authenticated user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new ForbiddenError('Unauthorized');
    }

    // 2. Get course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, price, is_published, instructor_id')
      .eq('id', courseId)
      .eq('is_published', true)
      .single();

    if (courseError || !course) {
      throw new NotFoundError('Course not found or not published');
    }

    // 3. Check if user is already enrolled
    const { data: existingEnrollment, error: enrollmentCheckError } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('course_id', courseId)
      .maybeSingle();

    if (enrollmentCheckError) {
      console.error('Error checking enrollment:', enrollmentCheckError);
      throw handleApiError(enrollmentCheckError);
    }

    if (existingEnrollment) {
      throw new ResourceConflictError('You are already enrolled in this course');
    }

    // 4. Check if user is trying to enroll in their own course
    if (course.instructor_id === session.user.id) {
      throw new ValidationError('You cannot enroll in your own course');
    }

    // 5. Handle enrollment based on course price
    if (course.price === 0) {
      // FREE COURSE: Create enrollment immediately
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('enrollments')
        .insert({
          user_id: session.user.id,
          course_id: courseId,
          enrolled_at: new Date().toISOString()
        })
        .select()
        .single();

      if (enrollmentError) {
        console.error('Error creating enrollment:', enrollmentError);
        throw handleApiError(enrollmentError);
      }

      // Track enrollment event
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/analytics/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'course_enrolled',
            properties: {
              course_id: courseId,
              course_title: course.title,
              price: 0,
              user_id: session.user.id
            }
          })
        });
      } catch (analyticsError) {
        console.warn('Analytics tracking failed:', analyticsError);
      }

      // Send congratulations email (non-blocking)
      try {
        // Fetch user details for email
        const { data: userProfile, error: userError } = await supabase
          .from('users')
          .select('full_name, email')
          .eq('id', session.user.id)
          .single();

        if (!userError && userProfile?.email) {
          // Import dynamically to avoid circular dependencies
          const { sendEnrollmentCongratulationsEmail } = await import('@/lib/email/resend');
          sendEnrollmentCongratulationsEmail({
            userEmail: userProfile.email,
            userName: userProfile.full_name || userProfile.email.split('@')[0],
            courseTitle: course.title,
          }).catch((e) => console.error('Failed to send congratulations email:', e));
        }
      } catch (e) {
        console.error('Error preparing to send congratulations email:', e);
      }

      return NextResponse.json({
        success: true,
        enrollment,
        message: 'Successfully enrolled in course!',
        redirect_url: `/courses/${courseId}`
      });

    } else {
      // PAID COURSE: Initialize Stripe payment
      const { amount, currency = 'USD' } = await request.json();
      
      if (!amount || amount !== course.price) {
        throw new ValidationError('Invalid payment amount');
      }

      // Get user details for payment
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', session.user.id)
        .single();

      if (userError) {
        console.error('Error fetching user profile:', userError);
        throw handleApiError(userError);
      }

      // Initialize payment with Stripe
      const paymentData = await initializeStripePayment({
        amount: course.price,
        currency,
        email: session.user.email || userProfile.email,
        name: userProfile.full_name,
        course_id: courseId,
        course_title: course.title,
        user_id: session.user.id
      });

      if (!paymentData.success) {
        throw new PaymentError(paymentData.error || 'Failed to initialize payment');
      }

      return NextResponse.json({
        success: true,
        payment_required: true,
        payment_url: paymentData.payment_url,
        session_id: paymentData.session_id,
        message: 'Payment initialized. Redirecting to payment page...'
      });
    }

  } catch (error: any) {
    console.error('Enrollment error:', error);
    Sentry.captureException(error);
    const apiError = await handleApiError(error);
    return NextResponse.json({ 
      code: apiError.code, error: apiError.message, details: apiError.details 
    }, { status: apiError.code === 'VALIDATION_ERROR' ? 400 : apiError.code === 'FORBIDDEN' ? 403 : apiError.code === 'RESOURCE_CONFLICT' ? 409 : apiError.code === 'NOT_FOUND' ? 404 : apiError.code === 'PAYMENT_ERROR' ? 402 : 500 });
  }
}

// Stripe payment initialization
async function initializeStripePayment({
  amount,
  currency,
  email,
  name,
  course_id,
  course_title,
  user_id
}: {
  amount: number;
  currency: string;
  email: string;
  name: string;
  course_id: string;
  course_title: string;
  user_id: string;
}) {
  try {
    // Debug log for Stripe redirect URLs
    const successUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/payment/callback?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/courses/${course_id}`;
    console.log('Stripe Checkout URLs:', { successUrl, cancelUrl });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: course_title,
              description: `Enrollment for: ${course_title}`,
              images: [`${process.env.NEXT_PUBLIC_SITE_URL}/logo.jpg`],
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: email,
      metadata: {
        course_id,
        user_id,
        course_title,
      },
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT', 'LU', 'GR', 'CY', 'MT', 'SI', 'SK', 'EE', 'LV', 'LT', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'JP', 'SG', 'HK', 'MY', 'TH', 'PH', 'ID', 'VN', 'IN', 'AE', 'SA', 'EG', 'ZA', 'KE', 'NG', 'GH', 'ET'], // Include Ethiopia and other Ethiopian countries
      },
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes expiry
    });

    return {
      success: true,
      payment_url: session.url,
      session_id: session.id
    };
    
  } catch (error: any) {
    console.error('Stripe payment initialization error:', error);
    return { 
      success: false, 
      error: error.message || 'Stripe payment initialization failed' 
    };
  }
} 
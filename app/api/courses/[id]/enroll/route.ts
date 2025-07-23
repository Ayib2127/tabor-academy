import { NextRequest, NextResponse } from 'next/server';
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import * as Sentry from '@sentry/nextjs';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<any>> {
  const supabase = await createApiSupabaseClient();

  try {
    const courseId = params.id;

    // 1. Check for authenticated user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, price, is_published, instructor_id')
      .eq('id', courseId)
      .eq('is_published', true)
      .single();

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found or not published' }, { status: 404 });
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
      return NextResponse.json({ error: 'Failed to check enrollment status' }, { status: 500 });
    }

    if (existingEnrollment) {
      return NextResponse.json({ 
        error: 'You are already enrolled in this course',
        enrolled: true 
      }, { status: 400 });
    }

    // 4. Check if user is trying to enroll in their own course
    if (course.instructor_id === session.user.id) {
      return NextResponse.json({ 
        error: 'You cannot enroll in your own course' 
      }, { status: 400 });
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
        return NextResponse.json({ error: 'Failed to enroll in course' }, { status: 500 });
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
        return NextResponse.json({ 
          error: 'Invalid payment amount' 
        }, { status: 400 });
      }

      // Get user details for payment
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', session.user.id)
        .single();

      if (userError) {
        console.error('Error fetching user profile:', userError);
        return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
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
        return NextResponse.json({ 
          error: 'Failed to initialize payment' 
        }, { status: 500 });
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
    return NextResponse.json({ 
      error: 'An unexpected error occurred during enrollment' 
    }, { status: 500 });
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
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { handleWelcomeEmail } from '@/lib/utils/welcome-email';
import { handleApiError, ValidationError, ForbiddenError } from '@/lib/utils/error-handling';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                 session:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     expiresAt:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Use SSR server client for correct cookie handling
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new ForbiddenError(error.message);
    }

    // After successful login, trigger welcome email (non-blocking)
    if (data.user) {
      handleWelcomeEmail(data.user.id).catch(error => {
        console.error('Welcome email error (non-blocking):', error);
      });
    }

    return NextResponse.json({
      user: data.user,
      session: data.session
    });
  } catch (error) {
    console.error('Login API error:', error);
    const apiError = handleApiError(error);
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'VALIDATION_ERROR' ? 400 : apiError.code === 'FORBIDDEN' ? 401 : 500 });
  }
}
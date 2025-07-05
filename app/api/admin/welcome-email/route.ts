import { NextRequest, NextResponse } from 'next/server';
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { forceSendWelcomeEmail } from '@/lib/utils/welcome-email';

/**
 * @swagger
 * /api/admin/welcome-email:
 *   post:
 *     summary: Force send welcome email to a user (Admin only)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Welcome email sent successfully
 *       401:
 *         description: Unauthorized - Admin access required
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const { session, supabase } = await createApiSupabaseClient();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (userError || !userData || userData.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 401 }
      );
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const result = await forceSendWelcomeEmail(userId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send welcome email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Welcome email sent successfully',
    });

  } catch (error) {
    console.error('Admin welcome email API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/admin/welcome-email:
 *   get:
 *     summary: Get users who haven't received welcome emails (Admin only)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of users without welcome emails
 *       401:
 *         description: Unauthorized - Admin access required
 *       500:
 *         description: Server error
 */
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const { session, supabase } = await createApiSupabaseClient();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (userError || !userData || userData.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 401 }
      );
    }

    // Get users who haven't received welcome emails
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, full_name, role, created_at')
      .eq('welcome_email_sent', false)
      .order('created_at', { ascending: false });

    if (usersError) {
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      users: users || [],
      count: users?.length || 0,
    });

  } catch (error) {
    console.error('Admin welcome email list API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 
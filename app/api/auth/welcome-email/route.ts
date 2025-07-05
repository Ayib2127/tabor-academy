import { NextRequest, NextResponse } from 'next/server';
import { handleWelcomeEmail } from '@/lib/utils/welcome-email';

/**
 * @swagger
 * /api/auth/welcome-email:
 *   post:
 *     summary: Send welcome email to user if not already sent
 *     tags: [Authentication]
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
 *         description: Welcome email processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 emailSent:
 *                   type: boolean
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const result = await handleWelcomeEmail(userId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to process welcome email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      emailSent: result.emailSent || false,
    });

  } catch (error) {
    console.error('Welcome email API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 
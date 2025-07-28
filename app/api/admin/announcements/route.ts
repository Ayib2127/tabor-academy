import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ValidationError, ForbiddenError, handleApiError } from '@/lib/utils/error-handling';

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  type: z.enum(['info', 'warning', 'success', 'error']),
  enabled: z.boolean(),
});

export async function POST(req: Request) {
  try {
    const supabase = await createApiSupabaseClient();

    // Check authentication
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new ForbiddenError('Unauthorized');
    }

    // Verify admin role
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (userError || userProfile?.role !== 'admin') {
      throw new ForbiddenError('Admin access required');
    }

    // Parse and validate request body
    let announcementData;
    try {
      const body = await req.json();
      announcementData = announcementSchema.parse(body);
    } catch (err) {
      throw new ValidationError('Invalid request data', err instanceof z.ZodError ? err.errors : undefined);
    }

    // For MVP, we'll store in localStorage on the client side
    // In production, this would be stored in the database
    // TODO: In production, save to database

    return NextResponse.json({
      success: true,
      message: 'Global announcement saved successfully',
      announcement: announcementData,
    });

  } catch (error: any) {
    console.error('Announcement API error:', error);
    const apiError = handleApiError(error);
    return NextResponse.json({
      code: apiError.code,
      error: apiError.message,
      details: apiError.details,
    }, { status: apiError.code === 'VALIDATION_ERROR' ? 400 : apiError.code === 'FORBIDDEN' ? 403 : 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createApiSupabaseClient();

    // Check authentication
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new ForbiddenError('Unauthorized');
    }

    // TODO: In production, fetch from database
    // For MVP, return empty array since we're using localStorage
    return NextResponse.json({
      announcements: [],
      message: 'Announcements are managed via localStorage for MVP',
    });

  } catch (error: any) {
    console.error('Get announcements API error:', error);
    const apiError = handleApiError(error);
    return NextResponse.json({
      code: apiError.code,
      error: apiError.message,
      details: apiError.details,
    }, { status: apiError.code === 'FORBIDDEN' ? 403 : 500 });
  }
}
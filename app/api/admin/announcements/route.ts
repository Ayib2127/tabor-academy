import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  type: z.enum(['info', 'warning', 'success', 'error']),
  enabled: z.boolean(),
});

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Check authentication
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (userError || userProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Parse and validate request body
    const body = await req.json();
    const announcementData = announcementSchema.parse(body);

    // For MVP, we'll store in localStorage on the client side
    // In production, this would be stored in the database
    
    // TODO: In production, save to database:
    // const { data, error } = await supabase
    //   .from('global_announcements')
    //   .insert({
    //     title: announcementData.title,
    //     message: announcementData.message,
    //     type: announcementData.type,
    //     enabled: announcementData.enabled,
    //     created_by: session.user.id,
    //     created_at: new Date().toISOString(),
    //   });

    return NextResponse.json({
      success: true,
      message: 'Global announcement saved successfully',
      announcement: announcementData,
    });

  } catch (error: any) {
    console.error('Announcement API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Invalid request data',
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message,
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Check authentication
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: In production, fetch from database:
    // const { data: announcements, error } = await supabase
    //   .from('global_announcements')
    //   .select('*')
    //   .eq('enabled', true)
    //   .order('created_at', { ascending: false })
    //   .limit(1);

    // For MVP, return empty array since we're using localStorage
    return NextResponse.json({
      announcements: [],
      message: 'Announcements are managed via localStorage for MVP',
    });

  } catch (error: any) {
    console.error('Get announcements API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message,
    }, { status: 500 });
  }
}
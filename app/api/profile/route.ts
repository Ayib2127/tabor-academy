import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { ValidationError, ForbiddenError, handleApiError } from '@/lib/utils/error-handling';

export async function GET(request: NextRequest) {
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new ForbiddenError('Unauthorized');
    }
    // Get the user profile
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();
    if (error) {
      throw error;
    }
    return NextResponse.json({ profile: data });
  } catch (error) {
    console.error('Profile API error:', error);
    const apiError = handleApiError(error);
    return NextResponse.json(
      { code: apiError.code, error: apiError.message, details: apiError.details },
      { status: apiError.code === 'FORBIDDEN' ? 403 : 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { fullName, avatarUrl, bio, location } = await request.json();
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new ForbiddenError('Unauthorized');
    }
    // Update the user profile
    const { data, error } = await supabase
      .from('users')
      .update({
        full_name: fullName,
        avatar_url: avatarUrl,
        bio,
        location,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.user.id)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return NextResponse.json({ profile: data });
  } catch (error) {
    console.error('Profile API error:', error);
    const apiError = handleApiError(error);
    return NextResponse.json(
      { code: apiError.code, error: apiError.message, details: apiError.details },
      { status: apiError.code === 'FORBIDDEN' ? 403 : 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { handleApiError, ValidationError } from '@/lib/utils/error-handling';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw new ValidationError(authError.message);
    }

    if (authData.user) {
      // Create a profile in the users table (no custom confirmation fields)
      const { error: profileError } = await supabase
        .from("users")
        .insert({
          id: authData.user.id,
          email: email,
          full_name: fullName || null,
          role: "student",
        });

      if (profileError) {
        console.error("Error creating user profile:", profileError);
      }
    }

    return NextResponse.json({
      user: authData.user,
      session: authData.session,
      message: "Registration successful! Please check your email to confirm your account.",
    });
  } catch (error) {
    console.error('Register API error:', error);
    const apiError = handleApiError(error);
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'VALIDATION_ERROR' ? 400 : 500 });
  }
}
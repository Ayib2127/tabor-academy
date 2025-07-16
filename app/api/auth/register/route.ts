import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
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
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
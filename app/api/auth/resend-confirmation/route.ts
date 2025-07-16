import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import crypto from "crypto";
import { sendConfirmationEmail } from "@/lib/email/resend";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // Look up user by email
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, full_name, email_confirmed")
      .eq("email", email)
      .single();

    // Always return a generic message for security
    if (userError || !user) {
      return NextResponse.json({
        message: "If your account exists and is not confirmed, a new confirmation email has been sent."
      });
    }

    if (user.email_confirmed) {
      return NextResponse.json({
        message: "Your email is already confirmed. Please log in."
      });
    }

    // Generate a new confirmation token
    const confirmationToken = crypto.randomUUID();

    // Update user record with new token
    await supabase
      .from("users")
      .update({
        email_confirmation_token: confirmationToken,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id);

    // Send confirmation email
    await sendConfirmationEmail({
      userEmail: email,
      userName: user.full_name || email,
      confirmationToken,
    });

    return NextResponse.json({
      message: "If your account exists and is not confirmed, a new confirmation email has been sent."
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
} 
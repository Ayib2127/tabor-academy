import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing confirmation token." }, { status: 400 });
  }

  // Find user by token
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, email_confirmed")
    .eq("email_confirmation_token", token)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: "Invalid or expired confirmation token." }, { status: 400 });
  }

  if (user.email_confirmed) {
    return NextResponse.json({ message: "Email already confirmed." });
  }

  // Update user: set email_confirmed true, clear token
  const { error: updateError } = await supabase
    .from("users")
    .update({ email_confirmed: true, email_confirmation_token: null, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (updateError) {
    return NextResponse.json({ error: "Failed to confirm email." }, { status: 500 });
  }

  // Optionally, redirect to a confirmation success page
  // return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/confirmation-success`);

  return NextResponse.json({ message: "Email confirmed successfully!" });
} 
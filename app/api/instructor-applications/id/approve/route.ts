import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
// import { sendWelcomeEmail } from "@/lib/email"; // implement as needed

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch application to get user_id
  const { data: app, error: appError } = await supabase
    .from("instructor_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (appError || !app) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  // Update user role to 'instructor'
  const { error: userError } = await supabase
    .from("users")
    .update({ role: "instructor" })
    .eq("id", app.user_id);

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  // Update application status to 'approved'
  const { error: statusError } = await supabase
    .from("instructor_applications")
    .update({ status: "approved" })
    .eq("id", id);

  if (statusError) {
    return NextResponse.json({ error: statusError.message }, { status: 500 });
  }

  // TODO: Send welcome email
  // await sendWelcomeEmail(app.user_id);

  return NextResponse.json({ success: true });
}
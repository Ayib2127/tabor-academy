import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
// import { sendRejectionEmail } from "@/lib/email"; // implement as needed

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // Update application status to 'rejected'
  const { error } = await supabase
    .from("instructor_applications")
    .update({ status: "rejected" })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // TODO: Send rejection email
  // await sendRejectionEmail(app.user_id);

  return NextResponse.json({ success: true });
}

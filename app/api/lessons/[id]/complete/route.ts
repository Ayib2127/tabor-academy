import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = userData.user.id;
  const { id: lessonId } = await params;
  console.log('[DEBUG] Marking lesson complete:', { userId, lessonId });
  const upsertPayload = { user_id: userId, lesson_id: lessonId, completed: true };
  console.log('[DEBUG] Upsert payload:', upsertPayload);
  const { data, error } = await supabase
    .from('progress')
    .upsert([upsertPayload], { onConflict: 'lesson_id,user_id' });
  console.log('[DEBUG] Upsert result:', { data, error });

  if (error) {
    console.error("Supabase upsert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("Lesson marked as complete for user:", userData.user.id);
  return NextResponse.json({ success: true });
} 
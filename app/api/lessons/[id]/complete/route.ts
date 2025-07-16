import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const lessonId = params.id;

  // Log the lessonId
  console.log("Completing lesson:", lessonId);

  // Get the authenticated user
  const { data: { user }, error: sessionError } = await supabase.auth.getUser();
  console.log("User:", user);
  if (sessionError || !user) {
    console.error("Auth error:", sessionError);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Log the upsert payload
  const upsertPayload = {
    lesson_id: lessonId,
    user_id: user.id,
    completed: true,
    updated_at: new Date().toISOString()
  };
  console.log("Upsert payload:", upsertPayload);

  // Upsert progress for this lesson and user
  const { error } = await supabase
    .from('progress')
    .upsert([upsertPayload], { onConflict: ['lesson_id', 'user_id'] });

  if (error) {
    console.error("Supabase upsert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("Lesson marked as complete for user:", user.id);
  return NextResponse.json({ success: true });
} 
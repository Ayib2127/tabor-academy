import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = userData.user.id;
  const lessonId = params.id;
  console.log('[DEBUG] Fetching notes:', { userId, lessonId });
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single();
  console.log('[DEBUG] Notes fetch result:', { data, error });
}

export async function POST(req, { params }) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = userData.user.id;
  const lessonId = params.id;
  const body = await req.json();
  console.log('[DEBUG] Saving notes:', { userId, lessonId, body });
  const { data, error } = await supabase
    .from('notes')
    .upsert([{ user_id: userId, lesson_id: lessonId, ...body }], { onConflict: 'lesson_id,user_id' });
  console.log('[DEBUG] Notes upsert result:', { data, error });
}
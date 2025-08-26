import { NextRequest, NextResponse } from 'next/server';
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createApiSupabaseClient();
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
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No notes found - return empty string
        return NextResponse.json({ notes: '' });
      }
      console.error('Error fetching notes:', error);
      return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
    }
    
    return NextResponse.json({ notes: data?.notes || '' });
    
  } catch (error) {
    console.error('Unexpected error in notes GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createApiSupabaseClient();
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
      .upsert([{ 
        user_id: userId, 
        lesson_id: lessonId, 
        notes: body.notes,
        updated_at: new Date().toISOString()
      }], { 
        onConflict: 'lesson_id,user_id' 
      });
    
    console.log('[DEBUG] Notes upsert result:', { data, error });
    
    if (error) {
      console.error('Error saving notes:', error);
      return NextResponse.json({ error: 'Failed to save notes' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, notes: data?.[0]?.notes || '' });
    
  } catch (error) {
    console.error('Unexpected error in notes POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { handleApiError } from '@/lib/utils/error-handling';

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    // Test the Supabase connection
    const { data, error } = await supabase.from('users').select('count').single();
    if (error) {
      throw error;
    }
    return NextResponse.json({ 
      status: 'ok', 
      message: 'Supabase connection successful', 
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Supabase Health API error:', error);
    const apiError = handleApiError(error);
    return NextResponse.json(
      { code: apiError.code, error: apiError.message, details: apiError.details },
      { status: 500 }
    );
  }
}
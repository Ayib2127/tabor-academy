import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { handleApiError } from '@/lib/utils/error-handling';

export async function GET() {
  try {
    // Test the Supabase connection
    const { data, error } = await supabase.from('users').select('count').single();
    if (error) {
      throw error;
    }
    return NextResponse.json({ 
      status: 'ok', 
      message: 'API is healthy', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health API error:', error);
    const apiError = handleApiError(error);
    return NextResponse.json(
      { code: apiError.code, error: apiError.message, details: apiError.details },
      { status: 500 }
    );
  }
}
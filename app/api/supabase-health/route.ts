import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Test the Supabase connection
    const { data, error } = await supabase.from('users').select('count').single();
    
    if (error) {
      console.error('Supabase connection error:', error);
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Database connection failed', 
          error: error.message 
        }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      status: 'ok', 
      message: 'Supabase connection successful', 
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Health check failed', 
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
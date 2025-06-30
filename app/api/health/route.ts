import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    // Test the Supabase connection
    const { data, error } = await supabase.from('users').select('count').single();
    
    if (error) {
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
      message: 'API is healthy', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'API health check failed', 
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
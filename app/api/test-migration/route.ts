import { NextRequest, NextResponse } from 'next/server';
import { createApiSupabaseClient, getMigrationStatus } from '@/lib/supabase/standardized-client';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing migration status:', getMigrationStatus());
    
    const supabase = await createApiSupabaseClient();
    
    // Test authentication
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth test error:', error);
      return NextResponse.json({ 
        error: 'Auth error',
        details: error.message,
        migrationStatus: getMigrationStatus()
      }, { status: 500 });
    }
    
    // Test database connection
    const { data: testData, error: dbError } = await supabase
      .from('users')
      .select('id, email, role')
      .limit(1);
    
    if (dbError) {
      console.error('Database test error:', dbError);
      return NextResponse.json({ 
        error: 'Database error',
        details: dbError.message,
        migrationStatus: getMigrationStatus()
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      authenticated: !!session,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      databaseConnected: true,
      testDataCount: testData?.length || 0,
      migrationStatus: getMigrationStatus(),
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Test route error:', error);
    return NextResponse.json({ 
      error: 'Test failed',
      details: error.message,
      migrationStatus: getMigrationStatus()
    }, { status: 500 });
  }
} 
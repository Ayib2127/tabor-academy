import { NextRequest, NextResponse } from 'next/server';
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';

export const dynamic = 'force-dynamic';

// GET: List all pending Ethiopian payments
export async function GET(request: NextRequest): Promise<NextResponse<any>> {
  const supabase = await createApiSupabaseClient();
  // Authenticate admin
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();
  if (!userProfile || userProfile.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }
  // Fetch pending payments
  const { data, error } = await supabase
    .from('ethiopian_payments')
    .select('id, user_id, course_id, course_title, amount, currency, payment_method, payment_method_name, account_number, transaction_id, payment_proof_url, status, submitted_at')
    .eq('status', 'pending_verification')
    .order('submitted_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ payments: data });
}

// PATCH: Approve or reject a payment
export async function PATCH(request: NextRequest): Promise<NextResponse<any>> {
  try {
    const supabase = await createApiSupabaseClient();
    
    // Authenticate admin
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();
      
    if (profileError) {
      console.error('Profile error:', profileError);
      return NextResponse.json({ error: 'Failed to get user profile' }, { status: 500 });
    }
    
    if (!userProfile || userProfile.role !== 'admin') {
      console.error('User not admin:', userProfile?.role);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { id, action } = body;
    if (!id || !['approve', 'reject'].includes(action)) {
      console.error('Invalid request data:', { id, action });
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    
    const status = action === 'approve' ? 'verified' : 'rejected';
    const update: any = { status };
    
    if (status === 'verified') {
      update.verified_at = new Date().toISOString();
      update.verified_by = session.user.id;
    }
    
    console.log('Updating payment:', { id, update });
    
    const { data, error } = await supabase
      .from('ethiopian_payments')
      .update(update)
      .eq('id', id)
      .select();
      
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log('Update successful:', data);
    return NextResponse.json({ success: true, data });
    
  } catch (error) {
    console.error('Unexpected error in PATCH /api/admin/payments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
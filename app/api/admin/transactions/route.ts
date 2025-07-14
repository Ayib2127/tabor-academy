import { NextRequest, NextResponse } from 'next/server';
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';

export const dynamic = 'force-dynamic';

// GET: List all Ethiopian/local payments (all statuses)
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
  // Fetch all payments
  const { data, error } = await supabase
    .from('ethiopian_payments')
    .select('id, user_id, course_id, course_title, amount, currency, payment_method, payment_method_name, account_number, transaction_id, payment_proof_url, status, submitted_at, verified_at, verified_by')
    .order('submitted_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ transactions: data });
} 
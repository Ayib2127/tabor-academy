import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminDashboardPageClient from './AdminDashboardPageClient';

export default async function AdminDashboardPageWrapper() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: userRecord, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !userRecord || userRecord.role !== 'admin') {
    redirect('/not-authorized');
  }

  return <AdminDashboardPageClient user={user} role={userRecord.role} />;
}
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import MentorDashboardPageClient from './MentorDashboardPageClient';

export default async function MentorDashboardPageWrapper() {
  const cookieStore = await cookies();
  console.log('SSR cookies:', cookieStore.getAll());

  const supabase = await createApiSupabaseClient(cookieStore);
  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: userRecord, error: userRecordError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userRecordError || !userRecord || userRecord.role !== 'mentor') {
    redirect('/not-authorized');
  }

  return <MentorDashboardPageClient user={user} role={userRecord.role} />;
}
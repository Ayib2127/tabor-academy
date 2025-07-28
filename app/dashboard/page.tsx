import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardPageClient from './DashboardPageClient';
import { cookies } from 'next/headers';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// Server component for auth and role protection
export default async function DashboardPageWrapper() {
  try {
    const cookieStore = await cookies();
    console.log('SSR cookies:', cookieStore.getAll());

    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    console.log('SSR user:', user);
    console.log('SSR user id:', user?.id);
    console.log('SSR error:', error);

    if (!user) {
      redirect('/login');
    }

    // Fetch user role from the 'users' table
    const { data: userRecord, error: userRecordError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userRecordError || !userRecord || !['student', 'instructor', 'mentor', 'admin'].includes(userRecord.role)) {
      redirect('/not-authorized');
    }

    return <DashboardPageClient user={user} role={userRecord.role} />;
  } catch (error) {
    console.error('Error in DashboardPageWrapper:', error);
    redirect('/login');
  }
}
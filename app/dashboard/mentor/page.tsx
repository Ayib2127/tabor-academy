import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import MentorDashboardPageClient from './MentorDashboardPageClient';

export async function createSupabaseServerClient(cookieStore: any) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookies) => cookies.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  );
}

export default async function MentorDashboardPageWrapper() {
  const cookieStore = await cookies();
  console.log('SSR cookies:', cookieStore.getAll());

  const supabase = await createSupabaseServerClient(cookieStore);
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
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';

const CourseDetailsPageClient = dynamic(() => import('./page-client'), { ssr: false });

export default async function CourseDetailsPageWrapper({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check enrollment
  const { count: enrollmentCount, error: enrollmentError } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', params.id)
    .eq('user_id', user.id);

  if (enrollmentError || !enrollmentCount || enrollmentCount === 0) {
    redirect('/not-authorized');
  }

  return <CourseDetailsPageClient />;
}
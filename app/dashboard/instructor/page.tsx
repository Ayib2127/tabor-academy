import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import InstructorDashboardPageClient from './InstructorDashboardPageClient';

interface Course {
    id: string;
    title: string;
    is_published: boolean;
    created_at: string;
    thumbnail_url?: string;
    price?: number;
    students?: number;
    completionRate?: number;
    recentActivity?: number;
}

interface ActivityItem {
  id: string;
  type: 'enrollment' | 'completion' | 'assignment' | 'question'; // Expanded types for potential future use
  student: string;
  action: string;
  course: string;
  time: string;
}

export default async function InstructorDashboardPageWrapper() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: userRecord, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userError || !userRecord || userRecord.role !== 'instructor') {
    redirect('/not-authorized');
  }

  return <InstructorDashboardPageClient user={user} role={userRecord.role} />;
} 
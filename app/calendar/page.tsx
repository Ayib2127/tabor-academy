import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CalendarDashboard from '@/components/calendar/CalendarDashboard';

export default async function CalendarPage() {
  try {
    const supabase = createSupabaseServerClient();
    
    if (!supabase) {
      redirect('/login');
    }
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      redirect('/login');
    }

    // Get user profile
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = userProfile?.role || 'student';

    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <CalendarDashboard userId={user.id} role={role} />
      </div>
    );
  } catch (error) {
    console.error('Calendar page error:', error);
    redirect('/login');
  }
} 
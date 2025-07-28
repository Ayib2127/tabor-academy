import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CalendarDashboard from '@/components/calendar/CalendarDashboard';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      redirect('/login');
    }

    // Get user profile - check both tables
    let userProfile = null;
    
    // Try profiles table first
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profileData) {
      userProfile = profileData;
    } else {
      // Try users table as fallback
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      
      userProfile = userData;
    }

    const role = userProfile?.role || 'student';

    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <CalendarDashboard userId={user.id} role={role} />
      </div>
    );
  } catch (error) {
    console.error('Error in CalendarPage:', error);
    redirect('/login');
  }
} 
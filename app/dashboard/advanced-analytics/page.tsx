import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdvancedAnalyticsDashboard from '@/components/analytics/AdvancedAnalyticsDashboard';
import PredictiveAnalytics from '@/components/analytics/PredictiveAnalytics';
import { SiteHeader } from '@/components/site-header';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function AdvancedAnalyticsPage() {
  try {
    const supabase = await createSupabaseServerClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      redirect('/login');
    }

    // Get user role - check both 'users' and 'profiles' tables
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

    // Check if user has access to analytics
    if (role === 'student') {
      redirect('/dashboard');
    }

    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6">
            <AdvancedAnalyticsDashboard userId={user.id} role={role} />
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error in AdvancedAnalyticsPage:', error);
    redirect('/login');
  }
} 
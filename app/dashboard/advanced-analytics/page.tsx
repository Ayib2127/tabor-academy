import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdvancedAnalyticsDashboard from '@/components/analytics/AdvancedAnalyticsDashboard';
import PredictiveAnalytics from '@/components/analytics/PredictiveAnalytics';
import { SiteHeader } from '@/components/site-header';

export default async function AdvancedAnalyticsPage() {
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

    // Get user role
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

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
    console.error('Advanced analytics page error:', error);
    redirect('/login');
  }
} 
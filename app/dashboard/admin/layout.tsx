'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CheckCircle,
  Settings,
  BarChart3,
  Shield,
  Bell,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    checkAdminAccess();
    fetchPendingCount();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error || profile?.role !== 'admin') {
        toast.error('Admin access required');
        router.push('/dashboard');
        return;
      }

      setUser(profile);
    } catch (error) {
      console.error('Admin access check error:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingCount = async () => {
    try {
      const { count, error } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending_review');

      if (!error) {
        setPendingCount(count || 0);
      }
    } catch (error) {
      console.error('Error fetching pending count:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard/admin',
      icon: LayoutDashboard,
      current: false,
    },
    {
      name: 'Course Approvals',
      href: '/dashboard/admin/approvals',
      icon: CheckCircle,
      current: true,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    {
      name: 'Users',
      href: '/dashboard/admin/users',
      icon: Users,
      current: false,
    },
    {
      name: 'Courses',
      href: '/dashboard/admin/courses',
      icon: BookOpen,
      current: false,
    },
    {
      name: 'Analytics',
      href: '/dashboard/admin/analytics',
      icon: BarChart3,
      current: false,
    },
    {
      name: 'Settings',
      href: '/dashboard/admin/settings',
      icon: Settings,
      current: false,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F9F9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4ECDC4]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9F9]">
      <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, background: 'red', color: 'white' }}>
        ADMIN LAYOUT ACTIVE
      </div>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#E5E8E8]">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-[#FF6B35]" />
            <span className="text-lg font-bold text-[#2C3E50]">Admin Panel</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${item.current
                      ? 'bg-[#4ECDC4]/10 text-[#4ECDC4] border-r-2 border-[#4ECDC4]'
                      : 'text-[#2C3E50]/70 hover:bg-[#F7F9F9] hover:text-[#2C3E50]'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                  {item.badge && (
                    <Badge className="ml-auto bg-[#FF6B35] text-white">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#E5E8E8]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-[#4ECDC4] rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#2C3E50] truncate">
                {user?.full_name || 'Admin User'}
              </p>
              <p className="text-xs text-[#2C3E50]/60 truncate">
                Administrator
              </p>
            </div>
          </div>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-[#2C3E50]/70 hover:text-[#2C3E50]"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-[#E5E8E8]">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {pendingCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#FF6B35] text-white text-xs flex items-center justify-center p-0">
                    {pendingCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
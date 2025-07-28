"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface ProtectedRouteProps {
  children: React.ReactNode;
  resource?: {
    table: string;
    id: string;
    ownerField: string;
  };
  requiredRole?: 'admin' | 'instructor' | 'student';
}

export function ProtectedRoute({ 
  children, 
  resource, 
  requiredRole 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAccess = async () => {
      if (loading) return;

      if (!user) {
        router.push('/login');
        return;
      }

      // Check role-based access
      if (requiredRole) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (!profile || profile.role !== requiredRole) {
          router.push('/dashboard');
          return;
        }
      }

      // Check resource ownership
      if (resource) {
        const { data: resourceData, error } = await supabase
          .from(resource.table)
          .select('*')
          .eq('id', resource.id)
          .eq(resource.ownerField, user.id)
          .single();

        if (error || !resourceData) {
          router.push('/dashboard');
          return;
        }
      }

      setHasAccess(true);
      setCheckingAccess(false);
    };

    checkAccess();
  }, [user, loading, resource, requiredRole, router, supabase]);

  if (loading || checkingAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
} 
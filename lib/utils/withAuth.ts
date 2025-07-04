import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

interface WithAuthOptions {
  roles?: string[];
  resource?: {
    table: string;
    id: string;
    ownerField: string;
  };
  redirectTo?: string;
}

/**
 * Universal authentication and authorization utility for Next.js server components and API routes.
 *
 * Usage (server component):
 *   await withAuth({ roles: ['instructor'], resource: { table: 'courses', id: courseId, ownerField: 'instructor_id' } })
 *
 * Usage (API route):
 *   const { user } = await withAuth({ roles: ['student'], resource: { ... } }, { api: true, req, res })
 */
export async function withAuth(options: WithAuthOptions, context?: { api?: boolean; req?: any; res?: any }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    if (context?.api) {
      context.res?.status(401).json({ error: 'Unauthorized' });
      throw new Error('Unauthorized');
    } else {
      redirect(options.redirectTo || '/login');
    }
  }

  // Fetch user role
  const { data: userRecord, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userError || !userRecord) {
    if (context?.api) {
      context.res?.status(403).json({ error: 'Forbidden' });
      throw new Error('Forbidden');
    } else {
      redirect(options.redirectTo || '/not-authorized');
    }
  }

  // Role check
  if (options.roles && !options.roles.includes(userRecord.role)) {
    if (context?.api) {
      context.res?.status(403).json({ error: 'Forbidden: Insufficient role' });
      throw new Error('Forbidden');
    } else {
      redirect(options.redirectTo || '/not-authorized');
    }
  }

  // Ownership/resource check
  if (options.resource) {
    const { table, id, ownerField } = options.resource;
    const { data: resource, error: resourceError } = await supabase
      .from(table)
      .select(ownerField)
      .eq('id', id)
      .single();
    if (resourceError || !resource || resource[ownerField] !== user.id) {
      if (context?.api) {
        context.res?.status(403).json({ error: 'Forbidden: Not owner' });
        throw new Error('Forbidden');
      } else {
        redirect(options.redirectTo || '/not-authorized');
      }
    }
  }

  return { user, role: userRecord.role };
} 
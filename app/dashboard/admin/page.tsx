import { withAuth } from '@/lib/utils/withAuth';
import AdminDashboardPageClient from './AdminDashboardPageClient';

export default async function AdminDashboardPageWrapper() {
  const { user, role } = await withAuth({ roles: ['admin'] });
  return <AdminDashboardPageClient user={user} role={role} />;
}
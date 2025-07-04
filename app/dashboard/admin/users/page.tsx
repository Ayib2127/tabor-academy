import { withAuth } from '@/lib/utils/withAuth';
import AdminUsersPageClient from './page-client';

export default async function AdminUsersPageWrapper() {
  await withAuth({ roles: ['admin'] });
  return <AdminUsersPageClient />;
}
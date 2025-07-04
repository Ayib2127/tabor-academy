import { withAuth } from '@/lib/utils/withAuth';
import AdminSettingsPageClient from './page-client';

export default async function AdminSettingsPageWrapper() {
  const { user, role } = await withAuth({ roles: ['admin'] });
  return <AdminSettingsPageClient user={user} role={role} />;
}
import { withAuth } from '@/lib/utils/withAuth';
import AdminApprovalsPageClient from './page-client';

export default async function AdminApprovalsPageWrapper() {
  await withAuth({ roles: ['admin'] });
  return <AdminApprovalsPageClient />;
}
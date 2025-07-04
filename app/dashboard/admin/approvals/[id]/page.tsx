import { withAuth } from '@/lib/utils/withAuth';
import AdminApprovalDetailPageClient from './page-client';

export default async function AdminApprovalDetailPageWrapper() {
  await withAuth({ roles: ['admin'] });
  return <AdminApprovalDetailPageClient />;
}

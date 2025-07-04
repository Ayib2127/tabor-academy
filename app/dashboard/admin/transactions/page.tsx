import { withAuth } from '@/lib/utils/withAuth';
import AdminTransactionsPageClient from './page-client';

export default async function AdminTransactionsPageWrapper() {
  await withAuth({ roles: ['admin'] });
  return <AdminTransactionsPageClient />;
}
import { withAuth } from '@/lib/utils/withAuth';
import InstructorDashboardPageClient from './InstructorDashboardPageClient';

export default async function InstructorDashboardPageWrapper() {
  const { user, role } = await withAuth({ roles: ['instructor'] });
  return <InstructorDashboardPageClient user={user} role={role} />;
} 
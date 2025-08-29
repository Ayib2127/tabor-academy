import { withAuth } from '@/lib/utils/withAuth';
import CourseAnalyticsPageClient from './page-client';

export default async function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await withAuth({
    roles: ['instructor'],
    resource: { table: 'courses', id, ownerField: 'instructor_id' },
  });
  return <CourseAnalyticsPageClient />;
}
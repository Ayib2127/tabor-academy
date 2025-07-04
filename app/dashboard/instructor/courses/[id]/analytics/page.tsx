import { withAuth } from '@/lib/utils/withAuth';
import CourseAnalyticsPageClient from './page-client';

export default async function CourseAnalyticsPageWrapper({ params }: { params: { id: string } }) {
  await withAuth({
    roles: ['instructor'],
    resource: { table: 'courses', id: params.id, ownerField: 'instructor_id' },
  });
  return <CourseAnalyticsPageClient />;
}
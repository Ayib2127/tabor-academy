import { withAuth } from '@/lib/utils/withAuth';
import CourseContentPageClient from './page-client';

export default async function CourseContentPageWrapper({ params }: { params: { id: string } }) {
  await withAuth({
    roles: ['instructor'],
    resource: { table: 'courses', id: params.id, ownerField: 'instructor_id' },
  });
  return <CourseContentPageClient />;
}
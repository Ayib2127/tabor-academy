import { withAuth } from '@/lib/utils/withAuth';
import CourseContentPageClient from './page-client';

export default async function ContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await withAuth({
    roles: ['instructor'],
    resource: { table: 'courses', id, ownerField: 'instructor_id' },
  });
  return <CourseContentPageClient />;
}
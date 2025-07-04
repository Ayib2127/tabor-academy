import { withAuth } from '@/lib/utils/withAuth';
import dynamic from 'next/dynamic';

const CoursePageClient = dynamic(() => import('./page-client'), { ssr: false });

export default async function CoursePageWrapper({ params }: { params: { id: string } }) {
  await withAuth({
    roles: ['instructor'],
    resource: { table: 'courses', id: params.id, ownerField: 'instructor_id' },
  });
  return <CoursePageClient />;
}
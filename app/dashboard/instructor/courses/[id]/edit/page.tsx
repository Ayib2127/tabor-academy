import { withAuth } from '@/lib/utils/withAuth';
import EditPageClient from './page-client';

interface CourseEditPageProps {
  params: { id: string };
}

export default async function EditPageWrapper({ params }: CourseEditPageProps) {
  await withAuth({
    roles: ['instructor'],
    resource: { table: 'courses', id: params.id, ownerField: 'instructor_id' },
  });
  return <EditPageClient />;
} 
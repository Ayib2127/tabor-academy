import { withAuth } from '@/lib/utils/withAuth';
import StudentsPageClient from './page-client';

export default async function StudentsPageWrapper({ params }: { params: { id: string } }) {
  await withAuth({
    roles: ['instructor'],
    resource: { table: 'courses', id: params.id, ownerField: 'instructor_id' },
  });
  return <StudentsPageClient />;
}

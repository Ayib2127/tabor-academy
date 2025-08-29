import { withAuth } from '@/lib/utils/withAuth';
import StudentsPageClient from './page-client';

export default async function StudentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await withAuth({
    roles: ['instructor'],
    resource: { table: 'courses', id, ownerField: 'instructor_id' },
  });
  return <StudentsPageClient />;
}

import { withAuth } from '@/lib/utils/withAuth';
import LessonsPageClient from './page-client';

export default async function LessonsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await withAuth({
    roles: ['instructor'],
    resource: { table: 'courses', id, ownerField: 'instructor_id' },
  });
  return <LessonsPageClient id={id} />;
}
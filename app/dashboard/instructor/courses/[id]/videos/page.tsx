import { withAuth } from '@/lib/utils/withAuth';
import VideosPageClient from './page-client';

export default async function VideosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await withAuth({
    roles: ['instructor'],
    resource: { table: 'courses', id, ownerField: 'instructor_id' },
  });
  return <VideosPageClient id={id} />;
}
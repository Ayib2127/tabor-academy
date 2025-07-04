import { withAuth } from '@/lib/utils/withAuth';
import VideosPageClient from './page-client';

export default async function VideosPageWrapper({ params }: { params: { id: string } }) {
  await withAuth({
    roles: ['instructor'],
    resource: { table: 'courses', id: params.id, ownerField: 'instructor_id' },
  });
  return <VideosPageClient id={params.id} />;
} 
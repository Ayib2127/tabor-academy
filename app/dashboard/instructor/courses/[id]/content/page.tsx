import { withAuth } from '@/lib/utils/withAuth';
import CourseContentPageClient from './page-client';

export default async function CourseContentPageWrapper({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  let resolvedParams: { id: string };
  if (typeof (params as any)?.then === 'function') {
    resolvedParams = await (params as Promise<{ id: string }>);
  } else {
    resolvedParams = params as { id: string };
  }
  await withAuth({
    roles: ['instructor'],
    resource: { table: 'courses', id: resolvedParams.id, ownerField: 'instructor_id' },
  });
  return <CourseContentPageClient />;
}
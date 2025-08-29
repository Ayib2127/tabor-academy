import { withAuth } from '@/lib/utils/withAuth';
import ModulesPageClient from './page-client';

export default async function ModulesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await withAuth({
    roles: ['instructor'],
    resource: { table: 'courses', id, ownerField: 'instructor_id' },
  });
  return <ModulesPageClient id={id} />;
}
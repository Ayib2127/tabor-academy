import { withAuth } from '@/lib/utils/withAuth';
import ModulesPageClient from './page-client';

export default async function ModulesPageWrapper({ params }: { params: { id: string } }) {
  await withAuth({
    roles: ['instructor'],
    resource: { table: 'courses', id: params.id, ownerField: 'instructor_id' },
  });
  return <ModulesPageClient id={params.id} />;
} 
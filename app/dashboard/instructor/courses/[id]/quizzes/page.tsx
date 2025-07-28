import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import QuizzesPageClient from './page-client';

export default async function QuizzesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <ProtectedRoute
      resource={{ table: 'courses', id, ownerField: 'instructor_id' }}
      requiredRole="instructor"
    >
      <QuizzesPageClient id={id} />
    </ProtectedRoute>
  );
}
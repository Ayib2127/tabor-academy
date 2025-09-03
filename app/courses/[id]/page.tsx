import CourseDetailsPageClient from './page-client';

export default async function CourseDetailsPageWrapper({ params }: { params: Promise<{ id: string }> }) {
  await params; // Consume the params to satisfy Next.js 15 requirements
  return <CourseDetailsPageClient />;
}
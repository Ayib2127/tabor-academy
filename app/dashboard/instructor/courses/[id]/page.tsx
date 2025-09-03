import CoursePageClient from './page-client';

export default async function InstructorCoursePage({ params }: { params: Promise<{ id: string }> }) {
  await params; // Consume the params to satisfy Next.js 15 requirements
  return <CoursePageClient />;
}
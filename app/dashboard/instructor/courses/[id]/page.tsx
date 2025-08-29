import dynamic from 'next/dynamic';

const CoursePageClient = dynamic(() => import('./page-client'), { ssr: false });

export default async function InstructorCoursePage({ params }: { params: Promise<{ id: string }> }) {
  await params; // Consume the params to satisfy Next.js 15 requirements
  return <CoursePageClient />;
}
"use client";
import dynamic from 'next/dynamic';

const CourseDetailsPageClient = dynamic(() => import('./page-client'), { ssr: false });

export default function CourseDetailsPageWrapper({ params }: { params: { id: string } }) {
  return <CourseDetailsPageClient params={params} />;
}
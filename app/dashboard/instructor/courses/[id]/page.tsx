"use client";
import dynamic from 'next/dynamic';

const CoursePageClient = dynamic(() => import('./page-client'), { ssr: false });

export default function CoursePageWrapper({ params }: { params: { id: string } }) {
  return <CoursePageClient params={params} />;
}
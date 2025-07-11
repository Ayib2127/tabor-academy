"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";

interface ActiveStudentsProps {
  courses: Array<{
    id: string;
    title: string;
    students: number;
  }>;
  stats: {
    totalStudents: number;
  };
}

export default function ActiveStudents({ courses, stats }: ActiveStudentsProps) {
  // Calculate total students from courses
  const totalStudents = stats.totalStudents;
  
  // For now, we'll show a summary since we don't have individual student data
  // In a real implementation, you'd fetch detailed student data

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-[#2C3E50]">Active Students</h2>
        <span className="text-sm text-gray-500">{totalStudents} total</span>
      </div>
      <div className="p-6">
        <div className="text-center text-gray-500 mb-4">
          <div className="text-3xl font-bold text-[#4ECDC4] mb-2">{totalStudents}</div>
          <div className="text-sm">Total Students Enrolled</div>
        </div>
        
        {courses.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#2C3E50] mb-2">Students by Course:</h3>
            {courses.slice(0, 3).map((course) => (
              <div key={course.id} className="flex items-center justify-between p-3 bg-[#E5E8E8] rounded">
                <div className="flex-1">
                  <div className="font-medium text-sm text-[#2C3E50] truncate">{course.title}</div>
                </div>
                <div className="text-sm font-semibold text-[#4ECDC4]">{course.students} students</div>
              </div>
            ))}
            {courses.length > 3 && (
              <div className="text-center text-xs text-gray-500">
                +{courses.length - 3} more courses
              </div>
            )}
          </div>
        )}
      </div>
      <div className="p-4 text-center border-t border-gray-200">
        <Link href="/dashboard/instructor/students" className="text-[#4ECDC4] font-medium hover:text-[#4ECDC4]/80 transition-colors">View All Students &rarr;</Link>
      </div>
    </Card>
  );
} 
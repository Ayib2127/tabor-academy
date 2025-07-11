"use client";

import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, ChevronRight, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface ActiveCoursesProps {
  courses: Array<{
    id: string;
    title: string;
    status: string;
    students: number;
    delivery_type?: string;
    next_session?: string;
    code?: string;
  }>;
  stats: {
    totalCourses: number;
  };
}

export default function ActiveCourses({ courses, stats }: ActiveCoursesProps) {

  const getStatusBadge = (status) => {
    switch (status) {
      case "published":
        return <Badge className="bg-[#1B4D3E] text-white border-[#1B4D3E]"><CheckCircle className="w-3 h-3 mr-1" />Published</Badge>;
      case "pending_review":
        return <Badge className="bg-[#FF6B35] text-white border-[#FF6B35]"><Clock className="w-3 h-3 mr-1" />Pending Review</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 border-red-200"><AlertTriangle className="w-3 h-3 mr-1" />Needs Changes</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Draft</Badge>;
    }
  };



  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-[#2C3E50]">Active Courses</h2>
        <Link href="/dashboard/instructor/course-builder">
          <Button className="bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90 transition-colors">
            <PlusCircle className="w-4 h-4 mr-2" /> New Course
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {courses.length === 0 ? (
          <div className="text-center text-gray-500 col-span-full">No active courses yet.</div>
        ) : (
          courses.map((course) => (
            <Link key={course.id} href={`/dashboard/instructor/courses/${course.id}`} className="block">
              <Card className="p-4 hover:shadow-lg transition-shadow border border-gray-200 cursor-pointer h-full flex flex-col justify-between bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#2C3E50] text-base line-clamp-1">{course.title}</span>
                  {getStatusBadge(course.status)}
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  {course.code && <span className="mr-2">{course.code}</span>}
                  {course.students} Students
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <span className="capitalize font-medium">
                    {course.delivery_type === "cohort" ? "Cohort-Based" : "Self-Paced"}
                  </span>
                  {course.delivery_type === "cohort" && course.next_session && (
                    <span className="ml-2">Next: {course.next_session}</span>
                  )}
                </div>
                <div className="flex items-center justify-end mt-2">
                  <span className="text-[#4ECDC4] text-xs font-semibold flex items-center hover:text-[#4ECDC4]/80 transition-colors">Manage <ChevronRight className="w-4 h-4 ml-1" /></span>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </Card>
  );
} 
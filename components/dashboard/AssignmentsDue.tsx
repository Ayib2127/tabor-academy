"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAssignmentDashboardSummary } from "@/lib/utils/assignment-dashboard";
import { Course } from "@/types/course";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";

interface AssignmentsDueProps {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

export default function AssignmentsDue({ courses, loading, error }: AssignmentsDueProps) {
  const summary = useMemo(() => getAssignmentDashboardSummary(courses), [courses]);

  if (loading) return <Card className="p-6">Loading assignments...</Card>;
  if (error) return <Card className="p-6 text-red-600">{error}</Card>;

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-lg font-bold text-gray-800">Assignments Due</h2>
        <Link href="/dashboard/instructor/assignments" className="text-[#2CC4A7] font-medium hover:underline">View All</Link>
      </div>
      <div className="p-6 space-y-2">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700 font-semibold">Total:</span>
          <span className="text-lg font-bold text-gray-800">{summary.total}</span>
        </div>
        <div className="flex items-center gap-4">
          <Clock className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-gray-700">Due Soon:</span>
          <span className="font-semibold text-yellow-700">{summary.dueSoon}</span>
        </div>
        <div className="flex items-center gap-4">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-gray-700">Needs Grading:</span>
          <span className="font-semibold text-red-700">{summary.needsGrading}</span>
        </div>
        {summary.urgentAssignments.length > 0 && (
          <div className="mt-4">
            <div className="text-xs text-gray-500 mb-1">Urgent Assignments:</div>
            <ul className="space-y-1">
              {summary.urgentAssignments.slice(0, 3).map((a) => (
                <li key={a.id} className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-800 line-clamp-1">{a.title}</span>
                  {a.dueDate && (
                    <span className="ml-2 text-xs text-gray-500">Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                  )}
                  {a.needsGrading && (
                    <span className="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs">Needs Grading</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
} 
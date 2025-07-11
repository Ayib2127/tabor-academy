'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface AssignmentsDueSafeProps {
  courses: any[];
  loading: boolean;
  error: string | null;
}

export default function AssignmentsDueSafe({ courses, loading, error }: AssignmentsDueSafeProps) {
  // Filter out courses that don't have modules or have non-iterable modules
  const validCourses = courses.filter(course => 
    course && 
    Array.isArray(course.modules) && 
    course.modules.length > 0
  );

  if (loading) {
    return (
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#FF6B35]" />
            Assignments Due
          </h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#FF6B35]" />
            Assignments Due
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">Error loading assignments</span>
          </div>
        </div>
      </Card>
    );
  }

  // If no valid courses with modules, show a message
  if (validCourses.length === 0) {
    return (
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#FF6B35]" />
            Assignments Due
          </h2>
        </div>
        <div className="p-6">
          <div className="text-center py-4">
            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No assignments found</p>
            <p className="text-xs text-gray-400 mt-1">Create assignments in your courses to see them here</p>
          </div>
        </div>
      </Card>
    );
  }

  // Calculate assignment stats
  let totalAssignments = 0;
  let dueSoon = 0;
  let needsGrading = 0;
  const urgentAssignments: any[] = [];

  validCourses.forEach(course => {
    course.modules.forEach((module: any) => {
      module.lessons.forEach((lesson: any) => {
        if (lesson.type === 'assignment') {
          totalAssignments++;
          
          if (lesson.dueDate) {
            const dueDate = new Date(lesson.dueDate);
            const now = new Date();
            const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysUntilDue <= 3 && daysUntilDue >= 0) {
              dueSoon++;
            }
            
            if (daysUntilDue <= 1 && daysUntilDue >= 0) {
              urgentAssignments.push({
                ...lesson,
                courseTitle: course.title,
                moduleTitle: module.title,
                daysUntilDue,
              });
            }
          }
          
          if (lesson.needsGrading) {
            needsGrading++;
          }
        }
      });
    });
  });

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#FF6B35]" />
          Assignments Due
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-2xl font-bold text-[#2C3E50]">{totalAssignments}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#FF6B35]">{dueSoon}</div>
              <div className="text-xs text-gray-500">Due Soon</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{needsGrading}</div>
              <div className="text-xs text-gray-500">Need Grading</div>
            </div>
          </div>

          {/* Urgent Assignments */}
          {urgentAssignments.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                Urgent Assignments
              </h4>
              <div className="space-y-2">
                {urgentAssignments.slice(0, 3).map((assignment, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#2C3E50]">{assignment.title}</div>
                      <div className="text-xs text-gray-500">{assignment.courseTitle}</div>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      {assignment.daysUntilDue === 0 ? 'Due Today' : `Due in ${assignment.daysUntilDue} day${assignment.daysUntilDue === 1 ? '' : 's'}`}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button asChild className="w-full border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white" variant="outline">
            <Link href="/dashboard/instructor/assignments">
              <FileText className="w-4 h-4 mr-2" />
              View All Assignments
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
} 
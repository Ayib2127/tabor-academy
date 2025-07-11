'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, Clock, Award, TrendingUp, Eye, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface StudentProgressCardProps {
  courses: Array<{
    id: string;
    title: string;
    students: number;
    completionRate: number;
    status: string;
  }>;
}

export default function StudentProgressCard({ courses }: StudentProgressCardProps) {
  // Calculate overall metrics
  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
  const averageCompletionRate = courses.length > 0 
    ? courses.reduce((sum, course) => sum + course.completionRate, 0) / courses.length 
    : 0;
  
  // Get active courses (published)
  const activeCourses = courses.filter(course => course.status === 'published');
  const totalActiveStudents = activeCourses.reduce((sum, course) => sum + course.students, 0);

  // Mock data for engagement metrics
  const averageEngagement = 78; // 78% engagement rate
  const activeThisWeek = Math.round(totalActiveStudents * 0.65); // 65% active this week
  const newEnrollments = Math.round(totalActiveStudents * 0.12); // 12% new enrollments

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-[#2C3E50]">Student Progress</h2>
        <Link href="/dashboard/instructor/students">
          <Button variant="outline" size="sm" className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
            View All
          </Button>
        </Link>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-[#E5E8E8] rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-[#4ECDC4] mr-2" />
              <span className="text-2xl font-bold text-[#2C3E50]">{totalActiveStudents}</span>
            </div>
            <div className="text-sm text-gray-600">Active Students</div>
            <div className="text-xs text-gray-500 mt-1">
              {activeCourses.length} courses
            </div>
          </div>
          
          <div className="text-center p-4 bg-[#E5E8E8] rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-[#FF6B35] mr-2" />
              <span className="text-2xl font-bold text-[#2C3E50]">{activeThisWeek}</span>
            </div>
            <div className="text-sm text-gray-600">Active This Week</div>
            <div className="text-xs text-[#1B4D3E] mt-1">
              +{newEnrollments} new
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#2C3E50]">Average Engagement</span>
            <span className="text-sm font-semibold text-[#2C3E50]">{averageEngagement}%</span>
          </div>
          <Progress value={averageEngagement} className="h-2 bg-gray-200" style={{ 
            '--progress-background': '#4ECDC4',
            '--progress-foreground': '#1B4D3E'
          } as React.CSSProperties} />
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#2C3E50]">Completion Rate</span>
            <span className="text-sm font-semibold text-[#2C3E50]">{averageCompletionRate.toFixed(1)}%</span>
          </div>
          <Progress value={averageCompletionRate} className="h-2 bg-gray-200" style={{ 
            '--progress-background': '#4ECDC4',
            '--progress-foreground': '#1B4D3E'
          } as React.CSSProperties} />
        </div>

        {/* Top Courses by Students */}
        {activeCourses.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#2C3E50]">Most Popular Courses</h3>
            {activeCourses
              .sort((a, b) => b.students - a.students)
              .slice(0, 3)
              .map((course) => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-[#E5E8E8] rounded">
                  <div className="flex-1">
                    <div className="font-medium text-sm text-[#2C3E50] truncate">{course.title}</div>
                    <div className="text-xs text-gray-500">{course.students} students</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="text-xs bg-[#4ECDC4] text-white border-[#4ECDC4]">
                      {course.completionRate.toFixed(1)}%
                    </Badge>
                    <Button size="sm" variant="ghost" asChild className="text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
                      <Link href={`/dashboard/instructor/courses/${course.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button asChild variant="outline" size="sm" className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
            <Link href="/dashboard/instructor/students">
              <Users className="w-4 h-4 mr-2" />
              Manage Students
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white">
            <Link href="/community/messages">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Link>
          </Button>
        </div>

        {/* Achievement Badge */}
        {totalActiveStudents > 0 && (
          <div className="p-4 bg-gradient-to-r from-[#E5E8E8] to-[#4ECDC4]/10 rounded-lg border border-[#4ECDC4]/20">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-[#FF6B35]" />
              <div>
                <div className="font-semibold text-[#2C3E50]">Great Progress!</div>
                <div className="text-sm text-gray-600">
                  {totalActiveStudents} students are actively learning from your courses
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Users, DollarSign, Star, BookOpen, Brain } from 'lucide-react';
import Link from 'next/link';

interface AnalyticsCardProps {
  stats: {
    totalStudents: number;
    totalRevenue: number;
    averageRating: number;
    totalCourses: number;
  };
  courses: Array<{
    id: string;
    title: string;
    students: number;
    completionRate: number;
    averageRating: number;
    status: string;
  }>;
}

export default function AnalyticsCard({ stats, courses }: AnalyticsCardProps) {
  // Calculate trends (mock data for now)
  const studentGrowth = 12; // 12% growth
  const revenueGrowth = 8; // 8% growth
  const ratingTrend = 0.2; // 0.2 point increase

  // Get top performing course
  const topCourse = courses.reduce((top, course) => 
    course.students > top.students ? course : top, 
    courses[0] || { students: 0, title: 'No courses yet' }
  );

  // Calculate overall completion rate
  const overallCompletionRate = courses.length > 0 
    ? courses.reduce((sum, course) => sum + course.completionRate, 0) / courses.length 
    : 0;

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-[#2C3E50]">Analytics Overview</h2>
        <div className="flex gap-2">
          <Link href="/dashboard/instructor/analytics">
            <Button variant="outline" size="sm" className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
              View Details
            </Button>
          </Link>
          <Link href="/dashboard/advanced-analytics">
            <Button variant="outline" size="sm" className="border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white">
              <Brain className="w-4 h-4 mr-2" />
              AI Analytics
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-[#E5E8E8] rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-[#4ECDC4] mr-2" />
              <span className="text-2xl font-bold text-[#2C3E50]">{stats.totalStudents}</span>
            </div>
            <div className="text-sm text-gray-600">Total Students</div>
            <div className="flex items-center justify-center mt-1">
              <TrendingUp className="w-4 h-4 text-[#1B4D3E] mr-1" />
              <span className="text-xs text-[#1B4D3E]">+{studentGrowth}%</span>
            </div>
          </div>
          
          <div className="text-center p-4 bg-[#E5E8E8] rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="w-5 h-5 text-[#FF6B35] mr-2" />
              <span className="text-2xl font-bold text-[#2C3E50]">${stats.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
            <div className="flex items-center justify-center mt-1">
              <TrendingUp className="w-4 h-4 text-[#1B4D3E] mr-1" />
              <span className="text-xs text-[#1B4D3E]">+{revenueGrowth}%</span>
            </div>
          </div>
        </div>

        {/* Rating and Completion */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-[#E5E8E8] rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-[#FF6B35] mr-2" />
              <span className="text-2xl font-bold text-[#2C3E50]">{stats.averageRating.toFixed(1)}</span>
            </div>
            <div className="text-sm text-gray-600">Average Rating</div>
            <div className="flex items-center justify-center mt-1">
              {ratingTrend > 0 ? (
                <TrendingUp className="w-4 h-4 text-[#1B4D3E] mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
              )}
              <span className={`text-xs ${ratingTrend > 0 ? 'text-[#1B4D3E]' : 'text-red-600'}`}>
                {ratingTrend > 0 ? '+' : ''}{ratingTrend.toFixed(1)}
              </span>
            </div>
          </div>
          
          <div className="text-center p-4 bg-[#E5E8E8] rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <BookOpen className="w-5 h-5 text-[#4ECDC4] mr-2" />
              <span className="text-2xl font-bold text-[#2C3E50]">{stats.totalCourses}</span>
            </div>
            <div className="text-sm text-gray-600">Total Courses</div>
            <div className="text-xs text-gray-500 mt-1">
              {courses.filter(c => c.status === 'published').length} Published
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#2C3E50]">Overall Completion Rate</span>
            <span className="text-sm font-semibold text-[#2C3E50]">{overallCompletionRate.toFixed(1)}%</span>
          </div>
          <Progress value={overallCompletionRate} className="h-2 bg-gray-200" style={{ 
            '--progress-background': '#4ECDC4',
            '--progress-foreground': '#1B4D3E'
          } as React.CSSProperties} />
        </div>

        {/* Performance Indicators */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#2C3E50]">Performance Indicators</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-[#E5E8E8] rounded-lg">
              <div className="text-lg font-bold text-[#2C3E50]">
                {courses.filter(c => c.status === 'published').length}
              </div>
              <div className="text-xs text-gray-600">Published</div>
            </div>
            <div className="text-center p-3 bg-[#E5E8E8] rounded-lg">
              <div className="text-lg font-bold text-[#2C3E50]">
                {courses.filter(c => c.status === 'draft').length}
              </div>
              <div className="text-xs text-gray-600">Drafts</div>
            </div>
            <div className="text-center p-3 bg-[#E5E8E8] rounded-lg">
              <div className="text-lg font-bold text-[#2C3E50]">
                {courses.filter(c => c.status === 'pending_review').length}
              </div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
            <div className="text-center p-3 bg-[#E5E8E8] rounded-lg">
              <div className="text-lg font-bold text-[#2C3E50]">
                {courses.filter(c => c.status === 'rejected').length}
              </div>
              <div className="text-xs text-gray-600">Rejected</div>
            </div>
          </div>
        </div>

        {/* Top Performing Course */}
        {topCourse && topCourse.students > 0 && (
          <div className="p-4 bg-[#E5E8E8] rounded-lg">
            <h3 className="text-sm font-semibold text-[#2C3E50] mb-2">Top Performing Course</h3>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium text-[#2C3E50] truncate">{topCourse.title}</div>
                <div className="text-sm text-gray-500">{topCourse.students} students</div>
              </div>
              <Badge className="ml-2 bg-[#4ECDC4] text-white border-[#4ECDC4]">
                {'completionRate' in topCourse ? topCourse.completionRate.toFixed(1) : '0'}% completion
              </Badge>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button asChild variant="outline" size="sm" className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
            <Link href="/dashboard/instructor/analytics">
              <TrendingUp className="w-4 h-4 mr-2" />
              Detailed Analytics
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white">
            <Link href="/dashboard/instructor/course-builder">
              <BookOpen className="w-4 h-4 mr-2" />
              Create Course
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  Users,
  BookOpen,
  Star,
  MessageSquare,
  ChevronRight,
  BarChart3,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Target,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface CourseAnalytics {
  course: {
    id: string;
    title: string;
    created_at: string;
  };
  metrics: {
    totalEnrollments: number;
    totalLessons: number;
    completionRate: number;
    averageRating: number;
    totalReviews: number;
  };
  enrollmentTrends: Array<{
    month: string;
    enrollments: number;
  }>;
  engagementFunnel: Array<{
    lesson_id: string;
    lesson_title: string;
    lesson_order: number;
    completed_count: number;
    completion_rate: number;
    drop_off_rate: number;
  }>;
  reviews: Array<{
    id: string;
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
  }>;
  lastUpdated: string;
}

export default function CourseAnalyticsPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [analytics, setAnalytics] = useState<CourseAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [courseId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/instructor/courses/${courseId}/analytics`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch analytics');
      }
      
      const data = await response.json();
      setAnalytics(data);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
      toast.error('Failed to load course analytics');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDropOffColor = (rate: number) => {
    if (rate >= 30) return 'text-red-600';
    if (rate >= 15) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getDropOffIcon = (rate: number) => {
    if (rate >= 30) return <AlertTriangle className="w-4 h-4 text-red-600" />;
    if (rate >= 15) return <TrendingDown className="w-4 h-4 text-yellow-600" />;
    return <CheckCircle className="w-4 h-4 text-green-600" />;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6">
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Failed to Load Analytics</h3>
              <p className="text-[#2C3E50]/60 mb-4">{error}</p>
              <Button onClick={fetchAnalytics} className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white">
                Try Again
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/dashboard/instructor" className="hover:text-foreground">Instructor Dashboard</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/dashboard/instructor/courses" className="hover:text-foreground">Courses</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Analytics</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2C3E50] mb-2">Course Analytics</h1>
            <h2 className="text-xl text-[#2C3E50]/80 mb-2">{analytics.course.title}</h2>
            <p className="text-[#2C3E50]/60">
              Detailed performance insights and student engagement metrics for your course.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            <Card className="border-[#E5E8E8]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#2C3E50]">{analytics.metrics.totalEnrollments}</p>
                    <p className="text-sm text-[#2C3E50]/60">Total Enrollments</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E8E8]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[#4ECDC4]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#2C3E50]">{analytics.metrics.totalLessons}</p>
                    <p className="text-sm text-[#2C3E50]/60">Total Lessons</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E8E8]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#2C3E50]">{analytics.metrics.completionRate}%</p>
                    <p className="text-sm text-[#2C3E50]/60">Completion Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E8E8]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#2C3E50]">{analytics.metrics.averageRating.toFixed(1)}</p>
                    <p className="text-sm text-[#2C3E50]/60">Average Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E8E8]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#2C3E50]">{analytics.metrics.totalReviews}</p>
                    <p className="text-sm text-[#2C3E50]/60">Total Reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Enrollment Trends */}
            <Card className="border-[#E5E8E8]">
              <CardHeader>
                <CardTitle className="text-[#2C3E50] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#4ECDC4]" />
                  Enrollment Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.enrollmentTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E8E8" />
                    <XAxis dataKey="month" stroke="#2C3E50" fontSize={12} />
                    <YAxis stroke="#2C3E50" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E8E8',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="enrollments" 
                      stroke="#4ECDC4" 
                      strokeWidth={3}
                      dot={{ fill: '#4ECDC4', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#4ECDC4', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Completion Rate by Lesson */}
            <Card className="border-[#E5E8E8]">
              <CardHeader>
                <CardTitle className="text-[#2C3E50] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#FF6B35]" />
                  Lesson Completion Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.engagementFunnel.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E8E8" />
                    <XAxis 
                      dataKey="lesson_order" 
                      stroke="#2C3E50" 
                      fontSize={12}
                      label={{ value: 'Lesson', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      stroke="#2C3E50" 
                      fontSize={12}
                      label={{ value: 'Completion %', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E8E8',
                        borderRadius: '8px'
                      }}
                      formatter={(value, name) => [`${value}%`, 'Completion Rate']}
                      labelFormatter={(label) => `Lesson ${label}`}
                    />
                    <Bar 
                      dataKey="completion_rate" 
                      fill="#FF6B35"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Funnel */}
          <Card className="border-[#E5E8E8] mb-8">
            <CardHeader>
              <CardTitle className="text-[#2C3E50] flex items-center gap-2">
                <Target className="w-5 h-5 text-[#4ECDC4]" />
                Lesson-by-Lesson Engagement Funnel
              </CardTitle>
              <p className="text-sm text-[#2C3E50]/60">
                Identify where students are dropping off to improve course retention.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.engagementFunnel.map((lesson, index) => (
                  <div key={lesson.lesson_id} className="flex items-center justify-between p-4 bg-[#F7F9F9] rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-[#4ECDC4] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {lesson.lesson_order}
                      </div>
                      <div>
                        <h4 className="font-medium text-[#2C3E50]">{lesson.lesson_title}</h4>
                        <p className="text-sm text-[#2C3E50]/60">
                          {lesson.completed_count} of {analytics.metrics.totalEnrollments} students completed
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-[#2C3E50]">
                            {lesson.completion_rate}%
                          </span>
                          <Badge variant="outline" className="border-[#4ECDC4]/30 text-[#4ECDC4]">
                            Completion
                          </Badge>
                        </div>
                        {index > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            {getDropOffIcon(lesson.drop_off_rate)}
                            <span className={`text-sm ${getDropOffColor(lesson.drop_off_rate)}`}>
                              {lesson.drop_off_rate}% drop-off
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="w-32">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#4ECDC4] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${lesson.completion_rate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card className="border-[#E5E8E8]">
            <CardHeader>
              <CardTitle className="text-[#2C3E50] flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Recent Reviews & Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.reviews.length > 0 ? (
                  analytics.reviews.map((review) => (
                    <div key={review.id} className="border border-[#E5E8E8] rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-[#2C3E50]">{review.user_name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-[#2C3E50]/60">
                              {formatDate(review.created_at)}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-yellow-200 text-yellow-700">
                          {review.rating}/5
                        </Badge>
                      </div>
                      {review.comment && (
                        <p className="text-[#2C3E50]/80">{review.comment}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">No Reviews Yet</h3>
                    <p className="text-[#2C3E50]/60">
                      Your course hasn't received any reviews yet. Reviews will appear here once students rate your course.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
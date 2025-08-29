import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { showApiErrorToast } from "@/lib/utils/showApiErrorToast";

interface AnalyticsData {
  overview: {
    totalStudents: number;
    totalRevenue: number;
    averageRating: number;
    completionRate: number;
    activeCourses: number;
    totalEnrollments: number;
  };
  trends: {
    studentGrowth: number;
    revenueGrowth: number;
    ratingTrend: number;
    completionTrend: number;
  };
  engagement: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionDuration: number;
    bounceRate: number;
  };
  performance: {
    topPerformingCourses: Array<{
      id: string;
      title: string;
      enrollments: number;
      completionRate: number;
      averageRating: number;
      revenue: number;
    }>;
    studentProgress: Array<{
      courseId: string;
      courseTitle: string;
      enrolledStudents: number;
      completedStudents: number;
      inProgressStudents: number;
      droppedStudents: number;
    }>;
    revenueByMonth: Array<{
      month: string;
      revenue: number;
      enrollments: number;
    }>;
  };
  insights: Array<{
    id: string;
    type: 'success' | 'warning' | 'info' | 'alert';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    action?: string;
  }>;
  predictions: {
    nextMonthRevenue: number;
    studentRetentionRate: number;
    courseCompletionPrediction: number;
    atRiskStudents: number;
  };
}

interface UseRealtimeAnalyticsOptions {
  userId: string;
  role: string;
  enabled?: boolean;
  refreshInterval?: number;
  onDataUpdate?: (data: AnalyticsData) => void;
  onError?: (error: Error) => void;
}

export function useRealtimeAnalytics({
  userId,
  role,
  enabled = true,
  refreshInterval = 30000, // 30 seconds
  onDataUpdate,
  onError,
}: UseRealtimeAnalyticsOptions) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');

  const supabase = createClient();

  const fetchAnalyticsData = useCallback(async () => {
    if (!enabled || !userId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/analytics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`);
      }

      const analyticsData: AnalyticsData = await response.json();
      
      setData(analyticsData);
      setLastUpdate(new Date());
      setConnectionStatus('connected');
      
      onDataUpdate?.(analyticsData);
      
      // Generate real-time insights
      generateRealTimeInsights(analyticsData);
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      setConnectionStatus('disconnected');
      onError?.(error);
      
      console.error('Analytics fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [enabled, userId, onDataUpdate, onError]);

  const generateRealTimeInsights = useCallback((analyticsData: AnalyticsData) => {
    const insights: Array<{
      id: string;
      type: 'success' | 'warning' | 'info' | 'alert';
      title: string;
      description: string;
      impact: 'high' | 'medium' | 'low';
      action?: string;
    }> = [];

    // Revenue insights
    if (analyticsData.overview.totalRevenue > 0) {
      const revenueGrowth = analyticsData.trends.revenueGrowth;
      if (revenueGrowth > 10) {
        insights.push({
          id: `revenue-${Date.now()}`,
          type: 'success',
          title: 'Strong Revenue Growth',
          description: `Revenue increased by ${revenueGrowth}% this month.`,
          impact: 'high',
        });
      } else if (revenueGrowth < 0) {
        insights.push({
          id: `revenue-warning-${Date.now()}`,
          type: 'warning',
          title: 'Revenue Decline',
          description: `Revenue decreased by ${Math.abs(revenueGrowth)}% this month.`,
          impact: 'high',
          action: 'Review Marketing Strategy',
        });
      }
    }

    // Student engagement insights
    const engagementRate = (analyticsData.engagement.dailyActiveUsers / analyticsData.overview.totalStudents) * 100;
    if (engagementRate < 30) {
      insights.push({
        id: `engagement-${Date.now()}`,
        type: 'warning',
        title: 'Low Student Engagement',
        description: `Only ${engagementRate.toFixed(1)}% of students are active daily.`,
        impact: 'medium',
        action: 'Improve Course Content',
      });
    }

    // Completion rate insights
    if (analyticsData.overview.completionRate < 70) {
      insights.push({
        id: `completion-${Date.now()}`,
        type: 'alert',
        title: 'Low Completion Rate',
        description: `Course completion rate is ${analyticsData.overview.completionRate}%.`,
        impact: 'high',
        action: 'Analyze Drop-off Points',
      });
    }

    // Show insights as toasts for important alerts
    insights.forEach(insight => {
      if (insight.impact === 'high' && insight.type === 'alert') {
        toast.error(insight.title, {
          description: insight.description,
          duration: 8000,
          action: insight.action ? {
            label: insight.action,
            onClick: () => {
              // Handle action click
            }
          } : undefined,
        });
      } else if (insight.impact === 'high' && insight.type === 'success') {
        toast.success(insight.title, {
          description: insight.description,
          duration: 5000,
        });
      }
    });
    return insights;
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!enabled || !userId) return;

    // Subscribe to enrollment changes
    const enrollmentsSubscription = supabase
      .channel('analytics-enrollments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'enrollments',
          filter: role === 'instructor' ? `course_id=in.(${getInstructorCourseIds()})` : undefined,
        },
        (payload) => {
          // Refresh analytics data when enrollments change
          fetchAnalyticsData();
        }
      )
      .subscribe();

    // Subscribe to progress changes
    const progressSubscription = supabase
      .channel('analytics-progress')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'progress',
          filter: role === 'instructor' ? `course_id=in.(${getInstructorCourseIds()})` : undefined,
        },
        (payload) => {
          // Refresh analytics data when progress changes
          fetchAnalyticsData();
        }
      )
      .subscribe();

    // Subscribe to course rating changes
    const ratingsSubscription = supabase
      .channel('analytics-ratings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'course_ratings',
          filter: role === 'instructor' ? `course_id=in.(${getInstructorCourseIds()})` : undefined,
        },
        (payload) => {
          // Refresh analytics data when ratings change
          fetchAnalyticsData();
        }
      )
      .subscribe();

    return () => {
      enrollmentsSubscription.unsubscribe();
      progressSubscription.unsubscribe();
      ratingsSubscription.unsubscribe();
    };
  }, [enabled, userId, role, supabase, fetchAnalyticsData]);

  // Helper function to get instructor course IDs
  const getInstructorCourseIds = useCallback(async () => {
    if (role !== 'instructor') return '';
    
    try {
      const { data: courses } = await supabase
        .from('courses')
        .select('id')
        .eq('instructor_id', userId);
      
      return courses?.map(c => c.id).join(',') || '';
    } catch (error) {
      console.error('Error fetching instructor courses:', error);
      return '';
    }
  }, [role, userId, supabase]);

  // Set up periodic refresh
  useEffect(() => {
    if (!enabled || !userId) return;

    // Initial fetch
    fetchAnalyticsData();

    // Set up interval for periodic refresh
    const interval = setInterval(fetchAnalyticsData, refreshInterval);

    return () => clearInterval(interval);
  }, [enabled, userId, fetchAnalyticsData, refreshInterval]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Export data function
  const exportData = useCallback(async (format: 'csv' | 'json') => {
    if (!data) {
      toast.error('No data to export');
      return;
    }

    try {
      if (format === 'csv') {
        // Convert data to CSV format
        const csvContent = convertToCSV(data);
        downloadFile(csvContent, 'analytics-data.csv', 'text/csv');
      } else {
        // Export as JSON
        const jsonContent = JSON.stringify(data, null, 2);
        downloadFile(jsonContent, 'analytics-data.json', 'application/json');
      }
      
      toast.success(`Analytics data exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  }, [data]);

  // Helper function to convert data to CSV
  const convertToCSV = (data: AnalyticsData): string => {
    const rows = [
      ['Metric', 'Value'],
      ['Total Students', data.overview.totalStudents.toString()],
      ['Total Revenue', data.overview.totalRevenue.toString()],
      ['Average Rating', data.overview.averageRating.toString()],
      ['Completion Rate', data.overview.completionRate.toString()],
      ['Active Courses', data.overview.activeCourses.toString()],
      ['Total Enrollments', data.overview.totalEnrollments.toString()],
    ];

    return rows.map(row => row.join(',')).join('\n');
  };

  // Helper function to download file
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    data,
    loading,
    error,
    lastUpdate,
    connectionStatus,
    refresh,
    exportData,
  };
} 
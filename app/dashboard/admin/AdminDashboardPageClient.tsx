'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  Bell,
  Users,
  BookOpen,
  Globe,
  BarChart,
  Server,
  AlertCircle,
  CheckCircle,
  Settings,
  HelpCircle,
  FileText,
  MessageSquare,
  Shield,
  Database,
  Activity,
  DollarSign,
  TrendingUp,
  UserPlus,
  Flag,
  AlertTriangle,
  Lock,
  FileCheck,
  Scale,
  Zap,
  Sliders,
  Megaphone,
  LayoutGrid,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Calendar,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface DashboardData {
  metrics: {
    totalUsers: number;
    totalActiveCourses: number;
    totalRevenue: number;
    pendingUsers: number;
    totalInstructors: number;
    totalStudents: number;
    pendingCourses: number;
  };
  courseApprovalQueue: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    content_type: 'tabor_original' | 'community';
    created_at: string;
    updated_at: string;
    users: {
      full_name: string;
      email: string;
      avatar_url?: string;
    };
  }>;
  systemHealth: {
    serverStatus: string;
    databaseHealth: string;
    apiLatency: string;
    errorRate: string;
    uptime: string;
    lastUpdated: string;
  };
  recentAlerts: Array<{
    id: string;
    type: 'error' | 'warning' | 'success' | 'info';
    message: string;
    time: string;
    priority: 'high' | 'medium' | 'low';
    resolved: boolean;
  }>;
  recentActivity: Array<{
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
    last_sign_in_at?: string;
  }>;
  lastUpdated: string;
}

export default function AdminDashboardPageClient({ user, role }: { user: any, role: string }) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingCourse, setProcessingCourse] = useState<string | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/admin/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = await response.json();
      setDashboardData(data);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseAction = async (courseId: string, action: 'published' | 'needs_changes', feedback?: string) => {
    try {
      setProcessingCourse(courseId);
      
      const response = await fetch(`/api/admin/courses/${courseId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: action,
          feedback,
          rejection_reason: action === 'needs_changes' ? feedback : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update course status');
      }

      const result = await response.json();
      toast.success(result.message);
      
      // Refresh dashboard data
      await fetchDashboardData();
    } catch (error: any) {
      console.error('Error updating course status:', error);
      toast.error(error.message || 'Failed to update course status');
    } finally {
      setProcessingCourse(null);
    }
  };

  const getContentTypeBadge = (contentType: string) => {
    return contentType === 'tabor_original' ? (
      <Badge className="bg-gradient-to-r from-[#FF6B35] to-[#FF6B35]/80 text-white">
        <Shield className="w-3 h-3 mr-1" />
        Tabor Verified
      </Badge>
    ) : (
      <Badge variant="outline" className="border-[#4ECDC4]/30 text-[#4ECDC4]">
        <User className="w-3 h-3 mr-1" />
        Community
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Failed to Load Dashboard</h3>
          <p className="text-[#2C3E50]/60 mb-4">There was an error loading the dashboard data.</p>
          <Button onClick={fetchDashboardData} className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
          {/* Search and Notifications Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2C3E50]/40 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search users, content, or settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[#E5E8E8] focus:border-[#4ECDC4]"
              />
            </div>
            <Button variant="ghost" className="relative ml-4">
              <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-[#FF6B35] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {dashboardData.recentAlerts.filter(alert => !alert.resolved).length}
              </span>
            </Button>
          </div>

      {/* System Status Overview */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#2C3E50]">Admin Dashboard</h1>
          <Button variant="outline" className="text-green-500 border-green-200">
            <CheckCircle className="h-4 w-4 mr-2" />
            {dashboardData.systemHealth.serverStatus}
          </Button>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6 border-[#E5E8E8] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-[#FF6B35]/10 rounded-full p-3">
                <Server className="h-6 w-6 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-sm text-[#2C3E50]/60">Server Status</p>
                <h3 className="text-xl font-bold text-[#2C3E50]">{dashboardData.systemHealth.serverStatus}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-[#E5E8E8] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-[#4ECDC4]/10 rounded-full p-3">
                <Database className="h-6 w-6 text-[#4ECDC4]" />
              </div>
              <div>
                <p className="text-sm text-[#2C3E50]/60">Database Health</p>
                <h3 className="text-xl font-bold text-[#2C3E50]">{dashboardData.systemHealth.databaseHealth}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-[#E5E8E8] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-[#FF6B35]/10 rounded-full p-3">
                <Activity className="h-6 w-6 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-sm text-[#2C3E50]/60">API Latency</p>
                <h3 className="text-xl font-bold text-[#2C3E50]">{dashboardData.systemHealth.apiLatency}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-[#E5E8E8] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-[#4ECDC4]/10 rounded-full p-3">
                <AlertTriangle className="h-6 w-6 text-[#4ECDC4]" />
              </div>
              <div>
                <p className="text-sm text-[#2C3E50]/60">Error Rate</p>
                <h3 className="text-xl font-bold text-[#2C3E50]">{dashboardData.systemHealth.errorRate}</h3>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-[#2C3E50]">Platform Metrics</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6 border-[#E5E8E8] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-[#FF6B35]/10 rounded-full p-3">
                <Users className="h-6 w-6 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-sm text-[#2C3E50]/60">Total Users</p>
                <h3 className="text-2xl font-bold text-[#2C3E50]">{dashboardData.metrics.totalUsers}</h3>
                <p className="text-sm text-green-500">+15% this month</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-[#E5E8E8] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-[#4ECDC4]/10 rounded-full p-3">
                <BookOpen className="h-6 w-6 text-[#4ECDC4]" />
              </div>
              <div>
                <p className="text-sm text-[#2C3E50]/60">Active Courses</p>
                <h3 className="text-2xl font-bold text-[#2C3E50]">{dashboardData.metrics.totalActiveCourses}</h3>
                <p className="text-sm text-green-500">+8 this week</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-[#E5E8E8] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-[#FF6B35]/10 rounded-full p-3">
                <DollarSign className="h-6 w-6 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-sm text-[#2C3E50]/60">Revenue</p>
                <h3 className="text-2xl font-bold text-[#2C3E50]">${dashboardData.metrics.totalRevenue.toFixed(2)}</h3>
                <p className="text-sm text-green-500">+12% this month</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-[#E5E8E8] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-[#4ECDC4]/10 rounded-full p-3">
                <Clock className="h-6 w-6 text-[#4ECDC4]" />
              </div>
              <div>
                <p className="text-sm text-[#2C3E50]/60">Pending Reviews</p>
                <h3 className="text-2xl font-bold text-[#2C3E50]">{dashboardData.metrics.pendingCourses}</h3>
                <p className="text-sm text-yellow-600">Needs attention</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Course Approval Queue */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#2C3E50]">Course Approval Queue</h2>
          <Link href="/dashboard/admin/approvals">
            <Button variant="outline" className="border-[#E5E8E8] hover:border-[#4ECDC4]">
              View All
            </Button>
          </Link>
        </div>
        
        {dashboardData.courseApprovalQueue.length === 0 ? (
          <Card className="border-[#E5E8E8] shadow-sm">
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-[#4ECDC4] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">All Caught Up!</h3>
              <p className="text-[#2C3E50]/60">No courses pending review at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {dashboardData.courseApprovalQueue.slice(0, 3).map((course) => (
              <Card key={course.id} className="border-[#E5E8E8] shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-[#2C3E50]">{course.title}</h3>
                        {getContentTypeBadge(course.content_type)}
                      </div>
                      <p className="text-[#2C3E50]/70 mb-3 line-clamp-2">{course.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-[#2C3E50]/60 mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>By {course.users.full_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.category}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Submitted {formatDate(course.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Link href={`/dashboard/admin/approvals/${course.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#E5E8E8] hover:border-[#4ECDC4]"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleCourseAction(course.id, 'published')}
                        disabled={processingCourse === course.id}
                        size="sm"
                        className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
                      >
                        {processingCourse === course.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <ThumbsUp className="w-4 h-4 mr-2" />
                        )}
                        Approve
                      </Button>
                      <Button
                        onClick={() => {
                          const feedback = prompt('Please provide feedback for rejection:');
                          if (feedback) {
                            handleCourseAction(course.id, 'needs_changes', feedback);
                          }
                        }}
                        disabled={processingCourse === course.id}
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <ThumbsDown className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity and Alerts */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card className="border-[#E5E8E8] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#2C3E50]">Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivity.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#4ECDC4]/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-[#4ECDC4]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-[#2C3E50]">{user.full_name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#2C3E50]/60">{user.email}</p>
                    <p className="text-sm text-[#2C3E50]/60">
                      Joined {formatDate(user.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E5E8E8] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#2C3E50]">System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-4">
                  <div className={`rounded-full p-2 ${
                    alert.type === 'error' ? 'bg-red-100' :
                    alert.type === 'warning' ? 'bg-yellow-100' : 
                    alert.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {alert.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
                    {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                    {alert.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {alert.type === 'info' && <AlertCircle className="h-5 w-5 text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-[#2C3E50]">{alert.message}</h3>
                      <span className="text-sm text-[#2C3E50]/60">{alert.time}</span>
                    </div>
                    <p className="text-sm text-[#2C3E50]/60">Priority: {alert.priority}</p>
                    {alert.resolved && (
                      <Badge variant="outline" className="mt-1 text-xs border-green-200 text-green-700">
                        Resolved
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-[#2C3E50]">Quick Actions</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <Link href="/dashboard/admin/users">
            <Card className="p-6 border-[#E5E8E8] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="bg-[#FF6B35]/10 rounded-full p-3">
                  <Users className="h-6 w-6 text-[#FF6B35]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#2C3E50]">User Management</h3>
                  <p className="text-sm text-[#2C3E50]/60">Manage user accounts</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/admin/transactions">
            <Card className="p-6 border-[#E5E8E8] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="bg-[#4ECDC4]/10 rounded-full p-3">
                  <DollarSign className="h-6 w-6 text-[#4ECDC4]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#2C3E50]">Transactions</h3>
                  <p className="text-sm text-[#2C3E50]/60">Monitor payments</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/admin/settings">
            <Card className="p-6 border-[#E5E8E8] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="bg-[#FF6B35]/10 rounded-full p-3">
                  <Settings className="h-6 w-6 text-[#FF6B35]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#2C3E50]">Platform Settings</h3>
                  <p className="text-sm text-[#2C3E50]/60">Configure platform</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/admin/approvals">
            <Card className="p-6 border-[#E5E8E8] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="bg-[#4ECDC4]/10 rounded-full p-3">
                  <FileCheck className="h-6 w-6 text-[#4ECDC4]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#2C3E50]">Course Approvals</h3>
                  <p className="text-sm text-[#2C3E50]/60">Review submissions</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
} 
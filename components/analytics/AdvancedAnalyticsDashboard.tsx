'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Star,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  LineChart,
  PieChart,
  Download,
  RefreshCw,
  Eye,
  Brain,
  Zap,
  Award,
  Calendar,
  DollarSign,
  Activity,
  Target as TargetIcon,
  TrendingUp as TrendingUpIcon,
  Users as UsersIcon,
  BookOpen as BookOpenIcon,
  Star as StarIcon,
  Clock as ClockIcon,
  AlertTriangle as AlertTriangleIcon,
  CheckCircle as CheckCircleIcon,
  BarChart3 as BarChart3Icon,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Download as DownloadIcon,
  RefreshCw as RefreshCwIcon,
  Eye as EyeIcon,
  Brain as BrainIcon,
  Zap as ZapIcon,
  Award as AwardIcon,
  Calendar as CalendarIcon,
  DollarSign as DollarSignIcon,
  Activity as ActivityIcon,
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Legend,
} from 'recharts';
import { toast } from 'sonner';

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
    newPredictionField: number;
  };
}

interface AdvancedAnalyticsDashboardProps {
  userId: string;
  role: string;
}

// Mock data - replace with real API calls
const mockData: AnalyticsData = {
    overview: {
      totalStudents: 1247,
      totalRevenue: 45680,
      averageRating: 4.7,
      completionRate: 78.5,
      activeCourses: 12,
      totalEnrollments: 1893,
    },
    trends: {
      studentGrowth: 15.2,
      revenueGrowth: 8.7,
      ratingTrend: 0.3,
      completionTrend: 2.1,
    },
    engagement: {
      dailyActiveUsers: 342,
      weeklyActiveUsers: 892,
      monthlyActiveUsers: 1247,
      averageSessionDuration: 45,
      bounceRate: 23.4,
    },
    performance: {
      topPerformingCourses: [
        {
          id: '1',
          title: 'Digital Marketing Mastery',
          enrollments: 234,
          completionRate: 85.2,
          averageRating: 4.8,
          revenue: 12450,
        },
        {
          id: '2',
          title: 'No-Code Development',
          enrollments: 189,
          completionRate: 78.9,
          averageRating: 4.6,
          revenue: 9870,
        },
        {
          id: '3',
          title: 'E-commerce Strategy',
          enrollments: 156,
          completionRate: 82.1,
          averageRating: 4.7,
          revenue: 8230,
        },
      ],
      studentProgress: [
        {
          courseId: '1',
          courseTitle: 'Digital Marketing Mastery',
          enrolledStudents: 234,
          completedStudents: 199,
          inProgressStudents: 28,
          droppedStudents: 7,
        },
        {
          courseId: '2',
          courseTitle: 'No-Code Development',
          enrolledStudents: 189,
          completedStudents: 149,
          inProgressStudents: 32,
          droppedStudents: 8,
        },
      ],
      revenueByMonth: [
        { month: 'Jan', revenue: 8500, enrollments: 145 },
        { month: 'Feb', revenue: 9200, enrollments: 167 },
        { month: 'Mar', revenue: 10800, enrollments: 189 },
        { month: 'Apr', revenue: 12400, enrollments: 212 },
        { month: 'May', revenue: 11800, enrollments: 198 },
        { month: 'Jun', revenue: 13200, enrollments: 234 },
      ],
    },
    insights: [
      {
        id: '1',
        type: 'success',
        title: 'High Completion Rate',
        description: 'Digital Marketing Mastery has a 85.2% completion rate, 6.7% above average.',
        impact: 'high',
        action: 'Analyze success factors',
      },
      {
        id: '2',
        type: 'warning',
        title: 'Student Drop-off Alert',
        description: 'No-Code Development has 8 dropped students this month.',
        impact: 'medium',
        action: 'Review course content',
      },
      {
        id: '3',
        type: 'info',
        title: 'Revenue Growth',
        description: 'Monthly revenue increased by 8.7% compared to last month.',
        impact: 'high',
      },
    ],
    predictions: {
      nextMonthRevenue: 14500,
      studentRetentionRate: 82.3,
      courseCompletionPrediction: 81.2,
      atRiskStudents: 23,
      newPredictionField: 0,
    },
  };

export default function AdvancedAnalyticsDashboard({ userId, role }: AdvancedAnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30d');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedView, setSelectedView] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(mockData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey, timeframe]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast.success('Analytics data refreshed');
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    toast.success(`Exporting analytics data as ${format.toUpperCase()}`);
    // Implement export functionality
  };

  const getTrendIcon = (value: number) => {
    return value > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Eye className="w-4 h-4 text-blue-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-[#4ECDC4]" />
          <span className="text-[#2C3E50]">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Failed to Load Analytics</h3>
        <p className="text-[#2C3E50]/60 mb-4">Please try refreshing the page.</p>
        <Button onClick={handleRefresh} className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2C3E50]">Advanced Analytics</h1>
          <p className="text-[#2C3E50]/60">Real-time insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32 border-[#4ECDC4]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} variant="outline" className="border-[#4ECDC4] text-[#4ECDC4]">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button onClick={() => handleExport('csv')} variant="outline" className="border-[#4ECDC4] text-[#4ECDC4]">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#E5E8E8] hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#2C3E50]/60">Total Students</p>
                <p className="text-2xl font-bold text-[#2C3E50]">{data.overview.totalStudents.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(data.trends.studentGrowth)}
                  <span className="text-sm text-green-600">+{data.trends.studentGrowth}%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E5E8E8] hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#2C3E50]/60">Total Revenue</p>
                <p className="text-2xl font-bold text-[#2C3E50]">${data.overview.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(data.trends.revenueGrowth)}
                  <span className="text-sm text-green-600">+{data.trends.revenueGrowth}%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E5E8E8] hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#2C3E50]/60">Average Rating</p>
                <p className="text-2xl font-bold text-[#2C3E50]">{data.overview.averageRating}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(data.trends.ratingTrend)}
                  <span className="text-sm text-green-600">+{data.trends.ratingTrend}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E5E8E8] hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#2C3E50]/60">Completion Rate</p>
                <p className="text-2xl font-bold text-[#2C3E50]">{data.overview.completionRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(data.trends.completionTrend)}
                  <span className="text-sm text-green-600">+{data.trends.completionTrend}%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-[#E5E8E8]">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#4ECDC4] data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-[#4ECDC4] data-[state=active]:text-white">
            Performance
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-[#4ECDC4] data-[state=active]:text-white">
            Insights
          </TabsTrigger>
          <TabsTrigger value="predictions" className="data-[state=active]:bg-[#4ECDC4] data-[state=active]:text-white">
            Predictions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card className="border-[#E5E8E8]">
              <CardHeader>
                <CardTitle className="text-[#2C3E50] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#4ECDC4]" />
                  Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.performance.revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E8E8" />
                    <XAxis dataKey="month" stroke="#2C3E50" />
                    <YAxis stroke="#2C3E50" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E8E8',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#4ECDC4" 
                      fill="#4ECDC4" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Engagement Metrics */}
            <Card className="border-[#E5E8E8]">
              <CardHeader>
                <CardTitle className="text-[#2C3E50] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#FF6B35]" />
                  Engagement Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-[#2C3E50]/60">Daily Active Users</span>
                      <span className="text-sm font-medium">{data.engagement.dailyActiveUsers}</span>
                    </div>
                    <Progress value={(data.engagement.dailyActiveUsers / data.overview.totalStudents) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-[#2C3E50]/60">Weekly Active Users</span>
                      <span className="text-sm font-medium">{data.engagement.weeklyActiveUsers}</span>
                    </div>
                    <Progress value={(data.engagement.weeklyActiveUsers / data.overview.totalStudents) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-[#2C3E50]/60">Average Session Duration</span>
                      <span className="text-sm font-medium">{data.engagement.averageSessionDuration} min</span>
                    </div>
                    <Progress value={(data.engagement.averageSessionDuration / 60) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-[#2C3E50]/60">Bounce Rate</span>
                      <span className="text-sm font-medium">{data.engagement.bounceRate}%</span>
                    </div>
                    <Progress value={data.engagement.bounceRate} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Courses */}
            <Card className="border-[#E5E8E8]">
              <CardHeader>
                <CardTitle className="text-[#2C3E50] flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#FF6B35]" />
                  Top Performing Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.performance.topPerformingCourses.map((course, index) => (
                    <div key={course.id} className="flex items-center justify-between p-3 bg-[#E5E8E8]/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#4ECDC4] to-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-[#2C3E50]">{course.title}</p>
                          <p className="text-sm text-[#2C3E50]/60">{course.enrollments} students</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#2C3E50]">{course.completionRate}%</p>
                        <p className="text-sm text-[#2C3E50]/60">${course.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Student Progress */}
            <Card className="border-[#E5E8E8]">
              <CardHeader>
                <CardTitle className="text-[#2C3E50] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#4ECDC4]" />
                  Student Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={data.performance.studentProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E8E8" />
                    <XAxis dataKey="courseTitle" stroke="#2C3E50" fontSize={12} />
                    <YAxis stroke="#2C3E50" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E8E8',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="completedStudents" fill="#4ECDC4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="inProgressStudents" fill="#FF6B35" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="droppedStudents" fill="#E74C3C" radius={[4, 4, 0, 0]} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Insights */}
            <Card className="border-[#E5E8E8]">
              <CardHeader>
                <CardTitle className="text-[#2C3E50] flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#4ECDC4]" />
                  AI-Powered Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.insights.map((insight) => (
                    <div key={insight.id} className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-[#2C3E50]">{insight.title}</h4>
                            <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>
                              {insight.impact} impact
                            </Badge>
                          </div>
                          <p className="text-sm text-[#2C3E50]/70 mb-2">{insight.description}</p>
                          {insight.action && (
                            <Button variant="outline" size="sm" className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
                              {insight.action}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-[#E5E8E8]">
              <CardHeader>
                <CardTitle className="text-[#2C3E50] flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#FF6B35]" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
                    <Users className="w-6 h-6 mb-2" />
                    <span className="text-xs">Student Analysis</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
                    <BookOpen className="w-6 h-6 mb-2" />
                    <span className="text-xs">Course Review</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
                    <Target className="w-6 h-6 mb-2" />
                    <span className="text-xs">Set Goals</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
                    <Download className="w-6 h-6 mb-2" />
                    <span className="text-xs">Export Data</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Prediction */}
            <Card className="border-[#E5E8E8]">
              <CardHeader>
                <CardTitle className="text-[#2C3E50] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#4ECDC4]" />
                  Revenue Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#2C3E50] mb-2">
                    ${data.predictions.nextMonthRevenue.toLocaleString()}
                  </div>
                  <p className="text-[#2C3E50]/60 mb-4">Predicted revenue for next month</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#4ECDC4]">{data.predictions.studentRetentionRate}%</div>
                      <p className="text-sm text-[#2C3E50]/60">Retention Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#FF6B35]">{data.predictions.courseCompletionPrediction}%</div>
                      <p className="text-sm text-[#2C3E50]/60">Completion Rate</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Analysis */}
            <Card className="border-[#E5E8E8]">
              <CardHeader>
                <CardTitle className="text-[#2C3E50] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#FF6B35]" />
                  Risk Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-red-800">At-Risk Students</span>
                    </div>
                    <p className="text-red-700 text-sm mb-2">
                      {data.predictions.atRiskStudents} students may drop out this month
                    </p>
                    <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                      View Details
                    </Button>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium text-yellow-800">Low Engagement</span>
                    </div>
                    <p className="text-yellow-700 text-sm">
                      15% of students haven't logged in for 7+ days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
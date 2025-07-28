'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  Users,
  DollarSign,
  Calendar,
  Clock,
  Zap,
  Lightbulb,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Award,
  Star,
  Eye,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { toast } from 'sonner';

interface PredictionData {
  revenue: {
    current: number;
    predicted: number;
    trend: number;
    confidence: number;
    factors: Array<{
      factor: string;
      impact: 'positive' | 'negative' | 'neutral';
      weight: number;
    }>;
  };
  students: {
    current: number;
    predicted: number;
    retention: number;
    churn: number;
    atRisk: number;
  };
  courses: {
    performance: Array<{
      id: string;
      title: string;
      currentRating: number;
      predictedRating: number;
      completionRate: number;
      predictedCompletion: number;
      risk: 'low' | 'medium' | 'high';
    }>;
    recommendations: Array<{
      type: 'improve' | 'promote' | 'optimize';
      title: string;
      description: string;
      impact: 'high' | 'medium' | 'low';
      effort: 'low' | 'medium' | 'high';
    }>;
  };
  insights: Array<{
    id: string;
    type: 'opportunity' | 'risk' | 'trend' | 'optimization';
    title: string;
    description: string;
    confidence: number;
    timeframe: string;
    action?: string;
  }>;
  trends: {
    seasonal: Array<{
      month: string;
      revenue: number;
      enrollments: number;
      trend: 'up' | 'down' | 'stable';
    }>;
    patterns: Array<{
      pattern: string;
      description: string;
      confidence: number;
    }>;
  };
}

interface PredictiveAnalyticsProps {
  userId: string;
  role: string;
  currentData: any;
}

export default function PredictiveAnalytics({ userId, role, currentData }: PredictiveAnalyticsProps) {
  const [predictions, setPredictions] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('3m');
  const [showDetails, setShowDetails] = useState(false);

  // Mock prediction data - replace with real AI predictions
  const mockPredictions: PredictionData = {
    revenue: {
      current: currentData?.overview?.totalRevenue || 45680,
      predicted: 52340,
      trend: 14.6,
      confidence: 87.3,
      factors: [
        { factor: 'Course Quality', impact: 'positive', weight: 0.35 },
        { factor: 'Marketing Campaigns', impact: 'positive', weight: 0.25 },
        { factor: 'Seasonal Trends', impact: 'positive', weight: 0.20 },
        { factor: 'Competition', impact: 'negative', weight: 0.15 },
        { factor: 'Economic Factors', impact: 'neutral', weight: 0.05 },
      ],
    },
    students: {
      current: currentData?.overview?.totalStudents || 1247,
      predicted: 1389,
      retention: 82.3,
      churn: 8.7,
      atRisk: 23,
    },
    courses: {
      performance: [
        {
          id: '1',
          title: 'Digital Marketing Mastery',
          currentRating: 4.8,
          predictedRating: 4.9,
          completionRate: 85.2,
          predictedCompletion: 87.1,
          risk: 'low',
        },
        {
          id: '2',
          title: 'No-Code Development',
          currentRating: 4.6,
          predictedRating: 4.7,
          completionRate: 78.9,
          predictedCompletion: 81.2,
          risk: 'medium',
        },
        {
          id: '3',
          title: 'E-commerce Strategy',
          currentRating: 4.7,
          predictedRating: 4.8,
          completionRate: 82.1,
          predictedCompletion: 84.5,
          risk: 'low',
        },
      ],
      recommendations: [
        {
          type: 'improve',
          title: 'Enhance No-Code Course',
          description: 'Add more interactive exercises to improve completion rates',
          impact: 'high',
          effort: 'medium',
        },
        {
          type: 'promote',
          title: 'Market Digital Marketing Course',
          description: 'High-performing course with excellent student feedback',
          impact: 'high',
          effort: 'low',
        },
        {
          type: 'optimize',
          title: 'Optimize Course Pricing',
          description: 'Adjust pricing strategy based on market analysis',
          impact: 'medium',
          effort: 'low',
        },
      ],
    },
    insights: [
      {
        id: '1',
        type: 'opportunity',
        title: 'High Growth Potential',
        description: 'Based on current trends, you can expect 15% revenue growth in the next quarter',
        confidence: 89.2,
        timeframe: '3 months',
        action: 'Scale Marketing Efforts',
      },
      {
        id: '2',
        type: 'risk',
        title: 'Student Churn Risk',
        description: '23 students show signs of dropping out. Early intervention recommended.',
        confidence: 76.8,
        timeframe: '1 month',
        action: 'Implement Retention Program',
      },
      {
        id: '3',
        type: 'trend',
        title: 'Seasonal Uptick Expected',
        description: 'Historical data shows 20% increase in enrollments during Q3',
        confidence: 92.1,
        timeframe: '3 months',
      },
      {
        id: '4',
        type: 'optimization',
        title: 'Course Content Optimization',
        description: 'Adding video content could increase completion rates by 12%',
        confidence: 84.5,
        timeframe: '2 months',
        action: 'Review Content Strategy',
      },
    ],
    trends: {
      seasonal: [
        { month: 'Jul', revenue: 14500, enrollments: 245, trend: 'up' },
        { month: 'Aug', revenue: 15800, enrollments: 267, trend: 'up' },
        { month: 'Sep', revenue: 17200, enrollments: 289, trend: 'up' },
        { month: 'Oct', revenue: 16500, enrollments: 278, trend: 'down' },
        { month: 'Nov', revenue: 15800, enrollments: 265, trend: 'down' },
        { month: 'Dec', revenue: 14200, enrollments: 238, trend: 'down' },
      ],
      patterns: [
        {
          pattern: 'Weekend Engagement',
          description: 'Students are 35% more active on weekends',
          confidence: 91.2,
        },
        {
          pattern: 'Morning Learning',
          description: 'Peak learning hours are 9 AM - 11 AM',
          confidence: 87.6,
        },
        {
          pattern: 'Course Completion',
          description: 'Students who complete first module are 3x more likely to finish',
          confidence: 94.3,
        },
      ],
    },
  };

  useEffect(() => {
    const loadPredictions = async () => {
      setLoading(true);
      try {
        // Simulate AI prediction loading
        await new Promise(resolve => setTimeout(resolve, 2000));
        setPredictions(mockPredictions);
      } catch (error) {
        console.error('Error loading predictions:', error);
        toast.error('Failed to load predictions');
      } finally {
        setLoading(false);
      }
    };

    loadPredictions();
  }, [currentData]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'risk':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'trend':
        return <BarChart3 className="w-5 h-5 text-blue-500" />;
      case 'optimization':
        return <Zap className="w-5 h-5 text-yellow-500" />;
      default:
        return <Lightbulb className="w-5 h-5 text-purple-500" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
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

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 animate-pulse text-[#4ECDC4]" />
          <span className="text-[#2C3E50]">AI is analyzing your data...</span>
        </div>
      </div>
    );
  }

  if (!predictions) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Prediction Error</h3>
        <p className="text-[#2C3E50]/60 mb-4">Unable to generate predictions at this time.</p>
        <Button onClick={() => window.location.reload()} className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-[#4ECDC4] to-[#FF6B35] rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#2C3E50]">AI-Powered Predictions</h2>
            <p className="text-[#2C3E50]/60">Machine learning insights and forecasts</p>
          </div>
        </div>
        <Button
          onClick={() => setShowDetails(!showDetails)}
          variant="outline"
          className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white"
        >
          {showDetails ? <Eye className="w-4 h-4 mr-2" /> : <BarChart3 className="w-4 h-4 mr-2" />}
          {showDetails ? 'Hide Details' : 'Show Details'}
        </Button>
      </div>

      {/* Revenue Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-[#E5E8E8]">
          <CardHeader>
            <CardTitle className="text-[#2C3E50] flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Revenue Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#2C3E50] mb-2">
                  ${predictions.revenue.predicted.toLocaleString()}
                </div>
                <p className="text-[#2C3E50]/60 mb-4">Predicted revenue (next 3 months)</p>
                <div className="flex items-center justify-center gap-2">
                  {predictions.revenue.trend > 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`font-semibold ${predictions.revenue.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {predictions.revenue.trend > 0 ? '+' : ''}{predictions.revenue.trend}%
                  </span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {predictions.revenue.confidence}% confidence
                  </Badge>
                </div>
              </div>

              {showDetails && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-[#2C3E50]">Influencing Factors</h4>
                  {predictions.revenue.factors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-[#2C3E50]/70">{factor.factor}</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          factor.impact === 'positive' ? 'bg-green-500' :
                          factor.impact === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                        }`} />
                        <span className="text-sm font-medium">{factor.weight * 100}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E5E8E8]">
          <CardHeader>
            <CardTitle className="text-[#2C3E50] flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Student Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#2C3E50]">{predictions.students.predicted}</div>
                  <p className="text-sm text-[#2C3E50]/60">Predicted Students</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{predictions.students.retention}%</div>
                  <p className="text-sm text-[#2C3E50]/60">Retention Rate</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>At Risk Students</span>
                  <span className="font-medium text-red-600">{predictions.students.atRisk}</span>
                </div>
                <Progress value={(predictions.students.atRisk / predictions.students.current) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Churn Rate</span>
                  <span className="font-medium text-orange-600">{predictions.students.churn}%</span>
                </div>
                <Progress value={predictions.students.churn} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance Predictions */}
      <Card className="border-[#E5E8E8]">
        <CardHeader>
          <CardTitle className="text-[#2C3E50] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#4ECDC4]" />
            Course Performance Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.courses.performance.map((course) => (
              <div key={course.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-[#2C3E50]">{course.title}</h4>
                  <Badge className={getRiskColor(course.risk)}>
                    {course.risk} risk
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-[#2C3E50]/60">Current Rating</p>
                    <p className="font-semibold text-[#2C3E50]">{course.currentRating}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#2C3E50]/60">Predicted Rating</p>
                    <p className="font-semibold text-[#2C3E50]">{course.predictedRating}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#2C3E50]/60">Completion Rate</p>
                    <p className="font-semibold text-[#2C3E50]">{course.completionRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#2C3E50]/60">Predicted Completion</p>
                    <p className="font-semibold text-[#2C3E50]">{course.predictedCompletion}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-[#E5E8E8]">
        <CardHeader>
          <CardTitle className="text-[#2C3E50] flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            AI-Generated Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.insights.map((insight) => (
              <div key={insight.id} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-[#2C3E50]">{insight.title}</h4>
                      <Badge className="bg-blue-100 text-blue-800">
                        {insight.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-[#2C3E50]/70 mb-2">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#2C3E50]/50">{insight.timeframe}</span>
                      {insight.action && (
                        <Button size="sm" variant="outline" className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
                          {insight.action}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-[#E5E8E8]">
        <CardHeader>
          <CardTitle className="text-[#2C3E50] flex items-center gap-2">
            <Target className="w-5 h-5 text-[#FF6B35]" />
            Actionable Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.courses.recommendations.map((rec, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#4ECDC4]/10 rounded-lg flex items-center justify-center">
                    {rec.type === 'improve' && <Zap className="w-5 h-5 text-[#4ECDC4]" />}
                    {rec.type === 'promote' && <TrendingUp className="w-5 h-5 text-green-500" />}
                    {rec.type === 'optimize' && <Target className="w-5 h-5 text-[#FF6B35]" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2C3E50]">{rec.title}</h4>
                    <p className="text-sm text-[#2C3E50]/70">{rec.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getEffortColor(rec.effort)}`}>
                    {rec.effort} effort
                  </Badge>
                  <Badge className={`${getRiskColor(rec.impact)}`}>
                    {rec.impact} impact
                  </Badge>
                  <Button size="sm" className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Trends */}
      <Card className="border-[#E5E8E8]">
        <CardHeader>
          <CardTitle className="text-[#2C3E50] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            Seasonal Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={predictions.trends.seasonal}>
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
              <Area 
                type="monotone" 
                dataKey="enrollments" 
                stroke="#FF6B35" 
                fill="#FF6B35" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
} 
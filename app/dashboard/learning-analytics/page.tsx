"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  Clock,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  BarChart,
  LineChart,
  Activity,
  Calendar,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Zap,
  Star
} from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import Link from "next/link"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Mock analytics data
const analyticsData = {
  performance: {
    learningEffectiveness: 85,
    retentionRate: 78,
    averageScore: 92,
    completionRate: 88,
    peakLearningTime: "10:00 AM - 12:00 PM",
    optimalSessionLength: "45 minutes"
  },
  engagement: {
    videoCompletion: 92,
    interactionRate: 85,
    forumParticipation: 75,
    peerCollaboration: 80,
    resourceUsage: 88,
    weeklyData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Hours Spent Learning',
          data: [2.5, 3, 2, 4, 2.5, 1.5, 1],
          borderColor: 'rgb(234, 88, 12)',
          backgroundColor: 'rgba(234, 88, 12, 0.1)',
          fill: true
        }
      ]
    }
  },
  velocity: {
    averageCompletionTime: "4.2 hours",
    learningAcceleration: "+15%",
    consistencyScore: 88,
    monthlyProgress: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Course Progress',
          data: [25, 45, 68, 85],
          borderColor: 'rgb(20, 184, 166)',
          backgroundColor: 'rgba(20, 184, 166, 0.1)',
          fill: true
        }
      ]
    }
  },
  assessment: {
    quizScores: {
      labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'],
      datasets: [
        {
          label: 'Your Score',
          data: [85, 92, 88, 95, 90],
          backgroundColor: 'rgba(234, 88, 12, 0.8)'
        },
        {
          label: 'Class Average',
          data: [75, 78, 80, 82, 80],
          backgroundColor: 'rgba(20, 184, 166, 0.8)'
        }
      ]
    },
    strengthAreas: [
      "Digital Marketing Strategy",
      "Social Media Management",
      "Content Creation"
    ],
    improvementAreas: [
      "Data Analytics",
      "Email Marketing",
      "SEO Optimization"
    ]
  },
  comparative: {
    ranking: 85,
    totalLearners: 1000,
    peerProgress: 75,
    regionalRank: 12,
    cohortSize: 150
  },
  behavioral: {
    learningHabits: {
      morningLearning: 45,
      afternoonLearning: 35,
      eveningLearning: 20
    },
    deviceUsage: {
      mobile: 40,
      desktop: 45,
      tablet: 15
    },
    environmentPreference: {
      home: 60,
      office: 25,
      other: 15
    }
  }
}

export default function LearningAnalyticsPage() {
  const [timeframe, setTimeframe] = useState("week")

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
              Learning Analytics
            </h1>
            <p className="text-muted-foreground">
              Track your learning performance and identify areas for improvement
            </p>
          </div>

          {/* Performance Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 card-hover gradient-border">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 rounded-full p-3">
                  <Brain className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Learning Effectiveness</p>
                  <p className="text-2xl font-bold">{analyticsData.performance.learningEffectiveness}%</p>
                </div>
              </div>
              <Progress value={analyticsData.performance.learningEffectiveness} className="mt-4" />
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <div className="flex items-center gap-4">
                <div className="bg-teal-100 rounded-full p-3">
                  <Target className="h-6 w-6 text-teal-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Retention Rate</p>
                  <p className="text-2xl font-bold">{analyticsData.performance.retentionRate}%</p>
                </div>
              </div>
              <Progress value={analyticsData.performance.retentionRate} className="mt-4" />
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 rounded-full p-3">
                  <Star className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold">{analyticsData.performance.averageScore}%</p>
                </div>
              </div>
              <Progress value={analyticsData.performance.averageScore} className="mt-4" />
            </Card>
          </div>

          {/* Engagement Analytics */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6 card-hover gradient-border">
              <h2 className="text-xl font-bold mb-6">Weekly Learning Activity</h2>
              <Line
                data={analyticsData.engagement.weeklyData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Hours'
                      }
                    }
                  }
                }}
              />
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <h2 className="text-xl font-bold mb-6">Engagement Metrics</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Video Completion</span>
                    <span className="text-sm font-medium">{analyticsData.engagement.videoCompletion}%</span>
                  </div>
                  <Progress value={analyticsData.engagement.videoCompletion} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Interaction Rate</span>
                    <span className="text-sm font-medium">{analyticsData.engagement.interactionRate}%</span>
                  </div>
                  <Progress value={analyticsData.engagement.interactionRate} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Forum Participation</span>
                    <span className="text-sm font-medium">{analyticsData.engagement.forumParticipation}%</span>
                  </div>
                  <Progress value={analyticsData.engagement.forumParticipation} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Resource Usage</span>
                    <span className="text-sm font-medium">{analyticsData.engagement.resourceUsage}%</span>
                  </div>
                  <Progress value={analyticsData.engagement.resourceUsage} />
                </div>
              </div>
            </Card>
          </div>

          {/* Learning Velocity */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6 card-hover gradient-border">
              <h2 className="text-xl font-bold mb-6">Learning Progress</h2>
              <Line
                data={analyticsData.velocity.monthlyProgress}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: 'Progress %'
                      }
                    }
                  }
                }}
              />
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <h2 className="text-xl font-bold mb-6">Learning Velocity</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Completion Time</p>
                    <p className="text-xl font-bold">{analyticsData.velocity.averageCompletionTime}</p>
                  </div>
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Learning Acceleration</p>
                    <p className="text-xl font-bold text-green-500">{analyticsData.velocity.learningAcceleration}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Consistency Score</p>
                    <p className="text-xl font-bold">{analyticsData.velocity.consistencyScore}/100</p>
                  </div>
                  <Activity className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            </Card>
          </div>

          {/* Assessment Performance */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-2">
              <Card className="p-6 card-hover gradient-border">
                <h2 className="text-xl font-bold mb-6">Quiz Performance</h2>
                <Bar
                  data={analyticsData.assessment.quizScores}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                          display: true,
                          text: 'Score %'
                        }
                      }
                    }
                  }}
                />
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6 card-hover gradient-border">
                <h3 className="font-semibold mb-4">Strength Areas</h3>
                <div className="space-y-2">
                  {analyticsData.assessment.strengthAreas.map((area, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 card-hover gradient-border">
                <h3 className="font-semibold mb-4">Areas for Improvement</h3>
                <div className="space-y-2">
                  {analyticsData.assessment.improvementAreas.map((area, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Learning Behavior */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 card-hover gradient-border">
              <h2 className="text-lg font-semibold mb-4">Learning Time Distribution</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Morning</span>
                    <span className="text-sm">{analyticsData.behavioral.learningHabits.morningLearning}%</span>
                  </div>
                  <Progress value={analyticsData.behavioral.learningHabits.morningLearning} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Afternoon</span>
                    <span className="text-sm">{analyticsData.behavioral.learningHabits.afternoonLearning}%</span>
                  </div>
                  <Progress value={analyticsData.behavioral.learningHabits.afternoonLearning} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Evening</span>
                    <span className="text-sm">{analyticsData.behavioral.learningHabits.eveningLearning}%</span>
                  </div>
                  <Progress value={analyticsData.behavioral.learningHabits.eveningLearning} />
                </div>
              </div>
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <h2 className="text-lg font-semibold mb-4">Device Usage</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Mobile</span>
                    <span className="text-sm">{analyticsData.behavioral.deviceUsage.mobile}%</span>
                  </div>
                  <Progress value={analyticsData.behavioral.deviceUsage.mobile} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Desktop</span>
                    <span className="text-sm">{analyticsData.behavioral.deviceUsage.desktop}%</span>
                  </div>
                  <Progress value={analyticsData.behavioral.deviceUsage.desktop} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Tablet</span>
                    <span className="text-sm">{analyticsData.behavioral.deviceUsage.tablet}%</span>
                  </div>
                  <Progress value={analyticsData.behavioral.deviceUsage.tablet} />
                </div>
              </div>
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <h2 className="text-lg font-semibold mb-4">Learning Environment</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Home</span>
                    <span className="text-sm">{analyticsData.behavioral.environmentPreference.home}%</span>
                  </div>
                  <Progress value={analyticsData.behavioral.environmentPreference.home} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Office</span>
                    <span className="text-sm">{analyticsData.behavioral.environmentPreference.office}%</span>
                  </div>
                  <Progress value={analyticsData.behavioral.environmentPreference.office} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Other</span>
                    <span className="text-sm">{analyticsData.behavioral.environmentPreference.other}%</span>
                  </div>
                  <Progress value={analyticsData.behavioral.environmentPreference.other} />
                </div>
              </div>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="p-8 bg-gradient-to-r from-orange-50 to-teal-50">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Optimize Your Learning</h2>
              <p className="text-muted-foreground mb-6">
                Based on your analytics, we recommend focusing on your improvement areas and maintaining your current learning momentum.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-orange-600 to-orange-500" asChild>
                  <Link href="/courses">Explore Recommended Courses</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/mentorship">Get Learning Support</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  BookOpen,
  BriefcaseIcon,
  Code,
  Coins,
  Globe,
  GraduationCap,
  LineChart,
  MessageSquare,
  Star,
  Target,
  TrendingUp,
  Users
} from "lucide-react"
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import { Radar } from 'react-chartjs-2'
import Link from "next/link"

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

// Mock data for the radar chart
const skillData = {
  radarChart: {
    labels: [
      'Digital Marketing',
      'E-commerce',
      'No-Code Development',
      'Financial Literacy',
      'Communication',
      'Leadership'
    ],
    datasets: [
      {
        label: 'Your Skills',
        data: [75, 65, 80, 55, 70, 60],
        backgroundColor: 'rgba(234, 88, 12, 0.2)',
        borderColor: 'rgb(234, 88, 12)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(234, 88, 12)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(234, 88, 12)'
      },
      {
        label: 'Industry Average',
        data: [65, 60, 70, 65, 65, 55],
        backgroundColor: 'rgba(20, 184, 166, 0.2)',
        borderColor: 'rgb(20, 184, 166)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(20, 184, 166)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(20, 184, 166)'
      }
    ]
  },
  individualSkills: [
    {
      id: 1,
      name: "Digital Marketing",
      icon: Globe,
      level: 75,
      industryAvg: 65,
      subSkills: [
        { name: "Social Media Marketing", progress: 85 },
        { name: "Content Strategy", progress: 70 },
        { name: "SEO", progress: 65 },
        { name: "Email Marketing", progress: 80 }
      ],
      validations: [
        "Completed 3 marketing campaigns",
        "Achieved 150% ROI on client projects",
        "Peer-reviewed by 5 experts"
      ],
      recommendations: [
        "Advanced Analytics Course",
        "PPC Advertising Masterclass"
      ]
    },
    {
      id: 2,
      name: "E-commerce",
      icon: BriefcaseIcon,
      level: 65,
      industryAvg: 60,
      subSkills: [
        { name: "Platform Management", progress: 75 },
        { name: "Inventory Control", progress: 60 },
        { name: "Customer Service", progress: 80 },
        { name: "Payment Integration", progress: 55 }
      ],
      validations: [
        "Built 2 successful online stores",
        "Managed $50k in transactions",
        "Customer satisfaction rate 4.8/5"
      ],
      recommendations: [
        "Advanced E-commerce Operations",
        "Supply Chain Management"
      ]
    },
    {
      id: 3,
      name: "No-Code Development",
      icon: Code,
      level: 80,
      industryAvg: 70,
      subSkills: [
        { name: "Website Building", progress: 90 },
        { name: "App Development", progress: 75 },
        { name: "Automation", progress: 85 },
        { name: "Database Management", progress: 70 }
      ],
      validations: [
        "Created 5 production applications",
        "Saved 200+ development hours",
        "4.9/5 client satisfaction"
      ],
      recommendations: [
        "Advanced Automation Techniques",
        "API Integration Masterclass"
      ]
    }
  ],
  marketInsights: [
    {
      skill: "Digital Marketing",
      demand: "High",
      growthRate: "+25%",
      avgSalary: "$45,000",
      topEmployers: ["Tech Startups", "Digital Agencies", "E-commerce"],
      freelanceRate: "$35-50/hr"
    },
    {
      skill: "No-Code Development",
      demand: "Very High",
      growthRate: "+40%",
      avgSalary: "$55,000",
      topEmployers: ["SaaS Companies", "Digital Agencies", "Startups"],
      freelanceRate: "$45-75/hr"
    },
    {
      skill: "E-commerce",
      demand: "High",
      growthRate: "+30%",
      avgSalary: "$50,000",
      topEmployers: ["Online Retailers", "D2C Brands", "Marketplaces"],
      freelanceRate: "$40-60/hr"
    }
  ]
}

export default function SkillRadarPage() {
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
              Skill Radar
            </h1>
            <p className="text-muted-foreground">
              Track your skill development and identify opportunities for growth
            </p>
          </div>

          {/* Competency Visualization Dashboard */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 md:col-span-2 card-hover gradient-border">
              <h2 className="text-xl font-bold mb-6">Competency Overview</h2>
              <div className="aspect-square w-full max-w-2xl mx-auto">
                <Radar
                  data={skillData.radarChart}
                  options={{
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          stepSize: 20
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <h2 className="text-xl font-bold mb-6">Quick Stats</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-medium">72%</span>
                  </div>
                  <Progress value={72} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Skills Above Average</span>
                    <span className="font-medium">4/6</span>
                  </div>
                  <Progress value={66} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Growth Rate</span>
                    <span className="font-medium">+15%</span>
                  </div>
                  <Progress value={15} />
                </div>
              </div>
            </Card>
          </div>

          {/* Individual Skill Breakdown */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Individual Skill Breakdown</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {skillData.individualSkills.map((skill) => (
                <Card
                  key={skill.id}
                  className={`p-6 card-hover gradient-border cursor-pointer transition-all ${
                    selectedSkill === skill.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedSkill(skill.id === selectedSkill ? null : skill.id)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 rounded-full p-2">
                      <skill.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">{skill.name}</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Your Level</span>
                        <span className="text-sm font-medium">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="bg-primary/20" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Industry Average</span>
                        <span className="text-sm font-medium">{skill.industryAvg}%</span>
                      </div>
                      <Progress value={skill.industryAvg} className="bg-secondary/20" />
                    </div>

                    {selectedSkill === skill.id && (
                      <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Sub-skills</h4>
                          {skill.subSkills.map((subSkill, index) => (
                            <div key={index}>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-muted-foreground">{subSkill.name}</span>
                                <span className="text-sm font-medium">{subSkill.progress}%</span>
                              </div>
                              <Progress value={subSkill.progress} className="h-1" />
                            </div>
                          ))}
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2">Validations</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {skill.validations.map((validation, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                {validation}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2">Recommended Next Steps</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {skill.recommendations.map((recommendation, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-primary" />
                                {recommendation}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Market Insights */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Market Insights</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {skillData.marketInsights.map((insight, index) => (
                <Card key={index} className="p-6 card-hover gradient-border">
                  <h3 className="font-semibold mb-4">{insight.skill}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Market Demand</span>
                      <span className="text-sm font-medium">{insight.demand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Growth Rate</span>
                      <span className="text-sm font-medium text-green-500">{insight.growthRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg. Salary</span>
                      <span className="text-sm font-medium">{insight.avgSalary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Freelance Rate</span>
                      <span className="text-sm font-medium">{insight.freelanceRate}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">Top Employers</span>
                      <div className="flex flex-wrap gap-1">
                        {insight.topEmployers.map((employer, i) => (
                          <span
                            key={i}
                            className="text-xs bg-accent px-2 py-1 rounded-full"
                          >
                            {employer}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <Card className="p-8 bg-gradient-to-r from-orange-50 to-teal-50">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Level Up Your Skills?</h2>
              <p className="text-muted-foreground mb-6">
                Explore personalized learning paths and start building the skills that matter most in today's digital economy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-orange-600 to-orange-500" asChild>
                  <Link href="/courses">Explore Courses</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/mentorship">Find a Mentor</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
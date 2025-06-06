"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, BookOpen, Star, Trophy, Target, Flame, Share2, Download, Linkedin as LinkedIn, Facebook, Twitter, CheckCircle, Calendar, TrendingUp, Users, Brain, Zap, Crown, Shield, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock achievements data
const achievements = {
  stats: {
    totalBadges: 24,
    rareAchievements: 8,
    currentStreak: 15,
    longestStreak: 30,
    totalXP: 15000,
    level: 12
  },
  badges: [
    {
      id: 1,
      title: "Digital Marketing Master",
      description: "Completed all digital marketing courses with distinction",
      icon: Target,
      rarity: "Legendary",
      earnedDate: "2024-02-15",
      category: "Course Completion",
      xp: 1000,
      shared: true
    },
    {
      id: 2,
      title: "Community Champion",
      description: "Helped 50+ students in discussion forums",
      icon: Users,
      rarity: "Epic",
      earnedDate: "2024-02-10",
      category: "Community",
      xp: 750,
      shared: false
    },
    {
      id: 3,
      title: "Fast Learner",
      description: "Completed 5 courses in one month",
      icon: Zap,
      rarity: "Rare",
      earnedDate: "2024-01-20",
      category: "Learning Speed",
      xp: 500,
      shared: true
    }
  ],
  certificates: [
    {
      id: 1,
      title: "Digital Marketing Professional",
      issueDate: "2024-02-15",
      validUntil: "2027-02-15",
      credentialId: "DMP-2024-001",
      verificationUrl: "https://verify.taboracademy.com/DMP-2024-001",
      thumbnail: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea604"
    },
    {
      id: 2,
      title: "E-commerce Business Expert",
      issueDate: "2024-01-10",
      validUntil: "2027-01-10",
      credentialId: "EBE-2024-002",
      verificationUrl: "https://verify.taboracademy.com/EBE-2024-002",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
    }
  ],
  milestones: [
    {
      id: 1,
      title: "First Course Completed",
      date: "2023-12-01",
      reward: "Bronze Scholar Badge",
      description: "Successfully completed Digital Marketing Basics"
    },
    {
      id: 2,
      title: "10 Hours of Learning",
      date: "2023-12-15",
      reward: "Dedicated Learner Badge",
      description: "Invested 10 hours in skill development"
    },
    {
      id: 3,
      title: "First Business Project",
      date: "2024-01-05",
      reward: "Project Pioneer Badge",
      description: "Launched first e-commerce project"
    }
  ],
  streaks: {
    current: {
      days: 15,
      averageHours: 2.5,
      consistency: "85%",
      nextMilestone: "20 Days"
    },
    history: [
      { week: "Week 1", hours: 12 },
      { week: "Week 2", hours: 15 },
      { week: "Week 3", hours: 10 },
      { week: "Week 4", hours: 18 }
    ]
  },
  leaderboard: [
    {
      rank: 1,
      name: "Sarah K.",
      xp: 25000,
      badges: 45,
      streak: 60
    },
    {
      rank: 2,
      name: "John O.",
      xp: 23500,
      badges: 42,
      streak: 45
    },
    {
      rank: 3,
      name: "Grace M.",
      xp: 22000,
      badges: 40,
      streak: 30
    }
  ]
}

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  const filterBadges = () => {
    if (!selectedCategory) return achievements.badges
    return achievements.badges.filter(badge => badge.category === selectedCategory)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Achievement Overview */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-6">
              Your Achievements
            </h1>
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="p-6 card-hover gradient-border">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 rounded-full p-3">
                    <Trophy className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Badges</p>
                    <p className="text-2xl font-bold">{achievements.stats.totalBadges}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 card-hover gradient-border">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 rounded-full p-3">
                    <Crown className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rare Achievements</p>
                    <p className="text-2xl font-bold">{achievements.stats.rareAchievements}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 card-hover gradient-border">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Flame className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                    <p className="text-2xl font-bold">{achievements.stats.currentStreak} Days</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 card-hover gradient-border">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 rounded-full p-3">
                    <Brain className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total XP</p>
                    <p className="text-2xl font-bold">{achievements.stats.totalXP}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Achievement Gallery */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Achievement Gallery</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory(null)}
                  className={!selectedCategory ? "bg-accent" : ""}
                >
                  All
                </Button>
                {["Course Completion", "Community", "Learning Speed"].map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-accent" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {filterBadges().map((badge) => (
                <Card key={badge.id} className="p-6 card-hover gradient-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`rounded-full p-3 ${
                      badge.rarity === "Legendary" ? "bg-orange-100" :
                      badge.rarity === "Epic" ? "bg-purple-100" :
                      "bg-blue-100"
                    }`}>
                      <badge.icon className={`h-6 w-6 ${
                        badge.rarity === "Legendary" ? "text-orange-500" :
                        badge.rarity === "Epic" ? "text-purple-500" :
                        "text-blue-500"
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{badge.title}</h3>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-1 rounded-full ${
                      badge.rarity === "Legendary" ? "bg-orange-100 text-orange-700" :
                      badge.rarity === "Epic" ? "bg-purple-100 text-purple-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {badge.rarity}
                    </span>
                    <span className="text-muted-foreground">
                      Earned {new Date(badge.earnedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">+{badge.xp} XP</span>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Certificates */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Certificates</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.certificates.map((certificate) => (
                <Card key={certificate.id} className="p-6 card-hover gradient-border">
                  <div className="flex gap-6">
                    <div className="relative w-32 h-32 flex-shrink-0">
                      <Image
                        src={certificate.thumbnail}
                        alt={certificate.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{certificate.title}</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Issued: {new Date(certificate.issueDate).toLocaleDateString()}</p>
                        <p>Valid until: {new Date(certificate.validUntil).toLocaleDateString()}</p>
                        <p>Credential ID: {certificate.credentialId}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Shield className="h-4 w-4" />
                          Verify
                        </Button>
                        <Button variant="outline" size="sm">
                          <LinkedIn className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Learning Streaks */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Learning Streaks</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 card-hover gradient-border">
                <h3 className="font-semibold mb-4">Current Streak</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Days</span>
                    <span className="font-bold">{achievements.streaks.current.days}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Average Hours/Day</span>
                    <span className="font-bold">{achievements.streaks.current.averageHours}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Consistency</span>
                    <span className="font-bold">{achievements.streaks.current.consistency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Next Milestone</span>
                    <span className="font-bold">{achievements.streaks.current.nextMilestone}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 card-hover gradient-border">
                <h3 className="font-semibold mb-4">Weekly Progress</h3>
                <div className="space-y-4">
                  {achievements.streaks.history.map((week, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">{week.week}</span>
                        <span className="text-sm">{week.hours} hours</span>
                      </div>
                      <Progress value={(week.hours / 20) * 100} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Achievement Leaderboard</h2>
            <Card className="p-6">
              <div className="space-y-4">
                {achievements.leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      entry.rank === 1 ? 'bg-orange-50' :
                      entry.rank === 2 ? 'bg-gray-50' :
                      entry.rank === 3 ? 'bg-amber-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        entry.rank === 1 ? 'bg-orange-100 text-orange-600' :
                        entry.rank === 2 ? 'bg-gray-100 text-gray-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {entry.rank}
                      </div>
                      <div>
                        <p className="font-medium">{entry.name}</p>
                        <p className="text-sm text-muted-foreground">{entry.xp} XP</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{entry.badges}</p>
                        <p className="text-sm text-muted-foreground">Badges</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{entry.streak}</p>
                        <p className="text-sm text-muted-foreground">Day Streak</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Next Achievements */}
          <Card className="p-8 bg-gradient-to-r from-orange-50 to-teal-50">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Earn More Achievements?</h2>
              <p className="text-muted-foreground mb-6">
                Complete courses, participate in the community, and maintain your learning streak to unlock more badges and rewards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-orange-600 to-orange-500" asChild>
                  <Link href="/courses">Continue Learning</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/community">Join Discussions</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
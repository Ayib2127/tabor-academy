"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Search,
  Trophy,
  Users,
  Calendar,
  Clock,
  Target,
  Filter,
  Share2,
  Star,
  Heart,
  Award,
  Gift,
  TrendingUp,
  CheckCircle,
  Timer,
  BarChart,
  Zap,
  Crown,
  Medal,
  Flag
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock challenges data
const challengesData = {
  featured: [
    {
      id: 1,
      title: "Digital Marketing Challenge 2024",
      description: "Create and execute a digital marketing campaign for a local business",
      category: "Digital Marketing",
      participants: 156,
      duration: "4 weeks",
      startDate: "2024-03-15",
      endDate: "2024-04-15",
      prizes: [
        "Full Digital Marketing Course Scholarship",
        "$500 Marketing Budget",
        "1-on-1 Mentoring Sessions"
      ],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      sponsor: {
        name: "Ethiopian Digital Marketing Association",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623"
      },
      status: "upcoming",
      difficulty: "Intermediate"
    },
    {
      id: 2,
      title: "E-commerce Innovation Challenge",
      description: "Build a unique e-commerce solution addressing local market needs",
      category: "E-commerce",
      participants: 98,
      duration: "6 weeks",
      startDate: "2024-03-01",
      endDate: "2024-04-15",
      prizes: [
        "$1000 Seed Funding",
        "Business Incubation Program",
        "Tech Stack Credits"
      ],
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      sponsor: {
        name: "Ethiopian E-commerce Alliance",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623"
      },
      status: "active",
      difficulty: "Advanced"
    }
  ],
  categories: [
    {
      id: "business",
      name: "Business & Entrepreneurship",
      count: 12,
      icon: BarChart
    },
    {
      id: "tech",
      name: "Technology & Innovation",
      count: 8,
      icon: Zap
    },
    {
      id: "creative",
      name: "Creative & Design",
      count: 6,
      icon: Heart
    },
    {
      id: "social",
      name: "Social Impact",
      count: 5,
      icon: Users
    }
  ],
  active: [
    {
      id: 3,
      title: "No-Code App Challenge",
      description: "Build a community app using no-code tools",
      category: "Technology",
      participants: 75,
      duration: "3 weeks",
      progress: 60,
      endDate: "2024-03-30",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      difficulty: "Beginner"
    },
    {
      id: 4,
      title: "Social Impact Challenge",
      description: "Create a solution for local community challenges",
      category: "Social Impact",
      participants: 120,
      duration: "8 weeks",
      progress: 30,
      endDate: "2024-04-30",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd",
      difficulty: "Intermediate"
    }
  ],
  leaderboard: [
    {
      rank: 1,
      name: "Sarah Kimani",
      points: 2500,
      challenges: 8,
      wins: 3,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
    },
    {
      rank: 2,
      name: "John Okafor",
      points: 2200,
      challenges: 6,
      wins: 2,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    },
    {
      rank: 3,
      name: "Grace Mensah",
      points: 2000,
      challenges: 7,
      wins: 2,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
    }
  ],
  upcoming: [
    {
      id: 5,
      title: "Mobile Money Innovation",
      startDate: "2024-04-01",
      participants: 0,
      category: "Fintech",
      prize: "$2000 in prizes",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
    },
    {
      id: 6,
      title: "Sustainable Business Challenge",
      startDate: "2024-04-15",
      participants: 0,
      category: "Sustainability",
      prize: "Incubation Program",
      image: "https://images.unsplash.com/photo-1535551951406-a19828b0a76b"
    }
  ]
}

export default function ChallengesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                Community Challenges
              </h1>
              <p className="text-muted-foreground">
                Compete, learn, and win prizes while building real-world solutions
              </p>
            </div>
            <Button className="bg-gradient-to-r from-orange-600 to-orange-500">
              <Trophy className="h-4 w-4 mr-2" />
              Create Challenge
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select className="p-2 border rounded-md">
              <option value="all">All Categories</option>
              <option value="business">Business</option>
              <option value="tech">Technology</option>
              <option value="creative">Creative</option>
              <option value="social">Social Impact</option>
            </select>
            <select className="p-2 border rounded-md">
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Featured Challenges */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Challenges</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {challengesData.featured.map((challenge) => (
                <Card key={challenge.id} className="overflow-hidden card-hover gradient-border">
                  <div className="relative h-48">
                    <Image
                      src={challenge.image}
                      alt={challenge.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 right-4">
                      {challenge.status === "upcoming" ? (
                        <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                          Upcoming
                        </div>
                      ) : (
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                          Active
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-semibold text-white mb-1">{challenge.title}</h3>
                      <p className="text-white/80 text-sm">{challenge.description}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Image
                        src={challenge.sponsor.logo}
                        alt={challenge.sponsor.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-medium">{challenge.sponsor.name}</p>
                        <p className="text-sm text-muted-foreground">Challenge Sponsor</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Participants</p>
                        <p className="font-medium">{challenge.participants}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-medium">{challenge.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p className="font-medium">
                          {new Date(challenge.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Difficulty</p>
                        <p className="font-medium">{challenge.difficulty}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-6">
                      <h4 className="font-medium">Prizes</h4>
                      {challenge.prizes.map((prize, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">{prize}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        {challenge.status === "upcoming" ? "Register Now" : "Join Challenge"}
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Challenge Categories</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {challengesData.categories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-center gap-2 ${
                    selectedCategory === category.id ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <category.icon className="h-8 w-8" />
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-xs text-muted-foreground">{category.count} challenges</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Active Challenges */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Active Challenges</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {challengesData.active.map((challenge) => (
                <Card key={challenge.id} className="p-6 card-hover gradient-border">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={challenge.image}
                        alt={challenge.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>
                      <div className="space-y-2">
                        <Progress value={challenge.progress} className="mb-2" />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span>{challenge.progress}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{challenge.participants} participants</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{challenge.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Challenge Champions</h2>
            <Card className="p-6">
              <div className="space-y-4">
                {challengesData.leaderboard.map((entry) => (
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
                      <Image
                        src={entry.image}
                        alt={entry.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-medium">{entry.name}</p>
                        <p className="text-sm text-muted-foreground">{entry.points} points</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{entry.challenges}</p>
                        <p className="text-sm text-muted-foreground">Challenges</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{entry.wins}</p>
                        <p className="text-sm text-muted-foreground">Wins</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Upcoming Challenges */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Coming Soon</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {challengesData.upcoming.map((challenge) => (
                <Card key={challenge.id} className="p-6 card-hover gradient-border">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={challenge.image}
                        alt={challenge.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{challenge.title}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Starts {new Date(challenge.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          <span>{challenge.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4" />
                          <span>{challenge.prize}</span>
                        </div>
                      </div>
                      <Button className="mt-4">Get Notified</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <Card className="p-8 bg-gradient-to-r from-orange-50 to-teal-50">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Take on a Challenge?</h2>
              <p className="text-muted-foreground mb-6">
                Join our community challenges to learn, compete, and win prizes while building real-world solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-orange-600 to-orange-500">
                  Browse Challenges
                </Button>
                <Button variant="outline">
                  Create Challenge
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
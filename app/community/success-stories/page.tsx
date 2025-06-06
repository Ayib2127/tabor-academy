"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Search,
  Trophy,
  Star,
  Heart,
  Share2,
  ThumbsUp,
  MessageSquare,
  Filter,
  TrendingUp,
  BarChart3,
  ShoppingCart,
  Code,
  Coins,
  Laptop,
  Target,
  Award,
  Rocket,
  ArrowUp
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock success stories data
const successStoriesData = {
  featured: [
    {
      id: 1,
      title: "From Local Shop to E-commerce Success",
      author: {
        name: "Sarah Kimani",
        location: "Nairobi, Kenya",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
      },
      category: "E-commerce",
      story: "Started with a small local shop and transformed it into a thriving online business serving customers across East Africa.",
      impact: {
        revenue: "+300%",
        customers: "10,000+",
        countries: "5+"
      },
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      likes: 245,
      comments: 56,
      shares: 34,
      featured: true,
      courses: ["Digital Marketing Mastery", "E-commerce Fundamentals"],
      tags: ["e-commerce", "digital-transformation", "success"]
    },
    {
      id: 2,
      title: "Building a Digital Marketing Agency",
      author: {
        name: "John Okafor",
        location: "Lagos, Nigeria",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
      },
      category: "Digital Marketing",
      story: "Leveraged skills learned from Tabor Academy to start a digital marketing agency now serving over 50 clients.",
      impact: {
        clients: "50+",
        projects: "200+",
        growth: "+250%"
      },
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      likes: 189,
      comments: 42,
      shares: 28,
      featured: true,
      courses: ["Digital Marketing Mastery", "Business Strategy"],
      tags: ["digital-marketing", "agency", "entrepreneurship"]
    }
  ],
  categories: [
    {
      id: "e-commerce",
      name: "E-commerce Success",
      count: 156,
      icon: ShoppingCart
    },
    {
      id: "digital-marketing",
      name: "Digital Marketing",
      count: 124,
      icon: BarChart3
    },
    {
      id: "tech",
      name: "Tech & Innovation",
      count: 98,
      icon: Code
    },
    {
      id: "finance",
      name: "Financial Growth",
      count: 87,
      icon: Coins
    }
  ],
  recent: [
    {
      id: 3,
      title: "Launching My First Mobile App",
      author: {
        name: "Grace Mensah",
        location: "Accra, Ghana",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
      },
      category: "Tech",
      story: "Used no-code tools to build and launch a community app that now has over 5,000 users.",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      likes: 156,
      comments: 34,
      shares: 21,
      courses: ["No-Code Development", "App Marketing"],
      tags: ["no-code", "app-development", "tech"]
    },
    {
      id: 4,
      title: "Growing My Freelance Business",
      author: {
        name: "David Kamau",
        location: "Nairobi, Kenya",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
      },
      category: "Freelancing",
      story: "Transitioned from a 9-5 job to a successful freelance career serving international clients.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
      likes: 134,
      comments: 28,
      shares: 19,
      courses: ["Freelance Success", "Digital Skills"],
      tags: ["freelancing", "digital-skills", "remote-work"]
    }
  ],
  trending: [
    {
      id: 5,
      title: "Mobile Money Innovation",
      author: {
        name: "Emmanuel Kwesi",
        location: "Accra, Ghana",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
      },
      category: "Fintech",
      story: "Developed a mobile money solution for local businesses",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
      trending: true
    },
    {
      id: 6,
      title: "Community Education Platform",
      author: {
        name: "Amina Hassan",
        location: "Dar es Salaam, Tanzania",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
      },
      category: "EdTech",
      story: "Created an online platform connecting local tutors with students",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      trending: true
    }
  ],
  metrics: {
    totalStories: 1250,
    totalImpact: {
      businesses: 850,
      jobs: 3500,
      revenue: "$5M+"
    },
    categories: {
      ecommerce: 35,
      marketing: 28,
      tech: 22,
      other: 15
    }
  }
}

export default function SuccessStoriesPage() {
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
                Success Stories
              </h1>
              <p className="text-muted-foreground">
                Inspiring stories from our community of African entrepreneurs
              </p>
            </div>
            <Button className="bg-gradient-to-r from-orange-600 to-orange-500">
              <Trophy className="h-4 w-4 mr-2" />
              Share Your Story
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search success stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select className="p-2 border rounded-md">
              <option value="all">All Categories</option>
              <option value="e-commerce">E-commerce</option>
              <option value="marketing">Digital Marketing</option>
              <option value="tech">Technology</option>
              <option value="finance">Finance</option>
            </select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Impact Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 card-hover gradient-border">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 rounded-full p-3">
                  <Rocket className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success Stories</p>
                  <p className="text-2xl font-bold">{successStoriesData.metrics.totalStories}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <ShoppingCart className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Businesses Impacted</p>
                  <p className="text-2xl font-bold">{successStoriesData.metrics.totalImpact.businesses}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 rounded-full p-3">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Jobs Created</p>
                  <p className="text-2xl font-bold">{successStoriesData.metrics.totalImpact.jobs}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 rounded-full p-3">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue Generated</p>
                  <p className="text-2xl font-bold">{successStoriesData.metrics.totalImpact.revenue}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Featured Stories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Success Stories</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {successStoriesData.featured.map((story) => (
                <Card key={story.id} className="overflow-hidden card-hover gradient-border">
                  <div className="relative h-48">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                        Featured
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-semibold text-white mb-1">{story.title}</h3>
                      <p className="text-white/80 text-sm">{story.category}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Image
                        src={story.author.image}
                        alt={story.author.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-medium">{story.author.name}</p>
                        <p className="text-sm text-muted-foreground">{story.author.location}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6">{story.story}</p>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {Object.entries(story.impact).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-sm text-muted-foreground">{key}</p>
                          <p className="font-semibold">{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {story.courses.map((course, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-accent rounded-full text-xs"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          {story.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {story.comments}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          {story.shares}
                        </Button>
                      </div>
                      <Button>Read Full Story</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {successStoriesData.categories.map((category) => (
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
                  <span className="text-xs text-muted-foreground">{category.count} stories</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Recent Stories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Recent Success Stories</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {successStoriesData.recent.map((story) => (
                <Card key={story.id} className="p-6 card-hover gradient-border">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Image
                          src={story.author.image}
                          alt={story.author.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span className="font-medium">{story.author.name}</span>
                      </div>
                      <h3 className="font-semibold mb-2">{story.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{story.story}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {story.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-accent rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{story.likes} likes</span>
                        <span>{story.comments} comments</span>
                        <span>{story.shares} shares</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Trending Stories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {successStoriesData.trending.map((story) => (
                <Card key={story.id} className="p-6 card-hover gradient-border">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Image
                            src={story.author.image}
                            alt={story.author.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span className="font-medium">{story.author.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-orange-500">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm">Trending</span>
                        </div>
                      </div>
                      <h3 className="font-semibold mb-2">{story.title}</h3>
                      <p className="text-sm text-muted-foreground">{story.story}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <Card className="p-8 bg-gradient-to-r from-orange-50 to-teal-50">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Share Your Success Story</h2>
              <p className="text-muted-foreground mb-6">
                Inspire others by sharing your entrepreneurial journey and success with our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-orange-600 to-orange-500">
                  Share Your Story
                </Button>
                <Button variant="outline">
                  View Guidelines
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
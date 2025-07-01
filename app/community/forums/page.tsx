"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Bell,
  PlusCircle,
  Filter,
  MessageSquare,
  Eye,
  ArrowUp,
  Bookmark,
  Share2,
  Tag,
  Users,
  Clock,
  Flame,
  CheckCircle,
  BarChart3,
  ShoppingCart,
  Code,
  Coins,
  Laptop,
  HelpCircle
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock forum data
const forumData = {
  categories: [
    {
      id: "digital-marketing",
      icon: BarChart3,
      name: "Digital Marketing & Social Media",
      description: "Discuss digital marketing strategies and social media management",
      threads: 156,
      posts: 1243
    },
    {
      id: "ecommerce",
      icon: ShoppingCart,
      name: "E-commerce & Business",
      description: "Share experiences in running online businesses",
      threads: 98,
      posts: 876
    },
    {
      id: "no-code",
      icon: Code,
      name: "No-Code Development",
      description: "Build apps and websites without coding",
      threads: 75,
      posts: 654
    },
    {
      id: "finance",
      icon: Coins,
      name: "Financial Literacy",
      description: "Learn about business finance and money management",
      threads: 112,
      posts: 987
    },
    {
      id: "tech",
      icon: Laptop,
      name: "Technical Support",
      description: "Get help with technical issues",
      threads: 45,
      posts: 432
    }
  ],
  discussions: [
    {
      id: 1,
      title: "How to increase social media engagement in Ethiopian markets?",
      author: {
        name: "Sarah Kimani",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        reputation: 1250
      },
      category: "digital-marketing",
      tags: ["social-media", "engagement", "Ethiopia"],
      replies: 24,
      views: 1560,
      upvotes: 45,
      solved: true,
      lastActivity: "2024-02-29T10:30:00",
      preview: "I'm looking for strategies specifically tailored for Ethiopian audiences..."
    },
    {
      id: 2,
      title: "Mobile money integration with WooCommerce",
      author: {
        name: "John Okafor",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        reputation: 890
      },
      category: "ecommerce",
      tags: ["mobile-money", "woocommerce", "payments"],
      replies: 18,
      views: 980,
      upvotes: 32,
      solved: false,
      lastActivity: "2024-02-29T09:15:00",
      preview: "Need help setting up M-Pesa integration with my online store..."
    },
    {
      id: 3,
      title: "Building a marketplace app with Bubble.io",
      author: {
        name: "Grace Mensah",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
        reputation: 675
      },
      category: "no-code",
      tags: ["bubble", "marketplace", "no-code"],
      replies: 15,
      views: 845,
      upvotes: 28,
      solved: true,
      lastActivity: "2024-02-29T08:45:00",
      preview: "Step-by-step guide on creating a marketplace app..."
    }
  ]
}

export default function ForumsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      try {
        setIsLoading(true)
        // Here you would typically fetch data from your API
        // For now, we're using mock data
        await new Promise(resolve => setTimeout(resolve, 500))
        setIsLoading(false)
      } catch (err) {
        setError('Failed to load forum data')
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6">
            <Card className="p-6">
              <p className="text-red-500">{error}</p>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6">
            <Card className="p-6">
              <p>Loading forum data...</p>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Forum Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                Community Forums
              </h1>
              <p className="text-muted-foreground">
                Connect, learn, and share with fellow entrepreneurs across Ethiopia
              </p>
            </div>
            <Button className="bg-gradient-to-r from-orange-600 to-orange-500">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Discussion
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1 space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Categories */}
              <Card className="p-4">
                <h2 className="font-semibold mb-4">Categories</h2>
                <div className="space-y-2">
                  {forumData.categories.map((category) => (
                    <Button
                      key={category.id}
                      variant="ghost"
                      className={`w-full justify-start ${
                        selectedCategory === category.id ? "bg-accent" : ""
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <category.icon className="h-4 w-4 mr-2" />
                      <span className="truncate">{category.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {category.threads}
                      </span>
                    </Button>
                  ))}
                </div>
              </Card>

              {/* Quick Links */}
              <Card className="p-4">
                <h2 className="font-semibold mb-4">Quick Links</h2>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <Flame className="h-4 w-4 mr-2" />
                    Popular Discussions
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Clock className="h-4 w-4 mr-2" />
                    Recent Activity
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Solved Questions
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Bookmarked
                  </Button>
                </div>
              </Card>

              {/* Help Section */}
              <Card className="p-4">
                <h2 className="font-semibold mb-4">Need Help?</h2>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Forum Guidelines
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              {/* Tabs and Filters */}
              <div className="flex items-center justify-between mb-6">
                <Tabs defaultValue="all" className="w-[400px]">
                  <TabsList>
                    <TabsTrigger value="all">All Discussions</TabsTrigger>
                    <TabsTrigger value="my">My Topics</TabsTrigger>
                    <TabsTrigger value="following">Following</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="flex items-center gap-2">
                  <select className="p-2 border rounded-md">
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                    <option value="unanswered">Unanswered</option>
                  </select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Discussion List */}
              <div className="space-y-4">
                {forumData.discussions.map((discussion) => (
                  <Card key={discussion.id} className="p-6 card-hover gradient-border">
                    <div className="flex gap-4">
                      <Image
                        src={discussion.author.image}
                        alt={discussion.author.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Link
                              href={`/community/forums/discussion/${discussion.id}`}
                              className="text-lg font-semibold hover:text-primary"
                            >
                              {discussion.title}
                            </Link>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{discussion.author.name}</span>
                              <span>•</span>
                              <span>
                                {new Date(discussion.lastActivity).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {discussion.solved && (
                            <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              Solved
                            </div>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-4">{discussion.preview}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{discussion.replies} replies</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{discussion.views} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ArrowUp className="h-4 w-4" />
                            <span>{discussion.upvotes} upvotes</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          {discussion.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-accent rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
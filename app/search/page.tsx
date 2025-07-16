"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronRight,
  Search,
  Mic,
  Filter,
  ArrowUpDown,
  BookOpen,
  Video,
  FileText,
  Users,
  MessageSquare,
  Star,
  Clock,
  Eye,
  AlertCircle,
  BarChart,
  HelpCircle,
  X,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { withDefault, DEFAULT_BANNER_URL } from "@/lib/defaults";

export default function SearchResultsPage() {
  const [searchQuery, setSearchQuery] = useState("digital marketing")
  const [activeTab, setActiveTab] = useState("all")
  const [appliedFilters, setAppliedFilters] = useState([
    "Course",
    "Beginner",
    "English"
  ])

  // Mock search results data
  const searchResults = {
    total: 156,
    searchTime: 0.24,
    categories: {
      all: 156,
      courses: 45,
      lessons: 68,
      resources: 28,
      community: 15
    },
    filters: {
      contentType: ["Course", "Lesson", "Resource", "Discussion"],
      level: ["Beginner", "Intermediate", "Advanced"],
      duration: ["0-1 hour", "1-3 hours", "3+ hours"],
      language: ["English", "French", "Swahili"],
      instructor: ["Grace Mensah", "John Okafor", "Sarah Kimani"],
      rating: ["4+ stars", "3+ stars"]
    },
    results: [
      {
        id: "course-001",
        type: "course",
        title: "Digital Marketing Fundamentals",
        description: "Learn the basics of digital marketing including social media, SEO, and content strategy",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
        instructor: "Grace Mensah",
        rating: 4.8,
        reviews: 245,
        duration: "6 hours",
        level: "Beginner"
      },
      {
        id: "lesson-001",
        type: "lesson",
        title: "Social Media Strategy Planning",
        description: "Create effective social media strategies for business growth",
        thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113",
        course: "Digital Marketing Fundamentals",
        duration: "45 minutes",
        progress: 0
      },
      {
        id: "resource-001",
        type: "resource",
        title: "Marketing Campaign Template",
        description: "Ready-to-use template for planning marketing campaigns",
        downloads: 1250,
        rating: 4.6,
        fileType: "PDF & Excel"
      },
      {
        id: "discussion-001",
        type: "discussion",
        title: "Best practices for Facebook Ads in 2024",
        author: "John Okafor",
        replies: 28,
        lastActive: "2 hours ago",
        tags: ["facebook-ads", "social-media"]
      }
    ],
    popularSearches: [
      "social media marketing",
      "SEO basics",
      "content creation",
      "email marketing"
    ],
    relatedTopics: [
      "Facebook Ads",
      "Instagram Marketing",
      "Google Analytics",
      "Content Strategy"
    ]
  }

  const handleRemoveFilter = (filter: string) => {
    setAppliedFilters(appliedFilters.filter(f => f !== filter))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Search Interface */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  placeholder="Search courses, lessons, resources..."
                />
              </div>
              <Button variant="outline" size="icon">
                <Mic className="h-4 w-4" />
              </Button>
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            {/* Applied Filters */}
            <div className="flex items-center gap-2">
              {appliedFilters.map((filter) => (
                <div
                  key={filter}
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent text-sm"
                >
                  <span>{filter}</span>
                  <button
                    onClick={() => handleRemoveFilter(filter)}
                    className="hover:text-primary"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="text-primary">
                Clear All
              </Button>
            </div>
          </div>

          {/* Search Stats */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {searchResults.total} results ({searchResults.searchTime} seconds)
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filter Panel */}
            <Card className="p-6 lg:col-span-1 h-fit">
              <h2 className="font-semibold mb-4">Filters</h2>
              <div className="space-y-6">
                {Object.entries(searchResults.filters).map(([category, options]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="text-sm font-medium capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <div className="space-y-1">
                      {options.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-2 text-sm hover:text-primary"
                        >
                          <input
                            type="checkbox"
                            checked={appliedFilters.includes(option)}
                            className="rounded border-gray-300"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Results Tabs */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">
                    All ({searchResults.categories.all})
                  </TabsTrigger>
                  <TabsTrigger value="courses">
                    Courses ({searchResults.categories.courses})
                  </TabsTrigger>
                  <TabsTrigger value="lessons">
                    Lessons ({searchResults.categories.lessons})
                  </TabsTrigger>
                  <TabsTrigger value="resources">
                    Resources ({searchResults.categories.resources})
                  </TabsTrigger>
                  <TabsTrigger value="community">
                    Community ({searchResults.categories.community})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 mt-6">
                  {searchResults.results.map((result) => (
                    <Card key={result.id} className="p-4">
                      {result.type === "course" && (
                        <div className="flex gap-4">
                          <div className="w-48 h-32 relative rounded-lg overflow-hidden">
                            <Image
                              src={result.thumbnail}
                              alt={result.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <BookOpen className="h-4 w-4 text-primary" />
                              <span className="text-sm text-muted-foreground">Course</span>
                            </div>
                            <h3 className="font-medium mb-1">{result.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {result.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span>{result.instructor}</span>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                                <span>{result.rating}</span>
                                <span className="text-muted-foreground ml-1">
                                  ({result.reviews} reviews)
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{result.duration}</span>
                              </div>
                            </div>
                          </div>
                          <Button className="self-center">
                            Start Learning
                          </Button>
                        </div>
                      )}

                      {result.type === "lesson" && (
                        <div className="flex gap-4">
                          <div className="w-48 h-32 relative rounded-lg overflow-hidden">
                            <Image
                              src={withDefault(result.thumbnail, DEFAULT_BANNER_URL)}
                              alt={result.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Video className="h-4 w-4 text-primary" />
                              <span className="text-sm text-muted-foreground">Lesson</span>
                            </div>
                            <h3 className="font-medium mb-1">{result.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {result.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span>From: {result.course}</span>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{result.duration}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" className="self-center">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      )}

                      {result.type === "resource" && (
                        <div className="flex items-center gap-4">
                          <FileText className="h-12 w-12 text-primary" />
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">{result.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {result.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span>{result.fileType}</span>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                                <span>{result.rating}</span>
                              </div>
                              <span>{result.downloads} downloads</span>
                            </div>
                          </div>
                          <Button variant="outline">
                            Download
                          </Button>
                        </div>
                      )}

                      {result.type === "discussion" && (
                        <div className="flex items-start gap-4">
                          <MessageSquare className="h-8 w-8 text-primary" />
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">{result.title}</h3>
                            <div className="flex items-center gap-4 text-sm">
                              <span>By {result.author}</span>
                              <span>{result.replies} replies</span>
                              <span className="text-muted-foreground">
                                Last active {result.lastActive}
                              </span>
                            </div>
                            <div className="flex gap-2 mt-2">
                              {result.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 rounded-full bg-accent text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <Button variant="outline">
                            Join Discussion
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>

              {/* No Results Section */}
              {searchResults.results.length === 0 && (
                <Card className="p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Results Found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filters to find what you're looking for
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Popular Searches</h4>
                      <div className="flex flex-wrap gap-2">
                        {searchResults.popularSearches.map((search) => (
                          <Button
                            key={search}
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                          >
                            {search}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full sm:w-auto">
                      Browse All Courses
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Search Analytics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Popular Searches</h3>
                  <p className="text-sm text-muted-foreground">
                    Trending topics
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {searchResults.popularSearches.map((search) => (
                  <Button
                    key={search}
                    variant="outline"
                    className="w-full justify-between"
                  >
                    {search}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Need Help?</h3>
                  <p className="text-sm text-muted-foreground">
                    Search support
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/help/search">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Search Tips
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/help/contact">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Support
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
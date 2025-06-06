"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ChevronRight,
  Search,
  FileText,
  Download,
  Star,
  Filter,
  ArrowUpDown,
  BookOpen,
  BarChart,
  Briefcase,
  PenTool,
  FileCode,
  Scale,
  Layout,
  Share2,
  Eye,
  ThumbsUp,
  MessageSquare,
  Plus,
  FolderPlus,
  Settings,
  HelpCircle,
  ExternalLink,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ResourceLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")

  // Mock data
  const categories = [
    { id: "business", name: "Business Templates", icon: Briefcase },
    { id: "marketing", name: "Marketing Tools", icon: BarChart },
    { id: "development", name: "Development Resources", icon: FileCode },
    { id: "financial", name: "Financial Planning", icon: Scale },
    { id: "legal", name: "Legal Documents", icon: FileText },
    { id: "design", name: "Design Assets", icon: Layout }
  ]

  const featuredResources = [
    {
      id: "res-001",
      title: "Business Plan Template Pack",
      category: "Business Templates",
      thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
      downloads: 1250,
      rating: 4.8,
      type: "Template",
      isPremium: true
    },
    {
      id: "res-002",
      title: "Social Media Marketing Kit",
      category: "Marketing Tools",
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113",
      downloads: 980,
      rating: 4.6,
      type: "Tool",
      isPremium: false
    },
    {
      id: "res-003",
      title: "Financial Projection Spreadsheet",
      category: "Financial Planning",
      thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
      downloads: 750,
      rating: 4.7,
      type: "Template",
      isPremium: true
    }
  ]

  const templates = [
    {
      id: "temp-001",
      title: "Startup Business Plan",
      category: "Business",
      format: "PDF & Word",
      downloads: 850,
      rating: 4.5
    },
    {
      id: "temp-002",
      title: "Marketing Campaign Planner",
      category: "Marketing",
      format: "Excel",
      downloads: 620,
      rating: 4.3
    },
    {
      id: "temp-003",
      title: "Invoice Template",
      category: "Financial",
      format: "PDF & Excel",
      downloads: 1100,
      rating: 4.7
    }
  ]

  const tools = [
    {
      id: "tool-001",
      name: "SEO Analyzer",
      category: "Marketing",
      pricing: "Free",
      rating: 4.6,
      users: 2500
    },
    {
      id: "tool-002",
      name: "Financial Calculator",
      category: "Financial",
      pricing: "Premium",
      rating: 4.8,
      users: 1800
    }
  ]

  const communityResources = [
    {
      id: "comm-001",
      title: "E-commerce Success Guide",
      author: "Sarah Kimani",
      downloads: 450,
      rating: 4.4,
      verified: true
    },
    {
      id: "comm-002",
      title: "Social Media Content Calendar",
      author: "John Okafor",
      downloads: 320,
      rating: 4.2,
      verified: true
    }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Resource Library</span>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                Resource Library
              </h1>
              <p className="text-muted-foreground">
                Access templates, tools, and resources to support your entrepreneurial journey
              </p>
            </div>
            <div className="w-full md:w-auto flex gap-4">
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Category Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`p-4 rounded-lg border text-left hover:bg-accent ${
                  activeCategory === category.id ? "border-primary" : "border-border"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <category.icon className="h-6 w-6 mb-2 text-primary" />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Resources */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Featured Resources</h2>
                  <div className="flex gap-2">
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
                <div className="grid md:grid-cols-2 gap-4">
                  {featuredResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="rounded-lg border overflow-hidden hover:bg-accent"
                    >
                      <div className="aspect-video relative">
                        <Image
                          src={resource.thumbnail}
                          alt={resource.title}
                          fill
                          className="object-cover"
                        />
                        {resource.isPremium && (
                          <div className="absolute top-2 right-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                            Premium
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {resource.category} • {resource.type}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span>{resource.rating}</span>
                            <span>•</span>
                            <Download className="h-4 w-4" />
                            <span>{resource.downloads}</span>
                          </div>
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Templates */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Ready-to-Use Templates</h2>
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent"
                    >
                      <div className="flex items-center gap-4">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="font-medium">{template.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {template.category} • {template.format}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-right">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                            <span>{template.rating}</span>
                          </div>
                          <span className="text-muted-foreground">
                            {template.downloads} downloads
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Community Contributions */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Community Resources</h2>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Resource
                  </Button>
                </div>
                <div className="space-y-4">
                  {communityResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="p-4 rounded-lg border hover:bg-accent"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            By {resource.author}
                            {resource.verified && (
                              <span className="ml-2 text-green-500">✓ Verified</span>
                            )}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                          <span>{resource.rating}</span>
                        </div>
                        <div className="flex items-center">
                          <Download className="h-4 w-4 mr-1" />
                          <span>{resource.downloads}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tool Integration */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Recommended Tools</h3>
                <div className="space-y-4">
                  {tools.map((tool) => (
                    <div
                      key={tool.id}
                      className="p-4 rounded-lg border hover:bg-accent"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{tool.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          tool.pricing === "Free"
                            ? "bg-green-100 text-green-800"
                            : "bg-primary/10 text-primary"
                        }`}>
                          {tool.pricing}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {tool.category}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                          <span>{tool.rating}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {tool.users} users
                        </span>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/tools">
                      View All Tools
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* My Resources */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <FolderPlus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">My Resources</h3>
                    <p className="text-sm text-muted-foreground">
                      Saved items and collections
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/resources/saved">
                      <div className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Saved Resources
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/resources/collections">
                      <div className="flex items-center">
                        <FolderPlus className="mr-2 h-4 w-4" />
                        My Collections
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/resources/downloads">
                      <div className="flex items-center">
                        <Download className="mr-2 h-4 w-4" />
                        Downloaded Items
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Resource Settings */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Resource preferences
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-download updates</span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show premium resources</span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300"
                    />
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/settings/resources">
                      More Settings
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Help Section */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <HelpCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Need Help?</h3>
                    <p className="text-sm text-muted-foreground">
                      Resource support
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/resources">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Resource Guide
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/templates">
                      <FileText className="mr-2 h-4 w-4" />
                      Template Help
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
        </div>
      </main>
    </div>
  )
}
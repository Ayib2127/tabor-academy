"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ShoppingCart,
  BarChart,
  Code,
  Globe,
  Share2,
  Download,
  Edit,
  Eye,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Filter,
  Grid,
  List,
  Star
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock portfolio data
const portfolioData = {
  profile: {
    name: "Sarah Kimani",
    title: "Digital Marketing & E-commerce Specialist",
    bio: "Passionate about helping Ethiopian businesses succeed in the digital space. Experienced in creating and executing successful digital marketing campaigns and e-commerce strategies.",
    location: "Nairobi, Kenya",
    website: "www.sarahkimani.com",
    social: {
      linkedin: "linkedin.com/in/sarahkimani",
      twitter: "twitter.com/sarahkimani",
      github: "github.com/sarahkimani"
    }
  },
  projects: [
    {
      id: 1,
      title: "Ethiopian Artisans E-commerce Platform",
      category: "E-commerce",
      description: "Built and launched an e-commerce platform connecting Ethiopian artisans with global markets. Implemented mobile money integration and localized shipping solutions.",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      technologies: ["Shopify", "Mobile Money API", "Digital Marketing"],
      results: {
        sales: "$50,000+",
        artisans: "100+",
        countries: "15+"
      },
      link: "https://africanartisans.com",
      featured: true
    },
    {
      id: 2,
      title: "Local Restaurant Digital Marketing Campaign",
      category: "Digital Marketing",
      description: "Developed and executed a comprehensive digital marketing strategy for a chain of local restaurants, focusing on social media engagement and online ordering.",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      technologies: ["Social Media Marketing", "Google Ads", "Email Marketing"],
      results: {
        growth: "150%",
        engagement: "10,000+",
        roi: "300%"
      },
      link: "https://case-study.com/restaurant",
      featured: true
    },
    {
      id: 3,
      title: "Community Learning App",
      category: "No-Code Development",
      description: "Created a mobile app connecting local tutors with students using no-code tools. Implemented booking system and payment integration.",
      thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      technologies: ["Bubble.io", "Stripe", "WhatsApp API"],
      results: {
        users: "5,000+",
        tutors: "200+",
        sessions: "1,000+"
      },
      link: "https://learning-app.com",
      featured: false
    }
  ],
  skills: [
    {
      category: "Digital Marketing",
      skills: ["Social Media Strategy", "Content Marketing", "SEO", "Email Marketing", "Google Analytics"]
    },
    {
      category: "E-commerce",
      skills: ["Shopify", "WooCommerce", "Payment Integration", "Inventory Management", "Customer Service"]
    },
    {
      category: "No-Code Development",
      skills: ["Bubble.io", "Webflow", "Zapier", "Airtable", "Integromat"]
    }
  ],
  certifications: [
    {
      title: "Digital Marketing Professional",
      issuer: "Tabor Digital Academy",
      date: "2024",
      credential: "DMP-2024-001"
    },
    {
      title: "E-commerce Business Expert",
      issuer: "Tabor Digital Academy",
      date: "2024",
      credential: "EBE-2024-002"
    }
  ],
  testimonials: [
    {
      name: "John Okafor",
      role: "Business Owner",
      company: "Lagos Cuisine",
      text: "Sarah's digital marketing strategy transformed our restaurant business. Our online orders increased by 200% within three months.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    },
    {
      name: "Grace Mensah",
      role: "Artisan",
      company: "Ghana Crafts",
      text: "Thanks to the e-commerce platform Sarah built, I'm now selling my crafts internationally. The mobile money integration makes it easy to receive payments.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
    }
  ]
}

export default function PortfolioShowcasePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredProjects = selectedCategory
    ? portfolioData.projects.filter(project => project.category === selectedCategory)
    : portfolioData.projects

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Profile Section */}
          <div className="mb-12">
            <Card className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-4">
                    {portfolioData.profile.name}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-4">
                    {portfolioData.profile.title}
                  </p>
                  <p className="text-muted-foreground mb-6">
                    {portfolioData.profile.bio}
                  </p>
                  <div className="flex items-center gap-4 mb-6">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{portfolioData.profile.location}</span>
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <Link href={`https://${portfolioData.profile.website}`} className="text-primary hover:underline">
                      {portfolioData.profile.website}
                    </Link>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" size="icon">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Github className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <Button className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Portfolio
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download CV
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Projects Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Featured Projects</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-accent" : ""}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-accent" : ""}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <select
                  className="p-2 border rounded-md"
                  value={selectedCategory || ""}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                >
                  <option value="">All Categories</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="No-Code Development">No-Code Development</option>
                </select>
              </div>
            </div>

            <div className={`grid gap-6 ${
              viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            }`}>
              {filteredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden card-hover gradient-border">
                  <div className="relative h-48">
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                    {project.featured && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-accent rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {Object.entries(project.results).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-sm text-muted-foreground">{key}</p>
                          <p className="font-semibold">{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1" asChild>
                        <Link href={project.link}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Project
                        </Link>
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

          {/* Skills Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Skills & Expertise</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {portfolioData.skills.map((skillGroup, index) => (
                <Card key={index} className="p-6 card-hover gradient-border">
                  <h3 className="font-semibold mb-4">{skillGroup.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-accent rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Certifications</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {portfolioData.certifications.map((cert, index) => (
                <Card key={index} className="p-6 card-hover gradient-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold mb-2">{cert.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {cert.issuer} • {cert.date}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Credential ID: {cert.credential}
                      </p>
                    </div>
                    <Button variant="outline" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Client Testimonials</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {portfolioData.testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6 card-hover gradient-border">
                  <div className="flex items-start gap-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-orange-500 fill-current" />
                        <Star className="h-4 w-4 text-orange-500 fill-current" />
                        <Star className="h-4 w-4 text-orange-500 fill-current" />
                        <Star className="h-4 w-4 text-orange-500 fill-current" />
                        <Star className="h-4 w-4 text-orange-500 fill-current" />
                      </div>
                      <p className="text-muted-foreground mb-4">{testimonial.text}</p>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <Card className="p-8 bg-gradient-to-r from-orange-50 to-teal-50">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Collaborate?</h2>
              <p className="text-muted-foreground mb-6">
                Let's work together to bring your digital vision to life. Whether it's e-commerce, digital marketing, or custom solutions, I'm here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-orange-600 to-orange-500">
                  Get in Touch
                </Button>
                <Button variant="outline">
                  Download Portfolio
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
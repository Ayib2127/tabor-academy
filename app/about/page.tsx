import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Users, Globe, Smartphone, BookOpen, Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-orange-50 via-teal-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter gradient-text mb-6">
              About Tabor Academy
            </h1>
            <p className="text-xl text-muted-foreground">
              Building Ethiopia's digital future through accessible, quality education
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <h2 className="text-3xl font-bold mb-6 gradient-text">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                To empower Ethiopian entrepreneurs with the digital skills and knowledge needed to build
                successful businesses and contribute to the continent's economic growth.
              </p>
              <div className="grid gap-4">
                {[
                  "Accessible education for all",
                  "Practical, hands-on learning",
                  "Local context and relevance",
                  "Community-driven support"
                ].map((value, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-teal-600" />
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-orange-500 rounded-lg blur-2xl opacity-20 animate-pulse" />
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
                alt="Team collaboration"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl relative hover-scale"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ethiopian Focus Section */}
      <section className="py-20 bg-gray-50/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            Built for Ethiopia, by Ethiopians
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Globe,
                title: "Local Understanding",
                description: "Content tailored to Ethiopian markets and business environments"
              },
              {
                icon: Smartphone,
                title: "Mobile-First",
                description: "Optimized for the devices most Ethiopians use daily"
              },
              {
                icon: BookOpen,
                title: "Offline Learning",
                description: "Access course content without constant internet connection"
              },
              {
                icon: Users,
                title: "Community Focus",
                description: "Learn and grow with peers from across the continent"
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 card-hover gradient-border">
                <feature.icon className="h-12 w-12 text-teal-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            Our Impact
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Active Students" },
              { number: "15+", label: "Ethiopian Countries" },
              { number: "85%", label: "Completion Rate" },
              { number: "90%", label: "Employment Rate" }
            ].map((stat, index) => (
              <Card key={index} className="p-6 text-center card-hover gradient-border">
                <div className="text-3xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Kimani",
                role: "Founder & CEO",
                image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"
              },
              {
                name: "Michael Okonjo",
                role: "Head of Education",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              },
              {
                name: "Grace Mensah",
                role: "Tech Lead",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956"
              }
            ].map((member, index) => (
              <Card key={index} className="p-6 text-center card-hover gradient-border">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={200}
                  height={200}
                  className="rounded-full mx-auto mb-4 hover-scale"
                />
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 via-orange-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text animate-fade-up">
              Join Our Mission
            </h2>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-up">
              Be part of the digital transformation reshaping Ethiopia's future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400"
                asChild
              >
                <Link href="/signup">Start Learning</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="hover-scale"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
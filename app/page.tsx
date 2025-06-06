import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Laptop, Brain, Users, BarChart3, Code, Coins, GraduationCap, Play, Quote } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-orange-50 via-teal-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="flex flex-col gap-4 animate-fade-up">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter gradient-text">
                Empower Your Future with Digital Skills
              </h1>
              <p className="text-xl text-muted-foreground">
                Join Africa's leading e-learning platform for entrepreneurship, digital skills, and
                freelancing success. Learn from anywhere, anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button size="lg" className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400" asChild>
                  <Link href="/signup">Start Learning Free</Link>
                </Button>
                <Button size="lg" variant="outline" className="group" asChild>
                  <Link href="/demo">
                    <Play className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    Watch Demo
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="stat-card">
                  <div className="text-2xl font-bold gradient-text">10K+</div>
                  <div className="text-sm text-muted-foreground">Active Learners</div>
                </div>
                <div className="stat-card">
                  <div className="text-2xl font-bold gradient-text">15+</div>
                  <div className="text-sm text-muted-foreground">Countries Served</div>
                </div>
                <div className="stat-card">
                  <div className="text-2xl font-bold gradient-text">85%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-orange-500 rounded-lg blur-2xl opacity-20 animate-pulse" />
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                alt="Students learning"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl relative hover-scale"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            Why Choose Tabor Digital Academy
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 card-hover gradient-border">
              <Laptop className="h-12 w-12 text-teal-600 mb-4 animate-fade-in" />
              <h3 className="text-xl font-semibold mb-2">Mobile-First Learning</h3>
              <p className="text-muted-foreground">
                Access your courses anytime, anywhere with our mobile-optimized platform and offline capabilities.
              </p>
            </Card>
            <Card className="p-6 card-hover gradient-border">
              <Brain className="h-12 w-12 text-teal-600 mb-4 animate-fade-in" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Learning</h3>
              <p className="text-muted-foreground">
                Experience personalized learning paths tailored to your goals and learning style.
              </p>
            </Card>
            <Card className="p-6 card-hover gradient-border">
              <Users className="h-12 w-12 text-teal-600 mb-4 animate-fade-in" />
              <h3 className="text-xl font-semibold mb-2">Real Mentorship</h3>
              <p className="text-muted-foreground">
                Learn from successful African entrepreneurs who understand your journey.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Overview Section */}
      <section className="py-20 bg-gray-50/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            Learn Skills That Matter
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Digital Marketing",
                description: "Master social media, SEO, and online advertising to grow businesses.",
                link: "/courses/digital-marketing"
              },
              {
                icon: Code,
                title: "No-Code Development",
                description: "Build websites and apps without coding using modern tools.",
                link: "/courses/no-code"
              },
              {
                icon: Coins,
                title: "Financial Literacy",
                description: "Understand business finance, budgeting, and investment basics.",
                link: "/courses/financial-literacy"
              },
              {
                icon: GraduationCap,
                title: "Entrepreneurship",
                description: "Learn to start and scale successful businesses in Africa.",
                link: "/courses/entrepreneurship"
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 card-hover gradient-border group">
                <feature.icon className="h-12 w-12 text-orange-500 mb-4 transition-transform group-hover:scale-110" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <Link href={feature.link} className="text-teal-600 hover:text-teal-700 font-medium group-hover:underline">
                  Learn More →
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            Success Stories from Africa
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Thanks to Tabor Digital Academy, I launched my digital marketing agency and now serve clients across East Africa.",
                name: "Sarah Mwangi",
                location: "Kenya",
                image: "https://images.unsplash.com/photo-1539701938214-0d9736e1c16b"
              },
              {
                quote: "The no-code development course helped me build my first app. Now I'm teaching others in my community.",
                name: "John Okafor",
                location: "Nigeria",
                image: "https://images.unsplash.com/photo-1507152832244-10d45c7eda57"
              },
              {
                quote: "The mentorship program gave me the confidence to start my e-commerce business. My sales grow every month.",
                name: "Grace Mensah",
                location: "Ghana",
                image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="p-6 card-hover gradient-border">
                <Quote className="h-8 w-8 text-teal-600 mb-4" />
                <p className="text-muted-foreground mb-4">{testimonial.quote}</p>
                <div className="flex items-center gap-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="rounded-full hover-scale"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="hover-scale" asChild>
              <Link href="/success-stories">View All Success Stories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-gray-50/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            Trusted Partners
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {[1, 2, 3, 4].map((partner) => (
              <Image
                key={partner}
                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113"
                alt={`Partner ${partner}`}
                width={160}
                height={60}
                className="opacity-70 hover:opacity-100 transition-opacity hover-scale"
              />
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
              Start Your Journey Today
            </h2>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-up">
              Join thousands of successful African entrepreneurs who have transformed their lives through our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400"
                asChild
              >
                <Link href="/signup">Start Learning Free</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="hover-scale"
                asChild
              >
                <Link href="/contact">Speak with an Advisor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
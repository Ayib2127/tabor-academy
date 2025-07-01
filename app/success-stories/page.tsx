import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Quote, ArrowRight, Star, Globe, TrendingUp, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function SuccessStoriesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-orange-50 via-teal-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter gradient-text mb-6">
              Success Stories
            </h1>
            <p className="text-xl text-muted-foreground">
              Real stories from entrepreneurs who transformed their lives through digital skills
            </p>
          </div>
        </div>
      </section>

      {/* Featured Success Story */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <Card className="p-8 md:p-12 card-hover gradient-border">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative animate-fade-in order-2 md:order-1">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-orange-500 rounded-lg blur-2xl opacity-20 animate-pulse" />
                <Image
                  src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643"
                  alt="Sarah Mwangi"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-2xl relative hover-scale"
                  priority
                />
              </div>
              <div className="order-1 md:order-2">
                <Quote className="h-12 w-12 text-teal-600 mb-6" />
                <h2 className="text-3xl font-bold mb-4">Sarah Mwangi</h2>
                <p className="text-xl mb-6 text-muted-foreground italic">
                  "Tabor Digital Academy transformed my life. I went from struggling to find work to running my own successful digital marketing agency serving clients across East Ethiopia."
                </p>
                <div className="flex items-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-current text-orange-400" />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="stat-card">
                    <p className="text-2xl font-bold gradient-text">150+</p>
                    <p className="text-sm text-muted-foreground">Clients Served</p>
                  </div>
                  <div className="stat-card">
                    <p className="text-2xl font-bold gradient-text">300%</p>
                    <p className="text-sm text-muted-foreground">Revenue Growth</p>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-teal-600 to-teal-500" asChild>
                  <Link href="/courses/digital-marketing">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Success Stories Grid */}
      <section className="py-20 bg-gray-50/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "John Okafor",
                location: "Nigeria",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
                story: "Built a successful no-code development agency after completing the tech entrepreneurship program.",
                achievement: "20+ Apps Launched",
                growth: "400% Annual Growth"
              },
              {
                name: "Grace Mensah",
                location: "Ghana",
                image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
                story: "Transformed her small shop into a thriving e-commerce business using digital marketing skills.",
                achievement: "10,000+ Customers",
                growth: "200% Sales Increase"
              },
              {
                name: "David Kamau",
                location: "Kenya",
                image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
                story: "Launched a successful freelance career in digital content creation and social media management.",
                achievement: "50+ Global Clients",
                growth: "6-Figure Income"
              },
              {
                name: "Amara Okeke",
                location: "Nigeria",
                image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
                story: "Built a digital skills training center in her community using our enterprise program.",
                achievement: "500+ Students Trained",
                growth: "Community Impact"
              },
              {
                name: "Mohamed Hassan",
                location: "Tanzania",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
                story: "Developed a local tour booking platform using skills learned from our tech courses.",
                achievement: "30+ Local Partners",
                growth: "250% Booking Growth"
              },
              {
                name: "Fatima Diallo",
                location: "Senegal",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
                story: "Created a successful online fashion brand targeting Ethiopian diaspora markets.",
                achievement: "Global Reach",
                growth: "7-Figure Revenue"
              }
            ].map((story, index) => (
              <Card key={index} className="p-6 card-hover gradient-border">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={story.image}
                    alt={story.name}
                    width={60}
                    height={60}
                    className="rounded-full hover-scale"
                  />
                  <div>
                    <h3 className="font-semibold">{story.name}</h3>
                    <p className="text-sm text-muted-foreground">{story.location}</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">{story.story}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="stat-card">
                    <p className="text-sm font-bold gradient-text">{story.achievement}</p>
                  </div>
                  <div className="stat-card">
                    <p className="text-sm font-bold gradient-text">{story.growth}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            Our Impact Across Ethiopia
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                stat: "15+",
                label: "Ethiopian Countries",
                description: "Empowering entrepreneurs across the continent"
              },
              {
                icon: Users,
                stat: "10,000+",
                label: "Success Stories",
                description: "Transformed lives through digital skills"
              },
              {
                icon: TrendingUp,
                stat: "85%",
                label: "Employment Rate",
                description: "Of graduates achieving their career goals"
              }
            ].map((impact, index) => (
              <Card key={index} className="p-6 text-center card-hover gradient-border">
                <impact.icon className="h-12 w-12 mx-auto text-teal-600 mb-4" />
                <p className="text-3xl font-bold gradient-text mb-2">{impact.stat}</p>
                <p className="font-semibold mb-2">{impact.label}</p>
                <p className="text-muted-foreground">{impact.description}</p>
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
              Write Your Success Story
            </h2>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-up">
              Join our community of successful Ethiopian entrepreneurs and start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400"
                asChild
              >
                <Link href="/signup">Start Your Journey</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="hover-scale"
                asChild
              >
                <Link href="/contact">Talk to an Advisor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
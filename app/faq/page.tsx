import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, Book, CreditCard, Laptop, Users, HelpCircle, Rocket, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-orange-50 via-teal-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter gradient-text mb-6">
              How Can We Help?
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers to common questions about learning with Tabor Academy
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder="Search your question..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background/95 backdrop-blur focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Book,
                title: "Courses & Learning",
                description: "Information about our courses and learning methodology"
              },
              {
                icon: CreditCard,
                title: "Pricing & Payment",
                description: "Details about pricing plans and payment options"
              },
              {
                icon: Laptop,
                title: "Technical Support",
                description: "Help with platform access and technical issues"
              },
              {
                icon: Users,
                title: "Community",
                description: "Questions about our mentorship and community"
              }
            ].map((category, index) => (
              <Card key={index} className="p-6 card-hover gradient-border">
                <category.icon className="h-12 w-12 text-teal-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-muted-foreground">{category.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-20 bg-gray-50/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <div className="space-y-20">
            {/* Courses & Learning */}
            <div>
              <h2 className="text-3xl font-bold mb-8 gradient-text">Courses & Learning</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    question: "What courses do you offer?",
                    answer: "We offer courses in digital marketing, no-code development, financial literacy, and entrepreneurship, all tailored for the Ethiopian market."
                  },
                  {
                    question: "How long does each course take?",
                    answer: "Course duration varies from 4-12 weeks, depending on the program and your learning pace. You can learn at your own speed."
                  },
                  {
                    question: "Are the courses self-paced?",
                    answer: "Yes, all our courses are self-paced. You can learn whenever and wherever is convenient for you."
                  },
                  {
                    question: "Do I get a certificate?",
                    answer: "Yes, upon successful completion of each course, you receive a verified digital certificate that you can share with employers."
                  }
                ].map((faq, index) => (
                  <Card key={index} className="p-6 card-hover gradient-border">
                    <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pricing & Payment */}
            <div>
              <h2 className="text-3xl font-bold mb-8 gradient-text">Pricing & Payment</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    question: "What payment methods do you accept?",
                    answer: "We accept mobile money (M-Pesa, Airtel Money, MTN), credit/debit cards, and bank transfers. We also have special arrangements for enterprise clients."
                  },
                  {
                    question: "Do you offer refunds?",
                    answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with your learning experience."
                  },
                  {
                    question: "Are there any hidden fees?",
                    answer: "No, the price you see is what you pay. There are no hidden fees or additional charges."
                  },
                  {
                    question: "Do you offer scholarships?",
                    answer: "Yes, we offer scholarships to eligible students. Contact our support team to learn more about scholarship opportunities."
                  }
                ].map((faq, index) => (
                  <Card key={index} className="p-6 card-hover gradient-border">
                    <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Technical Support */}
            <div>
              <h2 className="text-3xl font-bold mb-8 gradient-text">Technical Support</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    question: "What devices can I use to access the platform?",
                    answer: "Our platform is accessible on any device with an internet connection - smartphones, tablets, laptops, or desktop computers."
                  },
                  {
                    question: "Can I download courses for offline learning?",
                    answer: "Yes, premium members can download course materials for offline access through our mobile app."
                  },
                  {
                    question: "What happens if I have technical issues?",
                    answer: "Our support team is available 24/7 to help you with any technical issues. You can reach us via chat, email, or phone."
                  },
                  {
                    question: "Is my data secure?",
                    answer: "Yes, we use industry-standard encryption and security measures to protect your data and personal information."
                  }
                ].map((faq, index) => (
                  <Card key={index} className="p-6 card-hover gradient-border">
                    <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Community */}
            <div>
              <h2 className="text-3xl font-bold mb-8 gradient-text">Community</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    question: "How does mentorship work?",
                    answer: "Premium members get access to monthly group mentoring sessions and 1-on-1 sessions with experienced entrepreneurs and industry experts."
                  },
                  {
                    question: "Can I connect with other students?",
                    answer: "Yes, our community platform allows you to connect with fellow students, share experiences, and collaborate on projects."
                  },
                  {
                    question: "Are there networking opportunities?",
                    answer: "Yes, we regularly organize virtual and physical networking events, workshops, and masterclasses for our community."
                  },
                  {
                    question: "How can I become a mentor?",
                    answer: "Experienced professionals can apply to become mentors through our website. We carefully vet all mentors to ensure quality."
                  }
                ].map((faq, index) => (
                  <Card key={index} className="p-6 card-hover gradient-border">
                    <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
              Still Have Questions?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center card-hover gradient-border">
                <HelpCircle className="h-12 w-12 mx-auto text-teal-600 mb-4" />
                <h3 className="font-semibold mb-2">Help Center</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Browse our detailed help articles and tutorials
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/help">Visit Help Center</Link>
                </Button>
              </Card>
              <Card className="p-6 text-center card-hover gradient-border">
                <MessageCircle className="h-12 w-12 mx-auto text-teal-600 mb-4" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Chat with our support team 24/7
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/chat">Start Chat</Link>
                </Button>
              </Card>
              <Card className="p-6 text-center card-hover gradient-border">
                <Rocket className="h-12 w-12 mx-auto text-teal-600 mb-4" />
                <h3 className="font-semibold mb-2">Contact Us</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Send us an email or schedule a call
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 via-orange-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text animate-fade-up">
              Ready to Start Learning?
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
                <Link href="/signup">Start Learning Free</Link>
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
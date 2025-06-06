import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, CreditCard, Smartphone, Building2, Gift } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-orange-50 via-teal-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter gradient-text mb-6">
              Choose Your Learning Path
            </h1>
            <p className="text-xl text-muted-foreground">
              Flexible pricing designed for Africa's aspiring entrepreneurs
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Starter Plan */}
            <Card className="p-6 card-hover gradient-border">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Free Starter</h3>
                <p className="text-4xl font-bold mb-2">$0</p>
                <p className="text-muted-foreground">Perfect for exploring our platform</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Access to basic courses",
                  "Community forum access",
                  "Mobile app access",
                  "Basic progress tracking"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-teal-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/signup">Get Started Free</Link>
              </Button>
            </Card>

            {/* Individual Learner Plan */}
            <Card className="p-6 relative card-hover">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-600 text-white px-4 py-1 rounded-full text-sm">
                Most Popular
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Individual Learner</h3>
                <p className="text-4xl font-bold mb-2">$29</p>
                <p className="text-muted-foreground">Monthly or $290/year (save 20%)</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "All Free features",
                  "Full course library access",
                  "Personalized learning path",
                  "Project feedback",
                  "Monthly group mentoring",
                  "Offline course access"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-teal-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-gradient-to-r from-teal-600 to-teal-500" asChild>
                <Link href="/signup">Start Learning</Link>
              </Button>
            </Card>

            {/* Premium Mentorship Plan */}
            <Card className="p-6 card-hover gradient-border">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Premium Mentorship</h3>
                <p className="text-4xl font-bold mb-2">$99</p>
                <p className="text-muted-foreground">Monthly or $990/year (save 20%)</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "All Individual features",
                  "1-on-1 mentor sessions",
                  "Priority project review",
                  "Career coaching",
                  "Business planning support",
                  "Network access"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-teal-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/signup">Get Premium Access</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="py-20 bg-gray-50/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            Payment Options
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Smartphone,
                title: "Mobile Money",
                description: "M-Pesa, Airtel Money, MTN Mobile Money"
              },
              {
                icon: CreditCard,
                title: "Cards & Bank Transfer",
                description: "All major cards and local bank transfers accepted"
              },
              {
                icon: Building2,
                title: "Enterprise Solutions",
                description: "Custom packages for organizations and teams"
              },
              {
                icon: Gift,
                title: "Scholarship Program",
                description: "Financial assistance for eligible students"
              }
            ].map((method, index) => (
              <Card key={index} className="p-6 card-hover gradient-border">
                <method.icon className="h-12 w-12 text-teal-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                <p className="text-muted-foreground">{method.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <h2 className="text-3xl font-bold mb-6 gradient-text">Enterprise Solutions</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Empower your organization with custom digital skills training programs tailored to your needs.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Custom learning paths",
                  "Bulk enrollment discounts",
                  "Progress tracking dashboard",
                  "Dedicated support manager"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-teal-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="bg-gradient-to-r from-teal-600 to-teal-500" size="lg" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
            <div className="relative animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-orange-500 rounded-lg blur-2xl opacity-20 animate-pulse" />
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf"
                alt="Enterprise training"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl relative hover-scale"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "What payment methods do you accept?",
                answer: "We accept various payment methods including mobile money (M-Pesa, Airtel Money, MTN), credit/debit cards, and bank transfers. We also offer special arrangements for enterprise clients."
              },
              {
                question: "Can I switch plans later?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. The changes will be reflected in your next billing cycle."
              },
              {
                question: "Do you offer refunds?",
                answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with your learning experience."
              },
              {
                question: "Are there any hidden fees?",
                answer: "No, the price you see is what you pay. There are no hidden fees or additional charges."
              }
            ].map((faq, index) => (
              <Card key={index} className="p-6 card-hover gradient-border">
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
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
              Start Your Learning Journey Today
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
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Star, TrendingUp, Shield, Users, Award, Clock, Globe, Zap, Laptop, Brain, AlertCircle, DollarSign, Target } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AIDemoCard } from "@/components/ai-demo-card"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { SuccessStoriesSection } from "@/components/success-stories-section"
import { AnimatedStats } from "@/components/animated-stats"
import { StickyCTABar } from "@/components/sticky-cta-bar"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      {/* 1. Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-[#FF6B35]/5 via-[#4ECDC4]/5 to-white dark:from-[#FF6B35]/10 dark:via-[#4ECDC4]/10 dark:to-gray-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-[#FF6B35]/10 to-[#4ECDC4]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-[#4ECDC4]/10 to-[#FF6B35]/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Left Content with Enhanced Text Overlay */}
            <div className="flex flex-col gap-6 animate-fade-up relative">
              {/* Enhanced gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent dark:from-gray-900/95 dark:via-gray-900/80 dark:to-transparent -z-10 rounded-2xl blur-sm lg:hidden" />
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2 border border-[#E5E8E8] dark:border-gray-700 w-fit shadow-sm">
                <div className="flex -space-x-1">
                  <div className="w-6 h-6 bg-[#4ECDC4] rounded-full border-2 border-white dark:border-gray-800"></div>
                  <div className="w-6 h-6 bg-[#FF6B35] rounded-full border-2 border-white dark:border-gray-800"></div>
                  <div className="w-6 h-6 bg-[#1B4D3E] rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <span className="text-sm font-medium text-[#2C3E50] dark:text-white">Join 10,000+ Ethiopian entrepreneurs</span>
              </div>

              {/* Main Headline with Enhanced Typography */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                  <span className="block text-[#2C3E50] dark:text-white drop-shadow-sm">Your</span>
                  <span className="block bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent drop-shadow-sm">
                    Launchpad:
                  </span>
                  <span className="block text-[#2C3E50] dark:text-white drop-shadow-sm">From Idea to Income</span>
              </h1>
                
                <p className="text-xl md:text-2xl text-[#2C3E50]/90 dark:text-white/90 leading-relaxed max-w-2xl font-medium">
                  Tabor Academy provides <span className="font-semibold text-[#4ECDC4]">mobile-first, project-based education</span> tailored for Ethiopia, connecting you with mentors and a community to launch a real business.
                </p>
              </div>

              {/* Value Props */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#1B4D3E]" />
                  <span className="text-sm font-medium text-[#2C3E50] dark:text-white">Mobile-First Learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#1B4D3E]" />
                  <span className="text-sm font-medium text-[#2C3E50] dark:text-white">Real Mentorship</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#1B4D3E]" />
                  <span className="text-sm font-medium text-[#2C3E50] dark:text-white">Project-Based</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] hover:from-[#FF6B35]/90 hover:to-[#4ECDC4]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group text-lg px-8 py-4"
                  asChild
                >
                  <Link href="/signup" className="flex items-center gap-2">
                    Start Your Journey Today
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 pt-4 border-t border-[#E5E8E8]/50 dark:border-gray-700/50">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-[#FF6B35] text-[#FF6B35]" />
                    ))}
                </div>
                  <span className="text-sm text-[#2C3E50]/70 dark:text-white/70">4.9/5 from 2,000+ reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#1B4D3E]" />
                  <span className="text-sm text-[#2C3E50]/70 dark:text-white/70">85% success rate</span>
                </div>
              </div>
            </div>

            {/* Right Visual - Enhanced Images */}
            <div className="relative animate-fade-in">
              {/* Main Image Container with Enhanced Styling */}
              <div className="relative">
                {/* Enhanced Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#4ECDC4]/30 to-[#FF6B35]/30 rounded-3xl blur-3xl scale-110" />
                
                {/* Main Image with Better Composition */}
                <div className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-3xl p-6 border border-white/30 dark:border-gray-700/30 shadow-2xl">
                  <div className="relative overflow-hidden rounded-2xl">
                    {/* Text overlay gradient for better readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
                    
              <Image
                src="https://ethiopiangobgnu.com/images/sample-business-opportunity.jpg"
                alt="Entrepreneurs collaborating globally"
                width={600}
                height={400}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                priority
              />
                    
                    {/* Overlay text for context */}
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <p className="text-white text-sm font-medium drop-shadow-lg">
                        Real entrepreneurs, real success stories
                      </p>
                    </div>
                  </div>
                  
                  {/* Enhanced Floating Stats Cards */}
                  <div className="absolute -top-6 -left-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 border border-[#E5E8E8] dark:border-gray-700 animate-float">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#4ECDC4]/20 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-[#4ECDC4]" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-[#2C3E50] dark:text-white">10K+</div>
                        <div className="text-xs text-[#2C3E50]/60 dark:text-white/60">Active Learners</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 border border-[#E5E8E8] dark:border-gray-700 animate-float delay-500">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FF6B35]/20 rounded-full flex items-center justify-center">
                        <Globe className="w-5 h-5 text-[#FF6B35]" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-[#2C3E50] dark:text-white">15+</div>
                        <div className="text-xs text-[#2C3E50]/60 dark:text-white/60">Countries</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Animated Social Proof Section (Momentum Bar) */}
      <section className="py-12 bg-white dark:bg-gray-900 border-b border-[#E5E8E8]/50 dark:border-gray-700/50">
        <div className="container px-4 md:px-6">
          <AnimatedStats />
        </div>
      </section>

      {/* 3. Problem & Solution Section with Enhanced Icons */}
      <section className="py-20 bg-gradient-to-br from-[#F7F9F9] to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
        
        {/* Background decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#4ECDC4]/5 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#FF6B35]/5 rounded-full blur-2xl" />
        
        <div className="container px-4 md:px-6 relative">
          {/* Problem Statement */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-[#FF6B35]/10 rounded-full px-4 py-2 mb-6">
              <AlertCircle className="w-4 h-4 text-[#FF6B35]" />
              <span className="text-sm font-medium text-[#FF6B35]">The Challenge</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-[#2C3E50] dark:text-white mb-6">
            Why Traditional Learning Fails Entrepreneurs?
              <span className="block bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent">
                Ethiopian Entrepreneurs
              </span>
            </h2>
            
            <p className="text-xl text-[#2C3E50]/80 dark:text-white/80 leading-relaxed mb-8">
              You have brilliant business ideas, but existing education platforms are expensive, 
              require constant internet, and teach generic skills that don't address Ethiopia's unique opportunities and challenges.
            </p>

            {/* Problem Points */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="flex items-start gap-3 text-left">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <DollarSign className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#2C3E50] dark:text-white mb-1">Too Expensive</h4>
                  <p className="text-sm text-[#2C3E50]/70 dark:text-white/70">Most platforms cost $100+ per month - out of reach for emerging entrepreneurs</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-left">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#2C3E50] dark:text-white mb-1">Internet Dependent</h4>
                  <p className="text-sm text-[#2C3E50]/70 dark:text-white/70">Require constant high-speed internet that's unreliable or expensive in many areas</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-left">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Target className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#2C3E50] dark:text-white mb-1">Generic Content</h4>
                  <p className="text-sm text-[#2C3E50]/70 dark:text-white/70">One-size-fits-all courses that ignore local markets, regulations, and opportunities</p>
                </div>
              </div>
            </div>
          </div>

          {/* Solution Statement */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-[#1B4D3E]/10 rounded-full px-4 py-2 mb-6">
              <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
              <span className="text-sm font-medium text-[#1B4D3E]">The Solution</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-[#2C3E50] dark:text-white mb-6">
              Ethiopia-First Education That 
              <span className="block bg-gradient-to-r from-[#4ECDC4] to-[#1B4D3E] bg-clip-text text-transparent">
                Actually Works
              </span>
          </h2>
            
            <p className="text-xl text-[#2C3E50]/80 dark:text-white/80 leading-relaxed">
              Tabor Academy combines cutting-edge technology with deep understanding of Ethiopian markets 
              to deliver practical, affordable, and accessible entrepreneurial education.
            </p>
          </div>

          {/* Solution Features Grid with Enhanced Icons */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1: Mobile-First Learning */}
            <div className="p-6 border border-[#E5E8E8] dark:border-gray-700 rounded-lg hover:border-[#4ECDC4]/40 transition-all duration-300 hover:shadow-lg group bg-white dark:bg-gray-800">
              <div className="w-12 h-12 bg-[#4ECDC4]/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Laptop className="w-6 h-6 text-[#4ECDC4]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C3E50] dark:text-white mb-2">Mobile-First Learning</h3>
              <p className="text-[#2C3E50]/70 dark:text-white/70 text-sm leading-relaxed">
                Optimized for smartphones with offline capabilities. Learn anywhere, anytime, even with limited internet.
              </p>
            </div>

            {/* Feature 2: AI-Powered Mentorship */}
            <div className="p-6 border border-[#E5E8E8] dark:border-gray-700 rounded-lg hover:border-[#4ECDC4]/40 transition-all duration-300 hover:shadow-lg group bg-white dark:bg-gray-800">
              <div className="w-12 h-12 bg-[#FF6B35]/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-[#FF6B35]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C3E50] dark:text-white mb-2">AI-Powered Mentorship</h3>
              <p className="text-[#2C3E50]/70 dark:text-white/70 text-sm leading-relaxed">
                Get personalized guidance 24/7 from our AI mentor, trained on successful Ethiopian business cases.
              </p>
            </div>

            {/* Feature 3: Real-World Projects */}
            <div className="p-6 border border-[#E5E8E8] dark:border-gray-700 rounded-lg hover:border-[#4ECDC4]/40 transition-all duration-300 hover:shadow-lg group bg-white dark:bg-gray-800">
              <div className="w-12 h-12 bg-[#1B4D3E]/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-[#1B4D3E]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C3E50] dark:text-white mb-2">Real-World Projects</h3>
              <p className="text-[#2C3E50]/70 dark:text-white/70 text-sm leading-relaxed">
                Build actual businesses while learning. Graduate with a portfolio and revenue, not just certificates.
              </p>
            </div>

            {/* Feature 4: AI Demo Card */}
            <AIDemoCard />
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] hover:from-[#FF6B35]/90 hover:to-[#4ECDC4]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              asChild
            >
              <Link href="/signup" className="flex items-center gap-2">
                Experience the Full Platform
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </Button>
            <p className="text-sm text-[#2C3E50]/60 dark:text-white/60 mt-3">
              Start with our free tier - no credit card required
            </p>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <HowItWorksSection />

      {/* 5. Success Stories Section */}
      <SuccessStoriesSection />

      {/* 6. Enhanced Partners Section with Animation */}
      <section id="partners" className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-[#4ECDC4]/10 rounded-full px-4 py-2 mb-6">
              <Shield className="w-4 h-4 text-[#4ECDC4]" />
              <span className="text-sm font-medium text-[#4ECDC4]">Trusted Partners</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-[#2C3E50] dark:text-white mb-6">
              Partnering with
              <span className="block bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent">
                Industry Leaders
              </span>
          </h2>
            
            <p className="text-xl text-[#2C3E50]/80 dark:text-white/80 leading-relaxed">
              We collaborate with leading organizations across Ethiopia to provide the best learning experience 
              and career opportunities for our students.
            </p>
          </div>

          {/* Animated Partner Logos */}
          <div className="relative">
            <div className="flex overflow-hidden">
              <div className="flex animate-scroll-left space-x-16 items-center">
                {/* First set of logos */}
                {[1, 2, 3, 4, 5, 6].map((partner) => (
                  <div
                    key={partner}
                    className="flex-shrink-0 w-32 h-16 bg-gradient-to-br from-[#4ECDC4]/10 to-[#FF6B35]/10 rounded-lg flex items-center justify-center border border-[#E5E8E8] dark:border-gray-700 hover:border-[#4ECDC4]/40 transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 bg-[#4ECDC4]/20 rounded-full mx-auto mb-1 group-hover:bg-[#4ECDC4]/30 transition-colors"></div>
                      <div className="text-xs font-medium text-[#2C3E50] dark:text-white">Partner {partner}</div>
                    </div>
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {[1, 2, 3, 4, 5, 6].map((partner) => (
                  <div
                    key={`duplicate-${partner}`}
                    className="flex-shrink-0 w-32 h-16 bg-gradient-to-br from-[#4ECDC4]/10 to-[#FF6B35]/10 rounded-lg flex items-center justify-center border border-[#E5E8E8] dark:border-gray-700 hover:border-[#4ECDC4]/40 transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 bg-[#4ECDC4]/20 rounded-full mx-auto mb-1 group-hover:bg-[#4ECDC4]/30 transition-colors"></div>
                      <div className="text-xs font-medium text-[#2C3E50] dark:text-white">Partner {partner}</div>
                  </div>
                </div>
                ))}
              </div>
            </div>
          </div>

          {/* Partner Benefits */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#4ECDC4]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[#4ECDC4]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C3E50] dark:text-white mb-2">Talent Pipeline</h3>
              <p className="text-[#2C3E50]/70 dark:text-white/70 text-sm">
                Access to skilled graduates ready to contribute to your organization's growth.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-[#FF6B35]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C3E50] dark:text-white mb-2">Custom Training</h3>
              <p className="text-[#2C3E50]/70 dark:text-white/70 text-sm">
                Tailored corporate training programs designed for your specific industry needs.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#1B4D3E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-[#1B4D3E]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C3E50] dark:text-white mb-2">Market Expansion</h3>
              <p className="text-[#2C3E50]/70 dark:text-white/70 text-sm">
                Strategic partnerships to expand your reach across Ethiopian markets.
              </p>
            </div>
          </div>

          {/* Partner CTA */}
          <div className="text-center mt-12">
            <Button 
              variant="outline"
              className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white"
              asChild
            >
              <Link href="/partners">Become a Partner</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 7. Pricing Section */}
      <section id="pricing" className="py-20 bg-[#F7F9F9] dark:bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-[#4ECDC4]/10 rounded-full px-4 py-2 mb-6">
              <DollarSign className="w-4 h-4 text-[#4ECDC4]" />
              <span className="text-sm font-medium text-[#4ECDC4]">Pricing Plans</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-[#2C3E50] dark:text-white mb-6">
              Choose Your
              <span className="block bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent">
                Learning Path
              </span>
          </h2>
            
            <p className="text-xl text-[#2C3E50]/80 dark:text-white/80 leading-relaxed">
              Start free and upgrade when you're ready. All plans include our core features 
              and access to our supportive community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 border border-[#E5E8E8] dark:border-gray-700 rounded-2xl hover:border-[#4ECDC4]/40 transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-900">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2 text-[#2C3E50] dark:text-white">Free Access</h3>
                <div className="text-4xl font-bold text-[#4ECDC4] mb-4">$0</div>
                <p className="text-[#2C3E50]/70 dark:text-white/70 mb-6">Perfect for getting started</p>
                <ul className="space-y-3 text-sm text-left mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Access to 3 introductory courses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Basic community access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Mobile learning app</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Progress tracking</span>
                  </li>
                </ul>
                <Button className="w-full bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white" asChild>
                  <Link href="/signup">Get Started Free</Link>
                </Button>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="p-8 border-2 border-[#FF6B35] rounded-2xl hover:border-[#FF6B35]/80 transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-900 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] text-white px-4 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2 text-[#2C3E50] dark:text-white">Premium</h3>
                <div className="text-4xl font-bold text-[#FF6B35] mb-4">$29<span className="text-lg">/month</span></div>
                <p className="text-[#2C3E50]/70 dark:text-white/70 mb-6">For serious learners</p>
                <ul className="space-y-3 text-sm text-left mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Access to all courses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">1-on-1 mentorship sessions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Project-based learning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Certificate of completion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Priority community support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Offline content access</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] hover:from-[#FF6B35]/90 hover:to-[#4ECDC4]/90 text-white" asChild>
                  <Link href="/signup?plan=premium">Start Premium</Link>
                </Button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 border border-[#E5E8E8] dark:border-gray-700 rounded-2xl hover:border-[#2C3E50]/40 transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-900">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2 text-[#2C3E50] dark:text-white">Enterprise</h3>
                <div className="text-4xl font-bold text-[#2C3E50] dark:text-white mb-4">Custom</div>
                <p className="text-[#2C3E50]/70 dark:text-white/70 mb-6">For organizations</p>
                <ul className="space-y-3 text-sm text-left mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Custom learning paths</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Team management tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Dedicated support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">White-label options</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">API access</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-gray-900" asChild>
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Trust Elements */}
          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-[#2C3E50]/60 dark:text-white/60">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#1B4D3E]" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#4ECDC4]" />
                <span>entrepreneurs</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#FF6B35]" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Enhanced Final Call-to-Action Section */}
      <section className="py-24 bg-gradient-to-br from-[#2C3E50] via-[#1B4D3E] to-[#2C3E50] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#FF6B35]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#4ECDC4]/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5 rounded-full blur-3xl" />
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
              <Zap className="w-4 h-4 text-[#FF6B35]" />
              <span className="text-sm font-medium text-white">Ready to Transform Your Future?</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white leading-tight">
              Start Building Your Future,
              <span className="block bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent">
                for Free
              </span>
            </h2>
            
            {/* Sub-headline */}
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join thousands of successful Ethiopian entrepreneurs who have transformed their lives through our platform.
              Your journey from idea to income starts with a single click.
            </p>

            {/* Value Propositions */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#4ECDC4]/20 rounded-full flex items-center justify-center mb-4 border border-[#4ECDC4]/30">
                  <Shield className="w-8 h-8 text-[#4ECDC4]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">100% Free to Start</h3>
                <p className="text-white/70 text-sm">No credit card required. Access premium content immediately.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#FF6B35]/20 rounded-full flex items-center justify-center mb-4 border border-[#FF6B35]/30">
                  <Users className="w-8 h-8 text-[#FF6B35]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Expert Community</h3>
                <p className="text-white/70 text-sm">Connect with mentors and fellow entrepreneurs across Ethiopia.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#1B4D3E]/40 rounded-full flex items-center justify-center mb-4 border border-[#1B4D3E]/50">
                  <Award className="w-8 h-8 text-[#4ECDC4]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Real Results</h3>
                <p className="text-white/70 text-sm">85% of our students launch profitable businesses within 6 months.</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] hover:from-[#FF6B35]/90 hover:to-[#4ECDC4]/90 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 text-lg px-8 py-4 group"
                asChild
              >
                <Link href="/signup" className="flex items-center gap-3">
                  <Zap className="w-5 h-5" />
                  Start Learning Free
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white hover:text-[#2C3E50] backdrop-blur-sm bg-white/10 text-lg px-8 py-4 group transition-all duration-300"
                asChild
              >
                <Link href="/courses" className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Explore Courses
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Setup in under 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm">30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">Join 10,000+ entrepreneurs</span>
              </div>
            </div>

            {/* Urgency Element */}
            <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-3 h-3 bg-[#FF6B35] rounded-full animate-pulse"></div>
                <span className="text-white font-medium">Limited Time: Free Premium Access</span>
              </div>
              <p className="text-white/70 text-sm">
                Get 3 months of premium features free when you sign up this week. 
                No commitment, cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky CTA Bar */}
      <StickyCTABar />
    </div>
  )
}
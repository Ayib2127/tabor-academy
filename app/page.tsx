import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Star, TrendingUp, Shield, Users, Award, Clock, Globe, Zap, Laptop, Brain, AlertCircle, DollarSign, Target, Hammer, Smartphone } from "lucide-react"
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
            {/* Left Content - Preserved Layout */}
            <div className="flex flex-col gap-6 animate-fade-up relative">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2 border border-[#E5E8E8] dark:border-gray-700 w-fit shadow-sm">
                <Globe className="w-5 h-5 text-brand-teal-500" />
                <span className="text-sm font-medium text-[#2C3E50] dark:text-white">Join 10,000+ Learners Worldwide</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] animate-fade-up">
                  <span className="block text-[#2C3E50] dark:text-white drop-shadow-sm">
                    Unlock Your Potential.
                  </span>
                  <span
                    className="block bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent drop-shadow-sm"
                    style={{
                      backgroundSize: '200% 200%',
                      animation: 'gradient-move 3s ease-in-out infinite alternate',
                    }}
                  >
                    Master New Skills.
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-[#2C3E50]/90 dark:text-white/90 leading-relaxed max-w-2xl font-medium">
                  Empower your journey with hands-on projects, expert mentors, and a global community.
                </p>
                <p className="text-[#2C3E50] text-base md:text-lg font-medium">
                  Gain real-world skills, connect with industry leaders, and learn flexibly—anytime, anywhere.
                </p>
              </div>

              {/* Value Props */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="flex items-center gap-2 card-hover gradient-border p-3 rounded-lg bg-white shadow">
                  <Hammer className="w-5 h-5 text-brand-orange-500" />
                  <span className="text-sm font-medium text-[#2C3E50] dark:text-white">Learn by Doing</span>
                </div>
                <div className="flex items-center gap-2 card-hover gradient-border p-3 rounded-lg bg-white shadow">
                  <Users className="w-5 h-5 text-brand-teal-500" />
                  <span className="text-sm font-medium text-[#2C3E50] dark:text-white">Expert Mentorship</span>
                </div>
                <div className="flex items-center gap-2 card-hover gradient-border p-3 rounded-lg bg-white shadow">
                  <Smartphone className="w-5 h-5 text-brand-orange-500" />
                  <span className="text-sm font-medium text-[#2C3E50] dark:text-white">Flexible & Accessible</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] hover:from-[#FF6B35]/90 hover:to-[#4ECDC4]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group text-lg px-8 py-4"
                  asChild
                >
                  <Link href="/signup" className="flex items-center gap-2">
                    Start Your Journey
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

            {/* Right Visual - Enhanced Dynamic Image Carousel */}
            <div className="relative animate-fade-in">
              <div className="relative">
                {/* Enhanced Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#4ECDC4]/40 to-[#FF6B35]/40 rounded-3xl blur-3xl scale-110 animate-pulse" />
                
                {/* Main Image Container */}
                <div className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-3xl p-6 border border-white/30 dark:border-gray-700/30 shadow-2xl overflow-hidden">
                  {/* Dynamic Image Carousel */}
                  <div className="relative overflow-hidden rounded-2xl h-[420px] w-[640px] max-w-full">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
                    
                    {/* Hero Images Array including previous image */}
                    {[
                      "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1751367778/Learning_Online_nslqk9.jpg",
                      "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753966396/hero5-1_mdi8hi.png",
                      "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753966383/hero2-1_lwmg9e.png",
                      "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753966893/hero3_sqokii.png",
                      "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753967073/hero4_mg2omb.png",
                      "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753966297/hero1-1_mqdznz.png",
                      "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753967089/hero6_drxrfb.png"
                    ].map((imageUrl, index) => (
                      <Image
                        key={index}
                        src={imageUrl}
                        alt={`Hero image ${index + 1}`}
                        fill
                        className={`absolute inset-0 object-contain will-change-transform will-change-opacity ${
                          index === 0 ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{
                          animation: `heroImageFadeSlow 28s ease-in-out infinite, ${[
                            'heroPanLeft', 'heroZoomIn', 'heroTiltRight', 'heroParallaxUp', 'heroPanRight', 'heroTiltLeft', 'heroZoomOut'
                          ][index % 7]} 10s ease-in-out infinite alternate`,
                          animationDelay: `${index * 4}s, ${index % 2 === 0 ? '0s' : '0.5s'}`
                        }}
                        priority={index === 0}
                      />
                    ))}

                    {/* Overlay Text */}
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <p className="text-white text-sm font-medium drop-shadow-lg">
                        Real learners, real success stories
                      </p>
                    </div>
                  </div>
                  
                  {/* Floating Stats Cards */}
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

      {/* 3. Problem & Solution Section */}
      <section className="py-20 bg-[#F7F9F9] dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
        
        {/* Problem Block */}
        <div className="container px-4 md:px-6 relative mb-20">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#2C3E50] dark:text-white mb-6">
              Why Most Online Courses Don't Work
            </h2>
            <p className="text-lg text-[#6E6C75] dark:text-white/80 leading-relaxed mb-10">
              Ever felt lost or unmotivated in an online course? Too often, e-learning means endless videos, little real-world practice, and no one to turn to for help. The result: skills that don't stick and progress that stalls.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-hover gradient-border p-6 rounded-xl bg-white dark:bg-gray-800 shadow flex flex-col items-center text-center">
                <AlertCircle className="w-8 h-8 mb-3 text-brand-orange-500" />
                <h3 className="font-bold text-lg text-[#2C3E50] dark:text-white mb-2">Lack of Practical Application</h3>
                <p className="text-muted-foreground text-sm">
                  Most courses focus on theory, leaving you without the hands-on skills needed to succeed in real jobs.
                </p>
              </div>
              <div className="card-hover gradient-border p-6 rounded-xl bg-white dark:bg-gray-800 shadow flex flex-col items-center text-center">
                <Users className="w-8 h-8 mb-3 text-brand-teal-500" />
                <h3 className="font-bold text-lg text-[#2C3E50] dark:text-white mb-2">Passive and Isolating</h3>
                <p className="text-muted-foreground text-sm">
                  Hours of video lectures can be disengaging and lonely, making it hard to stay motivated or connected.
                </p>
              </div>
              <div className="card-hover gradient-border p-6 rounded-xl bg-white dark:bg-gray-800 shadow flex flex-col items-center text-center">
                <Clock className="w-8 h-8 mb-3 text-brand-orange-500" />
                <h3 className="font-bold text-lg text-[#2C3E50] dark:text-white mb-2">Outdated Content</h3>
                <p className="text-muted-foreground text-sm">
                  Many platforms don't keep up with the latest trends, so you end up learning skills that are already obsolete.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Divider */}
        <div className="w-full flex justify-center mb-20">
          <div className="h-2 w-24 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] opacity-60"></div>
        </div>

        {/* Solution Block with Image on Right */}
        <div className="container px-4 md:px-6 relative">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Left Content */}
            <div className="flex flex-col gap-6">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent mb-6">
                Learn, Build, and Grow with Tabor Academy
              </h2>
              <p className="text-lg text-[#2C3E50] dark:text-white/90 leading-relaxed mb-10">
                Tabor Academy redefines online learning with live sessions, hands-on projects, and real mentorship. Experience interactive classes, personalized guidance, and a supportive learning network—so you can master new skills and achieve your goals, your way.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Feature 1 */}
                <div className="card-hover gradient-border p-6 rounded-xl bg-white dark:bg-gray-800 shadow flex flex-col items-center text-center">
                  <Hammer className="w-8 h-8 mb-3 text-brand-orange-500" />
                  <h3 className="font-bold text-lg text-[#2C3E50] dark:text-white mb-2">Build Real-World Projects</h3>
                  <p className="text-muted-foreground text-sm">
                    Apply what you learn by creating a portfolio of work that proves your abilities.
                  </p>
                </div>
                {/* Feature 2 */}
                <div className="card-hover gradient-border p-6 rounded-xl bg-white dark:bg-gray-800 shadow flex flex-col items-center text-center">
                  <Zap className="w-8 h-8 mb-3 text-brand-teal-500" />
                  <h3 className="font-bold text-lg text-[#2C3E50] dark:text-white mb-2">Live Learning Sessions</h3>
                  <p className="text-muted-foreground text-sm">
                    Join interactive, instructor-led classes that keep you engaged and motivated.
                  </p>
                </div>
                {/* Feature 3 */}
                <div className="card-hover gradient-border p-6 rounded-xl bg-white dark:bg-gray-800 shadow flex flex-col items-center text-center">
                  <Users className="w-8 h-8 mb-3 text-brand-teal-500" />
                  <h3 className="font-bold text-lg text-[#2C3E50] dark:text-white mb-2">1:1 Mentorship</h3>
                  <p className="text-muted-foreground text-sm">
                    Get personalized feedback and support from experienced mentors, every step of the way.
                  </p>
                </div>
                {/* Feature 4 */}
                <div className="card-hover gradient-border p-6 rounded-xl bg-white dark:bg-gray-800 shadow flex flex-col items-center text-center">
                  <Smartphone className="w-8 h-8 mb-3 text-brand-orange-500" />
                  <h3 className="font-bold text-lg text-[#2C3E50] dark:text-white mb-2">Learn Anytime, Anywhere</h3>
                  <p className="text-muted-foreground text-sm">
                    Study on your schedule, on any device, with flexible, accessible courses.
                  </p>
                </div>
              </div>
            </div>
            {/* Right Image */}
            <div className="relative">
              <Image
                src="https://res.cloudinary.com/dbn8jx8bh/image/upload/v1751367781/The_solution_1_m4maew.png"
                alt="Learning at Tabor Academy"
                width={500}
                height={400}
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <HowItWorksSection />

      {/* 5. Success Stories Section */}
      <SuccessStoriesSection />

      {/* 6. Enhanced Partners Section with Brand Colors */}
      <section id="partners" className="py-24 bg-gradient-to-br from-[#FF6B35]/5 via-[#4ECDC4]/5 to-white dark:from-[#FF6B35]/10 dark:via-[#4ECDC4]/10 dark:to-gray-900 relative overflow-hidden">
        {/* Animated Background Elements with Brand Colors */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-[#FF6B35]/20 to-[#4ECDC4]/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-[#4ECDC4]/20 to-[#FF6B35]/20 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-[#4ECDC4]/20 to-[#2C3E50]/20 rounded-full blur-lg animate-bounce" />
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          {/* Section Header with Brand Colors */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] text-white px-6 py-3 rounded-full mb-6 shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-semibold">Strategic Partnerships</span>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-300" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#2C3E50] via-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-[#2C3E50]/80 dark:text-white/80 max-w-3xl mx-auto leading-relaxed">
              Collaborating with government institutions, educational organizations, and technology leaders to revolutionize digital education across Africa.
            </p>
          </div>
          
          {/* Scrolling Partner Cards with Brand Color Effects - Reduced Size */}
          <div className="relative">
            <div className="flex overflow-hidden">
              <div className="flex animate-scroll-left space-x-6 items-center">
                {/* First set of enhanced partner cards */}
                {[
                  {
                    name: "Tabor Digital Solutions",
                    logo: "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753458890/tabor_digital_logo_cslwuf.png",
                    category: "Platform",
                    color: "from-[#4ECDC4] to-[#2C3E50]"
                  },
                  {
                    name: "Ministry of Education",
                    logo: "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753458245/MoE_pmkjts.jpg",
                    category: "Government",
                    color: "from-[#FF6B35] to-[#4ECDC4]"
                  },
                  {
                    name: "Ministry of Innovation",
                    logo: "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753458245/MoIT_kh6eyf.png",
                    category: "Technology",
                    color: "from-[#4ECDC4] to-[#FF6B35]"
                  },
                  {
                    name: "ALX",
                    logo: "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753458245/ALX_Blue_Logo__1_rsb3a5.png",
                    category: "Education",
                    color: "from-[#FF6B35] to-[#2C3E50]"
                  },
                  {
                    name: "ET Academy",
                    logo: "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753458245/et-academy_sxkt2k.jpg",
                    category: "Institution",
                    color: "from-[#2C3E50] to-[#4ECDC4]"
                  },
                  {
                    name: "African Leadership Excellence Academy",
                    logo: "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753464707/images_19_htekxr.jpg",
                    category: "Strategic",
                    color: "from-[#4ECDC4] to-[#FF6B35]"
                  },
                  {
                    name: "Imagine1day",
                    logo: "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753460433/897a5105-df66-479a-85fa-d986e48ff685.png",
                    category: "Technology",
                    color: "from-[#FF6B35] to-[#4ECDC4]"
                  },
                  {
                    name: "International Community School of Addis Ababa",
                    logo: "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753460322/3a04b683-2140-4c09-ba21-97226b8950b5.png",
                    category: "Innovation",
                    color: "from-[#4ECDC4] to-[#2C3E50]"
                  }
                ].map((partner, index) => (
                  <div
                    key={index}
                    className="group relative flex-shrink-0 w-48 h-32 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 cursor-pointer border border-[#E5E8E8] dark:border-gray-700 hover:border-[#4ECDC4]/40 dark:hover:border-[#4ECDC4]/40 overflow-hidden"
                  >
                    {/* Animated Background Gradient with Brand Colors */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${partner.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
                    
                    {/* Floating Elements with Brand Colors */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-ping" />
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-gradient-to-r from-[#4ECDC4] to-[#2C3E50] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 animate-ping" />
                    
                    {/* Logo Container with Brand Color Effects */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-20 mb-2">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          width={100}
                          height={50}
                          className="max-w-full max-h-full object-contain transition-all duration-700 group-hover:scale-125 group-hover:rotate-3 filter group-hover:drop-shadow-2xl group-hover:drop-shadow-[#4ECDC4]/20"
                          priority={index < 3}
                        />
                        
                        {/* Hover Glow Effect with Brand Colors */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35]/20 to-[#4ECDC4]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-150" />
                      </div>
                    </div>
                    
                    {/* Partner Info with Brand Colors */}
                    <div className="relative z-10 text-center">
                      <h3 className="font-bold text-[#2C3E50] dark:text-white text-xs mb-1 group-hover:text-[#4ECDC4] dark:group-hover:text-[#4ECDC4] transition-colors duration-300">
                        {partner.name}
                      </h3>
                      <span className="inline-block px-2 py-0.5 bg-gradient-to-r from-[#E5E8E8] to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-full text-xs font-medium text-[#2C3E50] dark:text-gray-300 group-hover:from-[#4ECDC4]/20 group-hover:to-[#FF6B35]/20 dark:group-hover:from-[#4ECDC4]/30 dark:group-hover:to-[#FF6B35]/30 transition-all duration-300">
                        {partner.category}
                      </span>
                    </div>
                    
                    {/* Animated Border with Brand Colors */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-[#FF6B35] group-hover:to-[#4ECDC4] transition-all duration-700" />
                  </div>
                ))}
                
                {/* Duplicate set for seamless loop */}
                {[
                  {
                    name: "Tabor Digital Solutions",
                    logo: "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753458890/tabor_digital_logo_cslwuf.png",
                    category: "Platform",
                    color: "from-[#4ECDC4] to-[#2C3E50]"
                  },
                  {
                    name: "Ministry of Education",
                    logo: "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753458245/MoE_pmkjts.jpg",
                    category: "Government",
                    color: "from-[#FF6B35] to-[#4ECDC4]"
                  },
                  {
                    name: "Ministry of Innovation",
                    logo: "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753458245/MoIT_kh6eyf.png",
                    category: "Technology",
                    color: "from-[#4ECDC4] to-[#FF6B35]"
                  },
                  {
                    name: "ALX Ethiopia",
                    logo: "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753458245/ALX_Blue_Logo__1_rsb3a5.png",
                    category: "Education",
                    color: "from-[#FF6B35] to-[#2C3E50]"
                  },
                  {
                    name: "ET Academy",
                    logo: "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753458245/et-academy_sxkt2k.jpg",
                    category: "Institution",
                    color: "from-[#2C3E50] to-[#4ECDC4]"
                  },
                  {
                    name: "Custom Partner",
                    logo: "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753464707/images_19_htekxr.jpg",
                    category: "Strategic",
                    color: "from-[#4ECDC4] to-[#FF6B35]"
                  },
                  {
                    name: "Partner 7",
                    logo: "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753460433/897a5105-df66-479a-85fa-d986e48ff685.png",
                    category: "Technology",
                    color: "from-[#FF6B35] to-[#4ECDC4]"
                  },
                  {
                    name: "Partner 8",
                    logo: "https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753460322/3a04b683-2140-4c09-ba21-97226b8950b5.png",
                    category: "Innovation",
                    color: "from-[#4ECDC4] to-[#2C3E50]"
                  }
                ].map((partner, index) => (
                  <div
                    key={`duplicate-${index}`}
                    className="group relative flex-shrink-0 w-48 h-32 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 cursor-pointer border border-[#E5E8E8] dark:border-gray-700 hover:border-[#4ECDC4]/40 dark:hover:border-[#4ECDC4]/40 overflow-hidden"
                  >
                    {/* Animated Background Gradient with Brand Colors */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${partner.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
                    
                    {/* Floating Elements with Brand Colors */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-ping" />
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-gradient-to-r from-[#4ECDC4] to-[#2C3E50] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 animate-ping" />
                    
                    {/* Logo Container with Brand Color Effects */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-20 mb-2">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          width={100}
                          height={50}
                          className="max-w-full max-h-full object-contain transition-all duration-700 group-hover:scale-125 group-hover:rotate-3 filter group-hover:drop-shadow-2xl group-hover:drop-shadow-[#4ECDC4]/20"
                        />
                        
                        {/* Hover Glow Effect with Brand Colors */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35]/20 to-[#4ECDC4]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-150" />
                      </div>
                    </div>
                    
                    {/* Partner Info with Brand Colors */}
                    <div className="relative z-10 text-center">
                      <h3 className="font-bold text-[#2C3E50] dark:text-white text-xs mb-1 group-hover:text-[#4ECDC4] dark:group-hover:text-[#4ECDC4] transition-colors duration-300">
                        {partner.name}
                      </h3>
                      <span className="inline-block px-2 py-0.5 bg-gradient-to-r from-[#E5E8E8] to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-full text-xs font-medium text-[#2C3E50] dark:text-gray-300 group-hover:from-[#4ECDC4]/20 group-hover:to-[#FF6B35]/20 dark:group-hover:from-[#4ECDC4]/30 dark:group-hover:to-[#FF6B35]/30 transition-all duration-300">
                        {partner.category}
                      </span>
                    </div>
                    
                    {/* Animated Border with Brand Colors */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-[#FF6B35] group-hover:to-[#4ECDC4] transition-all duration-700" />
                </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Enhanced Final Call-to-Action Section */}
      <section className="relative py-28 bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#38b6ff] overflow-hidden min-h-[650px]">
        {/* Darker overlay for more contrast */}
        <div className="absolute inset-0 bg-black/60 z-0" />
        {/* Animated Pattern Overlay */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="2" fill="#fff" opacity="0.10"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        {/* Wavy Divider at Bottom */}
        <div className="absolute bottom-0 left-0 w-full z-10">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#17494D" fillOpacity="1" d="M0,32 C360,80 1080,0 1440,48 L1440,80 L0,80 Z"/>
          </svg>
        </div>
        <div className="container px-4 md:px-6 relative z-20 h-full">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full">
            {/* Left: Text Content */}
            <div className="text-center md:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/40 shadow-lg">
                <Zap className="w-4 h-4 text-[#FF6B35] animate-pulse" />
                <span className="text-sm font-medium text-white drop-shadow">Ready to Transform Your Future?</span>
              </div>
              {/* Main Headline */}
              <h2 className="text-4xl md:text-6xl font-extrabold mb-8 text-white leading-tight drop-shadow-2xl animate-fade-in-up">
                Start Building Your Future,
                <span
                  className="block bg-gradient-to-r from-[#FF6B35] via-[#FFD166] to-[#43B0F1] bg-clip-text text-transparent animate-gradient-move drop-shadow-2xl"
                  style={{
                    backgroundSize: '200% 200%',
                    animation: 'gradient-move 3s ease-in-out infinite alternate',
                  }}
                >
                  for <span className="text-[#FFD166] drop-shadow-2xl">Free</span>
                </span>
              </h2>
              {/* Sub-headline */}
              <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed max-w-3xl mx-auto md:mx-0 drop-shadow-2xl font-semibold">
                Join thousands of successful entrepreneurs who have transformed their lives through our platform.
                Your journey from idea to income starts with a single click.
              </p>
              {/* Value Propositions */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="flex flex-col items-center text-center bg-[#17494D] rounded-2xl p-6 border border-[#FFD166]/60 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <Shield className="w-8 h-8 text-[#4ECDC4]" />
                  <h3 className="text-lg font-bold text-white mb-2 mt-4 drop-shadow">100% Free to Start</h3>
                  <p className="text-white/90 text-sm font-medium drop-shadow">No credit card required. Access premium content immediately.</p>
                </div>
                <div className="flex flex-col items-center text-center bg-[#17494D] rounded-2xl p-6 border border-[#FFD166]/60 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <Users className="w-8 h-8 text-[#FF6B35]" />
                  <h3 className="text-lg font-bold text-white mb-2 mt-4 drop-shadow">Expert Community</h3>
                  <p className="text-white/90 text-sm font-medium drop-shadow">Connect with mentors and fellow entrepreneurs across Ethiopia.</p>
                </div>
                <div className="flex flex-col items-center text-center bg-[#17494D] rounded-2xl p-6 border border-[#FFD166]/60 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <Award className="w-8 h-8 text-[#FFD166]" />
                  <h3 className="text-lg font-bold text-white mb-2 mt-4 drop-shadow">Real Results</h3>
                  <p className="text-white/90 text-sm font-medium drop-shadow">85% of our students launch profitable businesses within 6 months.</p>
                </div>
              </div>
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start items-center mb-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#FF6B35] to-[#43B0F1] hover:from-[#FFD166] hover:to-[#43B0F1] text-white shadow-2xl border-2 border-white/80 hover:shadow-3xl transition-all duration-300 hover:scale-105 text-lg px-8 py-4 group animate-pulse-cta font-bold"
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
                  className="border-2 border-[#17494D] text-[#17494D] bg-white hover:bg-[#FFD166]/80 text-lg px-8 py-4 group transition-all duration-300 font-bold"
                  asChild
                >
                  <Link href="/courses" className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Explore Courses
                  </Link>
                </Button>
              </div>
            </div>
            {/* Right: Image and Trust Indicators (keep your improved version here) */}
            <div className="flex flex-col items-end justify-center h-full w-full p-4">
              <div className="relative group">
                <span className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] blur-lg opacity-60 group-hover:opacity-90 transition duration-500 animate-glow"></span>
                <Image
                  src="https://res.cloudinary.com/dbn8jx8bh/image/upload/v1751697065/welcome_s9s8az.png"
                  alt="Welcome to Tabor Academy"
                  width={500}
                  height={500}
                  className="relative rounded-3xl shadow-2xl w-full max-w-[500px] object-contain z-10"
                  priority
                />
              </div>
              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-8 text-white/80 mt-8 w-full">
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
              <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 max-w-2xl w-full">
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
        </div>
      </section>

      {/* Sticky CTA Bar */}
      <StickyCTABar />
    </div>
  )
}
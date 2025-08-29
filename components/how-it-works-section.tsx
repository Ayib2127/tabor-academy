'use client';

import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Users, 
  Rocket, 
  ArrowRight, 
  CheckCircle,
  Play,
  Target,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  color: string;
  bgColor: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Discover & Learn",
    description: "Choose from our curated courses designed specifically for entrepreneurs. Learn at your own pace with mobile-first, offline-capable content.",
    icon: BookOpen,
    features: [
      "Mobile-optimized lessons",
      "Offline content access",
      "Interactive projects",
      "Progress tracking"
    ],
    color: "#4ECDC4",
    bgColor: "bg-[#4ECDC4]/10"
  },
  {
    number: 2,
    title: "Connect & Build",
    description: "Join our vibrant community of entrepreneurs. Get mentorship, collaborate on projects, and build your network across Ethiopia.",
    icon: Users,
    features: [
      "1-on-1 mentorship",
      "Peer collaboration",
      "Community support",
      "Expert guidance"
    ],
    color: "#FF6B35",
    bgColor: "bg-[#FF6B35]/10"
  },
  {
    number: 3,
    title: "Launch & Scale",
    description: "Turn your learning into action. Launch your business with confidence, backed by real-world projects and ongoing support from our community.",
    icon: Rocket,
    features: [
      "Business launch support",
      "Ongoing mentorship",
      "Success tracking",
      "Growth resources"
    ],
    color: "#1B4D3E",
    bgColor: "bg-[#1B4D3E]/10"
  }
];

export function HowItWorksSection() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [visibleConnectors, setVisibleConnectors] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  // Initialize steps for mobile devices immediately
  useEffect(() => {
    const isMobile = window.innerWidth < 1024; // lg breakpoint
    if (isMobile) {
      setVisibleSteps([1, 2, 3]);
      setVisibleConnectors([1, 2]);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate steps sequentially
            animateSteps();
          }
        });
      },
      {
        threshold: 0.1, // Reduced threshold for better mobile detection
        rootMargin: '0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Fallback: Show all steps after 2 seconds if intersection observer fails
    const fallbackTimer = setTimeout(() => {
      if (visibleSteps.length === 0) {
        setVisibleSteps([1, 2, 3]);
        setVisibleConnectors([1, 2]);
      }
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [visibleSteps.length]);

  const animateSteps = () => {
    // Reset animations
    setVisibleSteps([]);
    setVisibleConnectors([]);

    // Animate step 1
    setTimeout(() => setVisibleSteps([1]), 200);
    
    // Animate connector 1 and step 2
    setTimeout(() => {
      setVisibleConnectors([1]);
      setTimeout(() => setVisibleSteps(prev => [...prev, 2]), 300);
    }, 800);
    
    // Animate connector 2 and step 3
    setTimeout(() => {
      setVisibleConnectors(prev => [...prev, 2]);
      setTimeout(() => setVisibleSteps(prev => [...prev, 3]), 300);
    }, 1600);
  };

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-white via-[#F7F9F9] to-[#4ECDC4]/5 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#4ECDC4]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#FF6B35]/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container px-4 md:px-6 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-[#E5E8E8]">
            <Target className="w-4 h-4 text-[#4ECDC4]" />
            <span className="text-sm font-medium text-[#2C3E50]">Your Learning Journey</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-[#2C3E50] mb-6">
            How It Works:
            <span className="block bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent">
              From Learning to Launching
            </span>
          </h2>
          
          <p className="text-xl text-[#2C3E50]/80 leading-relaxed">
            Our proven 3-step process has helped thousands of entrepreneurs 
            turn their ideas into successful businesses.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-3 gap-8 relative">
              {/* Connecting Lines */}
              <div className="absolute top-24 left-0 right-0 flex items-center justify-between px-32">
                {[1, 2].map((connectorIndex) => (
                  <div
                    key={connectorIndex}
                    className={`h-1 bg-gradient-to-r from-[#4ECDC4] to-[#FF6B35] transition-all duration-1000 ${
                      visibleConnectors.includes(connectorIndex)
                        ? 'w-full opacity-100 scale-x-100'
                        : 'w-0 opacity-0 scale-x-0'
                    }`}
                    style={{
                      transformOrigin: 'left',
                      width: connectorIndex === 1 ? '200px' : '200px'
                    }}
                  />
                ))}
              </div>

              {/* Steps */}
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`relative transition-all duration-800 ${
                    visibleSteps.includes(step.number)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <StepCard step={step} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative px-2">
                {/* Vertical Connector */}
                {index < steps.length - 1 && (
                  <div className="absolute left-5 sm:left-6 top-24 w-0.5 h-16 bg-gradient-to-b from-[#4ECDC4] to-[#FF6B35] opacity-30" />
                )}
                <div
                  className={`transition-all duration-800 ${
                    visibleSteps.includes(step.number) || visibleSteps.length === 0
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 300}ms` }}
                >
                  <StepCard step={step} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stats */}
        <div className="mt-16 bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-[#E5E8E8]/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-[#4ECDC4]">
                92%
              </div>
              <div className="text-sm text-[#2C3E50]/70">Complete the program</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-[#FF6B35]">
                85%
              </div>
              <div className="text-sm text-[#2C3E50]/70">Launch their business</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-[#1B4D3E]">
                73%
              </div>
              <div className="text-sm text-[#2C3E50]/70">Generate income within 6 months</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-[#2C3E50]">
                4.9/5
              </div>
              <div className="text-sm text-[#2C3E50]/70">Average satisfaction rating</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] hover:from-[#FF6B35]/90 hover:to-[#4ECDC4]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            asChild
          >
            <Link href="/signup" className="flex items-center gap-2">
              Start Your Journey Today
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <p className="text-sm text-[#2C3E50]/60 mt-3">
            Join thousands of successful entrepreneurs
          </p>
        </div>
      </div>
    </section>
  );
}

function StepCard({ step }: { step: Step }) {
  const IconComponent = step.icon;
  
  return (
    <Card className="relative overflow-hidden border-[#E5E8E8] hover:border-[#4ECDC4]/40 transition-all duration-300 hover:shadow-xl group">
      {/* Step Number Badge */}
      <div 
        className="absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
        style={{ backgroundColor: step.color }}
      >
        {step.number}
      </div>

      {/* Background Gradient */}
      <div className={`absolute inset-0 ${step.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative p-6">
        {/* Icon */}
        <div 
          className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: `${step.color}20` }}
        >
          <IconComponent className="w-8 h-8" style={{ color: step.color }} />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-[#2C3E50] mb-3">
          {step.title}
        </h3>
        
        <p className="text-[#2C3E50]/70 text-sm leading-relaxed mb-4">
          {step.description}
        </p>

        {/* Features List */}
        <div className="space-y-2">
          {step.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#1B4D3E] flex-shrink-0" />
              <span className="text-sm text-[#2C3E50]/80">{feature}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <Button
            variant="outline"
            size="sm"
            className="w-full group-hover:border-current group-hover:text-current transition-colors"
            style={{ 
              borderColor: `${step.color}40`,
              color: step.color
            }}
            asChild
          >
            <Link href="/signup" className="flex items-center justify-center gap-2">
              {step.number === 1 && (
                <>
                  <Play className="w-4 h-4" />
                  Start Learning
                </>
              )}
              {step.number === 2 && (
                <>
                  <Users className="w-4 h-4" />
                  Join Community
                </>
              )}
              {step.number === 3 && (
                <>
                  <TrendingUp className="w-4 h-4" />
                  Launch Business
                </>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
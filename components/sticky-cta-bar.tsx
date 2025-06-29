'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, X, Zap } from 'lucide-react';
import Link from 'next/link';

export function StickyCTABar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the bar in this session
    const dismissed = sessionStorage.getItem('ctaBarDismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const handleScroll = () => {
      // Show the bar after scrolling past the hero section (approximately 100vh)
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight;
      
      if (scrollPosition > heroHeight * 0.8) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('ctaBarDismissed', 'true');
  };

  if (isDismissed) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transform transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] text-white shadow-2xl border-t border-white/20">
        <div className="container px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Message */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="font-semibold text-sm">Ready to transform your future?</p>
                <p className="text-xs text-white/90">Join 10,000+ entrepreneurs learning with Tabor Academy</p>
              </div>
              <div className="sm:hidden">
                <p className="font-semibold text-sm">Start your journey today!</p>
              </div>
            </div>

            {/* Right side - CTA and Dismiss */}
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                className="bg-white text-[#FF6B35] hover:bg-white/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                asChild
              >
                <Link href="/signup" className="flex items-center gap-2">
                  <span className="hidden sm:inline">Start Learning Free</span>
                  <span className="sm:hidden">Start Free</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-white hover:bg-white/10 p-1"
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Dismiss</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
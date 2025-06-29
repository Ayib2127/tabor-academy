'use client';

import { useEffect, useState, useRef } from 'react';

interface Stats {
  totalStudents: number;
  countriesServed: number;
  successRate: number;
  businessesLaunched: number;
}

export function AnimatedStats() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    countriesServed: 0,
    successRate: 0,
    businessesLaunched: 0,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/public-stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Fallback to static values
        setStats({
          totalStudents: 10000,
          countriesServed: 15,
          successRate: 85,
          businessesLaunched: 2500,
        });
      }
    };

    fetchStats();
  }, []);

  // Intersection Observer for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true);
            setHasAnimated(true);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-50px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  // Animation function
  const animateValue = (start: number, end: number, duration: number, callback: (value: number) => void) => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max((endTime - now) / duration, 0);
      const value = Math.round(end - (remaining * (end - start)));

      callback(value);

      if (value === end) {
        clearInterval(timer);
      }
    }, 16);
  };

  // Animated counters
  const [displayStats, setDisplayStats] = useState({
    totalStudents: 0,
    countriesServed: 0,
    successRate: 0,
    businessesLaunched: 0,
  });

  useEffect(() => {
    if (isVisible && stats.totalStudents > 0) {
      // Animate each stat with different delays
      setTimeout(() => {
        animateValue(0, stats.totalStudents, 2000, (value) => {
          setDisplayStats(prev => ({ ...prev, totalStudents: value }));
        });
      }, 200);

      setTimeout(() => {
        animateValue(0, stats.countriesServed, 1500, (value) => {
          setDisplayStats(prev => ({ ...prev, countriesServed: value }));
        });
      }, 400);

      setTimeout(() => {
        animateValue(0, stats.successRate, 1800, (value) => {
          setDisplayStats(prev => ({ ...prev, successRate: value }));
        });
      }, 600);

      setTimeout(() => {
        animateValue(0, stats.businessesLaunched, 2200, (value) => {
          setDisplayStats(prev => ({ ...prev, businessesLaunched: value }));
        });
      }, 800);
    }
  }, [isVisible, stats]);

  return (
    <div ref={sectionRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div className="space-y-2">
        <div 
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {displayStats.totalStudents.toLocaleString()}+
        </div>
        <div className="text-sm text-[#2C3E50]/70">Active Learners</div>
      </div>
      <div className="space-y-2">
        <div 
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {displayStats.countriesServed}+
        </div>
        <div className="text-sm text-[#2C3E50]/70">Countries Served</div>
      </div>
      <div className="space-y-2">
        <div 
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {displayStats.successRate}%
        </div>
        <div className="text-sm text-[#2C3E50]/70">Success Rate</div>
      </div>
      <div className="space-y-2">
        <div 
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {displayStats.businessesLaunched.toLocaleString()}+
        </div>
        <div className="text-sm text-[#2C3E50]/70">Businesses Launched</div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  Star, 
  TrendingUp, 
  MapPin, 
  Calendar,
  DollarSign,
  Users,
  Award,
  Play,
  ExternalLink,
  Hammer,
  Zap,
  Smartphone
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

interface SuccessStory {
  id: string;
  name: string;
  location: string;
  country: string;
  image_url: string;
  business_name: string;
  business_type: string;
  course_taken: string;
  time_to_launch: string;
  monthly_revenue: string;
  employees_hired: number;
  quote: string;
  achievement: string;
  rating: number;
  video_url?: string;
  linkedin_url?: string;
  business_url?: string;
  before_story: string;
  after_story: string;
  is_featured: boolean;
  display_order: number;
}

export function SuccessStoriesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [visibleCards, setVisibleCards] = useState(3);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch testimonials from Supabase
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_featured', true)
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Error fetching testimonials:', error);
          // Fallback to mock data if Supabase fails
          setSuccessStories(mockSuccessStories);
        } else if (data && data.length > 0) {
          // Transform data to ensure all required fields are present
          const transformedData = data.map(item => ({
            id: item.id || `story-${Math.random()}`,
            name: item.name || item.full_name || 'Anonymous',
            location: item.location || 'Unknown',
            country: item.country || 'Unknown',
            image_url: item.image_url || item.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            business_name: item.business_name || item.company || 'Business',
            business_type: item.business_type || item.industry || 'Business',
            course_taken: item.course_taken || item.course_name || 'Course',
            time_to_launch: item.time_to_launch || '3 months',
            monthly_revenue: item.monthly_revenue || '$3,000',
            employees_hired: item.employees_hired || 2,
            quote: item.quote || item.testimonial || 'Great experience with Tabor Academy!',
            achievement: item.achievement || 'Successfully launched business',
            rating: item.rating || 5,
            video_url: item.video_url || '#',
            linkedin_url: item.linkedin_url || '#',
            business_url: item.business_url || '#',
            before_story: item.before_story || 'Started from scratch',
            after_story: item.after_story || 'Built a successful business',
            is_featured: item.is_featured || true,
            display_order: item.display_order || 1
          }));
          setSuccessStories(transformedData);
        } else {
          // Use mock data if no testimonials in database
          setSuccessStories(mockSuccessStories);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setSuccessStories(mockSuccessStories);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Responsive card visibility
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && successStories.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => 
          prev + visibleCards >= successStories.length ? 0 : prev + 1
        );
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, visibleCards, successStories.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => 
      prev + visibleCards >= successStories.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, successStories.length - visibleCards) : prev - 1
    );
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  // Auto-advance logic
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % successStories.length);
    }, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [successStories.length]);

  // Dot click handler
  const goToIndex = (idx: number) => {
    setCurrentIndex(idx);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % successStories.length);
      }, 4000);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-white via-[#F7F9F9] to-[#4ECDC4]/5">
        <div className="container px-4 md:px-6">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-[#E5E8E8] rounded w-64 mx-auto mb-4"></div>
              <div className="h-12 bg-[#E5E8E8] rounded w-96 mx-auto mb-8"></div>
              <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-96 bg-[#E5E8E8] rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-[#FF6B35]/10 via-[#4ECDC4]/10 to-white dark:from-[#FF6B35]/20 dark:via-[#4ECDC4]/20 dark:to-gray-900 overflow-hidden">
      {/* Optional: SVG or pattern overlay */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
      {/* Optional: Animated shapes */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-[#FF6B35]/10 to-[#4ECDC4]/10 rounded-full blur-3xl animate-pulse" />
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-8">
          Success Stories
          </h2>
        <div className="w-full max-w-lg mx-auto flex flex-col items-center">
          {/* Only one card visible, centered */}
          <div className="relative w-full">
            {successStories && successStories.length > 0 ? (
              <SuccessStoryCard story={successStories[currentIndex]} />
            ) : (
              <div className="text-center py-12 text-gray-400">Loading...</div>
            )}
        </div>
          {/* Dots navigation */}
          <div className="flex justify-center mt-6 space-x-2">
            {successStories && successStories.length > 0 &&
              successStories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "bg-[#4ECDC4] scale-125 shadow"
                      : "bg-gray-300 dark:bg-gray-700"
                  }`}
                  aria-label={`Go to story ${idx + 1}`}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SuccessStoryCard({ story }: { story: SuccessStory }) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Safety check to ensure all required fields are present
  const safeStory = {
    id: story?.id || 'default',
    name: story?.name || 'Anonymous',
    location: story?.location || 'Unknown',
    country: story?.country || 'Unknown',
    image_url: story?.image_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    business_name: story?.business_name || 'Business',
    business_type: story?.business_type || 'Business',
    course_taken: story?.course_taken || 'Course',
    time_to_launch: story?.time_to_launch || '3 months',
    monthly_revenue: story?.monthly_revenue || '$3,000',
    employees_hired: story?.employees_hired || 2,
    quote: story?.quote || 'Great experience with Tabor Academy!',
    achievement: story?.achievement || 'Successfully launched business',
    rating: story?.rating || 5,
    video_url: story?.video_url || '#',
    linkedin_url: story?.linkedin_url || '#',
    business_url: story?.business_url || '#',
    before_story: story?.before_story || 'Started from scratch',
    after_story: story?.after_story || 'Built a successful business',
    is_featured: story?.is_featured || true,
    display_order: story?.display_order || 1
  };

  return (
    <div className="relative h-[500px] perspective-1000">
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of Card */}
        <Card className="absolute inset-0 backface-hidden border-[#E5E8E8] hover:border-[#4ECDC4]/40 transition-all duration-300 hover:shadow-xl overflow-hidden">
          <CardContent className="p-0 h-full flex flex-col">
            {/* Header with Image and Basic Info */}
            <div className="relative h-48 bg-gradient-to-br from-[#4ECDC4]/20 to-[#FF6B35]/20">
              <Image
                src={safeStory.image_url}
                alt={safeStory.name}
                fill
                className="object-cover"
                loading="lazy"
                onError={(e) => {
                  // Fallback to a default image if the original fails
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Play Button Overlay */}
              {safeStory.video_url && safeStory.video_url !== '#' && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                  <Button
                    size="icon"
                    className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-[#2C3E50]"
                  >
                    <Play className="w-6 h-6 ml-1" />
                  </Button>
                </div>
              )}
              
              {/* Country Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/90 text-[#2C3E50] border-0">
                  <MapPin className="w-3 h-3 mr-1" />
                  {safeStory.country}
                </Badge>
              </div>
              
              {/* Rating */}
              <div className="absolute bottom-4 left-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${
                      i < safeStory.rating ? 'fill-[#FF6B35] text-[#FF6B35]' : 'text-white/50'
                    }`} 
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-[#2C3E50] mb-1">{safeStory.name}</h3>
                <p className="text-sm text-[#2C3E50]/70 mb-2">{safeStory.location}, {safeStory.country}</p>
                <Badge variant="outline" className="border-[#4ECDC4]/30 text-[#4ECDC4] text-xs">
                  {safeStory.business_type}
                </Badge>
              </div>

              <div className="relative mb-4">
                <Quote className="w-6 h-6 text-[#4ECDC4]/30 absolute -top-2 -left-1" />
                <p className="text-[#2C3E50]/80 text-sm leading-relaxed pl-4 line-clamp-3">
                  {safeStory.quote}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-[#4ECDC4]/5 rounded-lg">
                  <div className="text-lg font-bold text-[#4ECDC4]">{safeStory.monthly_revenue}</div>
                  <div className="text-xs text-[#2C3E50]/60">Monthly Revenue</div>
                </div>
                <div className="text-center p-3 bg-[#FF6B35]/5 rounded-lg">
                  <div className="text-lg font-bold text-[#FF6B35]">{safeStory.time_to_launch}</div>
                  <div className="text-xs text-[#2C3E50]/60">Time to Launch</div>
                </div>
              </div>

              {/* Flip Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFlipped(true)}
                className="mt-auto border-[#4ECDC4]/30 text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white"
              >
                View Full Story
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Back of Card */}
        <Card className="absolute inset-0 backface-hidden rotate-y-180 border-[#E5E8E8] overflow-hidden">
          <CardContent className="p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#2C3E50]">{safeStory.business_name}</h3>
                <p className="text-sm text-[#2C3E50]/70">{safeStory.name}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFlipped(false)}
                className="text-[#2C3E50]/60 hover:text-[#2C3E50]"
              >
                ← Back
              </Button>
            </div>

            {/* Before & After */}
            <div className="mb-6">
              <h4 className="font-semibold text-[#2C3E50] mb-3">Transformation Journey</h4>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-200">
                  <div className="text-xs font-medium text-red-600 mb-1">BEFORE</div>
                  <div className="text-sm text-[#2C3E50]">{safeStory.before_story}</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-200">
                  <div className="text-xs font-medium text-green-600 mb-1">AFTER</div>
                  <div className="text-sm text-[#2C3E50]">{safeStory.after_story}</div>
                </div>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="mb-6">
              <h4 className="font-semibold text-[#2C3E50] mb-3">Business Impact</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#1B4D3E]" />
                  <div>
                    <div className="text-sm font-medium text-[#2C3E50]">{safeStory.monthly_revenue}</div>
                    <div className="text-xs text-[#2C3E50]/60">Monthly Revenue</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#4ECDC4]" />
                  <div>
                    <div className="text-sm font-medium text-[#2C3E50]">{safeStory.employees_hired}</div>
                    <div className="text-xs text-[#2C3E50]/60">Employees Hired</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#FF6B35]" />
                  <div>
                    <div className="text-sm font-medium text-[#2C3E50]">{safeStory.time_to_launch}</div>
                    <div className="text-xs text-[#2C3E50]/60">Time to Launch</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#1B4D3E]" />
                  <div>
                    <div className="text-sm font-medium text-[#2C3E50]">Growing</div>
                    <div className="text-xs text-[#2C3E50]/60">Business Status</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="mb-6">
              <div className="p-3 bg-[#1B4D3E]/5 rounded-lg border border-[#1B4D3E]/20">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-[#1B4D3E]" />
                  <span className="text-xs font-medium text-[#1B4D3E]">KEY ACHIEVEMENT</span>
                </div>
                <p className="text-sm text-[#2C3E50]">{safeStory.achievement}</p>
              </div>
            </div>

            {/* Action Links */}
            <div className="mt-auto space-y-2">
              <div className="flex gap-2">
                {safeStory.business_url && safeStory.business_url !== '#' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-[#4ECDC4]/30 text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white"
                    asChild
                  >
                    <Link href={safeStory.business_url} target="_blank">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Visit Business
                    </Link>
                  </Button>
                )}
                {safeStory.video_url && safeStory.video_url !== '#' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-[#FF6B35]/30 text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
                    asChild
                  >
                    <Link href={safeStory.video_url} target="_blank">
                      <Play className="w-3 h-3 mr-1" />
                      Watch Story
                    </Link>
                  </Button>
                )}
              </div>
              <Badge variant="outline" className="w-full justify-center border-[#E5E8E8] text-[#2C3E50]/60">
                Course: {safeStory.course_taken}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Fallback mock data in case Supabase is not available
const mockSuccessStories: SuccessStory[] = [
  {
    id: '1',
    name: 'Sarah Mwangi',
    location: 'Nairobi',
    country: 'Kenya',
    image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    business_name: 'Digital Reach Ethiopia',
    business_type: 'Digital Marketing Agency',
    course_taken: 'Digital Marketing Mastery',
    time_to_launch: '3 months',
    monthly_revenue: '$4,200',
    employees_hired: 5,
    quote: "Tabor Academy didn't just teach me digital marketing - it gave me the confidence to build a business that serves clients across East Ethiopia. The mentorship was invaluable.",
    achievement: 'Scaled to 15+ clients in 6 months',
    rating: 5,
    video_url: '#',
    linkedin_url: '#',
    business_url: '#',
    before_story: 'Unemployed graduate struggling to find work',
    after_story: 'CEO of a thriving digital marketing agency',
    is_featured: true,
    display_order: 1
  },
  {
    id: '2',
    name: 'John Okafor',
    location: 'Lagos',
    country: 'Nigeria',
    image_url: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    business_name: 'NoCode Solutions NG',
    business_type: 'App Development',
    course_taken: 'No-Code Development',
    time_to_launch: '2 months',
    monthly_revenue: '$3,800',
    employees_hired: 3,
    quote: "The no-code course opened my eyes to possibilities I never knew existed. Now I'm building apps for local businesses and teaching others in my community.",
    achievement: 'Built 12 apps for local businesses',
    rating: 5,
    video_url: '#',
    linkedin_url: '#',
    business_url: '#',
    before_story: 'Taxi driver with a passion for technology',
    after_story: 'Successful app developer and community educator',
    is_featured: true,
    display_order: 2
  },
  {
    id: '3',
    name: 'Grace Mensah',
    location: 'Accra',
    country: 'Ghana',
    image_url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    business_name: 'Afri-Style Boutique',
    business_type: 'E-commerce Fashion',
    course_taken: 'E-commerce & Digital Marketing',
    time_to_launch: '4 months',
    monthly_revenue: '$2,900',
    employees_hired: 4,
    quote: "The mentorship program gave me the confidence to start my e-commerce business. My sales grow every month, and I'm now expanding to other West Ethiopian countries.",
    achievement: 'Expanded to 3 countries in first year',
    rating: 5,
    video_url: '#',
    linkedin_url: '#',
    business_url: '#',
    before_story: 'Small market vendor with limited reach',
    after_story: 'International e-commerce entrepreneur',
    is_featured: true,
    display_order: 3
  }
];
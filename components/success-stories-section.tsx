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
  ExternalLink
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
          setSuccessStories(data);
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
    <section id="success-stories" className="py-20 bg-gradient-to-br from-white via-[#F7F9F9] to-[#4ECDC4]/5 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#FF6B35]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#4ECDC4]/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container px-4 md:px-6 relative">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-[#E5E8E8]">
            <Award className="w-4 h-4 text-[#1B4D3E]" />
            <span className="text-sm font-medium text-[#1B4D3E]">Success Stories</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-[#2C3E50] mb-6">
            Real Students,
            <span className="block bg-gradient-to-r from-[#FF6B35] to-[#1B4D3E] bg-clip-text text-transparent">
              Real Success
            </span>
          </h2>
          
          <p className="text-xl text-[#2C3E50]/80 leading-relaxed">
            Meet the entrepreneurs who transformed their lives through Tabor Academy. 
            Their journeys from learning to launching inspire thousands across Africa.
          </p>
        </div>

        {/* Success Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent mb-2">
              2,500+
            </div>
            <div className="text-sm text-[#2C3E50]/70">Businesses Launched</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent mb-2">
              $12M+
            </div>
            <div className="text-sm text-[#2C3E50]/70">Revenue Generated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent mb-2">
              8,000+
            </div>
            <div className="text-sm text-[#2C3E50]/70">Jobs Created</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent mb-2">
              15
            </div>
            <div className="text-sm text-[#2C3E50]/70">Countries Impacted</div>
          </div>
        </div>

        {/* Carousel Container */}
        {successStories.length > 0 && (
          <div className="relative">
            {/* Navigation Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-[#E5E8E8] hover:border-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-[#E5E8E8] hover:border-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Carousel Content */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                  width: `${(successStories.length / visibleCards) * 100}%`
                }}
              >
                {successStories.map((story, index) => (
                  <div 
                    key={story.id}
                    className="px-3"
                    style={{ width: `${100 / successStories.length}%` }}
                  >
                    <SuccessStoryCard story={story} />
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(successStories.length / visibleCards) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    Math.floor(currentIndex / visibleCards) === index
                      ? 'bg-[#4ECDC4] scale-125'
                      : 'bg-[#E5E8E8] hover:bg-[#4ECDC4]/50'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-[#E5E8E8]/50 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">
              Ready to Write Your Success Story?
            </h3>
            <p className="text-[#2C3E50]/70 mb-6">
              Join thousands of African entrepreneurs who have transformed their lives through our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] hover:from-[#FF6B35]/90 hover:to-[#4ECDC4]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link href="/signup">Start Your Journey</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white"
                asChild
              >
                <Link href="/success-stories">View All Stories</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SuccessStoryCard({ story }: { story: SuccessStory }) {
  const [isFlipped, setIsFlipped] = useState(false);

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
                src={story.image_url}
                alt={story.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Play Button Overlay */}
              {story.video_url && story.video_url !== '#' && (
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
                  {story.country}
                </Badge>
              </div>
              
              {/* Rating */}
              <div className="absolute bottom-4 left-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${
                      i < story.rating ? 'fill-[#FF6B35] text-[#FF6B35]' : 'text-white/50'
                    }`} 
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-[#2C3E50] mb-1">{story.name}</h3>
                <p className="text-sm text-[#2C3E50]/70 mb-2">{story.location}, {story.country}</p>
                <Badge variant="outline" className="border-[#4ECDC4]/30 text-[#4ECDC4] text-xs">
                  {story.business_type}
                </Badge>
              </div>

              <div className="relative mb-4">
                <Quote className="w-6 h-6 text-[#4ECDC4]/30 absolute -top-2 -left-1" />
                <p className="text-[#2C3E50]/80 text-sm leading-relaxed pl-4 line-clamp-3">
                  {story.quote}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-[#4ECDC4]/5 rounded-lg">
                  <div className="text-lg font-bold text-[#4ECDC4]">{story.monthly_revenue}</div>
                  <div className="text-xs text-[#2C3E50]/60">Monthly Revenue</div>
                </div>
                <div className="text-center p-3 bg-[#FF6B35]/5 rounded-lg">
                  <div className="text-lg font-bold text-[#FF6B35]">{story.time_to_launch}</div>
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
                <h3 className="text-lg font-bold text-[#2C3E50]">{story.business_name}</h3>
                <p className="text-sm text-[#2C3E50]/70">{story.name}</p>
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
                  <div className="text-sm text-[#2C3E50]">{story.before_story}</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-200">
                  <div className="text-xs font-medium text-green-600 mb-1">AFTER</div>
                  <div className="text-sm text-[#2C3E50]">{story.after_story}</div>
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
                    <div className="text-sm font-medium text-[#2C3E50]">{story.monthly_revenue}</div>
                    <div className="text-xs text-[#2C3E50]/60">Monthly Revenue</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#4ECDC4]" />
                  <div>
                    <div className="text-sm font-medium text-[#2C3E50]">{story.employees_hired}</div>
                    <div className="text-xs text-[#2C3E50]/60">Employees Hired</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#FF6B35]" />
                  <div>
                    <div className="text-sm font-medium text-[#2C3E50]">{story.time_to_launch}</div>
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
                <p className="text-sm text-[#2C3E50]">{story.achievement}</p>
              </div>
            </div>

            {/* Action Links */}
            <div className="mt-auto space-y-2">
              <div className="flex gap-2">
                {story.business_url && story.business_url !== '#' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-[#4ECDC4]/30 text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white"
                    asChild
                  >
                    <Link href={story.business_url} target="_blank">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Visit Business
                    </Link>
                  </Button>
                )}
                {story.video_url && story.video_url !== '#' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-[#FF6B35]/30 text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
                    asChild
                  >
                    <Link href={story.video_url} target="_blank">
                      <Play className="w-3 h-3 mr-1" />
                      Watch Story
                    </Link>
                  </Button>
                )}
              </div>
              <Badge variant="outline" className="w-full justify-center border-[#E5E8E8] text-[#2C3E50]/60">
                Course: {story.course_taken}
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
    business_name: 'Digital Reach Africa',
    business_type: 'Digital Marketing Agency',
    course_taken: 'Digital Marketing Mastery',
    time_to_launch: '3 months',
    monthly_revenue: '$4,200',
    employees_hired: 5,
    quote: "Tabor Academy didn't just teach me digital marketing - it gave me the confidence to build a business that serves clients across East Africa. The mentorship was invaluable.",
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
    quote: "The mentorship program gave me the confidence to start my e-commerce business. My sales grow every month, and I'm now expanding to other West African countries.",
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
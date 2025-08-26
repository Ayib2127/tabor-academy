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
  Linkedin,
  Globe,
  Hammer,
  Zap,
  Smartphone
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { SafeImage } from '@/components/ui/safe-image';

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
  const USE_GRID_UI = true;

  // Fetch testimonials from Supabase (with dev-local override)
  useEffect(() => {
    const USE_LOCAL_TESTIMONIALS = true;

    const localSuccessStories: SuccessStory[] = [
      {
        id: 'story-ethiopia-sara-abebe',
        name: 'Sara Abebe',
        location: 'Addis Ababa',
        country: 'Ethiopia',
        image_url: 'https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753964517/jerry_we8wvb.jpg',
        business_name: 'Selam Crafts',
        business_type: 'E‑commerce (Handmade Goods)',
        course_taken: 'Digital Marketing Mastery',
        time_to_launch: '3 months',
        monthly_revenue: 'ETB 180,000',
        employees_hired: 3,
        quote: 'Tabor Academy gave me the skills and confidence to take Selam Crafts online. Sales grew every single month.',
        achievement: 'Launched online store and tripled monthly revenue',
        rating: 5,
        before_story: 'Sold locally at weekend markets with unpredictable foot traffic.',
        after_story: 'Built a successful business with targeted ads and nationwide delivery.',
        is_featured: true,
        display_order: 1
      },
      {
        id: 'story-ethiopia-hafiza-mohammed',
        name: 'Hafiza Mohammed',
        location: 'Addis Ababa',
        country: 'Ethiopia',
        image_url: 'https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753964503/iman_bbbcqy.jpg',
        business_name: 'NoCode Solutions',
        business_type: 'App Development',
        course_taken: 'No-Code Development',
        time_to_launch: '2 months',
        monthly_revenue: 'ETB 160,000',
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
        id: 'story-ethiopia-solomon-taye',
        name: 'Solomon Taye',
        location: 'Hawassa',
        country: 'Ethiopia',
        image_url: 'https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753889820/Mebratu_Admasu_tvpgza.png',
        business_name: 'Hawassa Style Boutique',
        business_type: 'E-commerce Fashion',
        course_taken: 'E-commerce & Digital Marketing',
        time_to_launch: '4 months',
        monthly_revenue: 'ETB 120,000',
        employees_hired: 4,
        quote: 'The mentorship program gave me the confidence to start my e-commerce business. My sales grow every month.',
        achievement: 'Expanded to 3 regions in first year',
        rating: 5,
        video_url: '#',
        linkedin_url: '#',
        business_url: '#',
        before_story: 'Small market vendor with limited reach',
        after_story: 'Growing e-commerce entrepreneur',
        is_featured: true,
        display_order: 3
      },
      {
        id: 'story-ethiopia-hana-girma',
        name: 'Hana Girma',
        location: 'Addis Ababa',
        country: 'Ethiopia',
        image_url: 'https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753884018/hana_girma_cxui38.png',
        business_name: 'Hana Creative Studio',
        business_type: 'Digital Services',
        course_taken: 'Digital Marketing Mastery',
        time_to_launch: '3 months',
        monthly_revenue: 'ETB 140,000',
        employees_hired: 2,
        quote: 'Clear lessons and real projects helped me land my first clients and grow consistently.',
        achievement: 'From freelancer to studio owner',
        rating: 5,
        video_url: '#',
        linkedin_url: '#',
        business_url: '#',
        before_story: 'Freelancer with inconsistent income',
        after_story: 'Stable client pipeline and growing team',
        is_featured: true,
        display_order: 4
      },
      {
        id: 'story-ethiopia-mahlet-dereje',
        name: 'Mahlet Dereje',
        location: 'Bahirdar',
        country: 'Ethiopia',
        image_url: 'https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753889661/mahi2_lxcedd.png',
        business_name: 'Blue Nile Handcrafts',
        business_type: 'E‑commerce (Handmade Goods)',
        course_taken: 'E-commerce & Digital Marketing',
        time_to_launch: '5 months',
        monthly_revenue: 'ETB 110,000',
        employees_hired: 3,
        quote: 'I learned how to package my products and reach customers across Ethiopia.',
        achievement: 'Launched online store with nationwide delivery',
        rating: 5,
        video_url: '#',
        linkedin_url: '#',
        business_url: '#',
        before_story: 'Local artisan selling only in-person',
        after_story: 'Online storefront with repeat customers',
        is_featured: true,
        display_order: 5
      }
    ];

    if (USE_LOCAL_TESTIMONIALS) {
      setSuccessStories(localSuccessStories);
      setLoading(false);
      return;
    }

    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_featured', true)
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Error fetching testimonials:', error);
          setSuccessStories(mockSuccessStories);
        } else if (data && data.length > 0) {
          const transformedData = data.map(item => ({
            id: item.id || `story-${Math.random()}`,
            name: item.name || item.full_name || 'Anonymous',
            location: item.location || 'Unknown',
            country: item.country || 'Unknown',
            image_url: item.image_url || item.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
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
      }, 8000);
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
    }, 7000);
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
    <section className="relative py-16 bg-gradient-to-br from-[#FF6B35]/5 via-[#4ECDC4]/5 to-white dark:from-[#FF6B35]/10 dark:via-[#4ECDC4]/10 dark:to-gray-900 overflow-hidden">
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">Success Stories</h2>

        {USE_GRID_UI ? (
          // Two-row continuous marquee, preserving card layout
          <div className="space-y-8">
            {/* Row 1 */}
            <div className="relative overflow-hidden">
              <div className="flex items-stretch gap-6 w-max animate-scroll-left">
                {([...(successStories || []), ...(successStories || [])]).map((story, idx) => (
                  <div key={`${story.id}-r1-${idx}`} className="w-[340px] sm:w-[360px] lg:w-[380px] flex-shrink-0">
                    <SimpleStoryCard story={story} />
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2 acts as continuation of Row 1 via negative offset */}
            <div className="relative overflow-hidden">
              <div className="flex items-stretch gap-6 w-max animate-scroll-right [animation-delay:-15s]">
                {([...(successStories || []), ...(successStories || [])]).map((story, idx) => (
                  <div key={`${story.id}-r2-${idx}`} className="w-[340px] sm:w-[360px] lg:w-[380px] flex-shrink-0">
                    <SimpleStoryCard story={story} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-lg mx-auto flex flex-col items-center">
            <div className="relative w-full">
              {successStories && successStories.length > 0 ? (
                <SuccessStoryCard story={successStories[currentIndex]} />
              ) : (
                <div className="text-center py-12 text-gray-400">Loading...</div>
              )}
            </div>
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
        )}
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
    image_url: story?.image_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
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
    <div className="relative h-[560px] md:h-[620px] perspective-1000">
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of Card */}
        <Card className="absolute inset-0 backface-hidden border-[#E5E8E8] hover:border-[#4ECDC4]/40 transition-all duration-300 hover:shadow-xl overflow-hidden">
          <CardContent className="p-0 h-full flex flex-col">
            {/* Header with Image and Basic Info */}
            <div className="relative h-80 md:h-96 bg-white rounded-t-md flex items-center justify-center">
              <div
                className="relative w-[72%] h-[94%] overflow-hidden"
                style={{ clipPath: 'ellipse(38% 66% at 50% 40%)' }}
              >
                <SafeImage
                  src={safeStory.image_url}
                  alt={safeStory.name}
                  fill
                  className="object-cover object-top"
                  style={(story?.id === 'story-ethiopia-hafiza-mohammed' || (story as any)?.name?.toLowerCase?.()?.includes('hafiza')) ? { objectPosition: '50% 15%' } : undefined}
                  loading="lazy"
                  fallback="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                />
              </div>
              
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
              
              {/* Country and City */}
              <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
                <Badge className="bg-white/90 text-[#2C3E50] border-0">
                  <MapPin className="w-3 h-3 mr-1" />
                  {safeStory.country}
                </Badge>
                <span className="text-xs px-2 py-0.5 rounded bg-white/80 text-[#2C3E50] shadow-sm">
                  {safeStory.location}
                </span>
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
                <h3 className="font-bold text-lg text-[#2C3E50] mb-1">{safeStory.name}</h3>
                <p className="text-sm text-[#2C3E50]/70">{safeStory.business_name} • {safeStory.business_type}</p>
              </div>
              
              <div className="flex-1">
                <blockquote className="text-[#2C3E50] italic mb-4">
                  "{safeStory.quote}"
                </blockquote>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center p-2 bg-[#F7F9F9] rounded">
                    <div className="font-bold text-[#4ECDC4]">{safeStory.monthly_revenue}</div>
                    <div className="text-[#2C3E50]/70">Monthly Revenue</div>
                  </div>
                  <div className="text-center p-2 bg-[#F7F9F9] rounded">
                    <div className="font-bold text-[#FF6B35]">{safeStory.employees_hired}</div>
                    <div className="text-[#2C3E50]/70">Employees</div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="mt-4 w-full py-2 bg-gradient-to-r from-[#4ECDC4] to-[#FF6B35] text-white rounded-lg font-semibold hover:from-[#4ECDC4]/90 hover:to-[#FF6B35]/90 transition-all"
              >
                Read Full Story
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Back of Card */}
        <Card className="absolute inset-0 backface-hidden border-[#E5E8E8] rotate-y-180 hover:border-[#4ECDC4]/40 transition-all duration-300 hover:shadow-xl overflow-hidden">
          <CardContent className="p-6 h-full flex flex-col">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-[#2C3E50] mb-4">Success Journey</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#4ECDC4] mb-2">Before</h4>
                  <p className="text-sm text-[#2C3E50]/80">{safeStory.before_story}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-[#FF6B35] mb-2">After</h4>
                  <p className="text-sm text-[#2C3E50]/80">{safeStory.after_story}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center p-2 bg-[#F7F9F9] rounded">
                    <div className="font-bold text-[#4ECDC4]">{safeStory.time_to_launch}</div>
                    <div className="text-[#2C3E50]/70">Time to Launch</div>
                  </div>
                  <div className="text-center p-2 bg-[#F7F9F9] rounded">
                    <div className="font-bold text-[#FF6B35]">{safeStory.course_taken}</div>
                    <div className="text-[#2C3E50]/70">Course Taken</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              {safeStory.linkedin_url && safeStory.linkedin_url !== '#' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white"
                  onClick={() => window.open(safeStory.linkedin_url, '_blank')}
                >
                  <Linkedin className="w-4 h-4 mr-1" />
                  LinkedIn
                </Button>
              )}
              {safeStory.business_url && safeStory.business_url !== '#' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
                  onClick={() => window.open(safeStory.business_url, '_blank')}
                >
                  <Globe className="w-4 h-4 mr-1" />
                  Website
                </Button>
              )}
            </div>
            
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="mt-3 w-full py-2 bg-gradient-to-r from-[#4ECDC4] to-[#FF6B35] text-white rounded-lg font-semibold hover:from-[#4ECDC4]/90 hover:to-[#FF6B35]/90 transition-all"
            >
              Back to Front
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SimpleStoryCard({ story }: { story: SuccessStory }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const safeStory = {
    id: story?.id || 'default',
    name: story?.name || 'Anonymous',
    location: story?.location || 'Unknown',
    country: story?.country || 'Unknown',
    image_url: story?.image_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    business_name: story?.business_name || 'Business',
    business_type: story?.business_type || 'Business',
    monthly_revenue: story?.monthly_revenue || '$3,000',
    quote: story?.quote || 'Great experience with Tabor Academy!',
    rating: story?.rating || 5,
    time_to_launch: story?.time_to_launch || '3 months',
    course_taken: story?.course_taken || 'Course',
    before_story: story?.before_story || 'Started from scratch',
    after_story: story?.after_story || 'Built a successful business',
  };

  return (
    <div className="relative h-[520px] perspective-1000">
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front */}
        <Card className="absolute inset-0 backface-hidden overflow-hidden border-[#E5E8E8] hover:border-[#4ECDC4]/40 transition-all duration-300 hover:shadow-lg">
          <div className="relative h-56 bg-white flex items-center justify-center">
            <div
              className="relative w-[78%] h-[92%] overflow-hidden"
              style={{ clipPath: 'ellipse(40% 65% at 50% 42%)' }}
            >
              <SafeImage
                src={safeStory.image_url}
                alt={safeStory.name}
                fill
                className="object-cover object-top"
                style={(story?.id === 'story-ethiopia-hafiza-mohammed' || (story as any)?.name?.toLowerCase?.()?.includes('hafiza')) ? { objectPosition: '50% 15%' } : undefined}
                loading="lazy"
              />
            </div>
            <div className="absolute top-3 right-3">
              <Badge className="bg-white/90 text-[#2C3E50] border-0">
                <MapPin className="w-3 h-3 mr-1" />
                {safeStory.country}
              </Badge>
            </div>
          </div>
          <CardContent className="p-5 flex flex-col h-[calc(100%-14rem)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-lg text-[#2C3E50]">{safeStory.name}</h3>
                <p className="text-sm text-[#2C3E50]/70">{safeStory.business_name} • {safeStory.business_type}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < safeStory.rating ? 'fill-[#FF6B35] text-[#FF6B35]' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
            <blockquote className="text-[#2C3E50] italic mt-3 line-clamp-3">"{safeStory.quote}"</blockquote>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="text-center p-2 bg-[#F7F9F9] rounded">
                <div className="font-bold text-[#4ECDC4]">{safeStory.monthly_revenue}</div>
                <div className="text-[#2C3E50]/70">Monthly Revenue</div>
              </div>
              <div className="text-left text-[#2C3E50]/70">
                <div className="text-xs">Country</div>
                <div className="font-medium text-[#2C3E50]">{safeStory.country}</div>
                <div className="text-xs mt-1">City</div>
                <div className="font-medium text-[#2C3E50]">{safeStory.location}</div>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" onClick={() => setIsFlipped(true)}>
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Back */}
        <Card className="absolute inset-0 backface-hidden rotate-y-180 overflow-hidden border-[#E5E8E8] hover:border-[#4ECDC4]/40 transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-5 h-full flex flex-col">
            <h3 className="font-bold text-lg text-[#2C3E50] mb-3">Success Journey</h3>
            <div className="space-y-4 flex-1">
              <div>
                <h4 className="font-semibold text-[#4ECDC4] mb-1">Before</h4>
                <p className="text-sm text-[#2C3E50]/80">{safeStory.before_story}</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#FF6B35] mb-1">After</h4>
                <p className="text-sm text-[#2C3E50]/80">{safeStory.after_story}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center p-2 bg-[#F7F9F9] rounded">
                  <div className="font-bold text-[#4ECDC4]">{safeStory.time_to_launch}</div>
                  <div className="text-[#2C3E50]/70">Time to Launch</div>
                </div>
                <div className="text-center p-2 bg-[#F7F9F9] rounded">
                  <div className="font-bold text-[#FF6B35]">{safeStory.course_taken}</div>
                  <div className="text-[#2C3E50]/70">Course Taken</div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button className="w-full bg-gradient-to-r from-[#4ECDC4] to-[#FF6B35] text-white" onClick={() => setIsFlipped(false)}>
                Back
              </Button>
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
    id: 'story-ethiopia-sara-abebe',
    name: 'Sara Abebe',
    location: 'Addis Ababa',
    country: 'Ethiopia',
    image_url: 'https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753964517/jerry_we8wvb.jpg',
    business_name: 'Selam Crafts',
    business_type: 'E‑commerce (Handmade Goods)',
    course_taken: 'Digital Marketing Mastery',
    time_to_launch: '3 months',
    monthly_revenue: 'ETB 180,000',
    employees_hired: 3,
    quote: 'Tabor Academy gave me the skills and confidence to take Selam Crafts online. Sales grew every single month.',
    achievement: 'Launched online store and tripled monthly revenue',
    rating: 5,
    before_story: 'Sold locally at weekend markets with unpredictable foot traffic.',
    after_story: 'Built a successful business with targeted ads and nationwide delivery.',
    is_featured: true,
    display_order: 1
  },
  {
    id: 'story-ethiopia-hafiza-mohammed',
    name: 'Hafiza Mohammed',
    location: 'Addis Ababa',
    country: 'Ethiopia',
    image_url: 'https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753964503/iman_bbbcqy.jpg',
    business_name: 'NoCode Solutions',
    business_type: 'App Development',
    course_taken: 'No-Code Development',
    time_to_launch: '2 months',
    monthly_revenue: 'ETB 160,000',
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
    id: 'story-ethiopia-solomon-taye',
    name: 'Solomon Taye',
    location: 'Hawassa',
    country: 'Ethiopia',
    image_url: 'https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753889820/Mebratu_Admasu_tvpgza.png',
    business_name: 'Hawassa Style Boutique',
    business_type: 'E-commerce Fashion',
    course_taken: 'E-commerce & Digital Marketing',
    time_to_launch: '4 months',
    monthly_revenue: 'ETB 120,000',
    employees_hired: 4,
    quote: 'The mentorship program gave me the confidence to start my e-commerce business. My sales grow every month.',
    achievement: 'Expanded to 3 regions in first year',
    rating: 5,
    video_url: '#',
    linkedin_url: '#',
    business_url: '#',
    before_story: 'Small market vendor with limited reach',
    after_story: 'Growing e-commerce entrepreneur',
    is_featured: true,
    display_order: 3
  },
  {
    id: 'story-ethiopia-hana-girma',
    name: 'Hana Girma',
    location: 'Addis Ababa',
    country: 'Ethiopia',
    image_url: 'https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753884018/hana_girma_cxui38.png',
    business_name: 'Hana Creative Studio',
    business_type: 'Digital Services',
    course_taken: 'Digital Marketing Mastery',
    time_to_launch: '3 months',
    monthly_revenue: 'ETB 140,000',
    employees_hired: 2,
    quote: 'Clear lessons and real projects helped me land my first clients and grow consistently.',
    achievement: 'From freelancer to studio owner',
    rating: 5,
    video_url: '#',
    linkedin_url: '#',
    business_url: '#',
    before_story: 'Freelancer with inconsistent income',
    after_story: 'Stable client pipeline and growing team',
    is_featured: true,
    display_order: 4
  },
  {
    id: 'story-ethiopia-mahlet-dereje',
    name: 'Mahlet Dereje',
    location: 'Bahirdar',
    country: 'Ethiopia',
    image_url: 'https://res.cloudinary.com/dbn8jx8bh/image/upload/v1753889661/mahi2_lxcedd.png',
    business_name: 'Blue Nile Handcrafts',
    business_type: 'E‑commerce (Handmade Goods)',
    course_taken: 'E-commerce & Digital Marketing',
    time_to_launch: '5 months',
    monthly_revenue: 'ETB 110,000',
    employees_hired: 3,
    quote: 'I learned how to package my products and reach customers across Ethiopia.',
    achievement: 'Launched online store with nationwide delivery',
    rating: 5,
    video_url: '#',
    linkedin_url: '#',
    business_url: '#',
    before_story: 'Local artisan selling only in-person',
    after_story: 'Online storefront with repeat customers',
    is_featured: true,
    display_order: 5
  }
];
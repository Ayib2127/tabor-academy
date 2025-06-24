import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Clock, User, ChevronLeft, ChevronRight, BookOpen, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  level: string;
  price: number;
  instructor?: {
    full_name: string;
    avatar_url?: string;
  };
  enrolledAt: string;
  progress: number;
  lastAccessed?: string;
  totalLessons?: number;
  completedLessons?: number;
  estimatedTimeLeft?: string;
}

interface EnrolledCoursesCarouselProps {
  courses: EnrolledCourse[];
}

export function EnrolledCoursesCarousel({ courses }: EnrolledCoursesCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [courses]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 320; // Width of one card plus gap
    const newScrollLeft = scrollContainerRef.current.scrollLeft + 
      (direction === 'left' ? -scrollAmount : scrollAmount);
    
    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-200';
    if (progress < 30) return 'bg-red-400';
    if (progress < 70) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  const getProgressMessage = (progress: number) => {
    if (progress === 0) return 'Not started';
    if (progress < 30) return 'Just getting started';
    if (progress < 70) return 'Making good progress';
    if (progress < 100) return 'Almost there!';
    return 'Completed!';
  };

  if (courses.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#2C3E50]">My Courses</h2>
        <Card className="p-8 text-center border-dashed border-2 border-[#E5E8E8] bg-gradient-to-br from-[#4ECDC4]/5 to-[#FF6B35]/5">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-[#4ECDC4]/10 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-10 h-10 text-[#4ECDC4]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">
                Ready to Start Learning?
              </h3>
              <p className="text-[#2C3E50]/60 mb-6 max-w-md mx-auto">
                You haven't enrolled in any courses yet. Discover amazing courses tailored for African entrepreneurs and start your learning journey today!
              </p>
              <Button asChild className="bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] hover:from-[#FF6B35]/90 hover:to-[#4ECDC4]/90 text-white px-6 py-3">
                <Link href="/courses">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Browse Courses
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2C3E50]">My Learning Journey</h2>
          <p className="text-[#2C3E50]/60 mt-1">
            {courses.length} course{courses.length !== 1 ? 's' : ''} in progress
          </p>
        </div>
        
        {courses.length > 2 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="h-9 w-9 border-[#E5E8E8] hover:border-[#4ECDC4] hover:bg-[#4ECDC4]/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="h-9 w-9 border-[#E5E8E8] hover:border-[#4ECDC4] hover:bg-[#4ECDC4]/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {courses.map((course) => (
          <Card 
            key={course.id} 
            className="flex-shrink-0 w-80 border-[#E5E8E8] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
          >
            {/* Course Thumbnail */}
            <div className="relative h-44 bg-gradient-to-br from-[#4ECDC4]/20 to-[#FF6B35]/20">
              {course.thumbnail ? (
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-[#4ECDC4]" />
                </div>
              )}
              
              {/* Progress Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{getProgressMessage(course.progress)}</span>
                    <span className="font-bold">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(course.progress)}`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Continue Button Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button 
                  asChild
                  className="bg-white/95 text-[#2C3E50] hover:bg-white shadow-lg"
                >
                  <Link href={`/courses/${course.id}`}>
                    <Play className="h-5 w-5 mr-2" />
                    Continue Learning
                  </Link>
                </Button>
              </div>
            </div>

            {/* Course Info */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="font-semibold text-[#2C3E50] line-clamp-2 mb-2 text-lg">
                  {course.title}
                </h3>
                <p className="text-sm text-[#2C3E50]/70 line-clamp-2">
                  {course.description}
                </p>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#2C3E50]/60">Progress</p>
                  <p className="font-semibold text-[#2C3E50]">{course.progress}%</p>
                </div>
                <div>
                  <p className="text-[#2C3E50]/60">Level</p>
                  <Badge variant="outline" className="text-xs capitalize">
                    {course.level}
                  </Badge>
                </div>
                {course.totalLessons && (
                  <div>
                    <p className="text-[#2C3E50]/60">Lessons</p>
                    <p className="font-semibold text-[#2C3E50]">
                      {course.completedLessons || 0}/{course.totalLessons}
                    </p>
                  </div>
                )}
                {course.estimatedTimeLeft && (
                  <div>
                    <p className="text-[#2C3E50]/60">Time Left</p>
                    <p className="font-semibold text-[#2C3E50]">{course.estimatedTimeLeft}</p>
                  </div>
                )}
              </div>

              {/* Instructor */}
              {course.instructor && (
                <div className="flex items-center gap-3 pt-2 border-t border-[#E5E8E8]">
                  <div className="w-8 h-8 bg-[#4ECDC4]/20 rounded-full flex items-center justify-center">
                    {course.instructor.avatar_url ? (
                      <Image
                        src={course.instructor.avatar_url}
                        alt={course.instructor.full_name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4 text-[#4ECDC4]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2C3E50] truncate">
                      {course.instructor.full_name}
                    </p>
                    <p className="text-xs text-[#2C3E50]/60">Instructor</p>
                  </div>
                </div>
              )}

              {/* Last Accessed */}
              {course.lastAccessed && (
                <div className="text-xs text-[#2C3E50]/60 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last accessed {new Date(course.lastAccessed).toLocaleDateString()}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* View All Courses Link */}
      {courses.length > 0 && (
        <div className="text-center">
          <Button variant="outline" asChild className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
            <Link href="/dashboard/courses">
              View All My Courses
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
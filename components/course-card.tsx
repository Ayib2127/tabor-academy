import { FC } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock,
  Users,
  Star,
  BookOpen,
  Shield,
  User,
  Play,
  CheckCircle,
} from 'lucide-react';
import { withDefault, DEFAULT_BANNER_URL } from "@/lib/defaults";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail_url?: string;
    price: number;
    level: string;
    category: string;
    content_type: 'tabor_original' | 'community';
    instructor: {
      full_name: string;
      avatar_url?: string;
    };
    _stats?: {
      totalLessons: number;
      estimatedDuration: number;
      enrollmentCount?: number;
      rating?: number;
    };
  };
  showInstructor?: boolean;
  showPrice?: boolean;
  variant?: 'default' | 'compact';
}

const CourseCard: FC<CourseCardProps> = ({
  course,
  showInstructor = true,
  showPrice = true,
  variant = 'default',
}) => {
  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const getContentTypeBadge = () => {
    if (course.content_type === 'tabor_original') {
      return (
        <Badge className="bg-gradient-to-r from-[#FF6B35] to-[#FF6B35]/80 text-white">
          <Shield className="w-3 h-3 mr-1" />
          Tabor Verified
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-[#4ECDC4]/30 text-[#4ECDC4]">
        <User className="w-3 h-3 mr-1" />
        Community
      </Badge>
    );
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (variant === 'compact') {
    return (
      <Card className="border-[#E5E8E8] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Thumbnail */}
            <div className="w-16 h-16 bg-gradient-to-br from-[#4ECDC4]/20 to-[#FF6B35]/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <img
                src={withDefault(course.thumbnail_url, DEFAULT_BANNER_URL)}
                alt={course.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-[#2C3E50] line-clamp-1">{course.title}</h3>
                {getContentTypeBadge()}
              </div>
              
              <p className="text-sm text-[#2C3E50]/70 line-clamp-2 mb-2">
                {course.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-[#2C3E50]/60">
                  {course._stats?.totalLessons && (
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {course._stats.totalLessons} lessons
                    </span>
                  )}
                  {course._stats?.estimatedDuration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(course._stats.estimatedDuration)}
                    </span>
                  )}
                </div>
                
                {showPrice && (
                  <span className="font-semibold text-[#4ECDC4]">
                    {formatPrice(course.price)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#E5E8E8] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-[#4ECDC4]/20 to-[#FF6B35]/20">
        <img
          src={withDefault(course.thumbnail_url, DEFAULT_BANNER_URL)}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        
        {/* Content Type Badge */}
        <div className="absolute top-3 left-3">
          {getContentTypeBadge()}
        </div>

        {/* Price Badge */}
        {showPrice && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/90 text-[#2C3E50] border-0">
              {formatPrice(course.price)}
            </Badge>
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
            <Play className="w-5 h-5 text-[#2C3E50] ml-1" />
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#2C3E50] mb-2 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-[#2C3E50]/70 text-sm line-clamp-3">
            {course.description}
          </p>
        </div>

        {/* Instructor */}
        {showInstructor && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-[#4ECDC4]/20 rounded-full flex items-center justify-center">
              {course.instructor.avatar_url ? (
                <img
                  src={course.instructor.avatar_url}
                  alt={course.instructor.full_name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="w-3 h-3 text-[#4ECDC4]" />
              )}
            </div>
            <span className="text-sm text-[#2C3E50]/70">
              {course.instructor.full_name}
            </span>
          </div>
        )}

        {/* Course Meta */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className={getLevelColor(course.level)}>
            {course.level}
          </Badge>
          <Badge variant="outline" className="border-[#E5E8E8] text-[#2C3E50]/60">
            {course.category}
          </Badge>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-[#2C3E50]/60 mb-4">
          <div className="flex items-center gap-4">
            {course._stats?.totalLessons && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {course._stats.totalLessons} lessons
              </span>
            )}
            {course._stats?.estimatedDuration && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDuration(course._stats.estimatedDuration)}
              </span>
            )}
          </div>
          
          {course._stats?.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{course._stats.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link href={`/courses/${course.id}`}>
          <Button className="w-full bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white">
            View Course
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
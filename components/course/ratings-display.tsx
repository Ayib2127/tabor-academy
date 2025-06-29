'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

interface Rating {
  id: string;
  rating: number;
  review?: string;
  created_at: string;
  users: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

interface RatingsDisplayProps {
  courseId: string;
  showDistribution?: boolean;
}

export function RatingsDisplay({
  courseId,
  showDistribution = true,
}: RatingsDisplayProps) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [distribution, setDistribution] = useState([0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, [courseId]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${courseId}/ratings`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch ratings');
      }
      
      const data = await response.json();
      
      setRatings(data.ratings || []);
      setAverageRating(data.averageRating || 0);
      setTotalRatings(data.totalRatings || 0);
      setDistribution(data.distribution || [0, 0, 0, 0, 0]);
    } catch (error: any) {
      console.error('Error fetching ratings:', error);
      toast.error('Failed to load ratings');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-start gap-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-[#2C3E50]">{averageRating.toFixed(1)}</div>
          <div className="flex items-center justify-center mt-2">
            {renderStars(Math.round(averageRating))}
          </div>
          <div className="text-sm text-[#2C3E50]/60 mt-2">
            {totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'}
          </div>
        </div>

        {showDistribution && (
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star - 1];
              const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
              
              return (
                <div key={star} className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 w-16">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-[#2C3E50]">{star}</span>
                  </div>
                  <Progress value={percentage} className="h-2 flex-1" />
                  <div className="text-sm text-[#2C3E50]/60 w-16 text-right">
                    {count} ({percentage.toFixed(0)}%)
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reviews */}
      {ratings.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-semibold text-[#2C3E50]">Reviews</h3>
          {ratings.filter(r => r.review).map((rating) => (
            <Card key={rating.id} className="border-[#E5E8E8]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-[#2C3E50]">{rating.users.full_name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        {renderStars(rating.rating)}
                      </div>
                      <span className="text-sm text-[#2C3E50]/60">
                        {formatDate(rating.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                {rating.review && (
                  <p className="text-[#2C3E50]/80">{rating.review}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-[#2C3E50]/60">No reviews yet</p>
        </div>
      )}
    </div>
  );
} 
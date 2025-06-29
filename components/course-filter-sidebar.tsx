'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  X, 
  Filter,
  Star,
  Clock,
  DollarSign,
  Shield,
  User,
  Award,
  TrendingUp
} from 'lucide-react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    categories: string[];
    levels: string[];
    contentTypes: string[];
    priceRange: [number, number];
    tags: string[];
    showFreeOnly: boolean;
    showFeaturedOnly: boolean;
    showNewOnly: boolean;
    minRating: number;
    maxDuration: number;
  };
  onFiltersChange: (filters: any) => void;
  availableCategories: string[];
  availableTags: string[];
}

export function CourseFilterSidebar({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  availableCategories,
  availableTags
}: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleArrayFilter = (key: string, value: string) => {
    const currentArray = localFilters[key as keyof typeof localFilters] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      categories: [],
      levels: [],
      contentTypes: [],
      priceRange: [0, 100] as [number, number],
      tags: [],
      showFreeOnly: false,
      showFeaturedOnly: false,
      showNewOnly: false,
      minRating: 0,
      maxDuration: 1000
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const activeFiltersCount = [
    localFilters.categories.length > 0,
    localFilters.levels.length > 0,
    localFilters.contentTypes.length > 0,
    localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 100,
    localFilters.tags.length > 0,
    localFilters.showFreeOnly,
    localFilters.showFeaturedOnly,
    localFilters.showNewOnly,
    localFilters.minRating > 0,
    localFilters.maxDuration < 1000
  ].filter(Boolean).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Overlay for mobile */}
      <div 
        className="fixed inset-0 bg-black/50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl lg:relative lg:w-full lg:shadow-none overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#4ECDC4]" />
              <h3 className="text-lg font-semibold text-[#2C3E50]">Filters</h3>
              {activeFiltersCount > 0 && (
                <Badge className="bg-[#FF6B35] text-white">
                  {activeFiltersCount}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Clear All Filters */}
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="w-full mb-6 border-[#FF6B35]/30 text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
            >
              Clear All Filters
            </Button>
          )}

          <div className="space-y-6">
            {/* Categories */}
            <Card className="border-[#E5E8E8]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#2C3E50]">
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availableCategories.filter(cat => cat !== 'All Categories').map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={localFilters.categories.includes(category)}
                        onCheckedChange={() => toggleArrayFilter('categories', category)}
                      />
                      <label 
                        htmlFor={`category-${category}`} 
                        className="text-sm text-[#2C3E50] cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skill Level */}
            <Card className="border-[#E5E8E8]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#2C3E50]">
                  Skill Level
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={`level-${level}`}
                        checked={localFilters.levels.includes(level)}
                        onCheckedChange={() => toggleArrayFilter('levels', level)}
                      />
                      <label 
                        htmlFor={`level-${level}`} 
                        className="text-sm text-[#2C3E50] cursor-pointer"
                      >
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Type */}
            <Card className="border-[#E5E8E8]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#2C3E50]">
                  Content Type
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tabor-verified"
                      checked={localFilters.contentTypes.includes('tabor_original')}
                      onCheckedChange={() => toggleArrayFilter('contentTypes', 'tabor_original')}
                    />
                    <label htmlFor="tabor-verified" className="text-sm text-[#2C3E50] cursor-pointer flex items-center gap-1">
                      <Shield className="w-3 h-3 text-[#FF6B35]" />
                      Tabor Verified
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="community"
                      checked={localFilters.contentTypes.includes('community')}
                      onCheckedChange={() => toggleArrayFilter('contentTypes', 'community')}
                    />
                    <label htmlFor="community" className="text-sm text-[#2C3E50] cursor-pointer flex items-center gap-1">
                      <User className="w-3 h-3 text-[#4ECDC4]" />
                      Community
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Range */}
            <Card className="border-[#E5E8E8]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#2C3E50] flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Price Range
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="text-sm text-[#2C3E50]/70">
                    ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
                  </div>
                  <Slider
                    value={localFilters.priceRange}
                    onValueChange={(value) => updateFilter('priceRange', value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-[#2C3E50]/50">
                    <span>$0</span>
                    <span>$100+</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rating */}
            <Card className="border-[#E5E8E8]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#2C3E50] flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Minimum Rating
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 3.0].map(rating => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox
                        id={`rating-${rating}`}
                        checked={localFilters.minRating === rating}
                        onCheckedChange={(checked) => 
                          updateFilter('minRating', checked ? rating : 0)
                        }
                      />
                      <label 
                        htmlFor={`rating-${rating}`} 
                        className="text-sm text-[#2C3E50] cursor-pointer flex items-center gap-1"
                      >
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                              key={star} 
                              className={`w-3 h-3 ${
                                star <= rating ? 'fill-[#FF6B35] text-[#FF6B35]' : 'text-[#E5E8E8]'
                              }`} 
                            />
                          ))}
                        </div>
                        <span>{rating} & up</span>
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Duration */}
            <Card className="border-[#E5E8E8]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#2C3E50] flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Course Duration
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {[
                    { label: 'Under 2 hours', value: 120 },
                    { label: '2-6 hours', value: 360 },
                    { label: '6-17 hours', value: 1020 },
                    { label: '17+ hours', value: 1000 }
                  ].map(duration => (
                    <div key={duration.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`duration-${duration.value}`}
                        checked={localFilters.maxDuration === duration.value}
                        onCheckedChange={(checked) => 
                          updateFilter('maxDuration', checked ? duration.value : 1000)
                        }
                      />
                      <label 
                        htmlFor={`duration-${duration.value}`} 
                        className="text-sm text-[#2C3E50] cursor-pointer"
                      >
                        {duration.label}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Special Features */}
            <Card className="border-[#E5E8E8]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#2C3E50] flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Special Features
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="free-only"
                      checked={localFilters.showFreeOnly}
                      onCheckedChange={(checked) => updateFilter('showFreeOnly', checked)}
                    />
                    <label htmlFor="free-only" className="text-sm text-[#2C3E50] cursor-pointer">
                      Free courses only
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured-only"
                      checked={localFilters.showFeaturedOnly}
                      onCheckedChange={(checked) => updateFilter('showFeaturedOnly', checked)}
                    />
                    <label htmlFor="featured-only" className="text-sm text-[#2C3E50] cursor-pointer flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-[#4ECDC4]" />
                      Featured courses
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="new-only"
                      checked={localFilters.showNewOnly}
                      onCheckedChange={(checked) => updateFilter('showNewOnly', checked)}
                    />
                    <label htmlFor="new-only" className="text-sm text-[#2C3E50] cursor-pointer">
                      New courses
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card className="border-[#E5E8E8]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#2C3E50]">
                  Popular Topics ({localFilters.tags.length} selected)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availableTags.slice(0, 15).map(tag => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={localFilters.tags.includes(tag)}
                        onCheckedChange={() => toggleArrayFilter('tags', tag)}
                      />
                      <label 
                        htmlFor={`tag-${tag}`} 
                        className="text-sm text-[#2C3E50] cursor-pointer"
                      >
                        {tag}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
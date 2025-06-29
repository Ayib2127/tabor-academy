"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  Star,
  Play,
  LayoutGrid,
  List,
  Filter,
  X,
  Users,
  Shield,
  Clock,
  TrendingUp,
  Loader2,
  ChevronDown,
  SlidersHorizontal
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useDebounce } from "@/lib/supabase/hooks"

// Enhanced Course interface with social proof
interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  price: number;
  level: string;
  category: string;
  content_type: string;
  delivery_type: string;
  tags: string[];
  instructor_name: string;
  instructor_avatar?: string;
  enrollment_count: number;
  rating: number;
  review_count: number;
  is_tabor_original: boolean;
  created_at: string;
}

interface CourseFilters {
  levels: string[];
  categories: string[];
  skills: string[];
  contentTypes: string[];
  deliveryTypes: string[];
  priceRange: string;
}

// Predefined filter options
const FILTER_OPTIONS = {
  levels: ["beginner", "intermediate", "advanced"],
  categories: [
    "Business & Entrepreneurship",
    "Digital Marketing", 
    "Technology & Development",
    "Financial Literacy",
    "Creative Skills",
    "Personal Development"
  ],
  skills: [
    "Business Validation",
    "Market Research", 
    "Financial Modeling",
    "Digital Marketing",
    "Social Media Marketing",
    "Content Creation",
    "No-Code Development",
    "Product Development",
    "Project Management",
    "Leadership",
    "Communication",
    "Data Analysis"
  ],
  contentTypes: ["tabor_original", "community"],
  deliveryTypes: ["self_paced", "cohort_based"],
  priceRanges: [
    { value: "all", label: "All Courses" },
    { value: "free", label: "Free Only" },
    { value: "paid", label: "Paid Only" }
  ]
};

function CoursesPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || "created_at");
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || "desc");
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    pages: 0
  });

  const [filters, setFilters] = useState<CourseFilters>({
    levels: searchParams.getAll('level'),
    categories: searchParams.getAll('category'),
    skills: searchParams.getAll('skill'),
    contentTypes: searchParams.getAll('content_type'),
    deliveryTypes: searchParams.getAll('delivery_type'),
    priceRange: searchParams.get('price_range') || 'all',
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch courses when filters change
  useEffect(() => {
    fetchCourses();
  }, [filters, sortBy, sortOrder, debouncedSearchQuery, pagination.page]);

  // Update URL when filters change
  useEffect(() => {
    updateURL();
  }, [filters, sortBy, sortOrder, debouncedSearchQuery]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      // Add all filters to query params
      filters.levels.forEach(level => params.append('level', level));
      filters.categories.forEach(cat => params.append('category', cat));
      filters.skills.forEach(skill => params.append('skill', skill));
      filters.contentTypes.forEach(type => params.append('content_type', type));
      filters.deliveryTypes.forEach(type => params.append('delivery_type', type));
      
      if (filters.priceRange !== 'all') {
        params.append('price_range', filters.priceRange);
      }
      
      if (debouncedSearchQuery) {
        params.append('search', debouncedSearchQuery);
      }
      
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());
      
      const response = await fetch(`/api/courses?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCourses(data.courses);
      setPagination(data.pagination);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    
    filters.levels.forEach(level => params.append('level', level));
    filters.categories.forEach(cat => params.append('category', cat));
    filters.skills.forEach(skill => params.append('skill', skill));
    filters.contentTypes.forEach(type => params.append('content_type', type));
    filters.deliveryTypes.forEach(type => params.append('delivery_type', type));
    
    if (filters.priceRange !== 'all') {
      params.append('price_range', filters.priceRange);
    }
    
    if (debouncedSearchQuery) {
      params.append('search', debouncedSearchQuery);
    }
    
    if (sortBy !== 'created_at') {
      params.append('sortBy', sortBy);
    }
    
    if (sortOrder !== 'desc') {
      params.append('sortOrder', sortOrder);
    }

    const newURL = params.toString() ? `?${params.toString()}` : '/courses';
    router.replace(newURL, { scroll: false });
  };

  const handleFilterChange = (type: keyof CourseFilters, value: string) => {
    setFilters(prev => {
      if (type === 'priceRange') {
        return { ...prev, [type]: value };
      }
      
      const currentValues = prev[type] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      
      return { ...prev, [type]: newValues };
    });
    
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      levels: [],
      categories: [],
      skills: [],
      contentTypes: [],
      deliveryTypes: [],
      priceRange: 'all',
    });
    setSearchQuery("");
    setSortBy("created_at");
    setSortOrder("desc");
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getActiveFilterCount = () => {
    return filters.levels.length + 
           filters.categories.length + 
           filters.skills.length + 
           filters.contentTypes.length + 
           filters.deliveryTypes.length + 
           (filters.priceRange !== 'all' ? 1 : 0);
  };

  // Enhanced Course Card Component with social proof
  const CourseCard = ({ course }: { course: Course }) => (
    <Card className="card-hover gradient-border overflow-hidden group border-[#E5E8E8] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <Link href={`/courses/${course.id}`} className="block">
        <div className="relative h-48">
          <Image
            src={course.thumbnail_url || '/logo.jpg'}
            alt={course.title}
            fill
            className="object-cover"
          />
          
          {/* Tabor Original Badge */}
          {course.is_tabor_original && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-gradient-to-r from-[#FF6B35] to-[#FF6B35]/80 text-white border-0">
                <Shield className="w-3 h-3 mr-1" />
                Tabor Verified
              </Badge>
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/90 text-[#2C3E50] border-0">
              {course.price === 0 ? "Free" : `$${course.price}`}
            </Badge>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-black group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
              <Play className="h-5 w-5 text-[#2C3E50] ml-1" />
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          {/* Title and Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-[#2C3E50]">
              {course.title}
            </h3>
            <p className="text-[#2C3E50]/70 text-sm line-clamp-2">
              {course.description}
            </p>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#4ECDC4]/20 rounded-full flex items-center justify-center">
              {course.instructor_avatar ? (
                <Image
                  src={course.instructor_avatar}
                  alt={course.instructor_name}
                  width={24}
                  height={24}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <Users className="w-3 h-3 text-[#4ECDC4]" />
              )}
            </div>
            <span className="text-sm text-[#2C3E50]/70">
              {course.instructor_name}
            </span>
          </div>

          {/* Course Meta */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs capitalize">
              {course.level}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {course.delivery_type.replace('_', ' ')}
            </Badge>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="font-medium">{course.rating}</span>
              <span className="text-[#2C3E50]/60">({course.review_count})</span>
            </div>
            <div className="flex items-center gap-1 text-[#2C3E50]/60">
              <Users className="h-4 w-4" />
              <span>{course.enrollment_count} enrolled</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );

  // Filter Sidebar Component
  const FilterSidebar = ({ isMobile = false }) => (
    <div className={`space-y-6 ${isMobile ? 'p-4' : ''}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#2C3E50]">Filters</h2>
        {getActiveFilterCount() > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearFilters}
            className="text-[#FF6B35] hover:text-[#FF6B35]/80"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium mb-3 text-[#2C3E50]">Price</h3>
        <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange('priceRange', value)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPTIONS.priceRanges.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Level Filters */}
      <div>
        <h3 className="font-medium mb-3 text-[#2C3E50]">Level</h3>
        <div className="space-y-2">
          {FILTER_OPTIONS.levels.map(level => (
            <Label key={level} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.levels.includes(level)}
                onCheckedChange={() => handleFilterChange('levels', level)}
              />
              <span className="capitalize">{level}</span>
            </Label>
          ))}
        </div>
      </div>

      {/* Content Type */}
      <div>
        <h3 className="font-medium mb-3 text-[#2C3E50]">Content Type</h3>
        <div className="space-y-2">
          <Label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={filters.contentTypes.includes('tabor_original')}
              onCheckedChange={() => handleFilterChange('contentTypes', 'tabor_original')}
            />
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-[#FF6B35]" />
              <span>Tabor Original</span>
            </div>
          </Label>
          <Label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={filters.contentTypes.includes('community')}
              onCheckedChange={() => handleFilterChange('contentTypes', 'community')}
            />
            <span>Community Course</span>
          </Label>
        </div>
      </div>

      {/* Delivery Type */}
      <div>
        <h3 className="font-medium mb-3 text-[#2C3E50]">Delivery</h3>
        <div className="space-y-2">
          <Label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={filters.deliveryTypes.includes('self_paced')}
              onCheckedChange={() => handleFilterChange('deliveryTypes', 'self_paced')}
            />
            <span>Self-Paced</span>
          </Label>
          <Label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={filters.deliveryTypes.includes('cohort_based')}
              onCheckedChange={() => handleFilterChange('deliveryTypes', 'cohort_based')}
            />
            <span>Cohort-Based</span>
          </Label>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-medium mb-3 text-[#2C3E50]">Category</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {FILTER_OPTIONS.categories.map(category => (
            <Label key={category} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.categories.includes(category)}
                onCheckedChange={() => handleFilterChange('categories', category)}
              />
              <span className="text-sm">{category}</span>
            </Label>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <h3 className="font-medium mb-3 text-[#2C3E50]">Skills</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {FILTER_OPTIONS.skills.map(skill => (
            <Label key={skill} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.skills.includes(skill)}
                onCheckedChange={() => handleFilterChange('skills', skill)}
              />
              <span className="text-sm">{skill}</span>
            </Label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      {/* Enhanced Header with Search and Controls */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container py-6">
          <div className="space-y-4">
            {/* Title and Stats */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#2C3E50]">Discover Courses</h1>
                <p className="text-[#2C3E50]/60 mt-1">
                  {loading ? 'Loading...' : `${pagination.total} courses available`}
                </p>
              </div>
              
              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === 'grid' ? 'bg-accent' : ''}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === 'list' ? 'bg-accent' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search and Sort Controls */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search courses, skills, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                  const [field, order] = value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at-desc">Newest First</SelectItem>
                    <SelectItem value="created_at-asc">Oldest First</SelectItem>
                    <SelectItem value="title-asc">Title A-Z</SelectItem>
                    <SelectItem value="title-desc">Title Z-A</SelectItem>
                    <SelectItem value="price-asc">Price Low to High</SelectItem>
                    <SelectItem value="price-desc">Price High to Low</SelectItem>
                  </SelectContent>
                </Select>

                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowMobileFilters(true)}
                  className="md:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {getActiveFilterCount() > 0 && (
                    <Badge className="ml-2 bg-[#FF6B35] text-white">
                      {getActiveFilterCount()}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            {/* Active Filters Display */}
            {getActiveFilterCount() > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-[#2C3E50]/60">Active filters:</span>
                {filters.levels.map(level => (
                  <Badge key={level} variant="secondary" className="gap-1">
                    {level}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange('levels', level)}
                    />
                  </Badge>
                ))}
                {filters.categories.map(category => (
                  <Badge key={category} variant="secondary" className="gap-1">
                    {category}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange('categories', category)}
                    />
                  </Badge>
                ))}
                {filters.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange('skills', skill)}
                    />
                  </Badge>
                ))}
                {filters.priceRange !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.priceRange}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange('priceRange', 'all')}
                    />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="md:col-span-1 hidden md:block">
            <div className="sticky top-8">
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-3">
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-[#4ECDC4]" />
                  <span className="text-lg text-[#2C3E50]">Finding perfect courses for you...</span>
                </div>
              </div>
            )}

            {error && (
              <Card className="p-8 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">
                      Unable to Load Courses
                    </h3>
                    <p className="text-[#2C3E50]/60 mb-4">{error}</p>
                    <Button onClick={fetchCourses} className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white">
                      Try Again
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {!loading && !error && (
              <>
                {courses.length > 0 ? (
                  <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                    {courses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-[#4ECDC4]/10 rounded-full flex items-center justify-center mx-auto">
                        <Search className="w-8 h-8 text-[#4ECDC4]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">
                          No Courses Found
                        </h3>
                        <p className="text-[#2C3E50]/60 mb-4">
                          Try adjusting your filters or search terms to find more courses.
                        </p>
                        <Button onClick={handleClearFilters} className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white">
                          Clear Filters
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      disabled={pagination.page <= 1}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={pagination.page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                            className={pagination.page === pageNum ? "bg-[#4ECDC4] text-white" : ""}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      disabled={pagination.page >= pagination.pages}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Dialog */}
      <Dialog open={showMobileFilters} onOpenChange={setShowMobileFilters}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Filter Courses</DialogTitle>
            <DialogDescription>
              Refine your search to find the perfect courses
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <FilterSidebar isMobile />
          </div>
        </DialogContent>
      </Dialog>

      {previewCourse && (
        <Dialog open={!!previewCourse} onOpenChange={() => setPreviewCourse(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{previewCourse.title}</DialogTitle>
              <DialogDescription>{previewCourse.description}</DialogDescription>
            </DialogHeader>
            <div className="relative h-48 mb-4">
              <Image
                src={previewCourse.thumbnail_url || '/logo.jpg'}
                alt={previewCourse.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#4ECDC4]/20 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#4ECDC4]" />
                  </div>
                  <div>
                    <p className="font-medium">{previewCourse.instructor_name}</p>
                    <p className="text-sm text-muted-foreground">Instructor</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span>{previewCourse.rating}</span>
                  <span className="text-muted-foreground">({previewCourse.review_count} reviews)</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="font-medium capitalize">{previewCourse.level}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Enrolled</p>
                  <p className="font-medium">{previewCourse.enrollment_count}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">
                    {previewCourse.price === 0 ? "Free" : `$${previewCourse.price}`}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setPreviewCourse(null)}>
                  Close
                </Button>
                <Button asChild className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white">
                  <Link href={`/courses/${previewCourse.id}`}>View Course</Link>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" /></div>}>
      <CoursesPageInner />
    </Suspense>
  );
}
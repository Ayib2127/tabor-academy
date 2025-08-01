"use client"

import { useState, useEffect } from "react"
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

export default function CoursesClient() {
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
    if (pagination.page !== 1) {
      params.append('page', pagination.page.toString());
    }
    if (pagination.limit !== 12) {
      params.append('limit', pagination.limit.toString());
    }
    router.replace(`/courses?${params.toString()}`);
  };

  // Client-side filtering and sorting for now
  const getFilteredAndSortedCourses = () => {
    let currentCourses = courses.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Add sorting logic here later if needed
    // For now, it just returns the filtered list
    return currentCourses;
  };

  const displayedCourses = getFilteredAndSortedCourses();

  // Reusable Course Card Component
  const CourseCard = ({ course }: { course: Course }) => (
    <Card className="card-hover gradient-border overflow-hidden group">
      <Link href={`/courses/${course.id}`} className="block">
        <div className="relative h-48">
          <Image
            src={course.thumbnail_url || '/logo.jpg'}
            alt={course.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Play className="h-12 w-12 text-white fill-current" />
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Image
              src={course.instructor_avatar || '/logo.jpg'}
              alt={course.instructor_name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span>{course.instructor_name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold gradient-text">
              {course.price === 0 ? "Free" : `$${course.price}`}
            </span>
             <span className="text-sm capitalize px-2 py-1 bg-accent rounded-md">{course.level}</span>
          </div>
        </div>
      </Link>
    </Card>
  );

  const CoursePreviewModal = ({ course }: { course: Course }) => (
    <Dialog open={!!course} onOpenChange={() => setPreviewCourse(null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{course.title}</DialogTitle>
          <DialogDescription>{course.description}</DialogDescription>
        </DialogHeader>
        <div className="relative h-48 mb-4">
          <Image
            src={course.thumbnail_url || '/logo.jpg'}
            alt={course.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={course.instructor_avatar || '/logo.jpg'}
                alt={course.instructor_name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-medium">{course.instructor_name}</p>
                <p className="text-sm text-muted-foreground">Instructor</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span>{course.rating}</span>
              <span className="text-muted-foreground">({course.review_count} reviews)</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{course.duration}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lessons</p>
              <p className="font-medium">{course.lesson_count}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Level</p>
              <p className="font-medium">{course.level}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPreviewCourse(null)}>
              Close
            </Button>
            <Button asChild>
              <Link href={`/courses/${course.id}`}>View Course</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container py-4">
          {/* Header section with search and view controls */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
             <div className="flex items-center gap-2">
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
        </div>
      </div>

      <div className="container py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="md:col-span-1 hidden md:block">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            <div className="space-y-4">
              {/* Level Filters */}
              <div>
                <h3 className="font-medium mb-2">Level</h3>
                <div className="space-y-2">
                  {FILTER_OPTIONS.levels.map(level => (
                    <Label key={level} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.levels.includes(level)}
                        onCheckedChange={() => setFilters(prev => ({ ...prev, levels: prev.levels.includes(level) ? prev.levels.filter(item => item !== level) : [...prev.levels, level] }))}
                      />
                      <span className="capitalize">{level}</span>
                    </Label>
                  ))}
                </div>
              </div>

              {/* Category Filters */}
              <div>
                <h3 className="font-medium mb-2">Category</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {FILTER_OPTIONS.categories.map(cat => (
                    <Label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.categories.includes(cat)}
                        onCheckedChange={() => setFilters(prev => ({ ...prev, categories: prev.categories.includes(cat) ? prev.categories.filter(item => item !== cat) : [...prev.categories, cat] }))}
                      />
                      <span>{cat}</span>
                    </Label>
                  ))}
                </div>
              </div>

              {/* Skill Filters */}
              <div>
                <h3 className="font-medium mb-2">Skill</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {FILTER_OPTIONS.skills.map(skill => (
                    <Label key={skill} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.skills.includes(skill)}
                        onCheckedChange={() => setFilters(prev => ({ ...prev, skills: prev.skills.includes(skill) ? prev.skills.filter(item => item !== skill) : [...prev.skills, skill] }))}
                      />
                      <span>{skill}</span>
                    </Label>
                  ))}
                </div>
              </div>

              {/* Content Type Filters */}
              <div>
                <h3 className="font-medium mb-2">Content Type</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {FILTER_OPTIONS.contentTypes.map(type => (
                    <Label key={type} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.contentTypes.includes(type)}
                        onCheckedChange={() => setFilters(prev => ({ ...prev, contentTypes: prev.contentTypes.includes(type) ? prev.contentTypes.filter(item => item !== type) : [...prev.contentTypes, type] }))}
                      />
                      <span>{type}</span>
                    </Label>
                  ))}
                </div>
              </div>

              {/* Delivery Type Filters */}
              <div>
                <h3 className="font-medium mb-2">Delivery Type</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {FILTER_OPTIONS.deliveryTypes.map(type => (
                    <Label key={type} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.deliveryTypes.includes(type)}
                        onCheckedChange={() => setFilters(prev => ({ ...prev, deliveryTypes: prev.deliveryTypes.includes(type) ? prev.deliveryTypes.filter(item => item !== type) : [...prev.deliveryTypes, type] }))}
                      />
                      <span>{type}</span>
                    </Label>
                  ))}
                </div>
              </div>

              {/* Price Range Filters */}
              <div>
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {FILTER_OPTIONS.priceRanges.map(range => (
                    <Label key={range.value} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.priceRange === range.value}
                        onCheckedChange={() => setFilters(prev => ({ ...prev, priceRange: range.value }))}
                      />
                      <span>{range.label}</span>
                    </Label>
                  ))}
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={() => setFilters({ levels: [], categories: [], skills: [], contentTypes: [], deliveryTypes: [], priceRange: 'all' })}>
                Clear Filters
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-3">
            <h1 className="text-3xl font-bold mb-6">All Courses</h1>

            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              </div>
            )}

            {error && <p className="text-red-500">Error: {error}</p>}

            {!loading && !error && (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {displayedCourses.length > 0 ? (
                  displayedCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))
                ) : (
                  <p>No courses found.</p>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {previewCourse && <CoursePreviewModal course={previewCourse} />}
    </div>
  )
}
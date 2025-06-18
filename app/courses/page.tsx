"use client"

import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  Star,
  Play,
  LayoutGrid,
  List
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useDebounce } from "@/lib/supabase/hooks" // Assuming you have a debounce hook

// Define the structure of a Course object based on our API response
// Note: The 'users' property is an object now, not just a string.
interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  price: number;
  level: string;
  users: {
    full_name: string;
    avatar_url: string;
  } | null;
  rating?: number;
  reviews?: number;
  lessons?: number;
  duration?: string;
}


interface Category {
  id: string;
  name: string;
}

interface CourseFilters {
  levels: string[];
  categories: string[];
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy] = useState("created_at");
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { inView } = useInView()
  const [filters, setFilters] = useState<CourseFilters>({
    levels: [],
    categories: [],
  })
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Debounce search input

  const LEVELS = ["beginner", "intermediate", "advanced"];

  
  // Fetch courses from the API when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        // Add filters to query params
        filters.levels.forEach(level => params.append('level', level));
        filters.categories.forEach(cat => params.append('category', cat));
        
        // Add sorting to query params
        const [sortField, sortOrder] = sortBy.split('-');
        params.append('sortBy', sortField);
        if(sortOrder) {
          params.append('sortOrder', sortOrder);
        }
        
        // Add search query
        if (debouncedSearchQuery) {
          params.append('search', debouncedSearchQuery);
        }
        
        const response = await fetch(`/api/courses?${params.toString()}`);
        if (!response.ok) {
          // Check for NEXT_NOT_FOUND or other errors
          if (response.status === 404) {
             throw new Error('API route not found. Please check the file path and restart the server.');
          }
          throw new Error(`Failed to fetch courses: ${response.statusText}`);
        }
        const data = await response.json();
        setCourses(data.courses);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [filters, sortBy, debouncedSearchQuery]);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (inView && hasMore) {
      // Simulate loading more courses
      setPage(prev => prev + 1)
      if (page >= 3) setHasMore(false) // For demo purposes
    }
  }, [inView, hasMore, page])

  const handleFilterChange = (type: keyof CourseFilters, value: string) => {
    setFilters(prev => {
      const currentValues = prev[type] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      
      return { ...prev, [type]: newValues };
    });
  }

  const handleClearFilters = () => {
    setFilters({ levels: [], categories: [] });
    setSearchQuery("");
  }

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
              src={course.users?.avatar_url || '/logo.jpg'}
              alt={course.users?.full_name || 'Instructor'}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span>{course.users?.full_name || 'Tabor Academy'}</span>
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
                src={course.users?.avatar_url || '/logo.jpg'}
                alt={course.users?.full_name || 'Instructor'}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-medium">{course.users?.full_name || 'Instructor'}</p>
                <p className="text-sm text-muted-foreground">Instructor</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span>{course.rating}</span>
              <span className="text-muted-foreground">({course.reviews} reviews)</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{course.duration}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lessons</p>
              <p className="font-medium">{course.lessons}</p>
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
                  {LEVELS.map(level => (
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

              {/* Category Filters */}
              <div>
                <h3 className="font-medium mb-2">Category</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {categories.map(cat => (
                    <Label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.categories.includes(cat.id)}
                        onCheckedChange={() => handleFilterChange('categories', cat.id)}
                      />
                      <span>{cat.name}</span>
                    </Label>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  )}
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={handleClearFilters}>
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
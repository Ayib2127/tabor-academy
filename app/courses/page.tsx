"use client"

import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  Filter,
  BookOpen,
  Star,
  Users,
  Clock,
  ChevronDown,
  X,
  Bookmark,
  Play,
  BarChart3,
  Code,
  Coins,
  GraduationCap,
  ShoppingCart,
  Laptop,
  Zap,
  TrendingUp,
  Award,
  User,
  Bell,
  LayoutGrid,
  List
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ... (keep all the existing interfaces and mock data)

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("popular")
  const [duration, setDuration] = useState([1, 12]) // weeks
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView()
  const [filters, setFilters] = useState<CourseFilters>({
    categories: [],
    levels: [],
    duration: [1, 12],
    price: [],
    languages: [],
    rating: null
  })

  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "French" },
    { code: "sw", name: "Swahili" },
    { code: "ar", name: "Arabic" },
    { code: "am", name: "Amharic" }
  ]

  useEffect(() => {
    if (inView && hasMore) {
      // Simulate loading more courses
      setPage(prev => prev + 1)
      if (page >= 3) setHasMore(false) // For demo purposes
    }
  }, [inView, hasMore, page])

  const handleFilterChange = (type: keyof CourseFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }))
  }

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      levels: [],
      duration: [1, 12],
      price: [],
      languages: [],
      rating: null
    })
  }

  const getFilteredAndSortedCourses = () => {
    let currentCourses = [...courses]

    // Apply search query
    if (searchQuery) {
      currentCourses = currentCourses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filters
    if (filters.categories.length > 0) {
      currentCourses = currentCourses.filter(course =>
        filters.categories.includes(course.category)
      )
    }

    // Apply level filters
    if (filters.levels.length > 0) {
      currentCourses = currentCourses.filter(course =>
        filters.levels.includes(course.level)
      )
    }

    // Apply price filters
    if (filters.price.length > 0) {
      currentCourses = currentCourses.filter(course => {
        if (filters.price.includes("Free") && course.price === "Free") return true
        if (filters.price.includes("Paid") && course.price !== "Free" && (course.price as number) <= 100) return true
        if (filters.price.includes("Premium") && course.price !== "Free" && (course.price as number) > 100) return true
        return false
      })
    }

    // Apply rating filter
    if (filters.rating !== null) {
      currentCourses = currentCourses.filter(course => course.rating >= filters.rating!)
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        currentCourses.sort((a, b) => (a.new === b.new ? 0 : a.new ? -1 : 1))
        break
      case "rating":
        currentCourses.sort((a, b) => b.rating - a.rating)
        break
      case "price-low":
        currentCourses.sort((a, b) => {
          const priceA = a.price === "Free" ? 0 : (a.price as number)
          const priceB = b.price === "Free" ? 0 : (b.price as number)
          return priceA - priceB
        })
        break
      case "price-high":
        currentCourses.sort((a, b) => {
          const priceA = a.price === "Free" ? 0 : (a.price as number)
          const priceB = b.price === "Free" ? 0 : (b.price as number)
          return priceB - priceA
        })
        break
      case "popular":
      default:
        currentCourses.sort((a, b) => b.reviews - a.reviews)
        break
    }

    return currentCourses
  }

  const displayedCourses = getFilteredAndSortedCourses()

  const CoursePreviewModal = ({ course }: { course: Course }) => (
    <Dialog open={!!course} onOpenChange={() => setPreviewCourse(null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{course.title}</DialogTitle>
          <DialogDescription>{course.description}</DialogDescription>
        </DialogHeader>
        <div className="relative h-48 mb-4">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={course.instructor.photo}
                alt={course.instructor.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-medium">{course.instructor.name}</p>
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

  const CourseCard = ({ course, onPreview }: { course: Course; onPreview: () => void }) => (
    <Card className="card-hover gradient-border overflow-hidden">
      <div className="relative h-48">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover rounded-t-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <Play className="h-12 w-12 text-white fill-current" />
        </div>
        {course.enrolled && course.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0">
            <Progress value={course.progress} className="h-2 rounded-none" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Image
            src={course.instructor.photo}
            alt={course.instructor.name}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span>{course.instructor.name}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-orange-400 mb-2">
          <Star className="h-4 w-4 fill-current" />
          <span>{course.rating} ({course.reviews})</span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.lessons} Lessons</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold gradient-text">
            {course.price === "Free" ? "Free" : `$${course.price}`}
          </span>
          <Button size="sm" onClick={onPreview}>
            Preview
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2">
          <Bookmark className="h-5 w-5 text-muted-foreground hover:text-primary" />
        </Button>
      </div>
    </Card>
  )

  const CourseListItem = ({ course, onPreview }: { course: Course; onPreview: () => void }) => (
    <Card className="card-hover gradient-border overflow-hidden flex flex-col md:flex-row items-center p-4 gap-4">
      <div className="relative w-full md:w-48 h-32 flex-shrink-0">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <Play className="h-8 w-8 text-white fill-current" />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{course.description}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Image
            src={course.instructor.photo}
            alt={course.instructor.name}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span>{course.instructor.name}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-orange-400 mb-2">
          <Star className="h-4 w-4 fill-current" />
          <span>{course.rating} ({course.reviews})</span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.lessons} Lessons</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className="text-xl font-bold gradient-text">
          {course.price === "Free" ? "Free" : `$${course.price}`}
        </span>
        <Button size="sm" onClick={onPreview}>
          Preview
        </Button>
        <Button variant="ghost" size="icon">
          <Bookmark className="h-5 w-5 text-muted-foreground hover:text-primary" />
        </Button>
      </div>
    </Card>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search courses, skills, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <select
                className="p-2 border rounded-md"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                {viewMode === "grid" ? (
                  <LayoutGrid className="h-4 w-4" />
                ) : (
                  <List className="h-4 w-4" />
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>My Courses</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid md:grid-cols-4 gap-6">
          <div className={`md:block ${showFilters ? 'block fixed inset-0 bg-background z-40 p-4 overflow-y-auto md:relative md:p-0' : 'hidden'}`}>
            <div className="md:hidden flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                    Clear All
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={category.id}
                            checked={filters.categories.includes(category.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleFilterChange('categories', [...filters.categories, category.id])
                              } else {
                                handleFilterChange('categories', filters.categories.filter(id => id !== category.id))
                              }
                            }}
                          />
                          <Label htmlFor={category.id} className="flex items-center gap-2">
                            <category.icon className="h-4 w-4 text-muted-foreground" />
                            <span>{category.name}</span>
                            <span className="text-sm text-muted-foreground">({category.count})</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Skill Level</h3>
                    <div className="space-y-2">
                      {["Beginner", "Intermediate", "Advanced"].map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox
                            id={level}
                            checked={filters.levels.includes(level)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleFilterChange('levels', [...filters.levels, level])
                              } else {
                                handleFilterChange('levels', filters.levels.filter(l => l !== level))
                              }
                            }}
                          />
                          <Label htmlFor={level}>{level}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Price</h3>
                    <div className="space-y-2">
                      {["Free", "Paid", "Premium"].map((price) => (
                        <div key={price} className="flex items-center space-x-2">
                          <Checkbox
                            id={price}
                            checked={filters.price.includes(price)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleFilterChange('price', [...filters.price, price])
                              } else {
                                handleFilterChange('price', filters.price.filter(p => p !== price))
                              }
                            }}
                          />
                          <Label htmlFor={price}>{price}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Rating</h3>
                    <div className="space-y-2">
                      {[4, 3, 2].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <Checkbox
                            id={`rating-${rating}`}
                            checked={filters.rating === rating}
                            onCheckedChange={(checked) => {
                              handleFilterChange('rating', checked ? rating : null)
                            }}
                          />
                          <Label htmlFor={`rating-${rating}`} className="flex items-center">
                            {rating}+ <Star className="h-4 w-4 text-orange-400 ml-1" />
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Duration (Weeks)</h3>
                    <Slider
                      value={duration}
                      onValueChange={setDuration}
                      min={1}
                      max={12}
                      step={1}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{duration[0]} week{duration[0] > 1 ? 's' : ''}</span>
                      <span>{duration[1]} weeks</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Content Language</h3>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 gradient-text">Featured Courses</h2>
              <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {courses.filter(course => course.featured).map((course) => (
                  viewMode === 'grid' ? (
                    <CourseCard key={course.id} course={course} onPreview={() => setPreviewCourse(course)} />
                  ) : (
                    <CourseListItem key={course.id} course={course} onPreview={() => setPreviewCourse(course)} />
                  )
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 gradient-text flex items-center gap-2">
                <TrendingUp className="h-6 w-6" /> Trending in Africa
              </h2>
              <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
                {courses.filter(course => course.trending).map((course) => (
                  <div key={course.id} className="flex-shrink-0 w-72">
                    <CourseCard course={course} onPreview={() => setPreviewCourse(course)} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 gradient-text">New Releases</h2>
              <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {courses.filter(course => course.new).map((course) => (
                  viewMode === 'grid' ? (
                    <CourseCard key={course.id} course={course} onPreview={() => setPreviewCourse(course)} />
                  ) : (
                    <CourseListItem key={course.id} course={course} onPreview={() => setPreviewCourse(course)} />
                  )
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 gradient-text flex items-center gap-2">
                <Award className="h-6 w-6" /> Staff Picks
              </h2>
              <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {courses.filter(course => course.staffPick).map((course) => (
                  viewMode === 'grid' ? (
                    <CourseCard key={course.id} course={course} onPreview={() => setPreviewCourse(course)} />
                  ) : (
                    <CourseListItem key={course.id} course={course} onPreview={() => setPreviewCourse(course)} />
                  )
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 gradient-text">
                Complete Learning Paths
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Digital Marketing Professional",
                    description: "Master digital marketing from basics to advanced strategies",
                    courses: 5,
                    duration: "6 months",
                    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
                  },
                  {
                    title: "E-commerce Entrepreneur",
                    description: "Build and scale your online business from scratch",
                    courses: 4,
                    duration: "4 months",
                    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                  }
                ].map((path, index) => (
                  <Card key={index} className="p-6 card-hover gradient-border">
                    <div className="relative h-40 mb-4">
                      <Image
                        src={path.image}
                        alt={path.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{path.title}</h3>
                    <p className="text-muted-foreground mb-4">{path.description}</p>
                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                      <span>{path.courses} Courses</span>
                      <span>{path.duration}</span>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href={`/courses/learning-paths/${index + 1}`}>
                        View Path
                      </Link>
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {displayedCourses.map((course) => (
                viewMode === 'grid' ? (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onPreview={() => setPreviewCourse(course)}
                  />
                ) : (
                  <CourseListItem
                    key={course.id}
                    course={course}
                    onPreview={() => setPreviewCourse(course)}
                  />
                )
              ))}
              {hasMore && (
                <div ref={ref} className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {previewCourse && <CoursePreviewModal course={previewCourse} />}
    </div>
  )
}
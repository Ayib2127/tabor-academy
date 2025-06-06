"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Search,
  Bell,
  BookOpen,
  Users,
  BarChart,
  MessageSquare,
  PlusCircle,
  Edit,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Video,
  Settings,
  HelpCircle,
  ChevronRight,
  Star,
  Check,
  Trash2
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useForm, Controller, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// Define types for Module and Lesson
interface Lesson {
  id: number;
  title: string;
  // Add other lesson properties like description, content type, etc.
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
  // Add other module properties like description
}

// Mock data for the instructor dashboard
const instructorData = {
  name: "Dr. Sarah Kimani",
  stats: {
    activeStudents: 156,
    coursesActive: 3,
    rating: 4.9,
    completionRate: 78
  },
  activeCourses: [
    {
      id: 1,
      title: "Digital Marketing Mastery",
      students: 156,
      completionRate: 78,
      recentActivity: 12,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
    },
    {
      id: 2,
      title: "E-commerce Strategy",
      students: 89,
      completionRate: 65,
      recentActivity: 8,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
    },
    {
      id: 3,
      title: "Social Media Marketing",
      students: 234,
      completionRate: 82,
      recentActivity: 15,
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0"
    }
  ],
  studentActivity: [
    {
      id: 1,
      type: "assignment",
      student: "John Okafor",
      action: "Submitted final project",
      course: "Digital Marketing Mastery",
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "question",
      student: "Grace Mensah",
      action: "Asked a question",
      course: "E-commerce Strategy",
      time: "4 hours ago"
    },
    {
      id: 3,
      type: "completion",
      student: "David Kamau",
      action: "Completed module 3",
      course: "Social Media Marketing",
      time: "6 hours ago"
    }
  ],
  quickActions: [
    {
      id: 1,
      title: "Review Assignments",
      count: 15,
      icon: FileText,
      color: "text-brand-orange-500",
      bgColor: "bg-brand-orange-100"
    },
    {
      id: 2,
      title: "Student Questions",
      count: 8,
      icon: MessageSquare,
      color: "text-brand-teal-500",
      bgColor: "bg-brand-teal-100"
    },
    {
      id: 3,
      title: "Course Updates",
      count: 3,
      icon: Edit,
      color: "text-brand-orange-500",
      bgColor: "bg-brand-orange-100"
    },
    {
      id: 4,
      title: "Live Sessions",
      count: 2,
      icon: Video,
      color: "text-brand-teal-500",
      bgColor: "bg-brand-teal-100"
    }
  ]
}

const courseInfoSchema = z.object({
  title: z.string().min(1, "Course title is required"),
  subtitle: z.string().optional(),
  description: z.string().min(1, "Course description is required"),
  learningOutcomes: z.string().min(1, "Learning outcomes are required"),
  targetAudience: z.string().optional(),
  prerequisites: z.string().optional(),
  category: z.string().min(1, "Course category is required"),
  level: z.string().min(1, "Skill level is required"),
  pricingStrategy: z.string().min(1, "Pricing strategy is required"),
  price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().optional().refine(val => val === undefined || val >= 0, "Price cannot be negative")
  ),
  language: z.string().min(1, "Course language is required"),
  subtitleLanguages: z.array(z.string()).optional(),
  thumbnail: z.any().optional(),
  promotionalVideo: z.any().optional(),
});

type CourseInfoFormData = z.infer<typeof courseInfoSchema>;

export default function InstructorDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCourseWizard, setShowCourseWizard] = useState(false)
  const [wizardStep, setWizardStep] = useState(1);
  const [modules, setModules] = useState<Module[]>([]);

  const [showAddModuleInput, setShowAddModuleInput] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');

  const wizardSteps = [
    { number: 1, title: "Course Information", description: "Basic course details" },
    { number: 2, title: "Course Structure", description: "Modules and lessons" },
    { number: 3, title: "Content Creation", description: "Add course materials" },
    { number: 4, title: "Review & Publish", description: "Final checks" }
  ];

  const { control, handleSubmit, formState: { errors } } = useForm<CourseInfoFormData>({
    resolver: zodResolver(courseInfoSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      description: '',
      learningOutcomes: '',
      targetAudience: '',
      prerequisites: '',
      category: '',
      level: '',
      pricingStrategy: '',
      language: '',
      subtitleLanguages: [],
    },
  });

  const handleCreateCourseClick = () => {
    setShowCourseWizard(true)
    setWizardStep(1);
  }

  const handleNextStep = (data: CourseInfoFormData) => {
    console.log('Course Information Submitted:', data);
    setWizardStep(2);
  };

  const handleAddModule = () => {
    if (newModuleTitle.trim()) {
      setModules([...modules, { id: Date.now(), title: newModuleTitle.trim(), lessons: [] }]);
      setNewModuleTitle('');
      setShowAddModuleInput(false);
    }
  };

  const handleCancelAddModule = () => {
    setNewModuleTitle('');
    setShowAddModuleInput(false);
  };

  const handleAddLesson = (moduleId: number) => {
    setModules(modules.map(module => {
      if (module.id === moduleId) {
        return {
          ...module,
          lessons: [...module.lessons, { id: Date.now() + module.lessons.length + 1, title: `New Lesson ${module.lessons.length + 1}` }]
        };
      }
      return module;
    }));
  };

  const handleDeleteModule = (moduleId: number) => {
    setModules(modules.filter(module => module.id !== moduleId));
  };

  const handleDeleteLesson = (moduleId: number, lessonId: number) => {
    setModules(modules.map(module => {
      if (module.id === moduleId) {
        return {
          ...module,
          lessons: module.lessons.filter(lesson => lesson.id !== lessonId)
        };
      }
      return module;
    }));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {showCourseWizard ? (
            // Course Creation Wizard
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tighter gradient-text">Create Your Course</h1>
                  <p className="text-muted-foreground">Let's get your course set up. We'll guide you through the process.</p>
                </div>
                <Button variant="outline" onClick={() => setShowCourseWizard(false)}>Cancel</Button>
              </div>

              {/* Progress Steps */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between max-w-3xl mx-auto">
                  {[1, 2, 3, 4].map((step, index) => (
                    <div key={step} className="flex items-center">
                      <div className={`flex flex-col items-center ${index < wizardStep ? 'text-brand-orange-500' : 'text-muted-foreground'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          index < wizardStep 
                            ? 'border-brand-orange-500 bg-brand-orange-500 text-white' 
                            : index === wizardStep - 1 
                            ? 'border-brand-orange-500 text-brand-orange-500' 
                            : 'border-muted-foreground'
                        }`}>
                          {index < wizardStep - 1 ? <Check className="w-4 h-4" /> : step}
                        </div>
                        <span className="text-xs mt-1 font-medium">
                          {index === 0 ? 'Course Info' :
                           index === 1 ? 'Structure' :
                           index === 2 ? 'Content' : 'Review'}
                        </span>
                      </div>
                      {index < 3 && (
                        <div className={`w-24 h-0.5 mx-2 ${
                          index < wizardStep - 1 ? 'bg-brand-orange-500' : 'bg-muted-foreground'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {wizardStep === 1 && (
                <form onSubmit={handleSubmit(handleNextStep)} className="space-y-6">
                  {/* Course Information Setup */}
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Course Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Title */}
                      <div>
                        <Label htmlFor="title">Course Title</Label>
                        <Controller
                          name="title"
                          control={control}
                          render={({ field }) => <Input id="title" placeholder="e.g. Advanced Web Development" value={field.value} onChange={field.onChange} />}
                        />
                        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                      </div>

                      {/* Subtitle */}
                      <div>
                        <Label htmlFor="subtitle">Course Subtitle (Optional)</Label>
                        <Controller
                          name="subtitle"
                          control={control}
                          render={({ field }) => <Input id="subtitle" placeholder="e.g. Become a full-stack expert" value={field.value} onChange={field.onChange} />}
                        />
                        {errors.subtitle && <p className="text-sm text-red-500">{errors.subtitle.message}</p>}
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <Label htmlFor="description">Course Description</Label>
                        <Controller
                          name="description"
                          control={control}
                          render={({ field }) => <Textarea id="description" placeholder="Describe your course" value={field.value} onChange={field.onChange} />}
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                      </div>

                      {/* Learning Outcomes */}
                      <div className="md:col-span-2">
                        <Label htmlFor="learningOutcomes">What will students learn?</Label>
                        <Controller
                          name="learningOutcomes"
                          control={control}
                          render={({ field }) => <Textarea id="learningOutcomes" placeholder="List 3-5 key outcomes" value={field.value} onChange={field.onChange} />}
                        />
                        {errors.learningOutcomes && <p className="text-sm text-red-500">{errors.learningOutcomes.message}</p>}
                      </div>

                      {/* Target Audience */}
                      <div>
                        <Label htmlFor="targetAudience">Who is this course for? (Optional)</Label>
                        <Controller
                          name="targetAudience"
                          control={control}
                          render={({ field }) => <Input id="targetAudience" placeholder="e.g. Beginners in web development" value={field.value} onChange={field.onChange} />}
                        />
                        {errors.targetAudience && <p className="text-sm text-red-500">{errors.targetAudience.message}</p>}
                      </div>

                      {/* Prerequisites */}
                      <div>
                        <Label htmlFor="prerequisites">Prerequisites (Optional)</Label>
                        <Controller
                          name="prerequisites"
                          control={control}
                          render={({ field }) => <Input id="prerequisites" placeholder="e.g. Basic HTML/CSS knowledge" value={field.value} onChange={field.onChange} />}
                        />
                        {errors.prerequisites && <p className="text-sm text-red-500">{errors.prerequisites.message}</p>}
                      </div>

                      {/* Category */}
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Controller
                          name="category"
                          control={control}
                          render={({ field }) => (
                            <Select {...field} onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="category">
                                <SelectValue value={typeof field.value === 'string' ? field.value : undefined} placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="development">Development</SelectItem>
                                <SelectItem value="design">Design</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
                      </div>

                      {/* Level */}
                      <div>
                        <Label htmlFor="level">Skill Level</Label>
                        <Controller
                          name="level"
                          control={control}
                          render={({ field }) => (
                            <Select {...field} onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="level">
                                <SelectValue value={typeof field.value === 'string' ? field.value : undefined} placeholder="Select skill level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.level && <p className="text-sm text-red-500">{errors.level.message}</p>}
                      </div>

                      {/* Pricing Strategy */}
                      <div>
                        <Label htmlFor="pricingStrategy">Pricing Strategy</Label>
                        <Controller
                          name="pricingStrategy"
                          control={control}
                          render={({ field }) => (
                            <Select {...field} onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="pricingStrategy">
                                <SelectValue value={typeof field.value === 'string' ? field.value : undefined} placeholder="Select pricing strategy" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="free">Free</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.pricingStrategy && <p className="text-sm text-red-500">{errors.pricingStrategy.message}</p>}
                      </div>

                      {/* Price (Conditional) */}
                      {/* This field should appear only if Pricing Strategy is 'paid' */}
                      {/* For now, we'll add it always and refine later */}
                      <div>
                        <Label htmlFor="price">Price (Optional)</Label>
                        <Controller
                          name="price"
                          control={control}
                          render={({ field }) => <Input id="price" type="number" placeholder="e.g. 99.99" value={field.value} onChange={field.onChange} />}
                        />
                        {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                      </div>

                      {/* Language */}
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Controller
                          name="language"
                          control={control}
                          render={({ field }) => (
                            <Select {...field} onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="language">
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                              <SelectContent>
                                {/* Add actual language options here */}
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="spanish">Spanish</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.language && <p className="text-sm text-red-500">{errors.language.message}</p>}
                      </div>

                      {/* Subtitle Languages (Optional - basic input for now) */}
                      <div>
                        <Label htmlFor="subtitleLanguages">Subtitle Languages (Optional)</Label>
                        {/* This should ideally be a multi-select or tag input, but using basic input for now */}
                        <Controller
                          name="subtitleLanguages"
                          control={control}
                          render={({ field }) => <Input id="subtitleLanguages" placeholder="e.g. Spanish, French" value={field.value} onChange={field.onChange} />}
                        />
                        {errors.subtitleLanguages && <p className="text-sm text-red-500">{errors.subtitleLanguages.message}</p>}
                      </div>

                      {/* Thumbnail Upload */}
                      <div>
                        <Label htmlFor="thumbnail">Course Thumbnail (Optional)</Label>
                        {/* File upload input - requires specific handling */}
                        <Controller
                          name="thumbnail"
                          control={control}
                          render={({ field: { value, onChange, ...field } }) => (
                            <Input
                              id="thumbnail"
                              type="file"
                              {...field}
                              onChange={(event) => {
                                onChange(event.target.files)
                              }}
                              value={value}
                            />
                          )}
                        />
                        {errors.thumbnail && <p className="text-sm text-red-500">{errors.thumbnail.message}</p>}
                      </div>

                      {/* Promotional Video Upload */}
                      <div>
                        <Label htmlFor="promotionalVideo">Promotional Video (Optional)</Label>
                        {/* File upload input - requires specific handling */}
                        <Controller
                          name="promotionalVideo"
                          control={control}
                          render={({ field: { value, onChange, ...field } }) => (
                            <Input
                              id="promotionalVideo"
                              type="file"
                              {...field}
                              onChange={(event) => {
                                onChange(event.target.files)
                              }}
                              value={value}
                            />
                          )}
                        />
                        {errors.promotionalVideo && <p className="text-sm text-red-500">{errors.promotionalVideo.message}</p>}
                      </div>

                    </div>
                  </Card>

                  {/* Navigation Buttons */}
                  <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => setShowCourseWizard(false)}>Cancel</Button>
                    <Button type="submit">Next Step</Button>
                  </div>
                </form>
              )}

              {wizardStep === 2 && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Course Structure</h2>
                    <p className="text-muted-foreground">Outline your course by creating modules and lessons.</p>
                    
                    {/* Section for adding Modules */}
                    <div className="space-y-4 mt-6">
                      <h3 className="text-lg font-medium">Modules ({modules.length})</h3>
                      {/* List of modules */}
                      {modules.map(module => (
                        <div key={module.id} className="border rounded-md p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{module.title}</span>
                            {/* Module actions */}
                            <div>
                               {/* Delete Module Button */}
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteModule(module.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>

                          {/* List of Lessons within the module */}
                          <div className="space-y-2 pl-4">
                            {module.lessons.map(lesson => (
                              <div key={lesson.id} className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>{lesson.title}</span>
                                {/* Lesson actions */}
                                <div>
                                   {/* Delete Lesson Button */}
                                  <Button variant="ghost" size="sm" onClick={() => handleDeleteLesson(module.id, lesson.id)}>
                                    <Trash2 className="h-3 w-3 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Add New Lesson Button for this module */}
                          <Button variant="outline" className="w-full" size="sm" onClick={() => handleAddLesson(module.id)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Lesson
                          </Button>
                        </div>
                      ))}
                      
                      {/* Add New Module Input and Button */}
                      {showAddModuleInput ? (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter module title"
                            value={newModuleTitle}
                            onChange={(e) => setNewModuleTitle(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddModule();
                              }
                            }}
                          />
                          <Button onClick={handleAddModule}>Save</Button>
                          <Button variant="outline" onClick={handleCancelAddModule}>Cancel</Button>
                        </div>
                      ) : (
                        <Button variant="outline" className="w-full" onClick={() => setShowAddModuleInput(true)}>
                          <PlusCircle className="mr-2 h-4 w-4" /> Add New Module
                        </Button>
                      )}

                    </div>

                  </Card>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setWizardStep(1)}>Previous</Button>
                    <Button onClick={() => setWizardStep(3)}>Next Step</Button>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Content Creation</h2>
                    <p className="text-muted-foreground">Coming soon...</p>
                  </Card>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setWizardStep(2)}>Previous</Button>
                    <Button onClick={() => setWizardStep(4)}>Next Step</Button>
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Review & Publish</h2>
                    <p className="text-muted-foreground">Coming soon...</p>
                  </Card>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setWizardStep(3)}>Previous</Button>
                    <Button>Publish Course</Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Search and Notifications Bar */}
              <div className="flex items-center justify-between mb-8">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search courses, students, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="ghost" className="relative ml-4">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-brand-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    5
                  </span>
                </Button>
              </div>

              {/* Welcome Section */}
              <div className="mb-12">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Welcome, {instructorData.name}</h1>
                    <p className="text-muted-foreground">Here's what's happening with your courses</p>
                  </div>
                  <Button className="bg-gradient-to-r from-brand-orange-600 to-brand-orange-500" onClick={handleCreateCourseClick}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create New Course
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <Card className="p-6 card-hover gradient-border">
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-orange-100 rounded-full p-3">
                      <Users className="h-6 w-6 text-brand-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Students</p>
                      <h3 className="text-2xl font-bold">{instructorData.stats.activeStudents}</h3>
                      <p className="text-sm text-green-500">+15% this month</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 card-hover gradient-border">
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-teal-100 rounded-full p-3">
                      <BookOpen className="h-6 w-6 text-brand-teal-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Courses</p>
                      <h3 className="text-2xl font-bold">{instructorData.stats.coursesActive}</h3>
                      <p className="text-sm text-green-500">+1 this week</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 card-hover gradient-border">
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-orange-100 rounded-full p-3">
                      <Star className="h-6 w-6 text-brand-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average Rating</p>
                      <h3 className="text-2xl font-bold">{instructorData.stats.rating}</h3>
                      <p className="text-sm text-green-500">Top Rated</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 card-hover gradient-border">
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-teal-100 rounded-full p-3">
                      <BarChart className="h-6 w-6 text-brand-teal-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completion Rate</p>
                      <h3 className="text-2xl font-bold">{instructorData.stats.completionRate}%</h3>
                      <p className="text-sm text-green-500">Above Average</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
                <div className="grid md:grid-cols-4 gap-6">
                  {instructorData.quickActions.map((action) => (
                    <Card key={action.id} className="p-6 card-hover gradient-border">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`${action.bgColor} rounded-full p-2`}>
                          <action.icon className={`h-6 w-6 ${action.color}`} />
                        </div>
                        <span className="text-sm font-medium">{action.count} Pending</span>
                      </div>
                      <h3 className="font-semibold">{action.title}</h3>
                      <Button variant="ghost" size="sm" className="mt-4">
                        View All
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Course Management */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Your Courses</h2>
                  <Button variant="outline">Manage All Courses</Button>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {instructorData.activeCourses.map((course) => (
                    <Card key={course.id} className="card-hover gradient-border">
                      <div className="relative h-48">
                        <Image
                          src={course.image}
                          alt={course.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-semibold mb-4">{course.title}</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Students</span>
                            <span className="font-medium">{course.students}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Completion Rate</span>
                            <span className="font-medium">{course.completionRate}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Recent Activity</span>
                            <span className="font-medium">{course.recentActivity} actions</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-6">
                          <Button variant="outline" className="flex-1">Edit</Button>
                          <Button className="flex-1">View</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Student Activity */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card className="p-6 card-hover gradient-border">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">Recent Student Activity</h2>
                      <Button variant="ghost">View All</Button>
                    </div>
                    <div className="space-y-6">
                      {instructorData.studentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4">
                          <div className="bg-brand-orange-100 rounded-full p-2">
                            {activity.type === "assignment" && <FileText className="h-5 w-5 text-brand-orange-500" />}
                            {activity.type === "question" && <MessageSquare className="h-5 w-5 text-brand-orange-500" />}
                            {activity.type === "completion" && <CheckCircle className="h-5 w-5 text-brand-orange-500" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{activity.student}</h3>
                              <span className="text-sm text-muted-foreground">{activity.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{activity.action}</p>
                            <p className="text-sm text-brand-orange-500">{activity.course}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <div>
                  <Card className="p-6 card-hover gradient-border">
                    <h2 className="text-2xl font-bold mb-6">Quick Tools</h2>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <Video className="h-4 w-4 mr-2" />
                        Record New Lesson
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Create Assignment
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Announcement
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        Course Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Get Support
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
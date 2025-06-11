"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Edit,
  PlusCircle,
  Trash2,
  GripVertical,
  FileText,
  ImageIcon,
  Video,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"

interface Lesson {
  id: string; // Changed to string for UUID from Supabase
  title: string;
  is_published: boolean;
}

interface Module {
  id: string; // Changed to string for UUID from Supabase
  title: string;
  lessons: Lesson[];
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  tags: string[];
  price: number;
  thumbnail_url: string | null;
  promo_video_url: string | null;
  is_published: boolean;
  modules: Module[];
}

interface DraggableModuleProps {
  module: Module;
  onDeleteModule: (moduleId: string) => void;
  onAddLesson: (moduleId: string) => void;
  onDeleteLesson: (moduleId: string, lessonId: string) => void;
  onLessonTitleChange: (moduleId: string, lessonId: string, newTitle: string) => void;
  onModuleTitleChange: (moduleId: string, newTitle: string) => void;
}

function DraggableModule({
  module,
  onDeleteModule,
  onAddLesson,
  onDeleteLesson,
  onLessonTitleChange,
  onModuleTitleChange
}: DraggableModuleProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `module-${module.id}`,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [showAddLessonInput, setShowAddLessonInput] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [isEditingModuleTitle, setIsEditingModuleTitle] = useState(false);
  const [editedModuleTitle, setEditedModuleTitle] = useState(module.title);

  const handleAddLesson = () => {
    if (newLessonTitle.trim()) {
      onAddLesson(module.id);
      setNewLessonTitle("");
      setShowAddLessonInput(null);
    }
  };

  const handleSaveModuleTitle = () => {
    onModuleTitleChange(module.id, editedModuleTitle);
    setIsEditingModuleTitle(false);
  };

  return (
    <Card ref={setNodeRef} style={style} className="border-[#E5E8E8] shadow-sm">
      <CardHeader className="pb-3 bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-white/50"
            >
              <GripVertical className="h-4 w-4 text-[#2C3E50]/40" />
            </div>
            <BookOpen className="h-5 w-5 text-[#FF6B35]" />
            {isEditingModuleTitle ? (
              <Input
                value={editedModuleTitle}
                onChange={(e) => setEditedModuleTitle(e.target.value)}
                onBlur={handleSaveModuleTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveModuleTitle();
                  }
                }}
                className="text-lg border-b border-gray-300 focus:border-blue-500 outline-none p-0 h-auto font-bold text-[#2C3E50]"
              />
            ) : (
              <CardTitle className="text-[#2C3E50] text-lg cursor-pointer" onClick={() => setIsEditingModuleTitle(true)}>
                {module.title}
              </CardTitle>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteModule(module.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 ml-8">
          <SortableContext
            items={module.lessons.map(lesson => `lesson-${module.id}-${lesson.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {module.lessons.map((lesson) => (
              <DraggableLesson
                key={lesson.id}
                module_id={module.id}
                lesson={lesson}
                onDeleteLesson={onDeleteLesson}
                onLessonTitleChange={onLessonTitleChange}
              />
            ))}
          </SortableContext>

          {showAddLessonInput === module.id ? (
            <div className="flex gap-2 mt-3">
              <Input
                placeholder="Enter lesson title"
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddLesson();
                  }
                }}
                className="border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
              />
              <Button
                onClick={handleAddLesson}
                className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
              >
                Add
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddLessonInput(null);
                  setNewLessonTitle("");
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddLessonInput(module.id)}
              className="w-full mt-3 border-[#4ECDC4]/30 text-[#4ECDC4] hover:bg-[#4ECDC4]/5"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Lesson
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface DraggableLessonProps {
  module_id: string;
  lesson: Lesson;
  onDeleteLesson: (moduleId: string, lessonId: string) => void;
  onLessonTitleChange: (moduleId: string, lessonId: string, newTitle: string) => void;
}

function DraggableLesson({
  module_id,
  lesson,
  onDeleteLesson,
  onLessonTitleChange,
}: DraggableLessonProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `lesson-${module_id}-${lesson.id}`,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(lesson.title);

  const handleSave = () => {
    onLessonTitleChange(module_id, lesson.id, editedTitle);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 bg-[#F7F9F9] rounded-lg border border-[#E5E8E8]"
    >
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-white/50"
        >
          <GripVertical className="h-4 w-4 text-[#2C3E50]/40" />
        </div>
        <FileText className="h-4 w-4 text-[#4ECDC4]" />
        {isEditing ? (
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }
            }}
            className="text-sm border-b border-gray-300 focus:border-blue-500 outline-none p-0 h-auto"
          />
        ) : (
          <span className="text-sm text-[#2C3E50] cursor-pointer" onClick={() => setIsEditing(true)}>
            {lesson.title}
          </span>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDeleteLesson(module_id, lesson.id)}
        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}

const categories = [
  "Digital Marketing",
  "No-Code Development",
  "E-commerce",
  "AI Tools",
  "Civil Engineering",
  "Financial Literacy",
  "Entrepreneurship",
  "Freelancing",
];

const levelOptions = [
  { value: "beginner", label: "🌱 Beginner" },
  { value: "intermediate", label: "🚀 Intermediate" },
  { value: "advanced", label: "⭐ Advanced" },
];

export default function CourseContentPage() {
  const params = useParams();
  const courseId = params.id as string;
  const supabase = createClientComponentClient();

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const { data: course, error: fetchError } = await supabase
          .from('courses')
          .select('*, modules:course_modules(*, lessons:module_lessons(*))')
          .eq('id', courseId)
          .single();

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        if (!course) {
          throw new Error("Course not found");
        }

        // Transform fetched data to CourseData format
        const transformedData: CourseData = {
          id: course.id,
          title: course.title,
          description: course.description,
          category: course.category,
          level: course.level as "beginner" | "intermediate" | "advanced",
          tags: course.tags || [],
          price: course.price || 0,
          thumbnail_url: course.thumbnail_url,
          promo_video_url: course.promo_video_url,
          is_published: course.is_published,
          modules: course.modules.map((mod: any) => ({
            id: mod.id,
            title: mod.title,
            lessons: mod.lessons.map((lesson: any) => ({
              id: lesson.id,
              title: lesson.title,
              is_published: lesson.is_published || false,
            })),
          })),
        };
        setCourseData(transformedData);

      } catch (err: any) {
        console.error("Error fetching course for editing:", err);
        setError(err.message || 'Failed to load course for editing.');
        toast.error(err.message || 'Failed to load course for editing.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, supabase]);

  const updateCourseData = (updates: Partial<CourseData>) => {
    setCourseData((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const addModule = () => {
    if (courseData) {
      const newModule: Module = {
        id: `temp-module-${Date.now()}`,
        title: "New Module",
        lessons: [],
      };
      updateCourseData({ modules: [...courseData.modules, newModule] });
    }
  };

  const deleteModule = (moduleId: string) => {
    if (courseData) {
      updateCourseData({ modules: courseData.modules.filter((m) => m.id !== moduleId) });
    }
  };

  const addLesson = (moduleId: string) => {
    if (courseData) {
      const newLesson: Lesson = {
        id: `temp-lesson-${Date.now()}`,
        title: "New Lesson",
        is_published: false,
      };
      updateCourseData({
        modules: courseData.modules.map((module) =>
          module.id === moduleId ? { ...module, lessons: [...module.lessons, newLesson] } : module,
        ),
      });
    }
  };

  const deleteLesson = (moduleId: string, lessonId: string) => {
    if (courseData) {
      updateCourseData({
        modules: courseData.modules.map((module) =>
          module.id === moduleId ? { ...module, lessons: module.lessons.filter((l) => l.id !== lessonId) } : module,
        ),
      });
    }
  };

  const handleLessonTitleChange = (moduleId: string, lessonId: string, newTitle: string) => {
    if (courseData) {
      updateCourseData({
        modules: courseData.modules.map((module) =>
          module.id === moduleId ?
            { ...module, lessons: module.lessons.map(lesson => lesson.id === lessonId ? { ...lesson, title: newTitle } : lesson) }
            : module,
        ),
      });
    }
  };

  const handleModuleTitleChange = (moduleId: string, newTitle: string) => {
    if (courseData) {
      updateCourseData({
        modules: courseData.modules.map((module) =>
          module.id === moduleId ? { ...module, title: newTitle } : module,
        ),
      });
    }
  };

  const handleReorderModules = ({ active, over }: DragEndEvent) => {
    if (!courseData || !over || active.id === over.id) return;

    const oldIndex = courseData.modules.findIndex((module) => `module-${module.id}` === active.id);
    const newIndex = courseData.modules.findIndex((module) => `module-${module.id}` === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    updateCourseData({
      modules: arrayMove(courseData.modules, oldIndex, newIndex),
    });
  };

  const handleReorderLessons = (moduleId: string, reorderedLessons: Lesson[]) => {
    if (courseData) {
      updateCourseData({
        modules: courseData.modules.map((module) =>
          module.id === moduleId ? { ...module, lessons: reorderedLessons } : module,
        ),
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!courseData) return;

    try {
      setLoading(true);

      // Update main course details
      const { error: courseUpdateError } = await supabase
        .from('courses')
        .update({
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
          level: courseData.level,
          tags: courseData.tags,
          price: courseData.price,
          thumbnail_url: courseData.thumbnail_url,
          promo_video_url: courseData.promo_video_url,
          is_published: courseData.is_published,
        })
        .eq('id', courseData.id);

      if (courseUpdateError) {
        throw new Error(courseUpdateError.message);
      }

      // Sync modules and lessons
      // For simplicity, this example re-inserts all modules/lessons. 
      // A more robust solution would track changes (add/update/delete).

      // Delete existing modules and lessons for this course to re-insert
      // NOTE: This assumes you have RLS policies that allow this or are handling it server-side
      const { error: deleteModulesError } = await supabase
        .from('course_modules')
        .delete()
        .eq('course_id', courseData.id);
      
      if (deleteModulesError) {
        throw new Error(deleteModulesError.message);
      }

      for (const moduleData of courseData.modules) {
        const { data: newModule, error: moduleInsertError } = await supabase
          .from('course_modules')
          .insert({
            course_id: courseData.id,
            title: moduleData.title,
          })
          .select()
          .single();

        if (moduleInsertError) {
          throw new Error(moduleInsertError.message);
        }

        for (const lessonData of moduleData.lessons) {
          const { error: lessonInsertError } = await supabase
            .from('module_lessons')
            .insert({
              module_id: newModule.id,
              title: lessonData.title,
              is_published: lessonData.is_published,
            });
          
          if (lessonInsertError) {
            throw new Error(lessonInsertError.message);
          }
        }
      }

      toast.success("Course updated successfully!");
    } catch (err: any) {
      console.error("Error saving course changes:", err);
      toast.error(err.message || 'Failed to save course changes.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Course</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-16 w-16 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Course Not Found</h2>
        <p className="text-gray-600 mb-4">The course you are looking for does not exist or you do not have access.</p>
        <Link href="/dashboard/instructor/courses"><Button>Back to My Courses</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9F9] to-white">
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#2C3E50]">Edit Course: {courseData.title}</h1>
          <Button onClick={handleSaveChanges} className="bg-gradient-to-r from-[#1B4D3E] to-[#4ECDC4] hover:from-[#1B4D3E]/90 hover:to-[#4ECDC4]/90 text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Course Basics */}
        <Card className="border-[#E5E8E8] shadow-sm mb-6">
          <CardHeader className="bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5">
            <CardTitle className="text-[#2C3E50] flex items-center gap-2">📚 Course Basics</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#2C3E50] font-semibold">Course Title *</Label>
              <Input
                id="title"
                value={courseData.title}
                onChange={(e) => updateCourseData({ title: e.target.value })}
                className="border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#2C3E50] font-semibold">Course Description *</Label>
              <Textarea
                id="description"
                value={courseData.description}
                onChange={(e) => updateCourseData({ description: e.target.value })}
                rows={4}
                className="border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[#2C3E50] font-semibold">Category *</Label>
                <Select value={courseData.category} onValueChange={(value) => updateCourseData({ category: value })}>
                  <SelectTrigger className="border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20">
                    <SelectValue>{courseData.category || "Select a category"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[#2C3E50] font-semibold">Skill Level *</Label>
                <Select value={courseData.level} onValueChange={(value) => updateCourseData({ level: value as any })}>
                  <SelectTrigger className="border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20">
                    <SelectValue>
                      {courseData.level ? levelOptions.find(opt => opt.value === courseData.level)?.label : "Select skill level"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {levelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[#2C3E50] font-semibold">Course Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={courseData.tags.join(", ")}
                  onChange={(e) => updateCourseData({ tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) })}
                  placeholder="e.g., SEO, Social Media"
                  className="border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {courseData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/20">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Media & Pricing */}
        <Card className="border-[#E5E8E8] shadow-sm mb-6">
          <CardHeader className="bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5">
            <CardTitle className="text-[#2C3E50] flex items-center gap-2">🎨 Course Media & Pricing</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <Label className="text-[#2C3E50] font-semibold flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Course Thumbnail URL
              </Label>
              <Input
                value={courseData.thumbnail_url || ''}
                onChange={(e) => updateCourseData({ thumbnail_url: e.target.value })}
                placeholder="Enter thumbnail URL"
                className="border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20"
              />
              {courseData.thumbnail_url && (
                <img src={courseData.thumbnail_url} alt="Thumbnail Preview" className="w-48 h-24 object-cover rounded-lg border border-[#E5E8E8]" />
              )}
            </div>
            <div className="space-y-4">
              <Label className="text-[#2C3E50] font-semibold flex items-center gap-2">
                <Video className="w-4 h-4" />
                Promotional Video URL (Optional)
              </Label>
              <Input
                value={courseData.promo_video_url || ''}
                onChange={(e) => updateCourseData({ promo_video_url: e.target.value })}
                placeholder="Enter promo video URL"
                className="border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20"
              />
              {courseData.promo_video_url && (
                <video src={courseData.promo_video_url} controls className="w-full h-48 rounded-lg border border-[#E5E8E8]" />
              )}
            </div>
            <div className="space-y-4">
              <Label className="text-[#2C3E50] font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Course Pricing
              </Label>
              <Input
                type="number"
                value={courseData.price}
                onChange={(e) => updateCourseData({ price: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
                className="border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Course Structure */}
        <Card className="border-[#E5E8E8] shadow-sm mb-6">
          <CardHeader className="bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5">
            <CardTitle className="text-[#2C3E50] flex items-center gap-2">🏗️ Course Structure</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <DndContext sensors={useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))} collisionDetection={closestCenter} onDragEnd={handleReorderModules}>
              <SortableContext items={courseData.modules.map(m => `module-${m.id}`)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {courseData.modules.map(module => (
                    <DraggableModule
                      key={module.id}
                      module={module}
                      onDeleteModule={deleteModule}
                      onAddLesson={addLesson}
                      onDeleteLesson={deleteLesson}
                      onLessonTitleChange={handleLessonTitleChange}
                      onModuleTitleChange={handleModuleTitleChange}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            <Button onClick={addModule} className="w-full mt-4 bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Module
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
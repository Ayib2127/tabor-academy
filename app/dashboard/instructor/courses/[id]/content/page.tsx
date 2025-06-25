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
  Video,
  HelpCircle,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Settings,
  Save,
  Menu,
  X,
  Target,
  Users,
  Layers,
  Eye,
  History,
  Command,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import dynamic from "next/dynamic"
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
  id: string;
  title: string;
  content?: object | null; // Updated to support Tiptap JSON
  type: 'video' | 'text' | 'quiz';
  is_published: boolean;
  order: number;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  weekly_sprint_goal?: string; // Added for cohort courses
  unlocks_on_week?: number; // Added for cohort courses
  order: number;
}

interface LiveSession {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  duration: number;
  meeting_link?: string;
  week_number: number;
  max_participants?: number;
  location?: string;
  type: 'online' | 'in_person' | 'hybrid';
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
  delivery_type: 'self_paced' | 'cohort'; // Added delivery type
  start_date?: string; // Added for cohort courses
  end_date?: string; // Added for cohort courses
  status: 'draft' | 'pending_review' | 'published'; // Added status
  modules: Module[];
  live_sessions?: LiveSession[]; // Added for cohort courses
}

interface DraggableModuleProps {
  module: Module;
  courseData: CourseData;
  onDeleteModule: (moduleId: string) => void;
  onAddLesson: (moduleId: string) => void;
  onDeleteLesson: (moduleId: string, lessonId: string) => void;
  onLessonTitleChange: (moduleId: string, lessonId: string, newTitle: string) => void;
  onModuleTitleChange: (moduleId: string, newTitle: string) => void;
  setSelectedLesson: (val: { moduleId: string; lesson: Lesson } | null) => void;
  setSelectedModule: (val: { module: Module } | null) => void;
  selectedLesson: { moduleId: string; lesson: Lesson } | null;
  selectedModule: { module: Module } | null;
  weekNumber?: number; // For cohort courses
}

function DraggableModule({
  module,
  courseData,
  onDeleteModule,
  onAddLesson,
  onDeleteLesson,
  onLessonTitleChange,
  onModuleTitleChange,
  setSelectedLesson,
  setSelectedModule,
  selectedLesson,
  selectedModule,
  weekNumber,
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

  // Check if course is locked (cohort course that has started)
  const isCourseLocked = courseData.delivery_type === 'cohort' && 
    courseData.start_date && 
    new Date(courseData.start_date) <= new Date();

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

  const handleModuleClick = () => {
    setSelectedModule({ module });
    setSelectedLesson(null);
  };

  const isSelected = selectedModule?.module.id === module.id;

  return (
    <div className="mb-4">
      {/* Week Header for Cohort Courses */}
      {courseData.delivery_type === 'cohort' && weekNumber && (
        <div className="mb-2 px-3 py-1 bg-gradient-to-r from-[#FF6B35]/10 to-[#4ECDC4]/10 rounded-md">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#2C3E50]">Week {weekNumber}</h4>
            {module.weekly_sprint_goal && (
              <Badge variant="outline" className="text-xs border-[#FF6B35]/30 text-[#FF6B35]">
                <Target className="w-3 h-3 mr-1" />
                Goal Set
              </Badge>
            )}
          </div>
        </div>
      )}
      
      <Card 
        ref={setNodeRef} 
        style={style} 
        className={`border-[#E5E8E8] shadow-sm cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-2 ring-[#4ECDC4] border-[#4ECDC4]' : 'hover:border-[#4ECDC4]/50'
        }`}
        onClick={handleModuleClick}
      >
        <CardHeader className="pb-3 bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                {...attributes}
                {...listeners}
                className={`cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-white/50 ${
                  isCourseLocked ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={(e) => e.stopPropagation()}
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
                    e.stopPropagation();
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="text-lg border-b border-gray-300 focus:border-blue-500 outline-none p-0 h-auto font-bold text-[#2C3E50]"
                  disabled={isCourseLocked}
                />
              ) : (
                <CardTitle 
                  className="text-[#2C3E50] text-lg cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isCourseLocked) {
                      setIsEditingModuleTitle(true);
                    }
                  }}
                >
                  {module.title}
                </CardTitle>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (!isCourseLocked) {
                  onDeleteModule(module.id);
                }
              }}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              disabled={isCourseLocked}
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
                  courseData={courseData}
                  onDeleteLesson={onDeleteLesson}
                  onLessonTitleChange={onLessonTitleChange}
                  setSelectedLesson={setSelectedLesson}
                  selectedLesson={selectedLesson}
                />
              ))}
            </SortableContext>

            {showAddLessonInput === module.id ? (
              <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                <Input
                  placeholder="Enter lesson title"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddLesson();
                    }
                    e.stopPropagation();
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
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isCourseLocked) {
                    setShowAddLessonInput(module.id);
                  }
                }}
                className="w-full mt-3 border-[#4ECDC4]/30 text-[#4ECDC4] hover:bg-[#4ECDC4]/5"
                disabled={isCourseLocked}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Lesson
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface DraggableLessonProps {
  module_id: string;
  lesson: Lesson;
  courseData: CourseData;
  onDeleteLesson: (moduleId: string, lessonId: string) => void;
  onLessonTitleChange: (moduleId: string, lessonId: string, newTitle: string) => void;
  setSelectedLesson: (val: { moduleId: string, lesson: Lesson } | null) => void;
  selectedLesson: { moduleId: string; lesson: Lesson } | null;
}

function DraggableLesson({
  module_id,
  lesson,
  courseData,
  onDeleteLesson,
  onLessonTitleChange,
  setSelectedLesson,
  selectedLesson,
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

  // Check if course is locked (cohort course that has started)
  const isCourseLocked = courseData.delivery_type === 'cohort' && 
    courseData.start_date && 
    new Date(courseData.start_date) <= new Date();

  const handleSave = () => {
    onLessonTitleChange(module_id, lesson.id, editedTitle);
    setIsEditing(false);
  };

  const handleLessonClick = () => {
    setSelectedLesson({ moduleId: module_id, lesson });
  };

  const isSelected = selectedLesson?.lesson.id === lesson.id && selectedLesson?.moduleId === module_id;

  // Get icon and color based on lesson type
  const getLessonIcon = () => {
    switch (lesson.type) {
      case 'text':
        return <FileText className="h-4 w-4 text-[#4ECDC4]" />;
      case 'video':
        return <Video className="h-4 w-4 text-[#FF6B35]" />;
      case 'quiz':
        return <HelpCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-[#4ECDC4]" />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 bg-[#F7F9F9] rounded-lg border cursor-pointer transition-all duration-200 ${
        isSelected ? 'border-[#4ECDC4] bg-[#4ECDC4]/5' : 'border-[#E5E8E8] hover:border-[#4ECDC4]/50'
      }`}
      onClick={handleLessonClick}
    >
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className={`cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-white/50 ${
            isCourseLocked ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4 text-[#2C3E50]/40" />
        </div>
        {getLessonIcon()}
        {isEditing ? (
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }
              e.stopPropagation();
            }}
            onClick={(e) => e.stopPropagation()}
            className="text-sm border-b border-gray-300 focus:border-blue-500 outline-none p-0 h-auto"
            disabled={isCourseLocked}
          />
        ) : (
          <span 
            className="text-sm text-[#2C3E50] cursor-pointer" 
            onClick={(e) => {
              e.stopPropagation();
              if (!isCourseLocked) {
                setIsEditing(true);
              }
            }}
          >
            {lesson.title}
          </span>
        )}
        {lesson.is_published && (
          <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
            Published
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="ml-2"
          onClick={(e) => {
            e.stopPropagation();
            handleLessonClick();
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            if (!isCourseLocked) {
              onDeleteLesson(module_id, lesson.id);
            }
          }}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
          disabled={isCourseLocked}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
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

// Dynamically import components client-side to avoid SSR hydration issues
const LessonEditor = dynamic(() => import("@/components/instructor/course-editor/LessonEditor"), { ssr: false });
const LiveSessionScheduler = dynamic(() => import("@/components/instructor/course-editor/LiveSessionScheduler"), { ssr: false });
const WeeklyGoalEditor = dynamic(() => import("@/components/instructor/course-editor/WeeklyGoalEditor"), { ssr: false });
const DripContentManager = dynamic(() => import("@/components/instructor/course-editor/DripContentManager"), { ssr: false });
const AIAssistant = dynamic(() => import("@/components/instructor/course-editor/AIAssistant"), { ssr: false });
const VersionHistory = dynamic(() => import("@/components/instructor/course-editor/VersionHistory"), { ssr: false });
const CommandPalette = dynamic(() => import("@/components/instructor/course-editor/CommandPalette"), { ssr: false });
const CoursePreview = dynamic(() => import("@/components/instructor/course-editor/CoursePreview"), { ssr: false });

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
  const [selectedLesson, setSelectedLesson] = useState<{ moduleId: string, lesson: Lesson } | null>(null);
  const [selectedModule, setSelectedModule] = useState<{ module: Module } | null>(null);
  const [activeView, setActiveView] = useState<'structure' | 'live-sessions' | 'drip-content'>('structure');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  // AI and Advanced Features State
  const [selectedText, setSelectedText] = useState<string>('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showCoursePreview, setShowCoursePreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<'student' | 'week-1' | 'week-2' | 'week-3' | 'instructor'>('student');

  // Dnd-kit hooks - MUST be called at the top level of the component
  const pointerSensor = useSensor(PointerSensor);
  const keyboardSensor = useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates });
  const sensors = useSensors(pointerSensor, keyboardSensor);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette (⌘K or Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      
      // Save (⌘S or Ctrl+S)
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSaveChanges();
      }
      
      // Preview (⌘P or Ctrl+P)
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        setShowCoursePreview(true);
      }
      
      // Version History (⌘H or Ctrl+H)
      if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
        e.preventDefault();
        if (selectedLesson) {
          setShowVersionHistory(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedLesson]);

  // Track text selection for AI assistant
  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        setSelectedText(selection.toString().trim());
      }
    };

    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('keyup', handleTextSelection);
    
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('keyup', handleTextSelection);
    };
  }, []);

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
          delivery_type: course.delivery_type || 'self_paced',
          start_date: course.start_date,
          end_date: course.end_date,
          status: course.status || 'draft',
          modules: course.modules.map((mod: any) => ({
            id: mod.id,
            title: mod.title,
            weekly_sprint_goal: mod.weekly_sprint_goal,
            unlocks_on_week: mod.unlocks_on_week,
            order: mod.order || 0,
            lessons: mod.lessons.map((lesson: any) => ({
              id: lesson.id,
              title: lesson.title,
              content: lesson.content,
              type: lesson.type || 'text',
              is_published: lesson.is_published || false,
              order: lesson.order || 0,
            })),
          })),
          live_sessions: [], // TODO: Fetch from live_sessions table
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
        order: courseData.modules.length,
      };
      updateCourseData({ modules: [...courseData.modules, newModule] });
    }
  };

  const deleteModule = (moduleId: string) => {
    if (courseData) {
      updateCourseData({ modules: courseData.modules.filter((m) => m.id !== moduleId) });
      // Clear selection if deleted module was selected
      if (selectedModule?.module.id === moduleId) {
        setSelectedModule(null);
      }
    }
  };

  const addLesson = (moduleId: string) => {
    if (courseData) {
      const newLesson: Lesson = {
        id: `temp-lesson-${Date.now()}`,
        title: "New Lesson",
        type: 'text',
        is_published: false,
        order: 0,
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
      // Clear selection if deleted lesson was selected
      if (selectedLesson?.lesson.id === lessonId) {
        setSelectedLesson(null);
      }
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

  const handleModuleUpdate = (moduleId: string, updates: Partial<Module>) => {
    if (courseData) {
      updateCourseData({
        modules: courseData.modules.map((module) =>
          module.id === moduleId ? { ...module, ...updates } : module,
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

  const handleSaveChanges = async () => {
    if (!courseData) return;

    try {
      setSaveStatus('saving');

      // Detect major changes (for published courses)
      const isMajorChange = false; // TODO: Implement major change detection logic

      // Update main course details
      const courseUpdateData: any = {
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        level: courseData.level,
        tags: courseData.tags,
        price: courseData.price,
        thumbnail_url: courseData.thumbnail_url,
        promo_video_url: courseData.promo_video_url,
        is_published: courseData.is_published,
        delivery_type: courseData.delivery_type,
        start_date: courseData.start_date,
        end_date: courseData.end_date,
      };

      // If major change detected on published course, revert to pending review
      if (isMajorChange && courseData.is_published) {
        courseUpdateData.status = 'pending_review';
      }

      const { error: courseUpdateError } = await supabase
        .from('courses')
        .update(courseUpdateData)
        .eq('id', courseData.id);

      if (courseUpdateError) {
        throw new Error(courseUpdateError.message);
      }

      // Sync modules and lessons
      const { error: deleteModulesError } = await supabase
        .from('course_modules')
        .delete()
        .eq('course_id', courseData.id);
      
      if (deleteModulesError) {
        throw new Error(deleteModulesError.message);
      }

      for (const [moduleIndex, moduleData] of courseData.modules.entries()) {
        const { data: newModule, error: moduleInsertError } = await supabase
          .from('course_modules')
          .insert({
            course_id: courseData.id,
            title: moduleData.title,
            weekly_sprint_goal: moduleData.weekly_sprint_goal,
            unlocks_on_week: moduleData.unlocks_on_week,
            order: moduleIndex,
          })
          .select()
          .single();

        if (moduleInsertError) {
          throw new Error(moduleInsertError.message);
        }

        // insert lessons for this module
        for (const [lessonIndex, lessonData] of moduleData.lessons.entries()) {
          const { error: lessonInsertError } = await supabase
            .from('module_lessons')
            .insert({
              module_id: newModule.id,
              title: lessonData.title,
              content: lessonData.content,
              type: lessonData.type,
              is_published: lessonData.is_published,
              order: lessonIndex,
            });
          if (lessonInsertError) {
            throw new Error(lessonInsertError.message);
          }
        }
      }

      setSaveStatus('saved');
      toast.success("Course updated successfully!");
      
      // Reset save status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);

    } catch (err: any) {
      console.error("Error saving course changes:", err);
      setSaveStatus('error');
      toast.error(err.message || 'Failed to save course changes.');
      
      // Reset save status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // AI Assistant Handlers
  const handleAIContentGenerated = (content: any) => {
    if (selectedLesson) {
      const updatedLesson = { ...selectedLesson.lesson, content };
      setCourseData(prev =>
        prev
          ? {
              ...prev,
              modules: prev.modules.map(m =>
                m.id === selectedLesson.moduleId
                  ? { ...m, lessons: m.lessons.map(l => l.id === updatedLesson.id ? updatedLesson : l) }
                  : m
              ),
            }
          : prev
      );
      setSelectedLesson({ moduleId: selectedLesson.moduleId, lesson: updatedLesson });
    }
  };

  const handleAIQuizGenerated = (quiz: any) => {
    if (selectedLesson) {
      const updatedLesson = { ...selectedLesson.lesson, content: quiz, type: 'quiz' as const };
      setCourseData(prev =>
        prev
          ? {
              ...prev,
              modules: prev.modules.map(m =>
                m.id === selectedLesson.moduleId
                  ? { ...m, lessons: m.lessons.map(l => l.id === updatedLesson.id ? updatedLesson : l) }
                  : m
              ),
            }
          : prev
      );
      setSelectedLesson({ moduleId: selectedLesson.moduleId, lesson: updatedLesson });
    }
  };

  // Command Palette Handlers
  const handleCommandNavigate = (path: string) => {
    switch (path) {
      case 'structure':
        setActiveView('structure');
        break;
      case 'schedule':
        setActiveView('drip-content');
        break;
      case 'sessions':
        setActiveView('live-sessions');
        break;
    }
  };

  const handleCommandAIAction = (action: string) => {
    // Trigger AI assistant with specific action
    console.log('AI Action:', action);
  };

  const handleCommandPreview = (mode: string) => {
    setPreviewMode(mode as any);
    setShowCoursePreview(true);
  };

  // Group modules by week for cohort courses
  const getModulesByWeek = () => {
    if (courseData?.delivery_type !== 'cohort') {
      return [{ week: null, modules: courseData?.modules || [] }];
    }

    const weekGroups: { [key: number]: Module[] } = {};
    courseData?.modules.forEach(module => {
      const week = module.unlocks_on_week || 1;
      if (!weekGroups[week]) {
        weekGroups[week] = [];
      }
      weekGroups[week].push(module);
    });

    return Object.entries(weekGroups).map(([week, modules]) => ({
      week: parseInt(week),
      modules,
    }));
  };

  // Render save status indicator
  const renderSaveStatus = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <div className="flex items-center gap-2 text-blue-600" aria-live="polite">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Saving...</span>
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center gap-2 text-green-600" aria-live="polite">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Saved ✓</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-600" aria-live="polite">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Save failed</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Refactored conditional rendering
  let content;

  if (!courseId) {
    content = (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Invalid Course ID</h2>
        <p className="text-gray-600 mb-4">Please provide a valid course ID to view this page.</p>
        <Link href="/dashboard/instructor/courses"><Button>Back to My Courses</Button></Link>
      </div>
    );
  } else if (loading) {
    content = (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <Clock className="h-16 w-16 text-blue-500 mb-4 animate-spin" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Loading Course Content...</h2>
        <p className="text-gray-600">Please wait while we fetch the course details.</p>
      </div>
    );
  } else if (error) {
    content = (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Course</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  } else if (!courseData) {
    content = (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-16 w-16 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Course Not Found</h2>
        <p className="text-gray-600 mb-4">The course you are looking for does not exist or you do not have access.</p>
        <Link href="/dashboard/instructor/courses"><Button>Back to My Courses</Button></Link>
      </div>
    );
  } else {
    content = (
      <div className="h-screen flex flex-col bg-[#FAFBFB]">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-[#E5E8E8] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              {/* Breadcrumb Navigation */}
              <nav className="flex items-center space-x-2 text-sm text-[#2C3E50]">
                <Link href="/dashboard/instructor/courses" className="hover:text-[#4ECDC4]">
                  My Courses
                </Link>
                <span>/</span>
                <span className="font-medium">{courseData.title}</span>
                {selectedLesson && (
                  <>
                    <span>/</span>
                    <span className="text-[#4ECDC4]">{selectedLesson.lesson.title}</span>
                  </>
                )}
              </nav>

              {/* Course Type Badge */}
              <Badge variant="outline" className={`${
                courseData.delivery_type === 'cohort' 
                  ? 'border-[#FF6B35]/30 text-[#FF6B35]' 
                  : 'border-[#4ECDC4]/30 text-[#4ECDC4]'
              }`}>
                {courseData.delivery_type === 'cohort' ? (
                  <>
                    <Users className="w-3 h-3 mr-1" />
                    Cohort Course
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 mr-1" />
                    Self-Paced
                  </>
                )}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              {/* Advanced Tools */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCommandPalette(true)}
                  className="border-[#E5E8E8] hover:border-[#4ECDC4] text-[#2C3E50]"
                >
                  <Command className="w-4 h-4 mr-2" />
                  ⌘K
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCoursePreview(true)}
                  className="border-[#E5E8E8] hover:border-[#4ECDC4] text-[#2C3E50]"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                {selectedLesson && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowVersionHistory(true)}
                    className="border-[#E5E8E8] hover:border-[#4ECDC4] text-[#2C3E50]"
                  >
                    <History className="w-4 h-4 mr-2" />
                    History
                  </Button>
                )}
              </div>

              {renderSaveStatus()}
              <Button 
                onClick={handleSaveChanges} 
                className="bg-gradient-to-r from-[#1B4D3E] to-[#4ECDC4] hover:from-[#1B4D3E]/90 hover:to-[#4ECDC4]/90 text-white"
                disabled={saveStatus === 'saving'}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Three-Panel Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Panel 1: Structure Sidebar */}
          <div className={`${
            isSidebarOpen ? 'w-80' : 'w-0'
          } lg:w-80 bg-[#F7F9F9] border-r border-[#E5E8E8] transition-all duration-300 overflow-hidden`}>
            <div className="h-full flex flex-col">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-[#E5E8E8] bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#2C3E50]">Course Structure</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Tabs for Cohort Courses */}
                {courseData.delivery_type === 'cohort' ? (
                  <div className="flex mt-3 bg-[#F7F9F9] rounded-lg p-1">
                    <button
                      onClick={() => setActiveView('structure')}
                      className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                        activeView === 'structure'
                          ? 'bg-white text-[#2C3E50] shadow-sm'
                          : 'text-[#2C3E50]/60 hover:text-[#2C3E50]'
                      }`}
                    >
                      <Layers className="w-4 h-4 inline mr-1" />
                      Structure
                    </button>
                    <button
                      onClick={() => setActiveView('drip-content')}
                      className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                        activeView === 'drip-content'
                          ? 'bg-white text-[#2C3E50] shadow-sm'
                          : 'text-[#2C3E50]/60 hover:text-[#2C3E50]'
                      }`}
                    >
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Schedule
                    </button>
                    <button
                      onClick={() => setActiveView('live-sessions')}
                      className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                        activeView === 'live-sessions'
                          ? 'bg-white text-[#2C3E50] shadow-sm'
                          : 'text-[#2C3E50]/60 hover:text-[#2C3E50]'
                      }`}
                    >
                      <Video className="w-4 h-4 inline mr-1" />
                      Sessions
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 text-sm text-[#2C3E50]/60">
                    Self-paced course structure
                  </div>
                )}
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {activeView === 'structure' ? (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleReorderModules}>
                    <SortableContext items={courseData.modules.map(m => `module-${m.id}`)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {getModulesByWeek().map(({ week, modules }) => (
                          <div key={week || 'no-week'}>
                            {modules.map(module => (
                              <DraggableModule
                                key={module.id}
                                module={module}
                                courseData={courseData}
                                onDeleteModule={deleteModule}
                                onAddLesson={addLesson}
                                onDeleteLesson={deleteLesson}
                                onLessonTitleChange={handleLessonTitleChange}
                                onModuleTitleChange={handleModuleTitleChange}
                                setSelectedLesson={setSelectedLesson}
                                setSelectedModule={setSelectedModule}
                                selectedLesson={selectedLesson}
                                selectedModule={selectedModule}
                                weekNumber={week || undefined}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                ) : activeView === 'drip-content' ? (
                  <DripContentManager
                    modules={courseData.modules}
                    onModuleUpdate={handleModuleUpdate}
                    startDate={courseData.start_date}
                    totalWeeks={12}
                  />
                ) : (
                  <LiveSessionScheduler
                    courseId={courseData.id}
                    sessions={courseData.live_sessions || []}
                    onSessionsChange={(sessions) => updateCourseData({ live_sessions: sessions })}
                    startDate={courseData.start_date}
                    endDate={courseData.end_date}
                  />
                )}

                {/* Add Module Button */}
                {activeView === 'structure' && (
                  <Button 
                    onClick={addModule} 
                    className="w-full mt-4 bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
                    disabled={courseData.delivery_type === 'cohort' && courseData.start_date && new Date(courseData.start_date) <= new Date()}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New Module
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Panel 2: Editing Canvas */}
          <div className="flex-1 bg-[#FEFEFE] overflow-hidden">
            <div className="h-full overflow-y-auto">
              {selectedLesson ? (
                <div className="p-6">
                  {/* AI Assistant Integration */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#2C3E50]">
                      Editing: {selectedLesson.lesson.title}
                    </h2>
                    <AIAssistant
                      selectedText={selectedText}
                      onContentGenerated={handleAIContentGenerated}
                      onQuizGenerated={handleAIQuizGenerated}
                      lessonType={selectedLesson.lesson.type}
                      lessonTitle={selectedLesson.lesson.title}
                      moduleTitle={courseData.modules.find(m => m.id === selectedLesson.moduleId)?.title}
                    />
                  </div>

                  <LessonEditor
                    lesson={selectedLesson.lesson}
                    onUpdate={updatedLesson => {
                      setCourseData(prev =>
                        prev
                          ? {
                              ...prev,
                              modules: prev.modules.map(m =>
                                m.id === selectedLesson.moduleId
                                  ? { ...m, lessons: m.lessons.map(l => l.id === updatedLesson.id ? updatedLesson : l) }
                                  : m
                              ),
                            }
                          : prev
                      );
                      setSelectedLesson({ moduleId: selectedLesson.moduleId, lesson: updatedLesson });
                    }}
                    onDelete={() => {
                      setCourseData(prev =>
                        prev
                          ? {
                              ...prev,
                              modules: prev.modules.map(m =>
                                m.id === selectedLesson.moduleId
                                  ? { ...m, lessons: m.lessons.filter(l => l.id !== selectedLesson.lesson.id) }
                                  : m
                              ),
                            }
                          : prev
                      );
                      setSelectedLesson(null);
                    }}
                  />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Edit className="w-16 h-16 text-[#4ECDC4] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">Select a lesson to edit</h3>
                    <p className="text-[#2C3E50]/60 mb-6">
                      Choose a lesson from the sidebar to start editing its content.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        onClick={() => setShowCommandPalette(true)}
                        variant="outline"
                        className="border-[#E5E8E8] hover:border-[#4ECDC4]"
                      >
                        <Command className="w-4 h-4 mr-2" />
                        Open Command Palette
                      </Button>
                      <Button
                        onClick={() => setShowCoursePreview(true)}
                        className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Course
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Panel 3: Inspector Panel */}
          <div className="w-80 bg-[#F7F9F9] border-l border-[#E5E8E8] overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Inspector Header */}
              <div className="p-4 border-b border-[#E5E8E8] bg-white">
                <h3 className="font-semibold text-[#2C3E50]">Properties</h3>
              </div>

              {/* Inspector Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {selectedLesson ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-[#2C3E50] font-semibold">Lesson Type</Label>
                      <div className="mt-1 p-2 bg-white rounded border border-[#E5E8E8]">
                        <div className="flex items-center gap-2">
                          {selectedLesson.lesson.type === 'text' && <FileText className="h-4 w-4 text-[#4ECDC4]" />}
                          {selectedLesson.lesson.type === 'video' && <Video className="h-4 w-4 text-[#FF6B35]" />}
                          {selectedLesson.lesson.type === 'quiz' && <HelpCircle className="h-4 w-4 text-purple-500" />}
                          <span className="capitalize text-sm text-[#2C3E50]">{selectedLesson.lesson.type}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-[#2C3E50] font-semibold">Publication Status</Label>
                      <div className="mt-1 p-2 bg-white rounded border border-[#E5E8E8]">
                        <Badge variant={selectedLesson.lesson.is_published ? "default" : "secondary"}>
                          {selectedLesson.lesson.is_published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                    </div>

                    {/* AI Suggestions */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h5 className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        AI Suggestions
                      </h5>
                      <ul className="text-xs text-purple-800 space-y-1">
                        <li>• Add more interactive elements</li>
                        <li>• Include practical examples</li>
                        <li>• Consider adding a quiz</li>
                        <li>• Break into smaller sections</li>
                      </ul>
                    </div>
                  </div>
                ) : selectedModule ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-[#2C3E50] font-semibold">Module Title</Label>
                      <div className="mt-1 p-2 bg-white rounded border border-[#E5E8E8]">
                        <span className="text-sm text-[#2C3E50]">{selectedModule.module.title}</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-[#2C3E50] font-semibold">Lessons Count</Label>
                      <div className="mt-1 p-2 bg-white rounded border border-[#E5E8E8]">
                        <span className="text-sm text-[#2C3E50]">{selectedModule.module.lessons.length} lessons</span>
                      </div>
                    </div>

                    {/* Weekly Sprint Goal for Cohort Courses */}
                    {courseData.delivery_type === 'cohort' && (
                      <WeeklyGoalEditor
                        module={selectedModule.module}
                        onUpdate={handleModuleUpdate}
                        weekNumber={selectedModule.module.unlocks_on_week}
                      />
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Settings className="w-12 h-12 text-[#4ECDC4] mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-[#2C3E50] mb-2">No Selection</h4>
                    <p className="text-sm text-[#2C3E50]/60">
                      Select a lesson or module to view its properties and settings.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Features Modals */}
        <CommandPalette
          isOpen={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
          onNavigate={handleCommandNavigate}
          onAIAction={handleCommandAIAction}
          onPreview={handleCommandPreview}
          courseData={courseData}
        />

        <CoursePreview
          courseData={courseData}
          isOpen={showCoursePreview}
          onClose={() => setShowCoursePreview(false)}
          previewMode={previewMode}
          onModeChange={setPreviewMode}
        />

        {selectedLesson && showVersionHistory && (
          <VersionHistory
            lessonId={selectedLesson.lesson.id}
            currentContent={selectedLesson.lesson.content}
            onRestore={(content) => {
              const updatedLesson = { ...selectedLesson.lesson, content };
              setCourseData(prev =>
                prev
                  ? {
                      ...prev,
                      modules: prev.modules.map(m =>
                        m.id === selectedLesson.moduleId
                          ? { ...m, lessons: m.lessons.map(l => l.id === updatedLesson.id ? updatedLesson : l) }
                          : m
                      ),
                    }
                  : prev
              );
              setSelectedLesson({ moduleId: selectedLesson.moduleId, lesson: updatedLesson });
            }}
            onClose={() => setShowVersionHistory(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9F9] to-white">
      <SiteHeader />
      {content}
      {showVersionHistory && (
        <div className="fixed inset-0 bg-black/50 z-50" />
      )}
    </div>
  );
}
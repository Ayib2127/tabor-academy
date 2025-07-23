"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
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
  Plus,
  User,
  BarChart,
  ChevronDown,
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
import { TagInput } from "@/components/ui/TagInput"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { v4 as uuidv4 } from 'uuid';
import { snakeToCamel } from "@/lib/utils/snakeToCamel";
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import Draggable from 'react-draggable';
import { supabase } from '@/lib/supabase/client'; // or createSupabaseClient if you use a function

interface Lesson {
  id: string;
  title: string;
  content?: object | null; // Updated to support Tiptap JSON
  type: 'video' | 'text' | 'quiz' | 'assignment';
  is_published: boolean;
  order: number;
  // Optionally add assignment-specific fields:
  dueDate?: string;
  needsGrading?: boolean;
  duration?: number;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  weekly_sprint_goal?: string; // Added for cohort courses
  unlocks_on_week?: number; // Added for cohort courses
  order: number;
  description?: string; // Added for module description
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
  subtitle?: string;
  language?: string;
  subtitles?: string[];
  videoHours?: number;
  resources?: number;
  certificate?: boolean;
  community?: boolean;
  lifetimeAccess?: boolean;
  learningOutcomes?: string[];
  requirements?: string[];
  successStories?: { name: string; photo?: string; outcome?: string; story: string }[];
  faq?: { question: string; answer: string }[];
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
  const [editedDescription, setEditedDescription] = useState(module.description || "");

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
    <div className="mb-8">
      <div
        ref={setNodeRef} 
        style={style} 
        className={`bg-[#F7F9F9] rounded-xl shadow-md p-6 transition-all duration-200 ${isSelected ? 'ring-2 ring-[#4ECDC4]' : 'hover:ring-1 hover:ring-[#4ECDC4]/40'}`}
        onClick={handleModuleClick}
      >
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                {...attributes}
                {...listeners}
              className="cursor-grab p-1 rounded hover:bg-white/50"
              onClick={e => e.stopPropagation()}
              >
                <GripVertical className="h-4 w-4 text-[#2C3E50]/40" />
              </div>
            <span className="font-bold text-lg text-[#2C3E50]">Module {module.order + 1}: {module.title}</span>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" aria-label="Edit Module" onClick={e => { e.stopPropagation(); setIsEditingModuleTitle(true); }}>
              <Edit className="h-4 w-4 text-[#FF6B35]" />
            </Button>
            <Button size="icon" variant="ghost" aria-label="Delete Module" onClick={e => { e.stopPropagation(); onDeleteModule(module.id); }}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
            <Button size="icon" variant="ghost" aria-label="Reorder Module" disabled>
              <GripVertical className="h-4 w-4 text-[#4ECDC4]" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          {module.lessons.map((lesson, idx) => (
            <div key={lesson.id} className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full mr-2 ${
                lesson.type === 'video' ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' :
                lesson.type === 'text' ? 'bg-[#FF6B35]/20 text-[#FF6B35]' :
                lesson.type === 'quiz' ? 'bg-purple-100 text-purple-600' :
                'bg-[#E5E8E8] text-[#2C3E50]'
              }`}>
                {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
              </span>
              <span className="flex-1 text-[#2C3E50] font-medium">{lesson.title}</span>
            </div>
          ))}
            </div>
            <Button
          variant="outline"
              size="sm"
          onClick={e => { e.stopPropagation(); setShowAddLessonInput(module.id); }}
          className="w-full mt-4 border-[#4ECDC4]/30 text-[#4ECDC4] hover:bg-[#4ECDC4]/5"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Add Lesson
            </Button>
        {showAddLessonInput === module.id && (
          <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
                <Input
                  placeholder="Enter lesson title"
                  value={newLessonTitle}
              onChange={e => setNewLessonTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddLesson(); } e.stopPropagation(); }}
                  className="border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
                />
            <Button
              onClick={e => { e.stopPropagation(); handleAddLesson(); }}
              className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
            >
              Add
            </Button>
            <Button variant="outline" onClick={() => { setShowAddLessonInput(null); setNewLessonTitle(''); }}>Cancel</Button>
              </div>
            )}
          </div>
    </div>
  );
}

interface DraggableLessonProps {
  module_id: string;
  lesson: Lesson;
  courseData: CourseData;
  onDeleteLesson: (moduleId: string, lessonId: string) => void;
  onLessonTitleChange: (moduleId: string, lessonId: string, newTitle: string) => void;
  setEditingLesson: (val: { moduleId: string, lesson: Lesson } | null) => void;
}

function DraggableLesson({
  module_id,
  lesson,
  courseData,
  onDeleteLesson,
  onLessonTitleChange,
  setEditingLesson,
}: DraggableLessonProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `lesson-${module_id}-${lesson.id}`,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Defensive parsing for lesson content
  const safeLesson = {
    ...lesson,
    content: typeof lesson.content === 'string' ? (() => {
      if (lesson.content.trim() === '') {
        return {}; // Empty string, treat as empty object
      }
      try {
        return JSON.parse(lesson.content);
      } catch (e) {
        console.error("Failed to parse lesson content on open:", e, lesson.content);
        return {}; // Default to empty object on parse failure
      }
    })() : lesson.content,
  };

  // Check if course is locked (cohort course that has started)
  const isCourseLocked = courseData.delivery_type === 'cohort' && 
    courseData.start_date && 
    new Date(courseData.start_date) <= new Date();

  const handleLessonClick = () => {
    setEditingLesson({ moduleId: module_id, lesson });
  };

  const isSelected = false; // This component is not directly used for selection in the main view

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
        <span className="text-sm text-[#2C3E50] cursor-pointer" onClick={e => { e.stopPropagation(); setEditingLesson({ moduleId: module_id, lesson }); }}>{lesson.title}{typeof lesson.duration === 'number' && lesson.duration > 0 && (
          <span className="ml-2 text-xs text-gray-500">• {lesson.duration} min</span>
        )}</span>
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
          onClick={e => { e.stopPropagation(); setEditingLesson({ moduleId: module_id, lesson }); }}
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

// Sidebar top-level sections
const sidebarSections = [
  { key: 'course-details', label: 'Course Details', icon: BookOpen },
  { key: 'content-modules', label: 'Content Modules', icon: Layers },
  { key: 'cohort-management', label: 'Cohort Management', icon: Users },
  { key: 'assessment-tools', label: 'Assessment Tools', icon: CheckCircle },
  { key: 'publishing-settings', label: 'Publishing Settings', icon: Settings },
  { key: 'analytics-reports', label: 'Analytics & Reports', icon: BarChart },
];

// Add prop types for ModuleAccordionCard:
interface ModuleAccordionCardProps {
  module: Module;
  courseData: CourseData;
  handleModuleTitleChange: (moduleId: string, newTitle: string) => void;
  handleModuleUpdate: (moduleId: string, updates: Partial<Module>) => void;
  addLesson: (moduleId: string, title: string, type: 'text' | 'video' | 'quiz') => void;
  deleteLesson: (moduleId: string, lessonId: string) => void;
  handleLessonTitleChange: (moduleId: string, lessonId: string, newTitle: string) => void;
  setEditingLesson: (val: { moduleId: string, lesson: Lesson } | null) => void;
  addLessonState: { open: boolean, title: string, type: 'text' | 'video' | 'quiz' };
  setAddLessonState: React.Dispatch<React.SetStateAction<{ [moduleId: string]: { open: boolean, title: string, type: 'text' | 'video' | 'quiz' } }>>;
  deleteModule: (moduleId: string) => void;
  onSave: (updatedModule: Module) => void;
  onClose: () => void;
}
function ModuleAccordionCard({ module, courseData, handleModuleTitleChange, handleModuleUpdate, addLesson, deleteLesson, handleLessonTitleChange, setEditingLesson, addLessonState, setAddLessonState, deleteModule, onSave, onClose }: ModuleAccordionCardProps) {
  const [open, setOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedTitle, setEditedTitle] = useState(module.title);
  const [editedWeek, setEditedWeek] = useState(module.unlocks_on_week || 1);
  const [editedDescription, setEditedDescription] = useState(module.description || "");
  const isCohort = courseData.delivery_type === 'cohort';
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const showAddLessonInput = addLessonState.open;
  const newLessonTitle = addLessonState.title;
  const newLessonType = addLessonState.type;

  const handleSave = () => {
    onSave({ ...module, title: editedTitle, description: editedDescription });
    setShowEditModal(false); // <-- Ensure this is called
  };

  const handleAddLesson = () => {
    if (newLessonTitle.trim()) {
      addLesson(module.id, newLessonTitle.trim(), newLessonType);
      setAddLessonState(prev => ({ ...prev, [module.id]: { open: false, title: '', type: 'text' } }));
    }
  };

  const closeModal = () => setShowEditModal(false);

  return (
    <div className="mb-6">
      <div
        className={`bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-[#4ECDC4] transition-all duration-300 cursor-pointer ${open ? 'border-gradient-to-r from-[#FF6B35] to-[#4ECDC4]' : ''}`}
        style={{ fontFamily: 'Inter, sans-serif' }}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        tabIndex={0}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <span className="font-bold text-lg text-[#2C3E50]">{module.title}</span>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" aria-label="Edit Module" onClick={e => { e.stopPropagation(); setShowEditModal(true); }}>
              <Edit className="h-4 w-4 text-[#FF6B35]" />
            </Button>
            <ChevronDown className={`h-5 w-5 text-[#4ECDC4] transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
          </div>
        </div>
        <div className={`overflow-hidden transition-all duration-500 ${open ? 'max-h-96 py-4 px-6' : 'max-h-0 py-0 px-6'}`}
          style={{ background: open ? 'linear-gradient(90deg, #FF6B35 0%, #4ECDC4 100%, #F7F9F9 100%)' : undefined }}>
          {open && (
            <>
              <div
                style={{ maxHeight: '60vh', overflowY: 'auto' }}
                className="space-y-2 scrollbar-brand"
              >
                {module.lessons.map(lesson => (
                  <DraggableLesson
                    key={lesson.id}
                    module_id={module.id}
                    lesson={lesson}
                    courseData={courseData}
                    onDeleteLesson={deleteLesson}
                    onLessonTitleChange={handleLessonTitleChange}
                    setEditingLesson={setEditingLesson}
                  />
                ))}
              </div>
              {/* Add Lesson UI */}
              {showAddLessonInput ? (
                <div
                  className="flex gap-2 mt-4 items-center"
                  onClick={e => e.stopPropagation()}
                >
                  <Input
                    placeholder="Enter lesson title"
                    value={newLessonTitle ?? ''}
                    onChange={e => setAddLessonState(prev => ({ ...prev, [module.id]: { ...prev[module.id], title: e.target.value } }))}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddLesson(); } }}
                    className="border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
                    onClick={e => e.stopPropagation()}
                  />
                  <Select
                    value={newLessonType}
                    onValueChange={val => setAddLessonState(prev => ({ ...prev, [module.id]: { ...prev[module.id], type: val as 'text' | 'video' | 'quiz' } }))}
                    onClick={e => e.stopPropagation()}
                  >
                    <SelectTrigger className="w-32 border-[#4ECDC4]/30 focus:border-[#4ECDC4]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">📝 Text</SelectItem>
                      <SelectItem value="video">🎬 Video</SelectItem>
                      <SelectItem value="quiz">❓ Quiz</SelectItem>
                      <SelectItem value="assignment">📄 Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddLesson} className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white" onClick={e => { e.stopPropagation(); handleAddLesson(); }}>Add</Button>
                  <Button variant="outline" onClick={e => { e.stopPropagation(); setAddLessonState(prev => ({ ...prev, [module.id]: { open: false, title: '', type: 'text' } })); }}>Cancel</Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={e => { e.stopPropagation(); setAddLessonState(prev => ({ ...prev, [module.id]: { ...prev[module.id], open: true } })); }}
                  className="w-full mt-4 border-[#4ECDC4]/30 text-[#4ECDC4] hover:bg-[#4ECDC4]/5"
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Lesson
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      {/* Module Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-white rounded-xl shadow-xl p-8 max-w-md mx-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50" aria-modal="true" role="dialog">
          <div className="flex items-center justify-between draggable-modal-title">
            <DialogTitle className="text-xl font-bold text-[#2C3E50] mb-2">Edit Module</DialogTitle>
            <Button variant="ghost" size="icon" aria-label="Delete Module" onClick={() => setShowDeleteConfirm(true)} className="text-red-500 hover:text-red-700">
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
          <DialogDescription className="mb-4 text-[#6E6C75]">Update the module details below.</DialogDescription>
          <label className="block mb-2 font-semibold text-[#2C3E50]">Module Title</label>
          <Input value={editedTitle} onChange={e => setEditedTitle(e.target.value)} className="mb-4" autoFocus aria-label="Module Title" />
          <label className="block mb-2 font-semibold text-[#2C3E50]">Module Description <span className="text-xs text-gray-400">(optional)</span></label>
          <Textarea value={editedDescription} onChange={e => setEditedDescription(e.target.value)} className="mb-4" placeholder="Enter a short description for this module (optional)" aria-label="Module Description" />
          {isCohort && (
            <>
              <label className="block mb-2 font-semibold text-[#2C3E50]">Unlock Week</label>
              <Input type="number" min={1} value={editedWeek} onChange={e => setEditedWeek(Number(e.target.value))} className="mb-4" aria-label="Unlock Week" />
            </>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] text-white font-bold">Save</Button>
          </div>
          {showDeleteConfirm && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                <h2 className="text-lg font-bold text-red-600 mb-2">Delete Module?</h2>
                <p className="mb-4 text-[#2C3E50]">Are you sure you want to delete this module? <b>This action cannot be undone.</b></p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                  <Button className="bg-red-600 text-white hover:bg-red-700" onClick={() => { setShowDeleteConfirm(false); setShowEditModal(false); deleteModule(module.id); }}>Delete</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CourseContentPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const supabase = createClientComponentClient();

  // 1. Fetch a lesson by ID
  const fetchLessonById = async (lessonId) => {
    const { data, error } = await supabase
      .from('module_lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (error) {
      toast.error('Failed to fetch lesson');
      return null;
    }
    return data;
  };

  // 2. Handler to open editor with fresh data
  const handleEditLesson = async ({ moduleId, lesson }: { moduleId: string, lesson: Lesson }) => {
    console.log('[handleEditLesson] Opening lesson:', lesson.id);
    const latestLesson = await fetchLessonById(lesson.id);
    if (latestLesson) {
      console.log('[handleEditLesson] Fetched latest lesson:', latestLesson);
      const parsedContent = (() => {
        if (typeof latestLesson.content === 'string') {
          try {
            return JSON.parse(latestLesson.content);
          } catch (e) {
            console.error("Failed to parse lesson content on open:", e);
            return {}; // Default to empty object on parse failure
          }
        }
        return latestLesson.content || {}; // Default if content is null/undefined
      })();

      setEditingLesson({
        moduleId,
        lesson: {
          ...latestLesson,
          content: parsedContent,
        }
      });
    } else {
      console.error('[handleEditLesson] Failed to fetch latest lesson data for', lesson.id);
      toast.error("Could not load the latest lesson data. Please refresh the page.");
    }
  };

  const saveLessonToBackend = async (updatedLesson) => {
    console.log('[saveLessonToBackend] Start saving lesson:', updatedLesson.id, updatedLesson);
    // Serialize content if needed
    const contentToSave = typeof updatedLesson.content === 'string'
      ? updatedLesson.content
      : JSON.stringify(updatedLesson.content);

    // Save to backend
    const { error } = await supabase
      .from('module_lessons')
      .update({
        title: updatedLesson.title,
        content: contentToSave,
        type: updatedLesson.type,
        is_published: updatedLesson.is_published,
        // ...add other fields as needed
      })
      .eq('id', updatedLesson.id);

    console.log('[saveLessonToBackend] Backend update error:', error);

    if (!error) {
      toast.success("Lesson saved successfully!");
      // Refetch the lesson from backend to get the latest data
      const { data: freshLesson, error: fetchError } = await supabase
        .from('module_lessons')
        .select('*')
        .eq('id', updatedLesson.id)
        .single();

      console.log('[saveLessonToBackend] Fetched fresh lesson after save:', freshLesson, 'Fetch error:', fetchError);

      if (!fetchError && freshLesson) {
        const parsedContent = (() => {
          if (typeof freshLesson.content === 'string') {
            try {
              return JSON.parse(freshLesson.content);
            } catch (e) {
              console.error("Failed to parse lesson content after save:", e);
              return {}; // Default to empty object on parse failure
            }
          }
          return freshLesson.content || {}; // Default if content is null/undefined
        })();
        
        const finalLesson = { ...freshLesson, content: parsedContent };

        // Update courseData with the fresh lesson
        setCourseData(prev => {
          if (!prev) return prev;
          const newCourseData = {
            ...prev,
            modules: prev.modules.map(m =>
              m.id === editingLesson?.moduleId
                ? {
                    ...m,
                    lessons: m.lessons.map(l =>
                      l.id === updatedLesson.id ? finalLesson : l
                    ),
                  }
                : m
            ),
          };
          console.log('[saveLessonToBackend] Updating courseData state with fresh lesson.');
          return newCourseData;
        });

        // Update editingLesson with the fresh lesson to ensure editor has latest data
        setEditingLesson(prev => {
          if (!prev) return null;
          console.log('[saveLessonToBackend] Updating editingLesson state with fresh lesson.');
          return {
            ...prev,
            lesson: finalLesson,
          };
        });
      } else {
        console.error('[saveLessonToBackend] Failed to refetch lesson after saving.');
        toast.error("Lesson saved, but couldn't refresh data. Please refresh.");
      }
    } else {
      console.error('[saveLessonToBackend] Error saving lesson:', error);
      toast.error('Failed to save lesson: ' + error.message);
    }
  };

  const [authChecked, setAuthChecked] = useState(false);

  const [courseData, setCourseData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<{ moduleId: string, lesson: Lesson } | null>(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [activeView, setActiveView] = useState<'structure' | 'live-sessions' | 'drip-content'>('structure');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  // Add Lesson Input State (per module)
  const [addLessonState, setAddLessonState] = useState<{
    [moduleId: string]: { open: boolean; title: string; type: 'text' | 'video' | 'quiz' }
  }>({});

  // AI and Advanced Features State
  const [selectedText, setSelectedText] = useState<string>('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showCoursePreview, setShowCoursePreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<'student' | 'week-1' | 'week-2' | 'week-3' | 'instructor'>('student');
  const [lessonSaveStatus, setLessonSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lessonLastSaved, setLessonLastSaved] = useState<Date | null>(null);

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
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
      } else {
        setAuthChecked(true);
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true);
      setError(null);
      try {
        // Fetch from your API route, not directly from Supabase
        const response = await fetch(`/api/instructor/courses/${courseId}`);
        if (!response.ok) throw new Error('Course not found');
        const course = await response.json();

        setCourseData(course);
        setLearningOutcomes(course.learningOutcomes ?? []);
        setRequirements(course.requirements ?? []);
        setSuccessStories(course.successStories ?? []);
        setFaqs(course.faq ?? []);
      } catch (err: any) {
        setError(err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    }
    if (courseId) fetchCourse();
  }, [courseId]);

  // (Optional) Slightly improve the cleanup effect for addLessonState:
  useEffect(() => {
    if (!courseData) return;
    setAddLessonState(prev => {
      const moduleIds = new Set(courseData.modules.map(m => m.id));
      // Only keep state for modules that still exist
      return Object.fromEntries(
        Object.entries(prev).filter(([id]) => moduleIds.has(id))
      );
    });
  }, [courseData?.modules.map(m => m.id).join(",")]);

  // (Optional) Debug log
  useEffect(() => {
    console.log("addLessonState", addLessonState);
  }, [addLessonState]);

  const updateCourseData = (updates: Partial<CourseData>) => {
    setCourseData(prev => prev ? { ...prev, ...updates } : prev);
  };

  const [addingModule, setAddingModule] = useState(false);

  const addModule = async () => {
    setAddingModule(true);
    try {
      const supabase = createClientComponentClient();
      const courseId = courseData?.id;
      if (!courseId) throw new Error('No course ID');
      const { data: newModule, error } = await supabase
        .from('course_modules')
        .insert({
          course_id: courseId,
          title: 'New Module',
          order: courseData.modules.length, // <-- use 'order' not 'position'
        })
        .select()
        .single();
      if (error) throw error;
      setCourseData(prev => {
        if (!prev) return prev;
        return { ...prev, modules: [...prev.modules, { ...newModule, lessons: [] }] };
      });
      setAddLessonState(prev => ({
        ...prev,
        [newModule.id]: { open: false, title: '', type: 'text' }
      }));
    } catch (err) {
      toast.error('Failed to create module');
    } finally {
      setAddingModule(false);
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

  const addLesson = async (moduleId: string, title: string, type: 'text' | 'video' | 'quiz') => {
    // 1. Find the order for the new lesson
    const module = courseData?.modules.find(m => m.id === moduleId);
    const order = module ? module.lessons.length : 0;

    // 2. Call the backend API
    const response = await fetch('/api/instructor/lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module_id: moduleId,
        title,
        type,
        is_published: false,
        order,
        content: '', // or default content structure if needed
      }),
    });
    const result = await response.json();

    if (!response.ok) {
      toast.error(result.error || 'Failed to add lesson');
      return;
    }

    const newLesson = result.lesson;

    // 3. Update local state with the real lesson id
    setCourseData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        modules: prev.modules.map(module =>
          module.id === moduleId
            ? {
                ...module,
                lessons: [...module.lessons, newLesson],
              }
            : module
        ),
      };
    });

    // 4. Reset only the addLessonState for this module
    setAddLessonState(prev => ({
      ...prev,
      [moduleId]: { open: false, title: '', type: 'text' }
    }));
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
        subtitle: courseData.subtitle,
        description: courseData.description,
        language: courseData.language,
        subtitles: courseData.subtitles,
        video_hours: courseData.videoHours,
        resources: courseData.resources,
        certificate: courseData.certificate,
        community: courseData.community,
        lifetime_access: courseData.lifetimeAccess,
        learning_outcomes: learningOutcomes,
        requirements: requirements,
        success_stories: successStories,
        faq: faqs,
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

      console.log("Saving course with payload:", courseUpdateData); // <--- ADD THIS
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
            description: moduleData.description, // <-- Add this line
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
          // If the lesson is new (no id or id starts with 'temp-'), use the backend API
          if (!lessonData.id || lessonData.id.startsWith('temp-')) {
            const response = await fetch('/api/instructor/lessons', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                module_id: newModule.id,
                title: lessonData.title,
                content: lessonData.content,
                type: lessonData.type,
                is_published: lessonData.is_published,
                order: lessonIndex,
              }),
            });
            const result = await response.json();
            if (!response.ok) {
              throw new Error(result.error || 'Failed to insert lesson');
            }
            // Optionally update local state with result.lesson if needed
          } else {
            // Existing lesson, update or re-insert as needed
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

  // Add state for new sections
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [successStories, setSuccessStories] = useState<any[]>([]);

  // Handlers for Learning Outcomes
  const handleAddLearningOutcome = (tag: string) => setLearningOutcomes([...learningOutcomes, tag]);
  const handleRemoveLearningOutcome = (i: number) => setLearningOutcomes(learningOutcomes.filter((_, idx) => idx !== i));
  // Handlers for Requirements
  const handleAddRequirement = (tag: string) => setRequirements([...requirements, tag]);
  const handleRemoveRequirement = (i: number) => setRequirements(requirements.filter((_, idx) => idx !== i));
  // Handlers for FAQ
  const handleAddFaq = () => setFaqs([...faqs, { question: "", answer: "" }]);
  const handleRemoveFaq = (i: number) => setFaqs(faqs.filter((_, idx) => idx !== i));
  const handleFaqChange = (i: number, field: "question" | "answer", value: string) => setFaqs(faqs.map((faq, idx) => idx === i ? { ...faq, [field]: value } : faq));
  // Handlers for Success Stories
  const handleAddSuccessStory = () => setSuccessStories([...successStories, { name: "", photo: "", outcome: "", story: "" }]);
  const handleRemoveSuccessStory = (i: number) => setSuccessStories(successStories.filter((_, idx) => idx !== i));
  const handleSuccessStoryChange = (i: number, field: string, value: string) => setSuccessStories(successStories.map((story, idx) => idx === i ? { ...story, [field]: value } : story));

  // State for open group and active section
  const [activeSection, setActiveSection] = useState('course-details');

  // 1. In CourseContentPage, add centralized editingLesson state:
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string, lesson: Lesson } | null>(null);

  // 1. Add state for modal position in CourseContentPage:
  const [modalPosition, setModalPosition] = useState<{ top: number; left: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 2. Drag event handlers:
  const handleTitleMouseDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const modal = document.getElementById('resizable-movable-modal');
    if (modal) {
      const rect = modal.getBoundingClientRect();
      dragOffset.current = { x: clientX - rect.left, y: clientY - rect.top };
    }
    document.body.style.userSelect = 'none';
  };
  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!dragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    setModalPosition({
      left: clientX - dragOffset.current.x,
      top: clientY - dragOffset.current.y,
    });
  };
  const handleMouseUp = () => {
    setDragging(false);
    document.body.style.userSelect = '';
  };
  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [dragging]);

  // Inside CourseContentPage component
  const handleModuleSave = (updatedModule) => {
    setCourseData(prev =>
      prev
        ? {
            ...prev,
            modules: prev.modules.map(m =>
              m.id === updatedModule.id ? updatedModule : m
            ),
          }
        : prev
    );
  };

  const closeModal = () => setSelectedModule(null);

  // Refactored conditional rendering
  let content;

  if (!authChecked) {
    content = <div className="min-h-screen flex items-center justify-center">Checking authentication...</div>;
  } else if (!courseId) {
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
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-[#E5E8E8] px-8 py-4 flex items-center justify-between" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-[#2C3E50]">{courseData.title}</h2>
            <Badge variant="outline" className={`ml-2 ${courseData.delivery_type === 'cohort' ? 'border-[#FF6B35]/30 text-[#FF6B35]' : 'border-[#4ECDC4]/30 text-[#4ECDC4]'}`}>{courseData.delivery_type === 'cohort' ? 'Cohort-Based' : 'Self-Paced'}</Badge>
            {saveStatus === 'saving' && <span className="ml-4 text-[#FF6B35] animate-pulse">Saving...</span>}
            {saveStatus === 'saved' && <span className="ml-4 text-[#4ECDC4]">All changes saved</span>}
            </div>
              <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowCoursePreview(true)} className="border-[#E5E8E8] hover:border-[#4ECDC4] text-[#2C3E50]">
              <Eye className="w-4 h-4 mr-2" /> Preview
                </Button>
            <Button onClick={handleSaveChanges} className="bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] hover:from-[#FF6B35]/90 hover:to-[#4ECDC4]/90 text-white font-bold" disabled={saveStatus === 'saving'}>
              <Save className="w-4 h-4 mr-2" /> Save & Publish
                </Button>
          </div>
        </div>

        {/* Three-Panel Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className={`transition-all duration-500 h-full flex flex-col bg-[#F7F9F9] border-r border-[#E5E8E8] ${isSidebarOpen ? 'w-64' : 'w-16'} overflow-hidden`} aria-label="Course Editor Sidebar">
            <div className="p-4 border-b border-[#E5E8E8] bg-white flex items-center justify-between">
              {isSidebarOpen && <h3 className="font-semibold text-[#2C3E50]">Course Builder</h3>}
                  <Button
                    variant="ghost"
                    size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                className="ml-auto"
                  >
                {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </div>
            <nav className="flex-1 py-4">
              {sidebarSections.map(section => (
                    <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`flex items-center gap-3 px-6 py-3 rounded transition-all duration-200 w-full text-left focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] mb-1 font-semibold ${
                    activeSection === section.key ? 'bg-[#4ECDC4] text-white shadow-md scale-105' : 'text-[#2C3E50] hover:bg-[#E5E8E8] hover:scale-105'
                  }`}
                  aria-current={activeSection === section.key ? 'page' : undefined}
                  aria-label={section.label}
                  tabIndex={0}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <section.icon className="h-5 w-5" />
                  {isSidebarOpen && <span className="truncate">{section.label}</span>}
                    </button>
              ))}
            </nav>
            <div className="relative flex-shrink-0 p-4 mt-auto">
                    <button
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] text-white rounded-full shadow-lg p-4 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]"
                aria-label="Add New Item"
                onClick={() => {
                  if (activeSection === 'content-modules') addModule();
                  if (activeSection === 'course-details') handleAddLearningOutcome('');
                }}
              >
                <Plus className="h-6 w-6" />
                    </button>
                  </div>
                  </div>
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeSection === 'course-details' && (
              <>
                {/* Course Info Card */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="font-bold text-[#2C3E50] flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-[#FF6B35]" /> Course Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Label>Course Title</Label>
                      <Input
                        value={courseData.title}
                        onChange={e => updateCourseData({ title: e.target.value })}
                        placeholder="Enter course title"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <Label>Subtitle</Label>
                      <Input
                        value={courseData.subtitle || ""}
                        onChange={e => updateCourseData({ subtitle: e.target.value })}
                        placeholder="Enter a short subtitle"
                        maxLength={150}
                      />
                    </div>
                    <div className="mb-4">
                      <Label>Description</Label>
                      <Textarea
                        value={courseData.description}
                        onChange={e => updateCourseData({ description: e.target.value })}
                        placeholder="Enter course description"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <Label>Language</Label>
                      <select
                        className="input input-bordered w-full"
                        value={courseData.language || ""}
                        onChange={e => updateCourseData({ language: e.target.value })}
                      >
                        <option value="">Select language</option>
                        <option value="English">English</option>
                        <option value="French">French</option>
                        <option value="Swahili">Swahili</option>
                        <option value="Arabic">Arabic</option>
                        {/* Add more as needed */}
                      </select>
                    </div>
                    <div className="mb-4">
                      <Label>Subtitles</Label>
                      <TagInput
                        tags={courseData.subtitles || []}
                        onAdd={tag => updateCourseData({ subtitles: [...(courseData.subtitles || []), tag] })}
                        onRemove={i => updateCourseData({ subtitles: courseData.subtitles.filter((_, idx) => idx !== i) })}
                        placeholder="Type a language and press Enter"
                      />
                    </div>
                    <div className="mb-4">
                      <Label>Course Features</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Video Hours</Label>
                          <Input
                            type="number"
                            value={courseData.videoHours || ""}
                            onChange={e => updateCourseData({ videoHours: Number(e.target.value) })}
                            placeholder="e.g. 24"
                            min={0}
                          />
                        </div>
                        <div>
                          <Label>Downloadable Resources</Label>
                          <Input
                            type="number"
                            value={courseData.resources || ""}
                            onChange={e => updateCourseData({ resources: Number(e.target.value) })}
                            placeholder="e.g. 15"
                            min={0}
                          />
                        </div>
                        <div>
                          <Label>
                            <input
                              type="checkbox"
                              checked={!!courseData.certificate}
                              onChange={e => updateCourseData({ certificate: e.target.checked })}
                            />
                            Certificate of Completion
                          </Label>
                        </div>
                        <div>
                          <Label>
                            <input
                              type="checkbox"
                              checked={!!courseData.community}
                              onChange={e => updateCourseData({ community: e.target.checked })}
                            />
                            Community Access
                          </Label>
                        </div>
                        <div>
                          <Label>
                            <input
                              type="checkbox"
                              checked={!!courseData.lifetimeAccess}
                              onChange={e => updateCourseData({ lifetimeAccess: e.target.checked })}
                            />
                            Lifetime Access
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Learning Outcomes */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="font-bold text-[#2C3E50] flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-[#4ECDC4]" /> Learning Outcomes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TagInput tags={learningOutcomes} onAdd={handleAddLearningOutcome} onRemove={handleRemoveLearningOutcome} placeholder="Type an outcome and press Enter" />
                  </CardContent>
                </Card>
                {/* Requirements */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="font-bold text-[#2C3E50] flex items-center gap-2">
                      <Layers className="h-5 w-5 text-[#FF6B35]" /> Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TagInput tags={requirements} onAdd={handleAddRequirement} onRemove={handleRemoveRequirement} placeholder="Type a requirement and press Enter" />
                  </CardContent>
                </Card>
                {/* Success Stories */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="font-bold text-[#2C3E50] flex items-center gap-2">
                      <User className="h-5 w-5 text-[#FF6B35]" /> Success Stories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {successStories.map((story, idx) => (
                      <div key={idx} className="mb-6 border-b border-[#E5E8E8] pb-4">
                        <div className="flex gap-4 items-center mb-2">
                          <Input
                            className="w-1/3"
                            value={story.name}
                            onChange={e => handleSuccessStoryChange(idx, "name", e.target.value)}
                            placeholder="Name"
                          />
                          <Input
                            className="w-1/3"
                            value={story.outcome}
                            onChange={e => handleSuccessStoryChange(idx, "outcome", e.target.value)}
                            placeholder="Outcome (e.g. Got a job!)"
                          />
                          <Input
                            className="w-1/3"
                            value={story.photo}
                            onChange={e => handleSuccessStoryChange(idx, "photo", e.target.value)}
                            placeholder="Photo URL"
                          />
                          <Button variant="destructive" onClick={() => handleRemoveSuccessStory(idx)}>
                            Remove
                          </Button>
                        </div>
                        <Textarea
                          value={story.story}
                          onChange={e => handleSuccessStoryChange(idx, "story", e.target.value)}
                          placeholder="Success story details"
                          rows={2}
                        />
                      </div>
                    ))}
                    <Button onClick={handleAddSuccessStory} className="mt-2">
                      Add Success Story
                    </Button>
                  </CardContent>
                </Card>
                {/* FAQ */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="font-bold text-[#2C3E50] flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-[#4ECDC4]" /> FAQ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="mb-6 border-b border-[#E5E8E8] pb-4">
                        <Input
                          className="mb-2"
                          value={faq.question}
                          onChange={e => handleFaqChange(idx, "question", e.target.value)}
                          placeholder="Question"
                        />
                        <Textarea
                          value={faq.answer}
                          onChange={e => handleFaqChange(idx, "answer", e.target.value)}
                          placeholder="Answer"
                          rows={2}
                        />
                        <Button variant="destructive" onClick={() => handleRemoveFaq(idx)} className="mt-2">
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button onClick={handleAddFaq} className="mt-2">
                      Add FAQ
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
            {activeSection === 'content-modules' && (
              <div>
                {/* Add New Module Button */}
                <div className="flex justify-end mb-4">
                  <Button
                    onClick={addModule}
                    className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-bold rounded px-6 py-2 shadow-md transition-colors"
                    aria-label="Add New Module"
                    disabled={addingModule}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    {addingModule ? 'Adding...' : 'Add New Module'}
                  </Button>
              </div>
                {/* For cohort-based: group by week, else flat list */}
                {courseData.delivery_type === 'cohort' ? (
                  getModulesByWeek().map((week, idx) => (
                    <div key={week.week} className="mb-10">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-lg font-bold text-[#2C3E50]">Week {week.week}</span>
                      </div>
                      {week.modules.map(module => (
                        <ModuleAccordionCard
                                key={module.id}
                                module={module}
                                courseData={courseData}
                          handleModuleTitleChange={handleModuleTitleChange}
                          handleModuleUpdate={handleModuleUpdate}
                          addLesson={addLesson}
                          deleteLesson={deleteLesson}
                          handleLessonTitleChange={handleLessonTitleChange}
                          setEditingLesson={handleEditLesson}
                          addLessonState={addLessonState[module.id] || { open: false, title: '', type: 'text' }}
                          setAddLessonState={setAddLessonState}
                          deleteModule={deleteModule}
                          onSave={handleModuleSave}
                          onClose={closeModal}
                              />
                            ))}
                          </div>
                  ))
                ) : (
                  courseData.modules.map(module => (
                    <ModuleAccordionCard
                      key={module.id}
                      module={module}
                      courseData={courseData}
                      handleModuleTitleChange={handleModuleTitleChange}
                      handleModuleUpdate={handleModuleUpdate}
                      addLesson={addLesson}
                      deleteLesson={deleteLesson}
                      handleLessonTitleChange={handleLessonTitleChange}
                      setEditingLesson={handleEditLesson}
                      addLessonState={addLessonState[module.id] || { open: false, title: '', type: 'text' }}
                      setAddLessonState={setAddLessonState}
                      deleteModule={deleteModule}
                      onSave={handleModuleSave}
                      onClose={closeModal}
                    />
                  ))
                )}
              </div>
            )}
            {activeSection === 'cohort-management' && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="font-bold text-[#2C3E50] flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#FF6B35]" /> Cohort Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* TODO: Add Cohort Management UI here */}
                  <div className="text-[#6E6C75]">Cohort management features coming soon.</div>
                </CardContent>
              </Card>
                )}
              </div>
            </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9F9] to-white">
      <SiteHeader />
      {content}
      {editingLesson && (
        <Dialog open={!!editingLesson} onOpenChange={open => { if (!open) setEditingLesson(null); }}>
          <DialogContent
            id="resizable-movable-modal"
            className="bg-white rounded-xl shadow-xl p-0 max-w-3xl w-full mx-auto mt-12 z-50 flex flex-col resize overflow-auto"
            style={{
              minWidth: '400px',
              minHeight: '400px',
              maxWidth: '95vw',
              maxHeight: '95vh',
              position: modalPosition ? 'fixed' : undefined,
              top: modalPosition ? modalPosition.top : '10vh',
              left: modalPosition ? modalPosition.left : '50%',
              transform: modalPosition ? 'none' : 'translateX(-50%)',
              cursor: dragging ? 'grabbing' : undefined,
            }}
            aria-modal="true"
            role="dialog"
          >
            {/* Sticky Header with drag handlers */}
            <div
              className="sticky top-0 z-10 bg-white border-b border-[#E5E8E8] px-8 py-4 flex items-center justify-between cursor-move select-none"
              onMouseDown={handleTitleMouseDown}
              onTouchStart={handleTitleMouseDown}
              style={{ cursor: 'move' }}
            >
              <DialogTitle className="text-xl font-bold">
                Edit Lesson{editingLesson.lesson.title ? `: ${editingLesson.lesson.title}` : ''}
              </DialogTitle>
              <div className="flex items-center gap-4">
                {/* Sticky Save Status */}
                {lessonSaveStatus === 'saving' && (
                  <div className="flex items-center gap-2 text-blue-600" aria-live="polite">
                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs">Saving...</span>
                  </div>
                )}
                {lessonSaveStatus === 'saved' && (
                  <div className="flex items-center gap-2 text-green-600" aria-live="polite">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    <span className="text-xs">Saved{lessonLastSaved ? ` at ${lessonLastSaved.toLocaleTimeString()}` : ''}</span>
                  </div>
                )}
                {lessonSaveStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-600" aria-live="polite">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" /></svg>
                    <span className="text-xs">Save failed</span>
                  </div>
                )}
                <button
                  onClick={() => setEditingLesson(null)}
                  className="text-[#FF6B35] hover:text-[#4ECDC4] text-lg font-bold px-2"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6" style={{ minHeight: 0 }}>
              <LessonEditor
                lesson={{
                  ...editingLesson.lesson,
                  // Normalize: parse then immediately serialize and parse again
                  content: (() => {
                    let parsed;
                    if (typeof editingLesson.lesson.content === 'string') {
                      try {
                        parsed = JSON.parse(editingLesson.lesson.content);
                      } catch (e) {
                        parsed = editingLesson.lesson.content;
                      }
                    } else {
                      parsed = editingLesson.lesson.content;
                    }
                    // Now serialize and parse again to normalize
                    try {
                      return JSON.parse(JSON.stringify(parsed));
                    } catch {
                      return parsed;
                    }
                  })(),
                }}
                onUpdate={saveLessonToBackend}
                onDelete={() => {
                  deleteLesson(editingLesson.moduleId, editingLesson.lesson.id);
                  setEditingLesson(null);
                }}
                onSave={() => {
                  setEditingLesson(null);
                }}
                isVisible={!!editingLesson}
                onSaveStatusChange={(status, lastSaved) => {
                  setLessonSaveStatus(status);
                  setLessonLastSaved(lastSaved);
                }}
                saveStatus={lessonSaveStatus}
                lastSaved={lessonLastSaved}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
      {showVersionHistory && (
        <div className="fixed inset-0 bg-black/50 z-50" />
      )}
      {selectedModule && (
        <EditModuleModal
          module={selectedModule}
          onSave={handleModuleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
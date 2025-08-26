"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, GripVertical, Trash2, FileText, BookOpen } from "lucide-react"
import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface Lesson {
  id: number;
  title: string;
  type: 'video' | 'text' | 'quiz' | '';
  order: number;
}

interface Module {
  id: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface CourseData {
  modules: Module[];
}

interface CourseStructureStepProps {
  courseData: CourseData
  updateCourseData: (updates: Partial<CourseData>) => void
}

function DraggableModule({
  module,
  onDeleteModule,
  onAddLesson,
  onDeleteLesson,
}: {
  module: Module
  onDeleteModule: (id: number) => void
  onAddLesson: (moduleId: number) => void
  onDeleteLesson: (moduleId: number, lessonId: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `module-${module.id}`,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card ref={setNodeRef} style={style} className="border-[#E5E8E8]">
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
            <CardTitle className="text-[#2C3E50] text-lg">{module.title}</CardTitle>
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
          {module.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between p-3 bg-[#F7F9F9] rounded-lg border border-[#E5E8E8]"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#4ECDC4]" />
                <span className="text-sm text-[#2C3E50]">{lesson.title}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteLesson(module.id, lesson.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddLesson(module.id)}
            className="w-full mt-3 border-[#4ECDC4]/30 text-[#4ECDC4] hover:bg-[#4ECDC4]/5"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Lesson
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function CourseStructureStep({ courseData, updateCourseData }: CourseStructureStepProps) {
  const [showAddModule, setShowAddModule] = useState(false)
  const [newModuleTitle, setNewModuleTitle] = useState("")
  const [showAddLesson, setShowAddLesson] = useState<number | null>(null)
  const [newLessonTitle, setNewLessonTitle] = useState("")
  const [newLessonType, setNewLessonType] = useState<'' | 'video' | 'text' | 'quiz'>("")
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Helper to update orders
  const updateOrders = (modules: Module[]) => {
    return modules.map((module, mIdx) => ({
      ...module,
      order: mIdx + 1,
      lessons: module.lessons.map((lesson, lIdx) => ({
        ...lesson,
        order: lIdx + 1,
      })),
    }))
  }

  // Validation
  const validateStructure = (modules: Module[]) => {
    const errors: string[] = []
    modules.forEach((module, mIdx) => {
      if (typeof module.order !== 'number') {
        errors.push(`Module ${mIdx + 1} is missing order`)
      }
      module.lessons.forEach((lesson, lIdx) => {
        if (!lesson.type) {
          errors.push(`Lesson ${lIdx + 1} in Module ${mIdx + 1} is missing type`)
        }
        if (typeof lesson.order !== 'number') {
          errors.push(`Lesson ${lIdx + 1} in Module ${mIdx + 1} is missing order`)
        }
      })
    })
    setValidationErrors(errors)
    return errors.length === 0
  }

  const addModule = () => {
    if (newModuleTitle.trim()) {
      const newModule: Module = {
        id: Date.now(),
        title: newModuleTitle.trim(),
        order: courseData.modules.length + 1,
        lessons: [],
      }
      const updatedModules = updateOrders([...courseData.modules, newModule])
      updateCourseData({ modules: updatedModules })
      setNewModuleTitle("")
      setShowAddModule(false)
    }
  }

  const deleteModule = (moduleId: number) => {
    const updatedModules = courseData.modules.filter((m) => m.id !== moduleId);
    const moduleItem = courseData.modules.find((m) => m.id === moduleId);
    updateCourseData({ modules: updatedModules });
  };

  const addLesson = (moduleId: number) => {
    if (newLessonTitle.trim() && newLessonType) {
      const moduleItem = courseData.modules.find((m) => m.id === moduleId)
      const newLesson: Lesson = {
        id: Date.now(),
        title: newLessonTitle.trim(),
        type: newLessonType,
        order: moduleItem ? moduleItem.lessons.length + 1 : 1,
      }
      const updatedModules = updateOrders(
        courseData.modules.map((module) =>
          module.id === moduleId ? { ...module, lessons: [...module.lessons, newLesson] } : module
        )
      )
      updateCourseData({ modules: updatedModules })
      setNewLessonTitle("")
      setNewLessonType("")
      setShowAddLesson(null)
    }
  }

  const deleteLesson = (moduleId: number, lessonId: number) => {
    const updatedModules = updateOrders(
      courseData.modules.map((module) =>
        module.id === moduleId ? { ...module, lessons: module.lessons.filter((l) => l.id !== lessonId) } : module
      )
    )
    updateCourseData({ modules: updatedModules })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id.toString()
    const overId = over.id.toString()

    if (activeId.startsWith("module-") && overId.startsWith("module-")) {
      const activeModuleId = Number.parseInt(activeId.replace("module-", ""))
      const overModuleId = Number.parseInt(overId.replace("module-", ""))

      if (activeModuleId !== overModuleId) {
        const oldIndex = courseData.modules.findIndex((m) => m.id === activeModuleId)
        const newIndex = courseData.modules.findIndex((m) => m.id === overModuleId)

        updateCourseData({
          modules: arrayMove(courseData.modules, oldIndex, newIndex),
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-[#E5E8E8] shadow-sm">
        <CardHeader className="bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#2C3E50] flex items-center gap-2">🏗️ Course Structure</CardTitle>
            <div className="text-sm text-[#2C3E50]/60">
              {courseData.modules.length} {courseData.modules.length === 1 ? "Module" : "Modules"}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={courseData.modules.map((m) => `module-${m.id}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {courseData.modules.map((module) => (
                  <DraggableModule
                    key={module.id}
                    module={module}
                    onDeleteModule={deleteModule}
                    onAddLesson={(moduleId) => setShowAddLesson(moduleId)}
                    onDeleteLesson={deleteLesson}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Add Lesson Input */}
          {showAddLesson && (
            <Card className="mt-4 border-[#4ECDC4]/30">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-2">
                  <Input
                    placeholder="Enter lesson title"
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    className="border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
                  />
                  <select
                    value={newLessonType}
                    onChange={(e) => setNewLessonType(e.target.value as any)}
                    className="border-[#4ECDC4]/30 focus:border-[#4ECDC4] rounded px-2 py-1"
                  >
                    <option value="">Select type</option>
                    <option value="video">Video</option>
                    <option value="text">Text</option>
                    <option value="quiz">Quiz</option>
                  </select>
                  <Button
                    onClick={() => addLesson(showAddLesson)}
                    className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
                    disabled={!newLessonTitle.trim() || !newLessonType}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddLesson(null)
                      setNewLessonTitle("")
                      setNewLessonType("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
                {(!newLessonType || !newLessonTitle.trim()) && (
                  <p className="text-sm text-red-500 mt-2">Lesson title and type are required</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <ul className="text-sm text-red-600 space-y-1">
                {validationErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Add Module Button */}
          {!showAddModule ? (
            <Button
              onClick={() => setShowAddModule(true)}
              className="w-full mt-4 bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          ) : (
            <Card className="mt-4 border-[#4ECDC4]/30">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter module title"
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addModule()
                      }
                    }}
                    className="border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
                  />
                  <Button onClick={addModule} className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white">
                    Add
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddModule(false)
                      setNewModuleTitle("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="border-[#4ECDC4]/20 bg-[#4ECDC4]/5">
        <CardContent className="p-4">
          <h3 className="font-semibold text-[#2C3E50] mb-2 flex items-center gap-2">💡 Structure Tips</h3>
          <ul className="text-sm text-[#2C3E50]/80 space-y-1">
            <li>• Start with an introduction module to set expectations</li>
            <li>• Break down complex topics into digestible lessons</li>
            <li>• Include practical exercises and real-world examples</li>
            <li>• End with a conclusion module that summarizes key points</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
} 
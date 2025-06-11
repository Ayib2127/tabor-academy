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

interface Module {
  id: number
  title: string
  lessons: Array<{
    id: number
    title: string
  }>
}

interface CourseData {
  modules: Module[]
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const addModule = () => {
    if (newModuleTitle.trim()) {
      const newModule: Module = {
        id: Date.now(),
        title: newModuleTitle.trim(),
        lessons: [],
      }
      updateCourseData({
        modules: [...courseData.modules, newModule],
      })
      setNewModuleTitle("")
      setShowAddModule(false)
    }
  }

  const deleteModule = (moduleId: number) => {
    updateCourseData({
      modules: courseData.modules.filter((m) => m.id !== moduleId),
    })
  }

  const addLesson = (moduleId: number) => {
    if (newLessonTitle.trim()) {
      const newLesson = {
        id: Date.now(),
        title: newLessonTitle.trim(),
      }

      updateCourseData({
        modules: courseData.modules.map((module) =>
          module.id === moduleId ? { ...module, lessons: [...module.lessons, newLesson] } : module,
        ),
      })
      setNewLessonTitle("")
      setShowAddLesson(null)
    }
  }

  const deleteLesson = (moduleId: number, lessonId: number) => {
    updateCourseData({
      modules: courseData.modules.map((module) =>
        module.id === moduleId ? { ...module, lessons: module.lessons.filter((l) => l.id !== lessonId) } : module,
      ),
    })
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
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter lesson title"
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addLesson(showAddLesson)
                      }
                    }}
                    className="border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
                  />
                  <Button
                    onClick={() => addLesson(showAddLesson)}
                    className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
                  >
                    Add
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddLesson(null)
                      setNewLessonTitle("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
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
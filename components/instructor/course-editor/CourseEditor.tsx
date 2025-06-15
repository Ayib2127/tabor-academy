'use client'

import { FC, useState } from 'react';
import { Course, Module, Lesson } from '@/types/course';
import { useAutoSave } from '@/lib/hooks/useAutoSave';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import ModuleEditor from './ModuleEditor';
import { Plus } from 'lucide-react';

interface CourseEditorProps {
  course: Course;
}

const CourseEditor: FC<CourseEditorProps> = ({ course: initialCourse }) => {
  const [course, setCourse] = useState(initialCourse);

  const { isSaving, lastSaved } = useAutoSave({
    data: course,
    onSave: async (updatedCourse) => {
      const response = await fetch(`/api/instructor/courses/${course.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCourse),
      });

      if (!response.ok) {
        throw new Error('Failed to save course');
      }
    },
  });

  const handleModuleUpdate = (moduleId: string, updatedModule: Module) => {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId ? updatedModule : m
      ),
    }));
  };

  const handleModuleDelete = (moduleId: string) => {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.filter((m) => m.id !== moduleId),
    }));
  };

  const handleAddModule = () => {
    const newModule: Module = {
      id: `temp-${Date.now()}`,
      title: 'New Module',
      description: '',
      lessons: [],
      order: course.modules.length,
    };

    setCourse((prev) => ({
      ...prev,
      modules: [...prev.modules, newModule],
    }));
  };

  const handleAddLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: `temp-${Date.now()}`,
      title: 'New Lesson',
      type: 'video',
      order: course.modules
        .find((m) => m.id === moduleId)
        ?.lessons.length || 0,
    };

    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: [...m.lessons, newLesson] }
          : m
      ),
    }));
  };

  const handleReorderLessons = (
    moduleId: string,
    startIndex: number,
    endIndex: number
  ) => {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) => {
        if (m.id !== moduleId) return m;

        const newLessons = Array.from(m.lessons);
        const [removed] = newLessons.splice(startIndex, 1);
        newLessons.splice(endIndex, 0, removed);

        return {
          ...m,
          lessons: newLessons.map((lesson, index) => ({
            ...lesson,
            order: index,
          })),
        };
      }),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <div className="flex items-center space-x-2">
          {isSaving && (
            <span className="text-sm text-gray-500">Saving...</span>
          )}
          {lastSaved && (
            <span className="text-sm text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {course.modules.map((module) => (
          <ModuleEditor
            key={module.id}
            module={module}
            onUpdate={(updatedModule: Module) => handleModuleUpdate(module.id, updatedModule)}
            onDelete={() => handleModuleDelete(module.id)}
            onAddLesson={() => handleAddLesson(module.id)}
            onReorderLessons={(startIndex: number, endIndex: number) =>
              handleReorderLessons(module.id, startIndex, endIndex)
            }
          />
        ))}

        <Button
          variant="outline"
          onClick={handleAddModule}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Module
        </Button>
      </div>
    </div>
  );
};

export default CourseEditor; 
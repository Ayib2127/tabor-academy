import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DraggableLesson } from './DraggableLesson';

interface DraggableModuleProps {
  id: number;
  title: string;
  lessons: Array<{
    id: number;
    title: string;
  }>;
  onDelete: (id: number) => void;
  onAddLesson: (moduleId: number) => void;
  onDeleteLesson: (moduleId: number, lessonId: number) => void;
}

export function DraggableModule({
  id,
  title,
  lessons,
  onDelete,
  onAddLesson,
  onDeleteLesson,
}: DraggableModuleProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `module-${id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-4 space-y-4 bg-white dark:bg-gray-800"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-grab"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-gray-400" />
          </button>
          <span className="font-semibold">{title}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(id)}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <SortableContext
        items={lessons.map(lesson => `lesson-${id}-${lesson.id}`)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 pl-8">
          {lessons.map((lesson) => (
            <DraggableLesson
              key={lesson.id}
              id={lesson.id}
              moduleId={id}
              title={lesson.title}
              onDelete={() => onDeleteLesson(id, lesson.id)}
            />
          ))}
        </div>
      </SortableContext>

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => onAddLesson(id)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Lesson
      </Button>
    </Card>
  );
} 
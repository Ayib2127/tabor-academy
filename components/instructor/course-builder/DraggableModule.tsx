import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2, PlusCircle } from 'lucide-react';
import { DraggableLesson } from './DraggableLesson';

interface Lesson {
  id: number;
  title: string;
}

interface DraggableModuleProps {
  id: number;
  title: string;
  lessons: Lesson[];
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
    <Card ref={setNodeRef} style={style} className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-gray-100"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 ml-6">
        {lessons.map((lesson) => (
          <DraggableLesson
            key={lesson.id}
            id={lesson.id}
            moduleId={id}
            title={lesson.title}
            onDelete={onDeleteLesson}
          />
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddLesson(id)}
          className="w-full mt-2"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Lesson
        </Button>
      </div>
    </Card>
  );
}
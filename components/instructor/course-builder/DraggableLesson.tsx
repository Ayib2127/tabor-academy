import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2, FileText } from 'lucide-react';

interface DraggableLessonProps {
  id: number;
  moduleId: number;
  title: string;
  onDelete: (moduleId: number, lessonId: number) => void;
}

export function DraggableLesson({
  id,
  moduleId,
  title,
  onDelete,
}: DraggableLessonProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `lesson-${moduleId}-${id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-2 bg-gray-50 rounded border"
    >
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-gray-200"
        >
          <GripVertical className="h-3 w-3 text-gray-400" />
        </div>
        <FileText className="h-4 w-4 text-gray-500" />
        <span className="text-sm">{title}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(moduleId, id)}
        className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
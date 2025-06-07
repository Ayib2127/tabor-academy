import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DraggableLessonProps {
  id: number;
  moduleId: number;
  title: string;
  onDelete: () => void;
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
      className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300"
    >
      <div className="flex items-center gap-2">
        <button
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-grab"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </button>
        <span>{title}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
} 
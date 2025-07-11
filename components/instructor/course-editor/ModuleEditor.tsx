import { FC, useState } from 'react';
import { Module } from '@/types/course';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Plus, Trash2 } from 'lucide-react';

interface ModuleEditorProps {
  module: Module;
  onUpdate: (updatedModule: Module) => void;
  onDelete: () => void;
  onAddLesson: () => void;
  onReorderLessons: (startIndex: number, endIndex: number) => void;
  hasRealId: boolean;
}

const ModuleEditor: FC<ModuleEditorProps> = ({
  module,
  onUpdate,
  onDelete,
  onAddLesson,
  onReorderLessons,
  hasRealId,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    onReorderLessons(result.source.index, result.destination.index);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <label className="font-semibold text-[#2C3E50]">Module Title</label>
          <Input
            value={module.title}
            onChange={(e) => onUpdate({ ...module, title: e.target.value })}
            placeholder="Module Title"
            className="text-lg font-semibold"
          />
          <label className="text-[#2C3E50]">Module Description <span className="text-xs text-gray-400">(optional)</span></label>
          <Textarea
            value={module.description || ''}
            onChange={(e) => onUpdate({ ...module, description: e.target.value })}
            placeholder="Module Description (optional)"
            className="resize-none"
          />
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '−' : '+'}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId={module.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {module.lessons.map((lesson, index) => (
                    <Draggable
                      key={lesson.id}
                      draggableId={lesson.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md"
                        >
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-4 w-4 text-gray-400" />
                          </div>
                          <span className="flex-1">{lesson.title}</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Button
            variant="outline"
            size="sm"
            onClick={onAddLesson}
            className="w-full"
            disabled={!hasRealId}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lesson
          </Button>
        </div>
      )}
    </div>
  );
};

export default ModuleEditor; 
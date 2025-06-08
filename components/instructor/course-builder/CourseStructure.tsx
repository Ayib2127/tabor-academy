import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DraggableModule } from './DraggableModule';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';

interface Module {
  id: number;
  title: string;
  lessons: Array<{
    id: number;
    title: string;
  }>;
}

interface CourseStructureProps {
  modules: Module[];
  onModulesChange: (modules: Module[]) => void;
  onAddModule: (title: string) => void;
  onDeleteModule: (id: number) => void;
  onAddLesson: (moduleId: number) => void;
  onDeleteLesson: (moduleId: number, lessonId: number) => void;
  showAddModuleInput: boolean;
  newModuleTitle: string;
  onNewModuleTitleChange: (title: string) => void;
  onCancelAddModule: () => void;
  onReorderModules: (modules: Module[]) => void;
  onReorderLessons: (moduleId: number, lessons: Array<{ id: number; title: string }>) => void;
}

export function CourseStructure({
  modules,
  onModulesChange,
  onAddModule,
  onDeleteModule,
  onAddLesson,
  onDeleteLesson,
  showAddModuleInput,
  newModuleTitle,
  onNewModuleTitleChange,
  onCancelAddModule,
  onReorderModules,
  onReorderLessons,
}: CourseStructureProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // Check if we're dragging a module or a lesson
    if (activeId.startsWith('module-')) {
      const moduleId = parseInt(activeId.replace('module-', ''));
      const overModuleId = parseInt(overId.replace('module-', ''));
      
      if (moduleId !== overModuleId) {
        const oldIndex = modules.findIndex((module) => module.id === moduleId);
        const newIndex = modules.findIndex((module) => module.id === overModuleId);
        onReorderModules(arrayMove(modules, oldIndex, newIndex));
      }
    } else if (activeId.startsWith('lesson-')) {
      const [moduleId, lessonId] = activeId.replace('lesson-', '').split('-').map(Number);
      const [overModuleId, overLessonId] = overId.replace('lesson-', '').split('-').map(Number);
      
      if (moduleId === overModuleId && lessonId !== overLessonId) {
        const module = modules.find(m => m.id === moduleId);
        if (module) {
          const oldIndex = module.lessons.findIndex(lesson => lesson.id === lessonId);
          const newIndex = module.lessons.findIndex(lesson => lesson.id === overLessonId);
          onReorderLessons(moduleId, arrayMove(module.lessons, oldIndex, newIndex));
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Course Structure</h2>
        <p className="text-sm text-gray-500">
          {modules.length} {modules.length === 1 ? 'Module' : 'Modules'}
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={modules.map((module) => `module-${module.id}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {modules.map((module) => (
              <DraggableModule
                key={module.id}
                id={module.id}
                title={module.title}
                lessons={module.lessons}
                onDelete={onDeleteModule}
                onAddLesson={onAddLesson}
                onDeleteLesson={onDeleteLesson}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {showAddModuleInput ? (
        <div className="flex gap-2">
          <Input
            placeholder="Enter module title"
            value={newModuleTitle}
            onChange={(e) => onNewModuleTitleChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAddModule(newModuleTitle);
              }
            }}
          />
          <Button onClick={() => onAddModule(newModuleTitle)}>Save</Button>
          <Button variant="outline" onClick={onCancelAddModule}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onNewModuleTitleChange('')}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Module
        </Button>
      )}
    </div>
  );
} 
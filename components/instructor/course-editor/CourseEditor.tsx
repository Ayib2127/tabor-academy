
"use client"

import { FC, useState, useEffect } from 'react';
import { Course, Module, Lesson } from '@/types/course';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import ModuleEditor from './ModuleEditor';
import { Plus } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { TagInput } from "@/components/ui/TagInput";

interface CourseEditorProps {
  course: Course;
}

const CourseEditor: FC<CourseEditorProps> = ({ course: initialCourse }) => {
  const [course, setCourse] = useState(() => ({
    ...initialCourse,
    deliveryType: initialCourse.deliveryType || 'self_paced',
    learningOutcomes: initialCourse.learningOutcomes ?? [],
    requirements: initialCourse.requirements ?? [],
    successStories: initialCourse.successStories ?? [],
    faq: initialCourse.faq ?? [],
  }));

  useEffect(() => {
    if (initialCourse) {
      setCourse({
        ...initialCourse,
        deliveryType: initialCourse.deliveryType || 'self_paced',
        learningOutcomes: initialCourse.learningOutcomes ?? [],
        requirements: initialCourse.requirements ?? [],
        successStories: initialCourse.successStories ?? [],
        faq: initialCourse.faq ?? [],
      });
    }
  }, [initialCourse]);

  // Temporarily disable auto-save to prevent infinite loops
  const isSaving = false;
  const lastSaved = null;

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

  const handleAddModule = async () => {
    // Optimistically show a loading module (optional, can be skipped for simplicity)
    const tempId = `temp-${Date.now()}`;
    const newModule = {
      id: tempId,
      title: 'New Module',
      description: '',
      lessons: [],
      order: course.modules.length,
    };
    setCourse((prev) => ({
      ...prev,
      modules: [...prev.modules, newModule],
    }));

    try {
      const response = await fetch(`/api/courses/${course.id}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newModule.title,
          position: newModule.order,
        }),
      });
      if (!response.ok) throw new Error('Failed to create module');
      const savedModule = await response.json();
      setCourse((prev) => ({
        ...prev,
        modules: prev.modules.map((m) =>
          m.id === tempId ? { ...savedModule, lessons: [] } : m
        ),
      }));
    } catch (err) {
      setCourse((prev) => ({
        ...prev,
        modules: prev.modules.filter((m) => m.id !== tempId),
      }));
      toast.error('Failed to create module');
    }
  };

  const handleAddLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: `temp-${Date.now()}`,
      title: 'New Lesson',
      type: 'video',
      order: course.modules
        .find((m) => m.id === moduleId)
        ?.lessons.length || 0,
      is_published: false,
      content: '',
      duration: 0,
      needsGrading: false,
      dueDate: '',
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

  // --- New Handlers for Learning Outcomes ---
  const handleLearningOutcomeChange = (index: number, value: string) => {
    setCourse((prev) => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.map((item, i) =>
        i === index ? value : item
      ),
    }));
  };
  const handleAddLearningOutcome = () => {
    setCourse((prev) => ({
      ...prev,
      learningOutcomes: [...prev.learningOutcomes, ""],
    }));
  };
  const handleRemoveLearningOutcome = (index: number) => {
    setCourse((prev) => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== index),
    }));
  };

  // --- New Handlers for Requirements ---
  const handleRequirementChange = (index: number, value: string) => {
    setCourse((prev) => ({
      ...prev,
      requirements: prev.requirements.map((item, i) =>
        i === index ? value : item
      ),
    }));
  };
  const handleAddRequirement = () => {
    setCourse((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };
  const handleRemoveRequirement = (index: number) => {
    setCourse((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  // --- New Handlers for Success Stories ---
  const handleSuccessStoryChange = (index: number, field: string, value: string) => {
    setCourse((prev) => ({
      ...prev,
      successStories: prev.successStories.map((story, i) =>
        i === index ? { ...story, [field]: value } : story
      ),
    }));
  };
  const handleAddSuccessStory = () => {
    setCourse((prev) => ({
      ...prev,
      successStories: [
        ...prev.successStories,
        { name: "", photo: "", outcome: "", story: "" },
      ],
    }));
  };
  const handleRemoveSuccessStory = (index: number) => {
    setCourse((prev) => ({
      ...prev,
      successStories: prev.successStories.filter((_, i) => i !== index),
    }));
  };

  // --- New Handlers for FAQ ---
  const handleFaqChange = (index: number, field: string, value: string) => {
    setCourse((prev) => ({
      ...prev,
      faq: prev.faq.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };
  const handleAddFaq = () => {
    setCourse((prev) => ({
      ...prev,
      faq: [...prev.faq, { question: "", answer: "" }],
    }));
  };
  const handleRemoveFaq = (index: number) => {
    setCourse((prev) => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index),
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
        <Card className="mb-4 p-4">
          <div className="mb-4">
            <label className="font-bold text-[#2C3E50] mb-1 block">Course Title</label>
            <input
              className="input input-bordered w-full font-bold text-lg"
              value={course.title}
              onChange={e => setCourse(c => ({ ...c, title: e.target.value }))}
              placeholder="Enter course title"
              required
            />
          </div>
          <div className="mb-4">
            <label className="font-bold text-[#2C3E50] mb-1 block">Subtitle</label>
            <input
              className="input input-bordered w-full"
              value={course.subtitle || ""}
              onChange={e => setCourse(c => ({ ...c, subtitle: e.target.value }))}
              placeholder="Enter a short subtitle"
              maxLength={150}
            />
          </div>
          <div className="mb-4">
            <label className="font-bold text-[#2C3E50] mb-1 block">Description</label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={course.description}
              onChange={e => setCourse(c => ({ ...c, description: e.target.value }))}
              placeholder="Enter course description"
              rows={3}
              required
            />
          </div>
          <div className="mb-4">
            <label className="font-bold text-[#2C3E50] mb-1 block">What You'll Learn</label>
            <TagInput
              tags={course.learningOutcomes}
              onAdd={tag => setCourse(c => ({ ...c, learningOutcomes: [...c.learningOutcomes, tag] }))}
              onRemove={i => setCourse(c => ({ ...c, learningOutcomes: c.learningOutcomes.filter((_, idx) => idx !== i) }))}
              placeholder="Type an outcome and press Enter"
            />
          </div>
          <div className="mb-4">
            <label className="font-bold text-[#2C3E50] mb-1 block">Requirements</label>
            <TagInput
              tags={course.requirements}
              onAdd={tag => setCourse(c => ({ ...c, requirements: [...c.requirements, tag] }))}
              onRemove={i => setCourse(c => ({ ...c, requirements: c.requirements.filter((_, idx) => idx !== i) }))}
              placeholder="Type a requirement and press Enter"
            />
          </div>
          <div className="mb-4">
            <label className="font-bold text-[#2C3E50] mb-1 block">Subtitles</label>
            <TagInput
              tags={course.subtitles || []}
              onAdd={tag => setCourse(c => ({ ...c, subtitles: [...(c.subtitles || []), tag] }))}
              onRemove={i => setCourse(c => ({ ...c, subtitles: c.subtitles.filter((_, idx) => idx !== i) }))}
              placeholder="Type a language and press Enter"
            />
          </div>
          <div className="mb-4">
            <label className="font-bold text-[#2C3E50] mb-1 block">Language</label>
            <select
              className="input input-bordered w-full"
              value={course.language || ""}
              onChange={e => setCourse(c => ({ ...c, language: e.target.value }))}
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
            <label className="font-bold text-[#2C3E50] mb-1 block">Course Features</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Video Hours</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={course.videoHours || ""}
                  onChange={e => setCourse(c => ({ ...c, videoHours: Number(e.target.value) }))}
                  placeholder="e.g. 24"
                  min={0}
                />
              </div>
              <div>
                <label>Downloadable Resources</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={course.resources || ""}
                  onChange={e => setCourse(c => ({ ...c, resources: Number(e.target.value) }))}
                  placeholder="e.g. 15"
                  min={0}
                />
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={!!course.certificate}
                    onChange={e => setCourse(c => ({ ...c, certificate: e.target.checked }))}
                  />
                  Certificate of Completion
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={!!course.community}
                    onChange={e => setCourse(c => ({ ...c, community: e.target.checked }))}
                  />
                  Community Access
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={!!course.lifetimeAccess}
                    onChange={e => setCourse(c => ({ ...c, lifetimeAccess: e.target.checked }))}
                  />
                  Lifetime Access
                </label>
              </div>
            </div>
          </div>
        </Card>

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
            hasRealId={!module.id.startsWith('temp-')}
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
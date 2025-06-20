import { FC, useState, useEffect, useRef } from 'react';
import { Lesson } from '@/types/course';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import VideoUploader from './VideoUploader';
import VideoPlayer from '@/components/course-player/VideoPlayer';

import RichTextEditor from './RichTextEditor';

import { debounce } from 'lodash-es';
import { toast } from '@/components/ui/use-toast';
import QuizBuilder from './QuizBuilder';

interface LessonEditorProps {
  lesson: Lesson;
  onUpdate: (updatedLesson: Lesson) => void;
  onDelete: () => void;
}

const LessonEditor: FC<LessonEditorProps> = ({
  lesson,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleVideoUpload = (videoUrl: string) => {
    onUpdate({
      ...lesson,
      content: videoUrl,
      type: 'video',
    });
  };

  const handleVideoError = (error: Error) => {
    console.error('Video upload error:', error);
    // Handle error (show toast, etc.)
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-4">
          <Input
            value={lesson.title}
            onChange={(e) => onUpdate({ ...lesson, title: e.target.value })}
            placeholder="Lesson Title"
            className="text-lg font-semibold"
          />
          
          <Select
            value={lesson.type}
            onValueChange={(value: 'video' | 'text' | 'quiz') =>
              onUpdate({ ...lesson, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Lesson Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video Lesson</SelectItem>
              <SelectItem value="text">Text Lesson</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
            </SelectContent>
          </Select>

          {lesson.type === 'video' && (
            <div className="space-y-4">
              {lesson.content ? (
                <div className="space-y-2">
                  <VideoPlayer src={lesson.content} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdate({ ...lesson, content: '' })}
                  >
                    Replace Video
                  </Button>
                </div>
              ) : (
                <VideoUploader
                  onUploadComplete={handleVideoUpload}
                  onUploadError={handleVideoError}
                />
              )}
            </div>
          )}

          {lesson.type === 'text' && (
            <div>
              <RichTextWrapper lesson={lesson} onUpdate={onUpdate} />
            </div>
          )}

          {lesson.type === 'quiz' && (
            <div className="space-y-4">
              <QuizBuilder
                quiz={lesson.content ? JSON.parse(lesson.content) : {
                  id: `quiz-${Date.now()}`,
                  title: 'New Quiz',
                  questions: [],
                  passingScore: 70,
                  attemptsAllowed: 3,
                  shuffleQuestions: false,
                  showCorrectAnswers: true,
                  showExplanations: true,
                }}
                onChange={(quiz) => onUpdate({
                  ...lesson,
                  content: JSON.stringify(quiz)
                })}
              />
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-red-500 hover:text-red-600 ml-4"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// --- RichTextEditor wrapper: handles text lesson editing and autosave ---
interface RichTextWrapperProps {
  lesson: Lesson;
  onUpdate: (updatedLesson: Lesson) => void;
}

const RichTextWrapper: FC<RichTextWrapperProps> = ({ lesson, onUpdate }) => {
  const [saving, setSaving] = useState(false);
  const initialContent = lesson.content || '';
  

  // debounce save
  const saveRef = useRef<(content: any) => void>();
  saveRef.current = async (content: any) => {
    try {
      setSaving(true);
      // Update parent state for instant UI feedback
      onUpdate({ ...lesson, content });
      // If lesson has a permanent UUID, save to backend; otherwise defer until course save
      if (!lesson.id.startsWith('temp-')) {
        const res = await fetch(`/api/instructor/lessons/${lesson.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, type: lesson.type ?? 'text' }),
        });
        if (!res.ok) {
          throw new Error('Save failed');
        }
      }
    } catch (e: any) {
      toast({ title: 'Error saving', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const debouncedSave = useRef(
    debounce((content) => saveRef.current?.(content), 1000)
  ).current;

  useEffect(() => {
    return () => debouncedSave.cancel();
  }, [debouncedSave]);

  return (
    <div>
      <RichTextEditor
        content={initialContent}
        onChange={(html) => {
          debouncedSave(html);
        }}
      />
      {saving && <p className="text-sm text-gray-500 mt-2">Saving…</p>}
    </div>
  );
};

export default LessonEditor;
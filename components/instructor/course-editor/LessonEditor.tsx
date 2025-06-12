import { FC, useState } from 'react';
import { Lesson } from '@/types/course';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import VideoUploader from './VideoUploader';
import VideoPlayer from '@/components/course-player/VideoPlayer';
import RichTextEditor from './RichTextEditor';
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
            <option value="video">Video Lesson</option>
            <option value="text">Text Lesson</option>
            <option value="quiz">Quiz</option>
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
            <div className="space-y-4">
              <RichTextEditor
                content={lesson.content || ''}
                onChange={(content) => onUpdate({ ...lesson, content })}
                placeholder="Write your lesson content here..."
              />
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

export default LessonEditor; 
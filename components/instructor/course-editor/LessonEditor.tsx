import { FC, useState, useEffect, useRef, useCallback } from 'react';
import { Lesson } from '@/types/course';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trash2, Save, Clock, CheckCircle, AlertCircle, Sparkles, Wand2 } from 'lucide-react';
import VideoUploader from './VideoUploader';
import VideoPlayer from '@/components/course-player/VideoPlayer';
import RichTextEditor from './RichTextEditor';
import QuizBuilder from './QuizBuilder';
import AIAssistant from './AIAssistant';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';

interface LessonEditorProps {
  lesson?: Lesson;
  onUpdate: (updatedLesson: Lesson) => void;
  onDelete: () => void;
  isVisible?: boolean;
}

const LessonEditor: FC<LessonEditorProps> = ({
  lesson,
  onUpdate,
  onDelete,
  isVisible = true,
}) => {
  if (!isVisible || !lesson) return null;

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [showAIQuizGenerator, setShowAIQuizGenerator] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  
  const supabase = createClientComponentClient();
  
  // Debounced save function
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastContentRef = useRef<any>(lesson.content);

  const debouncedSave = useCallback(async (updatedLesson: Lesson) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for debounced save
    saveTimeoutRef.current = setTimeout(async () => {
      // Only save if content has actually changed
      if (JSON.stringify(lastContentRef.current) === JSON.stringify(updatedLesson.content)) {
        return;
      }

      try {
        setSaveStatus('saving');
        
        // Update parent state immediately for optimistic UI
        onUpdate(updatedLesson);
        
        // Only save to backend if lesson has a permanent UUID (not temp)
        if (!updatedLesson.id.startsWith('temp-')) {
          const { error } = await supabase
            .from('module_lessons')
            .update({
              title: updatedLesson.title,
              content: updatedLesson.content,
              type: updatedLesson.type,
              is_published: updatedLesson.is_published,
              updated_at: new Date().toISOString(),
            })
            .eq('id', updatedLesson.id);

          if (error) {
            throw error;
          }
        }

        lastContentRef.current = updatedLesson.content;
        setSaveStatus('saved');
        setLastSaved(new Date());
        
        // Reset status after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000);
        
      } catch (error: any) {
        console.error('Auto-save error:', error);
        setSaveStatus('error');
        toast.error('Failed to save lesson: ' + error.message);
        
        // Reset status after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    }, 1000); // 1 second debounce
  }, [lesson.id, onUpdate, supabase]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Handle text selection for AI assistance
  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        setSelectedText(selection.toString().trim());
      } else {
        setSelectedText('');
      }
    };

    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('keyup', handleTextSelection);

    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('keyup', handleTextSelection);
    };
  }, []);

  const handleLessonUpdate = (updates: Partial<Lesson>) => {
    const updatedLesson = { ...lesson, ...updates };
    debouncedSave(updatedLesson);
  };

  const handleContentChange = (content: any) => {
    handleLessonUpdate({ content });
  };

  const handleVideoUpload = (videoUrl: string) => {
    handleLessonUpdate({
      content: { type: 'video', src: videoUrl },
      type: 'video',
    });
  };

  const handleVideoError = (error: Error) => {
    console.error('Video upload error:', error);
    toast.error('Video upload failed: ' + error.message);
  };

  const handleQuizChange = (quiz: any) => {
    handleLessonUpdate({
      content: quiz,
      type: 'quiz',
    });
  };

  // AI Content Generation Handlers
  const handleAIContentGenerated = (content: any) => {
    handleContentChange(content);
    toast.success('AI content applied successfully!');
  };

  const handleAIQuizGenerated = (quiz: any) => {
    handleQuizChange(quiz);
    toast.success('AI quiz generated and applied successfully!');
  };

  // Auto-generate quiz from lesson content
  const handleAutoGenerateQuiz = async () => {
    if (!lesson.content) {
      toast.error('Please add some lesson content first to generate a quiz');
      return;
    }

    setIsGeneratingQuiz(true);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'quiz',
          input: lesson.content,
          questionCount: 5,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate quiz');
      }

      const result = await response.json();
      
      // Switch to quiz type and apply the generated quiz
      handleLessonUpdate({
        type: 'quiz',
        content: result.content,
      });

      toast.success('Quiz generated successfully from lesson content!');
      
    } catch (error: any) {
      console.error('Quiz generation error:', error);
      toast.error(error.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const renderSaveStatus = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <div className="flex items-center gap-2 text-blue-600" aria-live="polite">
            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Saving...</span>
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center gap-2 text-green-600" aria-live="polite">
            <CheckCircle className="w-3 h-3" />
            <span className="text-xs">
              Saved {lastSaved ? `at ${lastSaved.toLocaleTimeString()}` : ''}
            </span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-600" aria-live="polite">
            <AlertCircle className="w-3 h-3" />
            <span className="text-xs">Save failed</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <div className="bg-white rounded-lg border border-[#E5E8E8] p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 space-y-4">
            <div>
              <Label htmlFor="lesson-title" className="text-[#2C3E50] font-semibold">
                Lesson Title
              </Label>
              <Input
                id="lesson-title"
                value={lesson.title}
                onChange={(e) => handleLessonUpdate({ title: e.target.value })}
                placeholder="Enter lesson title"
                className="mt-1 text-lg font-semibold border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div>
                <Label htmlFor="lesson-type" className="text-[#2C3E50] font-semibold">
                  Lesson Type
                </Label>
                <Select
                  value={lesson.type}
                  onValueChange={(value: 'video' | 'text' | 'quiz') =>
                    handleLessonUpdate({ type: value })
                  }
                >
                  <SelectTrigger className="mt-1 border-[#E5E8E8] focus:border-[#4ECDC4]">
                    <SelectValue placeholder="Select lesson type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">📝 Text Lesson</SelectItem>
                    <SelectItem value="video">🎬 Video Lesson</SelectItem>
                    <SelectItem value="quiz">❓ Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="lesson-published"
                  checked={lesson.is_published}
                  onCheckedChange={(checked) => handleLessonUpdate({ is_published: checked })}
                />
                <Label htmlFor="lesson-published" className="text-[#2C3E50] font-semibold">
                  Published
                </Label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* AI Assistant */}
            <AIAssistant
              selectedText={selectedText}
              onContentGenerated={handleAIContentGenerated}
              onQuizGenerated={handleAIQuizGenerated}
              lessonType={lesson.type}
              lessonTitle={lesson.title}
              currentContent={lesson.content}
            />
            
            {renderSaveStatus()}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              title="Delete lesson"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <Badge variant={lesson.is_published ? "default" : "secondary"}>
            {lesson.is_published ? "Published" : "Draft"}
          </Badge>
          <Badge variant="outline">
            {lesson.type === 'text' && '📝 Text'}
            {lesson.type === 'video' && '🎬 Video'}
            {lesson.type === 'quiz' && '❓ Quiz'}
          </Badge>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="bg-white rounded-lg border border-[#E5E8E8] shadow-sm overflow-hidden">
        {lesson.type === 'text' && (
          <div>
            <div className="px-6 py-4 border-b border-[#E5E8E8] bg-[#F7F9F9]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#2C3E50]">Lesson Content</h3>
                  <p className="text-sm text-[#2C3E50]/60 mt-1">
                    Create rich, engaging content using our block-based editor.
                  </p>
                </div>
                {lesson.content && (
                  <Button
                    onClick={handleAutoGenerateQuiz}
                    disabled={isGeneratingQuiz}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    size="sm"
                  >
                    {isGeneratingQuiz ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Auto-Generate Quiz
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            <div className="p-0">
              <RichTextEditor
                content={lesson.content}
                onChange={handleContentChange}
                placeholder="Start writing your lesson content. Use the toolbar to format text, add images, links, and more..."
              />
            </div>
          </div>
        )}

        {lesson.type === 'video' && (
          <div>
            <div className="px-6 py-4 border-b border-[#E5E8E8] bg-[#F7F9F9]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#2C3E50]">Video Content</h3>
                  <p className="text-sm text-[#2C3E50]/60 mt-1">
                    Upload or provide a video URL for this lesson.
                  </p>
                </div>
                {lesson.content?.src && (
                  <Button
                    onClick={handleAutoGenerateQuiz}
                    disabled={isGeneratingQuiz}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    size="sm"
                  >
                    {isGeneratingQuiz ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Quiz from Video
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            <div className="p-6 space-y-4">
              {lesson.content?.src ? (
                <div className="space-y-4">
                  <VideoPlayer src={lesson.content.src} />
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLessonUpdate({ content: null })}
                      className="border-[#E5E8E8] hover:border-[#4ECDC4]"
                    >
                      Replace Video
                    </Button>
                    <span className="text-sm text-[#2C3E50]/60">
                      Current video: {lesson.content.src}
                    </span>
                  </div>
                </div>
              ) : (
                <VideoUploader
                  onUploadComplete={handleVideoUpload}
                  onUploadError={handleVideoError}
                />
              )}
            </div>
          </div>
        )}

        {lesson.type === 'quiz' && (
          <div>
            <div className="px-6 py-4 border-b border-[#E5E8E8] bg-[#F7F9F9]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#2C3E50]">Quiz Builder</h3>
                  <p className="text-sm text-[#2C3E50]/60 mt-1">
                    Create interactive quizzes to test student knowledge.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setShowAIQuizGenerator(!showAIQuizGenerator)}
                    variant="outline"
                    size="sm"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Quiz Tools
                  </Button>
                </div>
              </div>
              
              {/* AI Quiz Generator Panel */}
              {showAIQuizGenerator && (
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <h4 className="text-sm font-semibold text-purple-900 mb-3">AI Quiz Generation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button
                      onClick={handleAutoGenerateQuiz}
                      disabled={isGeneratingQuiz}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      size="sm"
                    >
                      {isGeneratingQuiz ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Generate New Quiz
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        // This will open the AI Assistant with quiz focus
                        setShowAIQuizGenerator(false);
                      }}
                      variant="outline"
                      size="sm"
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Assistant
                    </Button>
                  </div>
                  <p className="text-xs text-purple-700 mt-2">
                    Generate quiz questions automatically from your lesson content or use the AI Assistant for custom quiz creation.
                  </p>
                </div>
              )}
            </div>
            <div className="p-6">
              <QuizBuilder
                quiz={lesson.content || {
                  id: `quiz-${Date.now()}`,
                  title: lesson.title || 'New Quiz',
                  questions: [],
                  passingScore: 70,
                  attemptsAllowed: 3,
                  shuffleQuestions: false,
                  showCorrectAnswers: true,
                  showExplanations: true,
                }}
                onChange={handleQuizChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonEditor;
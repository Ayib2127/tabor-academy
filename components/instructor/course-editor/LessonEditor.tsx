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

// Local lesson type for UI editing (content can be object or string)
type LocalLesson = Omit<Lesson, 'content'> & { content?: any };

interface LessonEditorProps {
  lesson?: Lesson;
  moduleId?: string; // Add moduleId for new lessons
  onUpdate: (updatedLesson: Lesson) => void;
  onDelete: () => void;
  isVisible?: boolean;
  onSave?: () => void;
}

const LessonEditor: FC<LessonEditorProps> = ({
  lesson,
  moduleId,
  onUpdate,
  onDelete,
  isVisible = true,
  onSave,
}) => {
  if (!isVisible || !lesson) return null;

  // Local state for editing
  const [localLesson, setLocalLesson] = useState<LocalLesson>(() => ({
    ...lesson,
    content: parseContent(lesson.content),
  }));

  // Reset local state when a new lesson is selected
  useEffect(() => {
    setLocalLesson({
      ...lesson,
      content: parseContent(lesson.content),
    });
  }, [lesson?.id]);

  // Helper to parse content string to object
  function parseContent(content: any) {
    if (!content) return undefined;
    if (typeof content === 'string') {
      try {
        return JSON.parse(content);
      } catch {
        // Fallback: wrap legacy HTML string in a minimal JSON structure for the editor
        return {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: content }
              ]
            }
          ]
        };
      }
    }
    return content;
  }
  // Helper to serialize content object to string
  function serializeContent(content: any) {
    if (typeof content === 'string') return content;
    return JSON.stringify(content);
  }

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [showAIQuizGenerator, setShowAIQuizGenerator] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  
  const supabase = createClientComponentClient();
  
  // Debounced save function
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastContentRef = useRef<any>(lesson.content);

  const debouncedSave = useCallback(async (updatedLesson: LocalLesson) => {
    console.log("debouncedSave called", updatedLesson);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(async () => {
      const contentString = serializeContent(updatedLesson.content);

      // Only compare serialized strings
      if (lastContentRef.current === contentString) return;

      try {
        setSaveStatus('saving');
        let savedLesson = { ...updatedLesson, content: updatedLesson.content };
        // If temp ID, insert new lesson
        if (updatedLesson.id.startsWith('temp-')) {
          const module_id = (updatedLesson as any).module_id || moduleId;
          if (!module_id) throw new Error('Module ID is required to create a new lesson');
          const { data: inserted, error } = await supabase
            .from('module_lessons')
            .insert({
              module_id,
              title: updatedLesson.title,
              description: updatedLesson.description,
              content: contentString,
              type: updatedLesson.type,
              is_published: updatedLesson.is_published ?? false,
              order: updatedLesson.order,
              dueDate: updatedLesson.dueDate,
              needsGrading: updatedLesson.needsGrading,
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();
          console.log('Supabase INSERT result:', { error, inserted });
          if (error || !inserted) {
            throw error || new Error('Failed to insert lesson');
          }
          // Fetch the latest lesson from backend
          const { data: freshLesson, error: fetchError } = await supabase
            .from('module_lessons')
            .select('*')
            .eq('id', inserted.id)
            .single();
          if (fetchError || !freshLesson) {
            throw fetchError || new Error('Failed to fetch new lesson');
          }
          savedLesson = { ...freshLesson, content: parseContent(freshLesson.content) };
          lastContentRef.current = serializeContent(savedLesson.content);
        } else {
          // Update existing lesson
          const { error } = await supabase
            .from('module_lessons')
            .update({
              title: updatedLesson.title,
              description: updatedLesson.description,
              content: contentString,
              type: updatedLesson.type,
              is_published: updatedLesson.is_published ?? false,
              order: updatedLesson.order,
              dueDate: updatedLesson.dueDate,
              needsGrading: updatedLesson.needsGrading,
              updated_at: new Date().toISOString(),
            })
            .eq('id', updatedLesson.id);
          console.log('Supabase UPDATE result:', { error, updatedLessonId: updatedLesson.id });
          if (error) {
            throw error;
          }
          // Fetch the latest lesson from backend
          const { data: freshLesson, error: fetchError } = await supabase
            .from('module_lessons')
            .select('*')
            .eq('id', updatedLesson.id)
            .single();
          if (fetchError || !freshLesson) {
            throw fetchError || new Error('Failed to fetch updated lesson');
          }
          savedLesson = { ...freshLesson, content: parseContent(freshLesson.content) };
          lastContentRef.current = serializeContent(savedLesson.content);
        }
        setSaveStatus('saved');
        setLastSaved(new Date());
        // When calling onUpdate, cast content to string for Lesson type
        onUpdate({ ...savedLesson, content: serializeContent(savedLesson.content) });
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error: any) {
        console.error('Auto-save error:', error);
        setSaveStatus('error');
        toast.error('Failed to save lesson: ' + (error?.message || error));
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    }, 1000);
  }, [lesson.id, onUpdate, supabase, moduleId]);

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

  // Debounce save to parent after user stops typing
  // REMOVE this effect entirely
  // useEffect(() => {
  //   if (!localLesson) return;
  //   const timeout = setTimeout(() => {
  //     onUpdate({ ...localLesson, content: serializeContent(localLesson.content) });
  //   }, 500); // 500ms debounce
  //   return () => clearTimeout(timeout);
  // }, [localLesson, onUpdate]);

  const handleLessonUpdate = (updates: Partial<Lesson>) => {
    const updatedLesson = { ...localLesson, ...updates };
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
    if (!localLesson.content) {
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
          input: localLesson.content,
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

  const [videoUrlInput, setVideoUrlInput] = useState(
    typeof localLesson.content === 'object' && localLesson.content && 'src' in localLesson.content
      ? String(localLesson.content.src)
      : ''
  );

  useEffect(() => {
    setVideoUrlInput(
      typeof localLesson.content === 'object' && localLesson.content && 'src' in localLesson.content
        ? String(localLesson.content.src)
        : ''
    );
  }, [localLesson.content]);

  const [editingQuiz, setEditingQuiz] = useState<any | null>(null);

  useEffect(() => {
    if (localLesson.type === 'quiz' && typeof localLesson.content === 'object') {
      setEditingQuiz(localLesson.content);
    }
  }, [localLesson.type, localLesson.content]);

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
                value={localLesson.title}
                onChange={(e) => setLocalLesson(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter lesson title"
                className="mt-1 text-lg font-semibold border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20"
              />
            </div>
            <div>
              <Label htmlFor="lesson-description" className="text-[#2C3E50]">Lesson Description <span className="text-xs text-gray-400">(optional)</span></Label>
              <Input
                id="lesson-description"
                value={localLesson.description || ''}
                onChange={e => setLocalLesson(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter a short description for this lesson (optional)"
                className="mt-1 border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div>
                <Label htmlFor="lesson-type" className="text-[#2C3E50] font-semibold">
                  Lesson Type
                </Label>
                <Select
                  value={localLesson.type}
                  onValueChange={(value: 'video' | 'text' | 'quiz' | 'assignment') =>
                    setLocalLesson(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="mt-1 border-[#E5E8E8] focus:border-[#4ECDC4]">
                    <SelectValue placeholder="Select lesson type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">📝 Text Lesson</SelectItem>
                    <SelectItem value="video">🎬 Video Lesson</SelectItem>
                    <SelectItem value="quiz">❓ Quiz</SelectItem>
                    <SelectItem value="assignment">📄 Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="lesson-published"
                  checked={localLesson.is_published}
                  onCheckedChange={(checked) => setLocalLesson(prev => ({ ...prev, is_published: checked }))}
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
              lessonType={
                ['video', 'text', 'quiz'].includes(localLesson.type)
                  ? (localLesson.type as 'video' | 'text' | 'quiz')
                  : 'text'
              }
              lessonTitle={localLesson.title}
              currentContent={localLesson.content}
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
          <Badge variant={localLesson.is_published ? "default" : "secondary"}>
            {localLesson.is_published ? "Published" : "Draft"}
          </Badge>
          <Badge variant="outline">
            {localLesson.type === 'text' && '📝 Text'}
            {localLesson.type === 'video' && '🎬 Video'}
            {localLesson.type === 'quiz' && '❓ Quiz'}
            {localLesson.type === 'assignment' && '📄 Assignment'}
          </Badge>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="bg-white rounded-lg border border-[#E5E8E8] shadow-sm overflow-hidden">
        {localLesson.type === 'text' && (
          <div>
            <div className="px-6 py-4 border-b border-[#E5E8E8] bg-[#F7F9F9]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#2C3E50]">Lesson Content</h3>
                  <p className="text-sm text-[#2C3E50]/60 mt-1">
                    Create rich, engaging content using our block-based editor.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-0">
              <RichTextEditor
                content={localLesson.content}
                onChange={handleContentChange}
                placeholder="Start writing your lesson content. Use the toolbar to format text, add images, links, and more..."
              />
            </div>
          </div>
        )}

        {localLesson.type === 'video' && (
          <div>
            <div className="px-6 py-4 border-b border-[#E5E8E8] bg-[#F7F9F9]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#2C3E50]">Video Content</h3>
                  <p className="text-sm text-[#2C3E50]/60 mt-1">
                    Provide a video URL for this lesson (YouTube, Vimeo, etc.).
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <Input
                type="url"
                placeholder="Paste video URL here (e.g. https://...)"
                value={videoUrlInput}
                onChange={e => setVideoUrlInput(e.target.value)}
                onBlur={() => {
                  handleLessonUpdate({
                    content: { type: 'video', src: videoUrlInput },
                    type: 'video',
                  });
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleLessonUpdate({
                      content: { type: 'video', src: videoUrlInput },
                      type: 'video',
                    });
                    e.preventDefault();
                  }
                }}
              />
              {typeof localLesson.content === 'object' &&
                localLesson.content &&
                'src' in (localLesson.content as any) && (
                  <VideoPlayer src={(localLesson.content as any).src} />
                )}
            </div>
          </div>
        )}

        {localLesson.type === 'quiz' && (
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
                quiz={editingQuiz || {
                  id: `quiz-${Date.now()}`,
                  title: localLesson.title || 'New Quiz',
                  questions: [],
                  passingScore: 70,
                  attemptsAllowed: 3,
                  shuffleQuestions: false,
                  showCorrectAnswers: true,
                  showExplanations: true,
                }}
                onChange={updatedQuiz => setEditingQuiz(updatedQuiz)}
                onBlur={() => handleLessonUpdate({ content: editingQuiz, type: 'quiz' })}
              />
            </div>
          </div>
        )}

        {localLesson.type === 'assignment' && (
          <div>
            <div className="px-6 py-4 border-b border-[#E5E8E8] bg-[#F7F9F9]">
              <h3 className="text-lg font-semibold text-[#2C3E50]">Assignment Details</h3>
              <p className="text-sm text-[#2C3E50]/60 mt-1">
                Provide instructions and set a due date for this assignment.
              </p>
            </div>
            <div className="p-6 space-y-4">
              <RichTextEditor
                content={localLesson.content}
                onChange={handleContentChange}
                placeholder="Write assignment instructions here..."
              />
              <Input
                type="date"
                value={localLesson.dueDate ?? ''}
                onChange={e => setLocalLesson(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-64"
                placeholder="Due date"
              />
              <div>
                <Label>
                  <input
                    type="checkbox"
                    checked={localLesson.needsGrading ?? false}
                    onChange={e => setLocalLesson(prev => ({ ...prev, needsGrading: e.target.checked }))}
                  />
                  Needs Grading
                </Label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonEditor;
import { FC, useState, useEffect } from 'react';
import { Quiz, QuizQuestion, QuestionType } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Plus,
  Trash2,
  GripVertical,
  Settings,
  HelpCircle,
  Sparkles,
  Wand2,
  Copy,
  AlertCircle,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Modal } from '@/components/ui/modal';
import QuizPlayer from '@/components/course-player/QuizPlayer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface QuizBuilderProps {
  quiz: Quiz;
  onChange: (quiz: Quiz) => void;
  onBlur?: () => void;
}

const QuizBuilder: FC<QuizBuilderProps> = ({ quiz, onChange, onBlur }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [editingQuestions, setEditingQuestions] = useState<{ [id: string]: string }>({});
  const [editingAnswers, setEditingAnswers] = useState<{ [optionId: string]: string }>({});
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Sync local state when quiz changes (e.g., when switching questions)
  useEffect(() => {
    setEditingQuestions({});
    setEditingAnswers({});
  }, [quiz]);

  // Validation logic
  function validateQuiz(quiz: Quiz): string[] {
    const errors: string[] = [];
    if (!quiz.questions || quiz.questions.length === 0) {
      errors.push('Quiz must have at least one question.');
    }
    quiz.questions?.forEach((q, idx) => {
      if (!q.question) errors.push(`Question ${idx + 1} is missing text.`);
      if (!q.type) errors.push(`Question ${idx + 1} is missing a type.`);
      if (!q.points) errors.push(`Question ${idx + 1} must have points assigned.`);
      if (q.type === 'multiple_choice' && (!q.options || q.options.length < 2)) {
        errors.push(`Question ${idx + 1} must have at least 2 options.`);
      }
      if (q.type === 'multiple_choice' && !(q.options || []).some(opt => opt.isCorrect)) {
        errors.push(`Question ${idx + 1} must have a correct option marked.`);
      }
      if (q.type === 'true_false' && !['true', 'false'].includes(q.correctAnswer)) {
        errors.push(`Question ${idx + 1} must have a correct answer (true/false).`);
      }
      if (q.type === 'short_answer' && !q.correctAnswer) {
        errors.push(`Question ${idx + 1} must have a correct answer.`);
      }
    });
    return errors;
  }

  // Run validation on quiz change
  useEffect(() => {
    setValidationErrors(validateQuiz(quiz));
  }, [quiz]);

  const handleQuestionAdd = (type: QuestionType) => {
    const newQuestion: QuizQuestion = {
      id: `temp-${Date.now()}`,
      type,
      question: '',
      points: 1,
      options: type === 'multiple_choice' ? [
        { id: `opt-${Date.now()}-1`, text: '', isCorrect: false },
        { id: `opt-${Date.now()}-2`, text: '', isCorrect: false },
      ] : undefined,
    };

    onChange({
      ...quiz,
      questions: [...(quiz.questions ?? []), newQuestion],
    });
  };

  const handleQuestionUpdate = (questionId: string, updates: Partial<QuizQuestion>) => {
    onChange({
      ...quiz,
      questions: (quiz.questions ?? []).map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    });
  };

  const handleQuestionDelete = (questionId: string) => {
    onChange({
      ...quiz,
      questions: (quiz.questions ?? []).filter(q => q.id !== questionId),
    });
  };

  const handleQuestionDuplicate = (questionId: string) => {
    const questionToDuplicate = quiz.questions?.find(q => q.id === questionId);
    if (!questionToDuplicate) return;

    const newQuestion: QuizQuestion = {
      ...questionToDuplicate,
      id: `dup-${Date.now()}-${Math.random()}`,
    };

    onChange({
      ...quiz,
      questions: [...(quiz.questions ?? []), newQuestion],
    });
  };

  const handleOptionAdd = (questionId: string) => {
    onChange({
      ...quiz,
      questions: (quiz.questions ?? []).map(q => {
        if (q.id !== questionId || !q.options) return q;
        return {
          ...q,
          options: [
            ...q.options,
            { id: `opt-${Date.now()}`, text: '', isCorrect: false },
          ],
        };
      }),
    });
  };

  const handleOptionUpdate = (
    questionId: string,
    optionId: string,
    updates: Partial<{ id: string; text: string; isCorrect: boolean }>
  ) => {
    onChange({
      ...quiz,
      questions: (quiz.questions ?? []).map(q => {
        if (q.id !== questionId || !q.options) return q;
        return {
          ...q,
          options: q.options.map(opt =>
            opt.id === optionId ? { ...opt, ...updates } : opt
          ),
        };
      }),
    });
  };

  const handleOptionDelete = (questionId: string, optionId: string) => {
    onChange({
      ...quiz,
      questions: (quiz.questions ?? []).map(q => {
        if (q.id !== questionId || !q.options) return q;
        return {
          ...q,
          options: q.options.filter(opt => opt.id !== optionId),
        };
      }),
    });
  };

  // AI-powered question generation
  const handleAIQuestionGeneration = async (questionType: QuestionType) => {
    if (!quiz.title && !quiz.description) {
      toast.error('Please add a quiz title or description first to generate AI questions');
      return;
    }

    setIsGeneratingQuestions(true);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'quiz',
          input: `Quiz Title: ${quiz.title}\nDescription: ${quiz.description || ''}`,
          questionCount: 3,
          questionType: questionType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate questions');
      }

      const result = await response.json();
      
      if (result.content && result.content.questions) {
        // Add the generated questions to the existing quiz
        const newQuestions = result.content.questions.map((q: any) => ({
          ...q,
          id: `ai-${Date.now()}-${Math.random()}`,
        }));

        onChange({
          ...quiz,
          questions: [...(quiz.questions ?? []), ...newQuestions],
        });

        toast.success(`${newQuestions.length} AI questions added successfully!`);
      }
      
    } catch (error: any) {
      console.error('AI question generation error:', error);
      toast.error(error.message || 'Failed to generate questions. Please try again.');
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  function cleanQuiz(quiz: Quiz): Quiz {
    return {
      ...quiz,
      questions: (quiz.questions ?? [])
        .filter(q => q.question && q.options && q.options.length > 0)
        .map(q => ({
          ...q,
          options: q.options.filter(a => a.text),
        })),
    };
  }

  const handleQuizChange = (updatedQuiz: Quiz, validate: boolean = false) => {
    if (validate && validationErrors.length > 0) {
      toast.error('Please fix validation errors before saving or publishing.');
      return;
    }
    onChange(updatedQuiz);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Input
            value={quiz.title ?? ''}
            onChange={(e) => handleQuizChange({ ...quiz, title: e.target.value }, false)}
            onBlur={() => handleQuizChange(quiz, true)}
            placeholder="Quiz Title"
            className="text-xl font-semibold border-[#4ECDC4]/30 focus:border-[#4ECDC4] text-[#2C3E50]"
          />
          <Textarea
            value={quiz.description ?? ''}
            onChange={e => onChange({ ...quiz, description: e.target.value })}
            onBlur={onBlur}
            placeholder="Quiz Description (optional)"
            className="resize-none border-[#4ECDC4]/30 focus:border-[#4ECDC4] text-[#2C3E50]"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowSettings(!showSettings)}
          className="border-[#4ECDC4]/30 hover:border-[#4ECDC4] text-[#2C3E50]"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {showSettings && (
        <Card className="border-2 border-transparent bg-gradient-to-r from-[#FF6B35]/10 to-[#4ECDC4]/10 shadow-sm">
          <CardHeader className="pb-3 bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5 rounded-t-lg">
            <CardTitle className="text-[#2C3E50] font-bold flex items-center gap-2">
              Quiz Settings
              <span className="text-xs font-normal text-[#6E6C75]">(Configure how this quiz behaves for students)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[#2C3E50] flex items-center gap-1">
                  Time Limit (minutes)
                  <span title="Set a time limit for the quiz. Leave blank for no limit." className="text-[#4ECDC4] cursor-help">?</span>
                </Label>
                <Input
                  type="number"
                  value={quiz.timeLimit ?? ''}
                  onChange={(e) => handleQuizChange({
                    ...quiz,
                    timeLimit: e.target.value ? parseInt(e.target.value) : undefined,
                  }, false)}
                  onBlur={() => handleQuizChange(quiz, true)}
                  placeholder="No time limit"
                  className="border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
                  min="0"
                />
                <span className="text-xs text-[#6E6C75]">Leave blank for untimed quiz.</span>
              </div>
              <div className="space-y-2">
                <Label className="text-[#2C3E50] flex items-center gap-1">
                  Passing Score (%)
                  <span title="Minimum score required to pass the quiz." className="text-[#4ECDC4] cursor-help">?</span>
                </Label>
                <Input
                  type="number"
                  value={quiz.passingScore ?? ''}
                  onChange={(e) => handleQuizChange({
                    ...quiz,
                    passingScore: e.target.value ? parseInt(e.target.value) : undefined,
                  }, false)}
                  onBlur={() => handleQuizChange(quiz, true)}
                  min="0"
                  max="100"
                  className="border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
                />
                <span className="text-xs text-[#6E6C75]">Students must score at least this percent to pass.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label className="text-[#2C3E50] flex items-center gap-1">
                  Attempts Allowed
                  <span title="How many times can a student attempt this quiz?" className="text-[#4ECDC4] cursor-help">?</span>
                </Label>
              <Input
                type="number"
                value={quiz.attemptsAllowed ?? ''}
                onChange={(e) => handleQuizChange({
                  ...quiz,
                  attemptsAllowed: e.target.value ? parseInt(e.target.value) : undefined,
                }, false)}
                onBlur={() => handleQuizChange(quiz, true)}
                min="1"
                className="border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
              />
                <span className="text-xs text-[#6E6C75]">Default is based on question type, but you can override.</span>
              </div>
              <div className="space-y-2">
                <Label className="text-[#2C3E50] flex items-center gap-1">
                  Availability (optional)
                  <span title="Set when the quiz is available to students." className="text-[#4ECDC4] cursor-help">?</span>
                </Label>
                <div className="flex gap-2">
                  <Input type="datetime-local" className="border-[#4ECDC4]/30 focus:border-[#4ECDC4]" />
                  <span className="text-[#6E6C75]">to</span>
                  <Input type="datetime-local" className="border-[#4ECDC4]/30 focus:border-[#4ECDC4]" />
                </div>
                <span className="text-xs text-[#6E6C75]">Leave blank for always available.</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[#2C3E50] flex items-center gap-1">
                  Shuffle Questions
                  <span title="Randomize the order of questions for each student." className="text-[#4ECDC4] cursor-help">?</span>
                </Label>
                <Switch
                  checked={quiz.shuffleQuestions}
                  onCheckedChange={(checked) => handleQuizChange({
                    ...quiz,
                    shuffleQuestions: checked,
                  }, false)}
                  onBlur={() => handleQuizChange(quiz, true)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[#2C3E50] flex items-center gap-1">
                  Show Correct Answers
                  <span title="Show students the correct answers after they submit." className="text-[#4ECDC4] cursor-help">?</span>
                </Label>
                <Switch
                  checked={quiz.showCorrectAnswers}
                  onCheckedChange={(checked) => handleQuizChange({
                    ...quiz,
                    showCorrectAnswers: checked,
                  }, false)}
                  onBlur={() => handleQuizChange(quiz, true)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[#2C3E50] flex items-center gap-1">
                  Show Explanations
                  <span title="Show explanations for answers after submission." className="text-[#4ECDC4] cursor-help">?</span>
                </Label>
                <Switch
                  checked={quiz.showExplanations}
                  onCheckedChange={(checked) => handleQuizChange({
                    ...quiz,
                    showExplanations: checked,
                  }, false)}
                  onBlur={() => handleQuizChange(quiz, true)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="outline"
          className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4]/10"
          onClick={() => setShowPreview(true)}
        >
          Preview Quiz
        </Button>
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="bg-[#FF6B35]/10 border-[#FF6B35] text-[#FF6B35]">
            <AlertCircle className="w-4 h-4 mr-2" />
            <AlertDescription>
              <ul>
                {validationErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#2C3E50]">Questions</h3>
          <div className="flex items-center space-x-2">
            {/* AI Question Generation */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleAIQuestionGeneration('multiple_choice')}
                disabled={isGeneratingQuestions}
                variant="outline"
                size="sm"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                {isGeneratingQuestions ? (
                  <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                AI Questions
              </Button>
            </div>
            
            <Select
              value=""
              onValueChange={(value: QuestionType) => handleQuestionAdd(value)}
            >
              <SelectTrigger className="w-[180px] border-[#4ECDC4]/30">
                <SelectValue placeholder="Add Question" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                <SelectItem value="true_false">True/False</SelectItem>
                <SelectItem value="short_answer">Short Answer</SelectItem>
                <SelectItem value="matching">Matching</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DragDropContext
          onDragEnd={(result) => {
            if (!result.destination) return;
            const items = Array.from(quiz.questions ?? []);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);
            handleQuizChange({ ...quiz, questions: items }, true);
          }}
        >
          <Droppable droppableId="questions">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {(quiz.questions ?? []).map((question, index) => (
                  <Draggable
                    key={question.id}
                    draggableId={question.id}
                    index={index}
                  >
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="border-[#E5E8E8] transition-all duration-200 ease-in-out animate-fadeIn"
                        tabIndex={0}
                        aria-label={`Question ${index + 1}`}
                      >
                        <CardContent className="pt-6 space-y-4">
                          <div className="flex items-start justify-between">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab p-2 -m-2"
                              aria-label="Drag to reorder"
                            >
                              <GripVertical className="h-4 w-4 text-[#2C3E50]/40" aria-hidden="true" />
                            </div>
                            <div className="flex-1 space-y-4">
                              <div className="space-y-2">
                                <Label className="text-[#2C3E50] font-semibold" htmlFor={`question-${question.id}`}>
                                  Question {index + 1}
                                </Label>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-[#FF6B35] hover:bg-[#FF6B35]/10 focus:ring-2 focus:ring-[#4ECDC4]"
                                    onClick={() => handleQuestionDelete(question.id)}
                                    title="Delete this question"
                                    aria-label="Delete this question"
                                  >
                                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-[#4ECDC4] hover:bg-[#4ECDC4]/10 focus:ring-2 focus:ring-[#4ECDC4]"
                                    onClick={() => handleQuestionDuplicate(question.id)}
                                    title="Duplicate this question"
                                    aria-label="Duplicate this question"
                                  >
                                    <Copy className="w-4 h-4" aria-hidden="true" />
                                  </Button>
                                </div>
                                <Input
                                  id={`question-${question.id}`}
                                  value={editingQuestions[question.id] ?? question.question ?? ''}
                                  onChange={e => {
                                    const value = e.target.value;
                                    setEditingQuestions(prev => ({ ...prev, [question.id]: value }));
                                    handleQuestionUpdate(question.id, { question: value });
                                  }}
                                  onBlur={() => {
                                    handleQuestionUpdate(question.id, { question: editingQuestions[question.id] ?? question.question });
                                    setEditingQuestions(prev => {
                                      const { [question.id]: _, ...rest } = prev;
                                      return rest;
                                    });
                                    if (onBlur) onBlur();
                                  }}
                                  placeholder="Enter your question here"
                                  className="border-[#4ECDC4]/30 focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]"
                                  aria-required="true"
                                />
                                <span className="text-xs text-[#6E6C75]">Be clear and concise. You can use images or math if needed.</span>
                              </div>
                              <div className="flex items-center gap-2">
                                  <Select
                                    value={question.type}
                                    onValueChange={(value: QuestionType) =>
                                      handleQuestionUpdate(question.id, { type: value })
                                    }
                                  >
                                    <SelectTrigger className="w-[180px] border-[#4ECDC4]/30">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                    <SelectItem value="true_false">True/False</SelectItem>
                                    <SelectItem value="short_answer">Short Answer</SelectItem>
                                    <SelectItem value="matching">Matching</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Input
                                    type="number"
                                    value={question.points ?? 1}
                                    onChange={(e) => handleQuestionUpdate(
                                      question.id,
                                      { points: parseInt(e.target.value) }
                                    )}
                                    onBlur={onBlur}
                                    min="1"
                                    className="w-20 border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
                                  placeholder="Points"
                                  />
                                <span className="text-xs text-[#6E6C75]">Points</span>
                              </div>
                              {/* Multiple Choice/True-False/Short Answer UI */}
                              {question.type === 'multiple_choice' && (
                                <div className="space-y-2">
                                  {(question.options || []).map((option, optionIndex) => (
                                    <div key={option.id} className="flex items-center gap-2">
                                      <Input
                                        value={editingAnswers[option.id] ?? option.text ?? ''}
                                        onChange={e => {
                                          const value = e.target.value;
                                          setEditingAnswers(prev => ({ ...prev, [option.id]: value }));
                                          handleOptionUpdate(question.id, option.id, { text: value });
                                        }}
                                        onBlur={() => {
                                          handleOptionUpdate(question.id, option.id, { text: editingAnswers[option.id] ?? option.text });
                                          setEditingAnswers(prev => {
                                            const { [option.id]: _, ...rest } = prev;
                                            return rest;
                                          });
                                          if (onBlur) onBlur();
                                        }}
                                        placeholder={`Option ${optionIndex + 1}`}
                                        className="border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
                                      />
                                      <input
                                        type="radio"
                                        checked={option.isCorrect}
                                        onChange={() => handleOptionUpdate(question.id, option.id, { isCorrect: true })}
                                        name={`correct-${question.id}`}
                                        className="accent-[#FF6B35]"
                                        title="Mark as correct"
                                      />
                                      <span className="text-xs text-[#6E6C75]">Correct</span>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="text-[#FF6B35] hover:bg-[#FF6B35]/10"
                                        onClick={() => handleOptionDelete(question.id, option.id)}
                                        title="Delete this option"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4]/10"
                                    onClick={() => handleOptionAdd(question.id)}
                                  >
                                    Add Option
                                  </Button>
                                </div>
                              )}
                              {question.type === 'true_false' && (
                                <div className="flex gap-4">
                                  <label className="flex items-center gap-1">
                                    <input
                                      type="radio"
                                      checked={question.correctAnswer === 'true'}
                                      onChange={() => handleQuestionUpdate(question.id, { correctAnswer: 'true' })}
                                      name={`tf-${question.id}`}
                                      className="accent-[#FF6B35]"
                                    />
                                    True
                                  </label>
                                  <label className="flex items-center gap-1">
                                    <input
                                      type="radio"
                                      checked={question.correctAnswer === 'false'}
                                      onChange={() => handleQuestionUpdate(question.id, { correctAnswer: 'false' })}
                                      name={`tf-${question.id}`}
                                      className="accent-[#FF6B35]"
                                    />
                                          False
                                  </label>
                                </div>
                              )}
                              {question.type === 'short_answer' && (
                                  <Input
                                    value={question.correctAnswer ?? ''}
                                  onChange={e => handleQuestionUpdate(question.id, { correctAnswer: e.target.value })}
                                  placeholder="Correct answer"
                                    className="border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
                                  />
                              )}
                              {/* Explanation Field */}
                              <div className="space-y-1">
                                <Label className="text-[#2C3E50]">Explanation (optional)</Label>
                                <Textarea
                                  value={question.explanation ?? ''}
                                  onChange={e => handleQuestionUpdate(question.id, { explanation: e.target.value })}
                                  placeholder="Explain the answer for students (shown after submission)"
                                  className="border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
                                  rows={2}
                                />
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleQuestionDelete(question.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quiz Preview</DialogTitle>
            <DialogDescription>
              This is how students will see your quiz.
            </DialogDescription>
          </DialogHeader>
          <QuizPlayer quiz={quiz} onComplete={() => setShowPreview(false)} previewMode />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizBuilder;
import { FC, useState } from 'react';
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
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'sonner';

interface QuizBuilderProps {
  quiz: Quiz;
  onChange: (quiz: Quiz) => void;
}

const QuizBuilder: FC<QuizBuilderProps> = ({ quiz, onChange }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

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
      questions: [...quiz.questions, newQuestion],
    });
  };

  const handleQuestionUpdate = (questionId: string, updates: Partial<QuizQuestion>) => {
    onChange({
      ...quiz,
      questions: quiz.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    });
  };

  const handleQuestionDelete = (questionId: string) => {
    onChange({
      ...quiz,
      questions: quiz.questions.filter(q => q.id !== questionId),
    });
  };

  const handleOptionAdd = (questionId: string) => {
    onChange({
      ...quiz,
      questions: quiz.questions.map(q => {
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
      questions: quiz.questions.map(q => {
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
          questions: [...quiz.questions, ...newQuestions],
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Input
            value={quiz.title}
            onChange={(e) => onChange({ ...quiz, title: e.target.value })}
            placeholder="Quiz Title"
            className="text-xl font-semibold border-[#4ECDC4]/30 focus:border-[#4ECDC4] text-[#2C3E50]"
          />
          <Textarea
            value={quiz.description || ''}
            onChange={(e) => onChange({ ...quiz, description: e.target.value })}
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
        <Card className="border-[#E5E8E8] shadow-sm">
          <CardHeader className="pb-3 bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5">
            <CardTitle className="text-[#2C3E50]">Quiz Settings</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#2C3E50]">Time Limit (minutes)</Label>
                <Input
                  type="number"
                  value={quiz.timeLimit || ''}
                  onChange={(e) => onChange({
                    ...quiz,
                    timeLimit: e.target.value ? parseInt(e.target.value) : undefined,
                  })}
                  placeholder="No time limit"
                  className="border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#2C3E50]">Passing Score (%)</Label>
                <Input
                  type="number"
                  value={quiz.passingScore}
                  onChange={(e) => onChange({
                    ...quiz,
                    passingScore: parseInt(e.target.value),
                  })}
                  min="0"
                  max="100"
                  className="border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[#2C3E50]">Attempts Allowed</Label>
              <Input
                type="number"
                value={quiz.attemptsAllowed}
                onChange={(e) => onChange({
                  ...quiz,
                  attemptsAllowed: parseInt(e.target.value),
                })}
                min="1"
                className="border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[#2C3E50]">Shuffle Questions</Label>
                <Switch
                  checked={quiz.shuffleQuestions}
                  onCheckedChange={(checked) => onChange({
                    ...quiz,
                    shuffleQuestions: checked,
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[#2C3E50]">Show Correct Answers</Label>
                <Switch
                  checked={quiz.showCorrectAnswers}
                  onCheckedChange={(checked) => onChange({
                    ...quiz,
                    showCorrectAnswers: checked,
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[#2C3E50]">Show Explanations</Label>
                <Switch
                  checked={quiz.showExplanations}
                  onCheckedChange={(checked) => onChange({
                    ...quiz,
                    showExplanations: checked,
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
            const items = Array.from(quiz.questions);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);
            onChange({ ...quiz, questions: items });
          }}
        >
          <Droppable droppableId="questions">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {quiz.questions.map((question, index) => (
                  <Draggable
                    key={question.id}
                    draggableId={question.id}
                    index={index}
                  >
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="border-[#E5E8E8]"
                      >
                        <CardContent className="pt-6 space-y-4">
                          <div className="flex items-start justify-between">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab p-2 -m-2"
                            >
                              <GripVertical className="h-4 w-4 text-[#2C3E50]/40" />
                            </div>
                            <div className="flex-1 space-y-4">
                              <div className="space-y-2">
                                <Input
                                  value={question.question}
                                  onChange={(e) => handleQuestionUpdate(
                                    question.id,
                                    { question: e.target.value }
                                  )}
                                  placeholder="Question"
                                  className="border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
                                />
                                <div className="flex items-center space-x-2">
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
                                      <SelectItem value="multiple_choice">
                                        Multiple Choice
                                      </SelectItem>
                                      <SelectItem value="true_false">
                                        True/False
                                      </SelectItem>
                                      <SelectItem value="short_answer">
                                        Short Answer
                                      </SelectItem>
                                      <SelectItem value="matching">
                                        Matching
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Input
                                    type="number"
                                    value={question.points}
                                    onChange={(e) => handleQuestionUpdate(
                                      question.id,
                                      { points: parseInt(e.target.value) }
                                    )}
                                    min="1"
                                    className="w-20 border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
                                  />
                                </div>
                              </div>

                              {question.type === 'multiple_choice' && (
                                <div className="space-y-2">
                                  {question.options?.map((option, optionIndex) => (
                                    <div
                                      key={option.id}
                                      className="flex items-center space-x-2"
                                    >
                                      <Input
                                        value={option.text}
                                        onChange={(e) => handleOptionUpdate(
                                          question.id,
                                          option.id,
                                          { text: e.target.value }
                                        )}
                                        placeholder={`Option ${optionIndex + 1}`}
                                        className="border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
                                      />
                                      <Switch
                                        checked={option.isCorrect}
                                        onCheckedChange={(checked) =>
                                          handleOptionUpdate(
                                            question.id,
                                            option.id,
                                            { isCorrect: checked }
                                          )
                                        }
                                      />
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                          const newOptions = question.options?.filter(
                                            (opt) => opt.id !== option.id
                                          );
                                          handleQuestionUpdate(question.id, {
                                            options: newOptions,
                                          });
                                        }}
                                        className="text-red-500 hover:text-red-600"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOptionAdd(question.id)}
                                    className="border-[#4ECDC4]/30 text-[#4ECDC4]"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Option
                                  </Button>
                                </div>
                              )}

                              {question.type === 'true_false' && (
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroup
                                      value={question.correctAnswer}
                                      onValueChange={(value) =>
                                        handleQuestionUpdate(question.id, {
                                          correctAnswer: value,
                                        })
                                      }
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value="true"
                                          id={`${question.id}-true`}
                                          className="border-[#4ECDC4] text-[#4ECDC4]"
                                        />
                                        <Label
                                          htmlFor={`${question.id}-true`}
                                          className="text-[#2C3E50]"
                                        >
                                          True
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value="false"
                                          id={`${question.id}-false`}
                                          className="border-[#4ECDC4] text-[#4ECDC4]"
                                        />
                                        <Label
                                          htmlFor={`${question.id}-false`}
                                          className="text-[#2C3E50]"
                                        >
                                          False
                                        </Label>
                                      </div>
                                    </RadioGroup>
                                  </div>
                                </div>
                              )}

                              {question.type === 'short_answer' && (
                                <div className="space-y-2">
                                  <Input
                                    value={question.correctAnswer || ''}
                                    onChange={(e) => handleQuestionUpdate(
                                      question.id,
                                      { correctAnswer: e.target.value }
                                    )}
                                    placeholder="Correct Answer"
                                    className="border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
                                  />
                                </div>
                              )}

                              <div className="space-y-2">
                                <Textarea
                                  value={question.explanation || ''}
                                  onChange={(e) => handleQuestionUpdate(
                                    question.id,
                                    { explanation: e.target.value }
                                  )}
                                  placeholder="Explanation (optional)"
                                  className="resize-none border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
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
    </div>
  );
};

export default QuizBuilder;
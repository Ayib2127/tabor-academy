"use client";

import { FC, useState, useEffect } from 'react';
import { Quiz, QuizQuestion } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (results: QuizResults) => void;
  onExit?: () => void;
  forceShowResults?: boolean;
  forcedResults?: QuizResults;
}

interface QuizResults {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  answers: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }[];
}

const QuizPlayer: FC<QuizPlayerProps> = ({
  quiz,
  onComplete,
  onExit,
  forceShowResults = false,
  forcedResults = null,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(
    quiz.timeLimit ? quiz.timeLimit * 60 : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<QuizResults | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const [maxAttempts, setMaxAttempts] = useState<number | null>(null);

  // --- Fetch attempts and maxAttempts on mount ---
  useEffect(() => {
    // You may need to fetch attempts/maxAttempts from props, context, or API
    // For now, try to get from quiz object or localStorage
    setMaxAttempts(quiz.attemptsAllowed ?? null);
    const savedAttempts = localStorage.getItem(`quiz-attempts-${quiz.id}`);
    setAttempts(savedAttempts ? parseInt(savedAttempts, 10) : 0);
  }, [quiz.id, quiz.attemptsAllowed]);

  // --- Only show results if user is out of attempts ---
  useEffect(() => {
    if (maxAttempts !== null && attempts >= maxAttempts) {
      const saved = localStorage.getItem(`quiz-results-${quiz.id}`);
      if (saved) {
        setResults(JSON.parse(saved));
        setShowResults(true);
      }
    } else {
      setShowResults(false);
      setResults(null);
      setAnswers({});
      setCurrentQuestionIndex(0);
    }
  }, [quiz.id, attempts, maxAttempts]);

  // --- Support forced results mode ---
  useEffect(() => {
    if (forceShowResults && forcedResults) {
      setResults(forcedResults);
      setShowResults(true);
    }
  }, [forceShowResults, forcedResults]);

  // Timer effect
  useEffect(() => {
    if (!timeLeft || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResults]);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleAnswerChange = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResults = (): QuizResults => {
    const correctAnswers = quiz.questions.filter((question) => {
      const userAnswer = answers[question.id];
      if (!userAnswer) return false;

      switch (question.type) {
        case 'multiple_choice':
          return question.options?.find(
            (opt) => opt.id === userAnswer
          )?.isCorrect;
        case 'true_false':
          return userAnswer === question.correctAnswer;
        case 'short_answer':
          return userAnswer.toLowerCase() === question.correctAnswer?.toLowerCase();
        default:
          return false;
      }
    }).length;

    const score = (correctAnswers / quiz.questions.length) * 100;

    return {
      score,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      timeSpent: quiz.timeLimit ? quiz.timeLimit * 60 - (timeLeft || 0) : 0,
      answers: quiz.questions.map((question) => ({
        questionId: question.id,
        userAnswer: answers[question.id] || '',
        isCorrect: (() => {
          const userAnswer = answers[question.id];
          if (!userAnswer) return false;

          switch (question.type) {
            case 'multiple_choice':
              return question.options?.find(
                (opt) => opt.id === userAnswer
              )?.isCorrect ?? false;
            case 'true_false':
              return userAnswer === question.correctAnswer;
            case 'short_answer':
              return userAnswer.toLowerCase() === question.correctAnswer?.toLowerCase();
            default:
              return false;
          }
        })(),
      })),
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const results = calculateResults();
      setResults(results);
      setShowResults(true);
      localStorage.setItem(`quiz-results-${quiz.id}`, JSON.stringify(results)); // Save results
      // Increment attempts
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem(`quiz-attempts-${quiz.id}`, newAttempts.toString());
      onComplete(results);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {!showResults ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#2C3E50]">{quiz.title}</h2>
            {timeLeft !== null && (
              <div className="flex items-center space-x-2 text-[#2C3E50]">
                <Clock className="h-5 w-5 text-[#FF6B35]" />
                <span className="font-medium">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
          </div>

          <Progress
            value={(currentQuestionIndex + 1) / quiz.questions.length * 100}
            className="h-2 bg-[#E5E8E8]"
          />

          <Card className="border-[#E5E8E8] shadow-sm">
            <CardHeader className="pb-3 bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5">
              <CardTitle className="text-[#2C3E50]">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
                <span className="text-sm font-normal ml-2 text-[#2C3E50]/60">
                  {currentQuestion.points} points
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-lg text-[#2C3E50]">{currentQuestion.question}</p>

              {currentQuestion.type === 'multiple_choice' && (
                <RadioGroup
                  value={answers[currentQuestion.id] || ''}
                  onValueChange={handleAnswerChange}
                  className="space-y-2"
                >
                  {currentQuestion.options?.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option.id} 
                        id={option.id}
                        className="border-[#4ECDC4] text-[#4ECDC4]"
                      />
                      <Label htmlFor={option.id} className="text-[#2C3E50]">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.type === 'true_false' && (
                <RadioGroup
                  value={answers[currentQuestion.id] || ''}
                  onValueChange={handleAnswerChange}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="true" 
                      id="true"
                      className="border-[#4ECDC4] text-[#4ECDC4]"
                    />
                    <Label htmlFor="true" className="text-[#2C3E50]">True</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="false" 
                      id="false"
                      className="border-[#4ECDC4] text-[#4ECDC4]"
                    />
                    <Label htmlFor="false" className="text-[#2C3E50]">False</Label>
                  </div>
                </RadioGroup>
              )}

              {currentQuestion.type === 'short_answer' && (
                <Input
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Enter your answer"
                  className="border-[#4ECDC4]/30 focus:border-[#4ECDC4]"
                />
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="border-[#4ECDC4]/30 hover:border-[#4ECDC4] text-[#2C3E50]"
            >
              Previous
            </Button>
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
              >
                Next
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <Card className="border-[#E5E8E8] shadow-sm">
            <CardHeader className="pb-3 bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5">
              <CardTitle className="text-[#2C3E50]">Quiz Results</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-[#2C3E50]/60">Score</p>
                  <p className="text-2xl font-bold text-[#2C3E50]">
                    {results.score.toFixed(1)}%
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-[#2C3E50]/60">Correct Answers</p>
                  <p className="text-2xl font-bold text-[#2C3E50]">
                    {results.correctAnswers} / {results.totalQuestions}
                  </p>
                </div>
                {quiz.timeLimit && (
                  <div className="space-y-2">
                    <p className="text-sm text-[#2C3E50]/60">Time Spent</p>
                    <p className="text-2xl font-bold text-[#2C3E50]">
                      {Math.floor(results.timeSpent / 60)}m {results.timeSpent % 60}s
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-[#2C3E50]">Question Review</h3>
                {quiz.questions.map((question, index) => {
                  const answer = results.answers[index];
                  return (
                    <Card key={question.id} className="border-[#E5E8E8]">
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-[#2C3E50]">Question {index + 1}</p>
                            {answer.isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-[#4ECDC4]" />
                            ) : (
                              <XCircle className="h-5 w-5 text-[#FF6B35]" />
                            )}
                          </div>
                          <p className="text-[#2C3E50]">{question.question}</p>
                          {quiz.showCorrectAnswers && (
                            <div className="space-y-1">
                              <p className="text-sm text-[#2C3E50]/60">
                                Your answer: {answer.userAnswer || 'Not answered'}
                              </p>
                              <p className="text-sm text-[#2C3E50]/60">
                                Correct answer: {question.correctAnswer}
                              </p>
                            </div>
                          )}
                          {quiz.showExplanations && question.explanation && (
                            <Alert className="bg-[#4ECDC4]/5 border-[#4ECDC4]/20">
                              <AlertCircle className="h-4 w-4 text-[#4ECDC4]" />
                              <AlertDescription className="text-[#2C3E50]">
                                {question.explanation}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default QuizPlayer; 
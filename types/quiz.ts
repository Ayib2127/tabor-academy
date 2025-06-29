export interface Lesson {
  id: string;
  title: string;
  content?: string;
  type: 'video' | 'text' | 'quiz';
  duration?: number;
  order: number;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  status: 'draft' | 'pending_review' | 'published';
  modules: Module[];
  created_at: string;
  updated_at: string;
  thumbnail_url?: string;
  price: number;
  level: string;
  users?: {
    full_name: string;
    avatar_url: string;
  } | null;
}

export type CourseChangeType = 
  | 'minor'  // Doesn't require re-approval
  | 'major'; // Requires re-approval

export interface CourseChange {
  type: CourseChangeType;
  field: string;
  oldValue: any;
  newValue: any;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'matching';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: QuizOption[];
  correctAnswer?: string;
  points: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  passingScore: number;
  attemptsAllowed: number;
  shuffleQuestions: boolean;
  showCorrectAnswers: boolean;
  showExplanations: boolean;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[]; // string for single answers, string[] for multiple choice
}

export interface QuizResults {
  score: number;
  answers: QuizAnswer[];
  timeSpent: number; // in seconds
}
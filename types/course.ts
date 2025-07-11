export interface Lesson {
  id: string;
  title: string;
  content?: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration?: number;
  order: number;
  dueDate?: string;
  needsGrading?: boolean;
  is_published: boolean;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  order: number;
}

export interface SuccessStory {
  name: string;
  photo: string;
  outcome: string;
  story: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Instructor {
  name: string;
  photo: string;
  title: string;
  bio: string;
  rating: number;
  students: number;
  courses: number;
  expertise: string[];
}

export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  language?: string;
  subtitles?: string[];
  videoHours?: number;
  resources?: number;
  certificate?: boolean;
  community?: boolean;
  lifetimeAccess?: boolean;
  instructor_id: string;
  status: 'draft' | 'pending_review' | 'published';
  modules: Module[];
  created_at: string;
  updated_at: string;
  deliveryType: 'self_paced' | 'cohort';
  learningOutcomes: string[];
  requirements: string[];
  successStories: SuccessStory[];
  faq: FAQ[];
  instructor: Instructor;
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
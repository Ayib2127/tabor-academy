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
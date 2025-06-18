export type Database = {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          instructor_id: string;
          created_at: string;
          updated_at: string;
          is_published: boolean;
          price: number;
          level: string;
          thumbnail_url: string | null;
        };
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          enrolled_at: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          content: string;
          position: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          completed: boolean;
          last_accessed: string;
        };
      };
    };
  };
}; 
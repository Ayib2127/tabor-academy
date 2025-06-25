-- This script updates the database schema to reflect the application's module-lesson structure and category handling.

-- Drop existing policies that might conflict with table alterations or drops
DROP POLICY IF EXISTS "Anyone can view published lessons" ON lessons;
DROP POLICY IF EXISTS "Instructors can manage their own lessons" ON lessons;
DROP POLICY IF EXISTS "Instructors can manage course categories" ON course_categories;

-- Drop the course_categories table first as it depends on categories and courses
DROP TABLE IF EXISTS course_categories CASCADE;

-- Drop the existing lessons table to recreate it with module_id and type
DROP TABLE IF EXISTS lessons CASCADE;

-- Add category column to courses table
ALTER TABLE courses ADD COLUMN category TEXT;

-- Create course_modules table
CREATE TABLE IF NOT EXISTS course_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  position integer, -- Add a position for ordering modules
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create module_lessons table (formerly lessons)
CREATE TABLE IF NOT EXISTS module_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES course_modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  content text,
  video_url text,
  duration integer,
  position integer NOT NULL,
  is_published boolean DEFAULT false,
  type text NOT NULL DEFAULT 'text', -- Added 'type' column with a default
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Re-enable Row Level Security for tables that were dropped/recreated, and for new table
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_lessons ENABLE ROW LEVEL SECURITY;

-- Recreate policies for lessons (now module_lessons) and course_modules
-- You might need to adjust these policies based on your specific security requirements
CREATE POLICY "Anyone can view published module lessons"
  ON module_lessons FOR SELECT
  USING (
    is_published = true AND
    EXISTS (
      SELECT 1 FROM course_modules cm
      JOIN courses c ON cm.course_id = c.id
      WHERE cm.id = module_lessons.module_id AND c.is_published = true
    )
  );

CREATE POLICY "Instructors can manage their own module lessons"
  ON module_lessons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM course_modules cm
      JOIN courses c ON cm.course_id = c.id
      WHERE cm.id = module_lessons.module_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can manage their own course modules"
  ON course_modules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_modules.course_id AND courses.instructor_id = auth.uid()
    )
  );
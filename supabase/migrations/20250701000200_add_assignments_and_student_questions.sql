/*
  # Create assignments and questions tables

  1. New Tables
    - `assignments`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key to courses)
      - `instructor_id` (uuid, foreign key to users)
      - `title` (text)
      - `description` (text)
      - `due_date` (timestamp)
      - `graded` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `student_questions`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key to courses)
      - `lesson_id` (uuid, foreign key to module_lessons)
      - `student_id` (uuid, foreign key to users)
      - `course_instructor_id` (uuid, foreign key to users)
      - `question` (text)
      - `answer` (text)
      - `answered` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on both tables
    - Add appropriate policies
*/

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date timestamptz,
  graded boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Policy for instructors to manage their assignments
DROP POLICY IF EXISTS "Instructors can manage their assignments" ON assignments;
CREATE POLICY "Instructors can manage their assignments"
  ON assignments
  FOR ALL
  TO authenticated
  USING (auth.uid() = instructor_id);

-- Policy for students to read assignments for enrolled courses
DROP POLICY IF EXISTS "Students can read assignments for enrolled courses" ON assignments;
CREATE POLICY "Students can read assignments for enrolled courses"
  ON assignments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.course_id = assignments.course_id
      AND enrollments.user_id = auth.uid()
    )
  );

-- Student questions table
CREATE TABLE IF NOT EXISTS student_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES module_lessons(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_instructor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text,
  answered boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE student_questions ENABLE ROW LEVEL SECURITY;

-- Policy for instructors to manage questions for their courses
DROP POLICY IF EXISTS "Instructors can manage questions for their courses" ON student_questions;
CREATE POLICY "Instructors can manage questions for their courses"
  ON student_questions
  FOR ALL
  TO authenticated
  USING (auth.uid() = course_instructor_id);

-- Policy for students to manage their own questions
DROP POLICY IF EXISTS "Students can manage their own questions" ON student_questions;
CREATE POLICY "Students can manage their own questions"
  ON student_questions
  FOR ALL
  TO authenticated
  USING (auth.uid() = student_id);

-- Drop the function if it exists
DROP FUNCTION IF EXISTS get_course_average_completion_rate(uuid);

-- Now create the function
CREATE OR REPLACE FUNCTION get_course_average_completion_rate(p_course_id uuid)
RETURNS float AS $$
DECLARE
  total_students integer;
  total_lessons integer;
  total_completed integer;
  avg_completion float;
BEGIN
  -- Get total enrolled students
  SELECT COUNT(*) INTO total_students
  FROM enrollments
  WHERE course_id = p_course_id;
  
  -- If no students, return 0
  IF total_students = 0 THEN
    RETURN 0;
  END IF;
  
  -- Get total lessons
  SELECT COUNT(*) INTO total_lessons
  FROM module_lessons ml
  JOIN course_modules cm ON ml.module_id = cm.id
  WHERE cm.course_id = p_course_id
  AND ml.is_published = true;
  
  -- If no lessons, return 0
  IF total_lessons = 0 THEN
    RETURN 0;
  END IF;
  
  -- Get total completed lessons
  SELECT COUNT(*) INTO total_completed
  FROM progress
  WHERE course_id = p_course_id
  AND completed = true;
  
  -- Calculate average completion rate
  avg_completion := (total_completed::float / (total_students * total_lessons)) * 100;
  
  RETURN ROUND(avg_completion::numeric, 1);
END;
$$ LANGUAGE plpgsql; 
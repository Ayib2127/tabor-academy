/*
  # Add lesson_id to assignments table

  This migration adds a lesson_id column to the assignments table to properly link
  assignments to their corresponding lessons in the module_lessons table.

  1. Add lesson_id column to assignments table
  2. Add foreign key constraint to module_lessons table
  3. Update RLS policies to include lesson-based access
*/

-- Add lesson_id column to assignments table
ALTER TABLE assignments 
ADD COLUMN IF NOT EXISTS lesson_id uuid REFERENCES module_lessons(id) ON DELETE CASCADE;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_assignments_lesson_id ON assignments(lesson_id);

-- Update RLS policy to include lesson-based access
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

-- Add policy for lesson-based access
DROP POLICY IF EXISTS "Students can read assignments for specific lessons" ON assignments;
CREATE POLICY "Students can read assignments for specific lessons"
  ON assignments
  FOR SELECT
  TO authenticated
  USING (
    lesson_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM module_lessons ml
      JOIN course_modules cm ON ml.module_id = cm.id
      JOIN enrollments e ON cm.course_id = e.course_id
      WHERE ml.id = assignments.lesson_id
      AND e.user_id = auth.uid()
    )
  );

-- Add helpful comment
COMMENT ON COLUMN assignments.lesson_id IS 'References the specific lesson this assignment is associated with in module_lessons table'; 
-- Simple script to add lesson_id to assignments table
-- This bypasses the migration conflicts

-- Add lesson_id column to assignments table
ALTER TABLE assignments 
ADD COLUMN IF NOT EXISTS lesson_id uuid REFERENCES module_lessons(id) ON DELETE CASCADE;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_assignments_lesson_id ON assignments(lesson_id);

-- Add helpful comment
COMMENT ON COLUMN assignments.lesson_id IS 'References the specific lesson this assignment is associated with in module_lessons table'; 
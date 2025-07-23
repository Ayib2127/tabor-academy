-- Add quiz_id column to module_lessons to link lessons of type 'quiz' to the quizzes table
ALTER TABLE module_lessons ADD COLUMN IF NOT EXISTS quiz_id uuid REFERENCES quizzes(id); 
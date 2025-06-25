-- Migration: add status enum and column to courses

-- 1. Create enum type if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_status') THEN
        CREATE TYPE course_status AS ENUM ('draft', 'pending_review', 'published', 'rejected');
    END IF;
END$$;

-- 2. Add status column to courses with default 'draft'
ALTER TABLE courses
    ADD COLUMN IF NOT EXISTS status course_status NOT NULL DEFAULT 'draft';

-- 3. Ensure is_published default is false (safety)
ALTER TABLE courses
    ALTER COLUMN is_published SET DEFAULT false;

-- 4. Back-fill existing rows
UPDATE courses
SET status = CASE WHEN is_published = true THEN 'published'::course_status ELSE 'draft'::course_status END
WHERE status IS NULL;

-- 5. (Optional) create an index to filter by pending_review quickly
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);

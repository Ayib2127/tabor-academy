/*
  # Add Course Approval and Content Type System

  1. New Columns
    - `status` (enum): Track course approval status ('draft', 'pending_review', 'published', 'rejected')
    - `content_type` (enum): Distinguish between 'tabor_original' and 'community' content
    - `rejection_reason` (text): Store admin feedback when rejecting courses
    - `reviewed_by` (uuid): Track which admin reviewed the course
    - `reviewed_at` (timestamp): When the review was completed

  2. Security
    - Enable RLS on courses table (if not already enabled)
    - Add policies for admin approval workflow
    - Ensure instructors can only see their own courses
    - Ensure admins can see all courses for review

  3. Indexes
    - Add indexes for efficient querying by status and content_type
*/

-- Add status enum type
DO $$ BEGIN
  CREATE TYPE course_status AS ENUM ('draft', 'pending_review', 'published', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add content_type enum type
DO $$ BEGIN
  CREATE TYPE content_type AS ENUM ('tabor_original', 'community');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add new columns to courses table
DO $$
BEGIN
  -- Add status column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'status'
  ) THEN
    ALTER TABLE courses ADD COLUMN status course_status DEFAULT 'draft';
  END IF;

  -- Add content_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'content_type'
  ) THEN
    ALTER TABLE courses ADD COLUMN content_type content_type DEFAULT 'community';
  END IF;

  -- Add rejection_reason column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'rejection_reason'
  ) THEN
    ALTER TABLE courses ADD COLUMN rejection_reason text;
  END IF;

  -- Add reviewed_by column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'reviewed_by'
  ) THEN
    ALTER TABLE courses ADD COLUMN reviewed_by uuid REFERENCES auth.users(id);
  END IF;

  -- Add reviewed_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'reviewed_at'
  ) THEN
    ALTER TABLE courses ADD COLUMN reviewed_at timestamptz;
  END IF;
END $$;

-- Update existing courses to have proper default values
UPDATE courses 
SET 
  status = 'draft',
  content_type = 'community'
WHERE status IS NULL OR content_type IS NULL;

-- Enable RLS on courses table (if not already enabled)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Instructors can view their own courses" ON courses;
DROP POLICY IF EXISTS "Instructors can create courses" ON courses;
DROP POLICY IF EXISTS "Instructors can update their own courses" ON courses;
DROP POLICY IF EXISTS "Admins can view all courses" ON courses;
DROP POLICY IF EXISTS "Admins can update course status" ON courses;
DROP POLICY IF EXISTS "Published courses are viewable by everyone" ON courses;

-- Create RLS policies for course access control

-- Instructors can view their own courses
CREATE POLICY "Instructors can view their own courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (
    instructor_id = auth.uid() OR
    -- Admins can see all courses
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Instructors can create courses (will be in draft status by default)
CREATE POLICY "Instructors can create courses"
  ON courses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    instructor_id = auth.uid() AND
    status = 'draft' AND
    -- Auto-set content_type based on user role
    (
      content_type = 'community' OR
      (content_type = 'tabor_original' AND EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('admin', 'staff')
      ))
    )
  );

-- Instructors can update their own courses (with restrictions)
CREATE POLICY "Instructors can update their own courses"
  ON courses
  FOR UPDATE
  TO authenticated
  USING (instructor_id = auth.uid())
  WITH CHECK (
    instructor_id = auth.uid() AND
    -- Prevent instructors from changing status directly (except draft to pending_review)
    (
      (OLD.status = 'draft' AND status IN ('draft', 'pending_review')) OR
      (OLD.status = 'rejected' AND status IN ('draft', 'pending_review')) OR
      (OLD.status = status) -- No status change
    ) AND
    -- Prevent instructors from changing content_type
    content_type = OLD.content_type AND
    -- Prevent instructors from setting review fields
    reviewed_by IS NULL AND
    reviewed_at IS NULL AND
    rejection_reason IS NULL
  );

-- Admins can update course status and review fields
CREATE POLICY "Admins can update course status"
  ON courses
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Published courses are viewable by everyone (for course catalog)
CREATE POLICY "Published courses are viewable by everyone"
  ON courses
  FOR SELECT
  TO authenticated
  USING (status = 'published');

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_content_type ON courses(content_type);
CREATE INDEX IF NOT EXISTS idx_courses_status_content_type ON courses(status, content_type);
CREATE INDEX IF NOT EXISTS idx_courses_reviewed_by ON courses(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_courses_pending_review ON courses(status) WHERE status = 'pending_review';

-- Create a function to automatically set content_type based on user role
CREATE OR REPLACE FUNCTION set_course_content_type()
RETURNS TRIGGER AS $$
BEGIN
  -- If user is admin or staff, they can create tabor_original content
  IF EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = NEW.instructor_id 
    AND users.role IN ('admin', 'staff')
  ) THEN
    -- Allow them to set tabor_original if they want, otherwise default to community
    IF NEW.content_type IS NULL THEN
      NEW.content_type = 'community';
    END IF;
  ELSE
    -- Regular instructors can only create community content
    NEW.content_type = 'community';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set content_type
DROP TRIGGER IF EXISTS trigger_set_course_content_type ON courses;
CREATE TRIGGER trigger_set_course_content_type
  BEFORE INSERT ON courses
  FOR EACH ROW
  EXECUTE FUNCTION set_course_content_type();

-- Create a function to handle course status transitions
CREATE OR REPLACE FUNCTION handle_course_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If status is being changed to published or rejected, set review fields
  IF NEW.status IN ('published', 'rejected') AND OLD.status != NEW.status THEN
    NEW.reviewed_by = auth.uid();
    NEW.reviewed_at = NOW();
  END IF;
  
  -- If status is being changed back to draft, clear review fields
  IF NEW.status = 'draft' AND OLD.status IN ('published', 'rejected', 'pending_review') THEN
    NEW.reviewed_by = NULL;
    NEW.reviewed_at = NULL;
    NEW.rejection_reason = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status change handling
DROP TRIGGER IF EXISTS trigger_handle_course_status_change ON courses;
CREATE TRIGGER trigger_handle_course_status_change
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION handle_course_status_change();

-- Add helpful comments
COMMENT ON COLUMN courses.status IS 'Course approval status: draft, pending_review, published, rejected';
COMMENT ON COLUMN courses.content_type IS 'Content type: tabor_original (official Tabor content) or community (instructor-created)';
COMMENT ON COLUMN courses.rejection_reason IS 'Admin feedback when course is rejected';
COMMENT ON COLUMN courses.reviewed_by IS 'Admin who reviewed the course';
COMMENT ON COLUMN courses.reviewed_at IS 'Timestamp when course was reviewed';
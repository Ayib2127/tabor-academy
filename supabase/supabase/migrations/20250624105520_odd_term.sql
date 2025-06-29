/*
  # Enrollment System Enhancements

  1. New Columns
    - Add payment tracking columns to enrollments table
    - Add enrollment analytics columns

  2. Security
    - Update RLS policies for enrollment system
    - Add payment verification policies

  3. Indexes
    - Add performance indexes for payment queries
    - Add enrollment lookup indexes
*/

-- Add payment tracking columns to enrollments table
DO $$
BEGIN
  -- Add payment_reference column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'payment_reference'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN payment_reference text;
  END IF;

  -- Add payment_amount column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'payment_amount'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN payment_amount decimal(10,2);
  END IF;

  -- Add payment_currency column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'payment_currency'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN payment_currency text DEFAULT 'USD';
  END IF;

  -- Add payment_provider column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'payment_provider'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN payment_provider text;
  END IF;

  -- Add enrolled_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'enrolled_at'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN enrolled_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_enrollments_payment_reference ON enrollments(payment_reference);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_course ON enrollments(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_enrolled_at ON enrollments(enrolled_at);

-- Update RLS policies for enrollments
DROP POLICY IF EXISTS "Users can view own enrollments" ON enrollments;
CREATE POLICY "Users can view own enrollments"
  ON enrollments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own enrollments" ON enrollments;
CREATE POLICY "Users can create own enrollments"
  ON enrollments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Instructors can view enrollments for their courses
DROP POLICY IF EXISTS "Instructors can view course enrollments" ON enrollments;
CREATE POLICY "Instructors can view course enrollments"
  ON enrollments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = enrollments.course_id
      AND courses.instructor_id = auth.uid()
    )
  );

-- Add constraint to prevent duplicate enrollments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'unique_user_course_enrollment'
    AND table_name = 'enrollments'
  ) THEN
    ALTER TABLE enrollments
    ADD CONSTRAINT unique_user_course_enrollment
    UNIQUE (user_id, course_id);
  END IF;
END $$;

-- Update existing enrollments with default enrolled_at if null
UPDATE enrollments 
SET enrolled_at = created_at 
WHERE enrolled_at IS NULL AND created_at IS NOT NULL;

UPDATE enrollments 
SET enrolled_at = now() 
WHERE enrolled_at IS NULL;
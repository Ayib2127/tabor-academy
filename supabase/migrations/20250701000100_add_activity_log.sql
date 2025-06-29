/*
  # Create activity log table

  1. New Tables
    - `activity_log`
      - `id` (uuid, primary key)
      - `type` (text, activity type)
      - `user_id` (uuid, foreign key to users)
      - `course_id` (uuid, foreign key to courses)
      - `instructor_id` (uuid, foreign key to users)
      - `action_description` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `activity_log` table
    - Add policies for instructors to read activity for their courses
*/

CREATE TABLE IF NOT EXISTS activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id uuid REFERENCES users(id) ON DELETE CASCADE,
  action_description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Policy for instructors to read activity for their courses
CREATE POLICY "Instructors can read activity for their courses"
  ON activity_log
  FOR SELECT
  TO authenticated
  USING (auth.uid() = instructor_id);

-- Policy for users to read their own activity
CREATE POLICY "Users can read their own activity"
  ON activity_log
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to log activity
CREATE OR REPLACE FUNCTION log_activity(
  p_type text,
  p_user_id uuid,
  p_course_id uuid,
  p_action_description text
)
RETURNS uuid AS $$
DECLARE
  v_instructor_id uuid;
  v_activity_id uuid;
BEGIN
  -- Get instructor ID from course
  SELECT instructor_id INTO v_instructor_id
  FROM courses
  WHERE id = p_course_id;
  
  -- Insert activity log
  INSERT INTO activity_log (
    type,
    user_id,
    course_id,
    instructor_id,
    action_description
  ) VALUES (
    p_type,
    p_user_id,
    p_course_id,
    v_instructor_id,
    p_action_description
  )
  RETURNING id INTO v_activity_id;
  
  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql; 
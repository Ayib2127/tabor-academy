/*
  # Replace reviews with course_ratings

  1. Drop the old reviews table
  2. Create course_ratings table
  3. Add RLS and policies
  4. Add get_course_average_rating function
*/

-- Drop the old reviews table if it exists
DROP TABLE IF EXISTS reviews CASCADE;

-- Create course_ratings table
CREATE TABLE IF NOT EXISTS course_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(course_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE course_ratings ENABLE ROW LEVEL SECURITY;

-- Policy for users to read all ratings
DROP POLICY IF EXISTS "Anyone can read course ratings" ON course_ratings;
CREATE POLICY "Anyone can read course ratings"
  ON course_ratings
  FOR SELECT
  USING (true);

-- Policy for users to create their own ratings
DROP POLICY IF EXISTS "Users can create their own ratings" ON course_ratings;
CREATE POLICY "Users can create their own ratings"
  ON course_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own ratings
DROP POLICY IF EXISTS "Users can update their own ratings" ON course_ratings;
CREATE POLICY "Users can update their own ratings"
  ON course_ratings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own ratings
DROP POLICY IF EXISTS "Users can delete their own ratings" ON course_ratings;
CREATE POLICY "Users can delete their own ratings"
  ON course_ratings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to calculate average rating for a course
CREATE OR REPLACE FUNCTION get_course_average_rating(p_course_id uuid)
RETURNS float AS $$
DECLARE
  avg_rating float;
BEGIN
  SELECT AVG(rating)::float
  INTO avg_rating
  FROM course_ratings
  WHERE course_id = p_course_id;
  
  RETURN COALESCE(avg_rating, 0);
END;
$$ LANGUAGE plpgsql; 
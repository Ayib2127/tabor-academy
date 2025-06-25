/*
  # Additional Database Features

  1. New Tables
    - `categories` - Course categories
    - `course_categories` - Junction table for courses and categories
    - `reviews` - Course reviews
    - `tags` - Course tags
    - `course_tags` - Junction table for courses and tags

  2. Security
    - Enable RLS on all tables
    - Add policies for data access control
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Create course_categories junction table
CREATE TABLE IF NOT EXISTS course_categories (
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (course_id, category_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create course_tags junction table
CREATE TABLE IF NOT EXISTS course_tags (
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (course_id, tag_id)
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_tags ENABLE ROW LEVEL SECURITY;

-- Category Policies
CREATE POLICY "Anyone can view categories" 
  ON categories FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage categories" 
  ON categories FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Course Categories Policies
CREATE POLICY "Anyone can view course categories" 
  ON course_categories FOR SELECT 
  USING (true);

CREATE POLICY "Instructors can manage their course categories" 
  ON course_categories FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = course_categories.course_id AND courses.instructor_id = auth.uid()
    )
  );

-- Reviews Policies
CREATE POLICY "Anyone can view reviews" 
  ON reviews FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own reviews" 
  ON reviews FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
  ON reviews FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
  ON reviews FOR DELETE 
  USING (auth.uid() = user_id);

-- Tags Policies
CREATE POLICY "Anyone can view tags" 
  ON tags FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage tags" 
  ON tags FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Course Tags Policies
CREATE POLICY "Anyone can view course tags" 
  ON course_tags FOR SELECT 
  USING (true);

CREATE POLICY "Instructors can manage their course tags" 
  ON course_tags FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = course_tags.course_id AND courses.instructor_id = auth.uid()
    )
  );
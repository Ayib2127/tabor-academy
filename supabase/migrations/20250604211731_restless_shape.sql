/*
  # Initial Database Schema

  1. New Tables
    - `users` - User profiles
    - `courses` - Course information
    - `lessons` - Course lessons
    - `enrollments` - User course enrollments
    - `progress` - User lesson progress

  2. Security
    - Enable RLS on all tables
    - Add policies for data access control
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  bio text,
  location text,
  role text DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  thumbnail_url text,
  instructor_id uuid REFERENCES users(id),
  level text CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration integer, -- in minutes
  price numeric(10,2) DEFAULT 0,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  content text,
  video_url text,
  duration integer, -- in minutes
  position integer NOT NULL,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, course_id)
);

-- Create progress table
CREATE TABLE IF NOT EXISTS progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  last_position integer DEFAULT 0, -- video position in seconds
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- User Policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
CREATE POLICY "Users can view their own data" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own data" ON users;
CREATE POLICY "Users can update their own data" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Course Policies
DROP POLICY IF EXISTS "Anyone can view published courses" ON courses;
CREATE POLICY "Anyone can view published courses" 
  ON courses FOR SELECT 
  USING (is_published = true);

DROP POLICY IF EXISTS "Instructors can manage their own courses" ON courses;
CREATE POLICY "Instructors can manage their own courses" 
  ON courses FOR ALL 
  USING (auth.uid() = instructor_id);

-- Lesson Policies
DROP POLICY IF EXISTS "Anyone can view published lessons" ON lessons;
CREATE POLICY "Anyone can view published lessons" 
  ON lessons FOR SELECT 
  USING (
    is_published = true AND 
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = lessons.course_id AND courses.is_published = true
    )
  );

DROP POLICY IF EXISTS "Instructors can manage their own lessons" ON lessons;
CREATE POLICY "Instructors can manage their own lessons" 
  ON lessons FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = lessons.course_id AND courses.instructor_id = auth.uid()
    )
  );

-- Enrollment Policies
DROP POLICY IF EXISTS "Users can view their own enrollments" ON enrollments;
CREATE POLICY "Users can view their own enrollments" 
  ON enrollments FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can enroll themselves" ON enrollments;
CREATE POLICY "Users can enroll themselves" 
  ON enrollments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Progress Policies
DROP POLICY IF EXISTS "Users can view their own progress" ON progress;
CREATE POLICY "Users can view their own progress" 
  ON progress FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress" ON progress;
CREATE POLICY "Users can update their own progress" 
  ON progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress" ON progress;
CREATE POLICY "Users can update their own progress" 
  ON progress FOR UPDATE 
  USING (auth.uid() = user_id);
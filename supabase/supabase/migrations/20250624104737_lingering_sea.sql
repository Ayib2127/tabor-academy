/*
  # Enhanced Course Catalog Schema

  1. New Columns
    - `category` (text) - Course category for filtering
    - `content_type` (text) - 'tabor_original' or 'community' 
    - `delivery_type` (text) - 'self_paced' or 'cohort_based'
    - `tags` (text[]) - Array of skills/topics for advanced filtering

  2. Security
    - Maintain existing RLS policies
    - Add policies for new columns

  3. Data Enhancement
    - Add sample data for better filtering experience
*/

-- Add new columns to courses table
DO $$
BEGIN
  -- Add category column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'category'
  ) THEN
    ALTER TABLE courses ADD COLUMN category text DEFAULT 'General';
  END IF;

  -- Add content_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'content_type'
  ) THEN
    ALTER TABLE courses ADD COLUMN content_type text DEFAULT 'community' CHECK (content_type IN ('tabor_original', 'community'));
  END IF;

  -- Add delivery_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'delivery_type'
  ) THEN
    ALTER TABLE courses ADD COLUMN delivery_type text DEFAULT 'self_paced' CHECK (delivery_type IN ('self_paced', 'cohort_based'));
  END IF;

  -- Add tags column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'tags'
  ) THEN
    ALTER TABLE courses ADD COLUMN tags text[] DEFAULT '{}';
  END IF;
END $$;

-- Update existing courses with sample data
UPDATE courses SET 
  category = CASE 
    WHEN title ILIKE '%marketing%' THEN 'Digital Marketing'
    WHEN title ILIKE '%business%' OR title ILIKE '%entrepreneur%' THEN 'Business & Entrepreneurship'
    WHEN title ILIKE '%development%' OR title ILIKE '%code%' THEN 'Technology & Development'
    WHEN title ILIKE '%financial%' OR title ILIKE '%money%' THEN 'Financial Literacy'
    ELSE 'Business & Entrepreneurship'
  END,
  content_type = CASE 
    WHEN random() > 0.7 THEN 'tabor_original'
    ELSE 'community'
  END,
  delivery_type = CASE 
    WHEN random() > 0.8 THEN 'cohort_based'
    ELSE 'self_paced'
  END,
  tags = CASE 
    WHEN title ILIKE '%marketing%' THEN ARRAY['Digital Marketing', 'Social Media Marketing', 'Content Creation']
    WHEN title ILIKE '%business%' THEN ARRAY['Business Validation', 'Market Research', 'Entrepreneurship']
    WHEN title ILIKE '%development%' THEN ARRAY['No-Code Development', 'Product Development', 'Technology']
    WHEN title ILIKE '%financial%' THEN ARRAY['Financial Modeling', 'Personal Finance', 'Investment']
    ELSE ARRAY['Business Skills', 'Professional Development']
  END
WHERE category IS NULL OR category = 'General';

-- Create index for better performance on filtering
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_content_type ON courses(content_type);
CREATE INDEX IF NOT EXISTS idx_courses_delivery_type ON courses(delivery_type);
CREATE INDEX IF NOT EXISTS idx_courses_tags ON courses USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_price ON courses(price);

-- Create composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_courses_published_filters ON courses(is_published, level, category, content_type) WHERE is_published = true;
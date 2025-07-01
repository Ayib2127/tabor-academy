/*
  # Create testimonials table for success stories

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text, required) - Student's full name
      - `location` (text, required) - City, Country
      - `country` (text, required) - Country name
      - `image_url` (text, required) - Profile image URL
      - `business_name` (text, required) - Name of their business
      - `business_type` (text, required) - Type/category of business
      - `course_taken` (text, required) - Course they completed
      - `time_to_launch` (text, required) - How long to launch business
      - `monthly_revenue` (text, required) - Current monthly revenue
      - `employees_hired` (integer, default 0) - Number of employees
      - `quote` (text, required) - Their testimonial quote
      - `achievement` (text, required) - Key achievement
      - `rating` (integer, default 5) - Rating out of 5
      - `video_url` (text, optional) - Video testimonial URL
      - `linkedin_url` (text, optional) - LinkedIn profile
      - `business_url` (text, optional) - Business website
      - `before_story` (text, required) - What they were doing before
      - `after_story` (text, required) - What they're doing now
      - `is_featured` (boolean, default false) - Whether to feature prominently
      - `display_order` (integer, default 0) - Order for display
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `testimonials` table
    - Add policy for public read access
    - Add policy for authenticated admin write access
*/

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  country text NOT NULL,
  image_url text NOT NULL,
  business_name text NOT NULL,
  business_type text NOT NULL,
  course_taken text NOT NULL,
  time_to_launch text NOT NULL,
  monthly_revenue text NOT NULL,
  employees_hired integer DEFAULT 0,
  quote text NOT NULL,
  achievement text NOT NULL,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  video_url text,
  linkedin_url text,
  business_url text,
  before_story text NOT NULL,
  after_story text NOT NULL,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Anyone can read testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (true);

-- Policy for authenticated admin write access
CREATE POLICY "Admins can manage testimonials"
  ON testimonials
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Insert sample testimonials data
INSERT INTO testimonials (
  name, location, country, image_url, business_name, business_type,
  course_taken, time_to_launch, monthly_revenue, employees_hired,
  quote, achievement, rating, video_url, linkedin_url, business_url,
  before_story, after_story, is_featured, display_order
) VALUES 
(
  'Sarah Mwangi',
  'Nairobi',
  'Kenya',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  'Digital Reach Ethiopia',
  'Digital Marketing Agency',
  'Digital Marketing Mastery',
  '3 months',
  '$4,200',
  5,
  'Tabor Academy didn''t just teach me digital marketing - it gave me the confidence to build a business that serves clients across East Ethiopia. The mentorship was invaluable.',
  'Scaled to 15+ clients in 6 months',
  5,
  '#',
  '#',
  '#',
  'Unemployed graduate struggling to find work',
  'CEO of a thriving digital marketing agency',
  true,
  1
),
(
  'John Okafor',
  'Lagos',
  'Nigeria',
  'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  'NoCode Solutions NG',
  'App Development',
  'No-Code Development',
  '2 months',
  '$3,800',
  3,
  'The no-code course opened my eyes to possibilities I never knew existed. Now I''m building apps for local businesses and teaching others in my community.',
  'Built 12 apps for local businesses',
  5,
  '#',
  '#',
  '#',
  'Taxi driver with a passion for technology',
  'Successful app developer and community educator',
  true,
  2
),
(
  'Grace Mensah',
  'Accra',
  'Ghana',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  'Afri-Style Boutique',
  'E-commerce Fashion',
  'E-commerce & Digital Marketing',
  '4 months',
  '$2,900',
  4,
  'The mentorship program gave me the confidence to start my e-commerce business. My sales grow every month, and I''m now expanding to other West Ethiopian countries.',
  'Expanded to 3 countries in first year',
  5,
  '#',
  '#',
  '#',
  'Small market vendor with limited reach',
  'International e-commerce entrepreneur',
  true,
  3
),
(
  'David Mukasa',
  'Kampala',
  'Uganda',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  'AgriTech Solutions',
  'Agricultural Technology',
  'AI Tools & Automation',
  '5 months',
  '$5,100',
  7,
  'Learning about AI tools transformed how I approach farming solutions. I now help farmers across Uganda optimize their yields using technology.',
  'Helped 200+ farmers increase yields by 40%',
  5,
  '#',
  '#',
  '#',
  'Agricultural extension officer',
  'AgriTech entrepreneur serving hundreds of farmers',
  true,
  4
),
(
  'Amina Hassan',
  'Dar es Salaam',
  'Tanzania',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  'FinLit Academy',
  'Financial Education',
  'Financial Literacy & Entrepreneurship',
  '3 months',
  '$3,200',
  6,
  'The financial literacy course didn''t just teach me about money - it showed me how to build a sustainable business helping others achieve financial freedom.',
  'Trained 500+ people in financial literacy',
  5,
  '#',
  '#',
  '#',
  'Bank teller with entrepreneurial dreams',
  'Financial education entrepreneur and community leader',
  true,
  5
);
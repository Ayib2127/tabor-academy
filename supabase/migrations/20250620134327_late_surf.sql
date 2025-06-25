-- Test script to verify the course approval system migration
-- Run this after applying the migration to ensure everything works

-- Test 1: Verify new columns exist
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'courses' 
AND column_name IN ('status', 'content_type', 'rejection_reason', 'reviewed_by', 'reviewed_at')
ORDER BY column_name;

-- Test 2: Verify enum types exist
SELECT 
  typname, 
  enumlabel 
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid 
WHERE typname IN ('course_status', 'content_type')
ORDER BY typname, enumlabel;

-- Test 3: Verify indexes exist
SELECT 
  indexname, 
  indexdef 
FROM pg_indexes 
WHERE tablename = 'courses' 
AND indexname LIKE 'idx_courses_%'
ORDER BY indexname;

-- Test 4: Verify triggers exist
SELECT 
  trigger_name, 
  event_manipulation, 
  action_timing 
FROM information_schema.triggers 
WHERE event_object_table = 'courses'
ORDER BY trigger_name;

-- Test 5: Verify RLS policies exist
SELECT 
  policyname, 
  permissive, 
  roles, 
  cmd 
FROM pg_policies 
WHERE tablename = 'courses'
ORDER BY policyname;

-- Sample test data (uncomment to test, but be careful in production)
/*
-- Insert a test course to verify the system works
INSERT INTO courses (
  title, 
  description, 
  instructor_id, 
  category, 
  level, 
  price
) VALUES (
  'Test Course for Approval System',
  'This is a test course to verify the approval system works correctly.',
  auth.uid(), -- Replace with actual instructor ID
  'Technology',
  'beginner',
  0
);

-- Verify the course was created with correct defaults
SELECT 
  id, 
  title, 
  status, 
  content_type, 
  created_at 
FROM courses 
WHERE title = 'Test Course for Approval System';
*/
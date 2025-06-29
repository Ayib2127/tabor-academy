/*
  # Add funnel stage tracking to users

  1. New Columns
    - `funnel_stage` (text) - Tracks user's position in the entrepreneurial journey
    - Default value is 'Idea' for new users

  2. Security
    - Users can read and update their own funnel_stage
    - Add RLS policy for funnel_stage updates
*/

-- Add funnel_stage column to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'funnel_stage'
  ) THEN
    ALTER TABLE users ADD COLUMN funnel_stage text DEFAULT 'Idea' CHECK (funnel_stage IN ('Idea', 'MVP', 'Growth'));
  END IF;
END $$;

-- Update existing users to have default funnel stage
UPDATE users SET funnel_stage = 'Idea' WHERE funnel_stage IS NULL;

-- Add RLS policy for funnel_stage updates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own funnel stage' AND tablename = 'users'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Users can update own funnel stage"
      ON users
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
    $policy$;
  END IF;
END $$; 
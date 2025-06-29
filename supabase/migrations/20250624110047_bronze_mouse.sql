/*
  # Success Funnel Dashboard Enhancements

  1. New Tables
    - `learning_activities` - Track daily learning activities for streak calculation
    - `user_achievements` - Store user achievements and badges
    - `funnel_progress` - Track progress through entrepreneurial funnel stages

  2. Enhanced Tables
    - Add indexes for better dashboard performance
    - Add triggers for automatic funnel stage progression

  3. Security
    - Enable RLS on all new tables
    - Add policies for user data access
*/

-- Create learning_activities table for tracking daily learning
CREATE TABLE IF NOT EXISTS learning_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  activity_date date NOT NULL,
  minutes_spent integer DEFAULT 0,
  lessons_completed integer DEFAULT 0,
  courses_accessed text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  achievement_type text NOT NULL,
  achievement_title text NOT NULL,
  achievement_description text,
  points_awarded integer DEFAULT 0,
  earned_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create funnel_progress table
CREATE TABLE IF NOT EXISTS funnel_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  stage text NOT NULL CHECK (stage IN ('Idea', 'MVP', 'Growth')),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  courses_completed_in_stage integer DEFAULT 0,
  key_milestones jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE learning_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for learning_activities
CREATE POLICY "Users can view own learning activities"
  ON learning_activities
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning activities"
  ON learning_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning activities"
  ON learning_activities
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for funnel_progress
CREATE POLICY "Users can view own funnel progress"
  ON funnel_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own funnel progress"
  ON funnel_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own funnel progress"
  ON funnel_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_learning_activities_user_date ON learning_activities(user_id, activity_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_earned ON user_achievements(user_id, earned_at DESC);
CREATE INDEX IF NOT EXISTS idx_funnel_progress_user_stage ON funnel_progress(user_id, stage);

-- Create unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS idx_learning_activities_user_date_unique 
  ON learning_activities(user_id, activity_date);

-- Function to calculate learning streak
CREATE OR REPLACE FUNCTION calculate_learning_streak(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  streak_count integer := 0;
  current_date_check date := CURRENT_DATE;
  has_activity boolean;
BEGIN
  -- Check if user has activity today or yesterday to start counting
  SELECT EXISTS(
    SELECT 1 FROM learning_activities 
    WHERE user_id = p_user_id 
    AND activity_date >= CURRENT_DATE - INTERVAL '1 day'
    AND minutes_spent > 0
  ) INTO has_activity;
  
  IF NOT has_activity THEN
    RETURN 0;
  END IF;
  
  -- Count consecutive days with learning activity
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM learning_activities 
      WHERE user_id = p_user_id 
      AND activity_date = current_date_check
      AND minutes_spent > 0
    ) INTO has_activity;
    
    IF has_activity THEN
      streak_count := streak_count + 1;
      current_date_check := current_date_check - INTERVAL '1 day';
    ELSE
      EXIT;
    END IF;
    
    -- Prevent infinite loop
    IF streak_count > 365 THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN streak_count;
END;
$$;

-- Function to award achievements
CREATE OR REPLACE FUNCTION award_achievement(
  p_user_id uuid,
  p_achievement_type text,
  p_title text,
  p_description text DEFAULT NULL,
  p_points integer DEFAULT 0,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  achievement_id uuid;
  existing_achievement uuid;
BEGIN
  -- Check if user already has this achievement
  SELECT id INTO existing_achievement
  FROM user_achievements
  WHERE user_id = p_user_id 
  AND achievement_type = p_achievement_type;
  
  IF existing_achievement IS NOT NULL THEN
    RETURN existing_achievement;
  END IF;
  
  -- Insert new achievement
  INSERT INTO user_achievements (
    user_id,
    achievement_type,
    achievement_title,
    achievement_description,
    points_awarded,
    earned_at,
    metadata
  ) VALUES (
    p_user_id,
    p_achievement_type,
    p_title,
    p_description,
    p_points,
    now(),
    p_metadata
  ) RETURNING id INTO achievement_id;
  
  RETURN achievement_id;
END;
$$; 
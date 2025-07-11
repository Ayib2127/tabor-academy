/*
  # Create Calendar Events Table

  1. New Tables
    - `calendar_events`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `start_date` (timestamptz, required)
      - `end_date` (timestamptz, required)
      - `type` (text, required) - course, mentorship, workshop, meeting, deadline, reminder
      - `status` (text, default 'scheduled') - scheduled, in-progress, completed, cancelled
      - `location` (text, optional)
      - `meeting_link` (text, optional)
      - `color` (text, default '#4ECDC4')
      - `priority` (text, default 'medium') - low, medium, high
      - `participants` (jsonb, array of user IDs)
      - `user_id` (uuid, foreign key to users) - event creator
      - `course_id` (uuid, foreign key to courses, optional)
      - `instructor_id` (uuid, foreign key to users, optional)
      - `student_id` (uuid, foreign key to users, optional)
      - `notifications` (jsonb) - notification settings
      - `recurring` (jsonb, optional) - recurring event settings
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Real-time Features
    - Enable real-time subscriptions on calendar_events table
    - Add indexes for efficient querying
    - Add RLS policies for secure access

  3. Event Types
    - course: Course-related events
    - mentorship: Mentorship sessions
    - workshop: Workshops and training
    - meeting: General meetings
    - deadline: Assignment deadlines
    - reminder: General reminders
*/

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  type text NOT NULL CHECK (type IN ('course', 'mentorship', 'workshop', 'meeting', 'deadline', 'reminder')),
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
  location text,
  meeting_link text,
  color text DEFAULT '#4ECDC4',
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  participants jsonb DEFAULT '[]',
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id uuid REFERENCES users(id) ON DELETE CASCADE,
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  notifications jsonb DEFAULT '{"email": true, "push": true, "sms": false, "minutesBefore": 15}',
  recurring jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_date ON calendar_events(start_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_end_date ON calendar_events(end_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_type ON calendar_events(type);
CREATE INDEX IF NOT EXISTS idx_calendar_events_status ON calendar_events(status);
CREATE INDEX IF NOT EXISTS idx_calendar_events_course_id ON calendar_events(course_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_instructor_id ON calendar_events(instructor_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_student_id ON calendar_events(student_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date_range ON calendar_events(start_date, end_date);

-- RLS Policies
DROP POLICY IF EXISTS "Users can view their own events" ON calendar_events;
CREATE POLICY "Users can view their own events"
  ON calendar_events FOR SELECT
  USING (
    auth.uid() = user_id OR
    auth.uid() = instructor_id OR
    auth.uid() = student_id OR
    (course_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.course_id = calendar_events.course_id
      AND enrollments.user_id = auth.uid()
    ))
  );

DROP POLICY IF EXISTS "Users can create their own events" ON calendar_events;
CREATE POLICY "Users can create their own events"
  ON calendar_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own events" ON calendar_events;
CREATE POLICY "Users can update their own events"
  ON calendar_events FOR UPDATE
  USING (
    auth.uid() = user_id OR
    auth.uid() = instructor_id OR
    auth.uid() = student_id
  );

DROP POLICY IF EXISTS "Users can delete their own events" ON calendar_events;
CREATE POLICY "Users can delete their own events"
  ON calendar_events FOR DELETE
  USING (
    auth.uid() = user_id OR
    auth.uid() = instructor_id OR
    auth.uid() = student_id
  );

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE calendar_events;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_calendar_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_update_calendar_events_updated_at ON calendar_events;
CREATE TRIGGER trigger_update_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_calendar_events_updated_at();

-- Create function to get upcoming events
DROP FUNCTION IF EXISTS get_upcoming_events(uuid, integer);
CREATE OR REPLACE FUNCTION get_upcoming_events(p_user_id uuid, p_days integer DEFAULT 7)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  start_date timestamptz,
  end_date timestamptz,
  type text,
  status text,
  location text,
  meeting_link text,
  color text,
  priority text,
  participants jsonb,
  course_id uuid,
  instructor_id uuid,
  student_id uuid
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ce.id,
    ce.title,
    ce.description,
    ce.start_date,
    ce.end_date,
    ce.type,
    ce.status,
    ce.location,
    ce.meeting_link,
    ce.color,
    ce.priority,
    ce.participants,
    ce.course_id,
    ce.instructor_id,
    ce.student_id
  FROM calendar_events ce
  WHERE (
    ce.user_id = p_user_id OR
    ce.instructor_id = p_user_id OR
    ce.student_id = p_user_id OR
    (ce.course_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.course_id = ce.course_id
      AND enrollments.user_id = p_user_id
    ))
  )
  AND ce.start_date >= now()
  AND ce.start_date <= now() + interval '1 day' * p_days
  AND ce.status != 'cancelled'
  ORDER BY ce.start_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get events by date range
DROP FUNCTION IF EXISTS get_events_by_date_range(uuid, timestamptz, timestamptz);
CREATE OR REPLACE FUNCTION get_events_by_date_range(
  p_user_id uuid,
  p_start_date timestamptz,
  p_end_date timestamptz
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  start_date timestamptz,
  end_date timestamptz,
  type text,
  status text,
  location text,
  meeting_link text,
  color text,
  priority text,
  participants jsonb,
  course_id uuid,
  instructor_id uuid,
  student_id uuid
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ce.id,
    ce.title,
    ce.description,
    ce.start_date,
    ce.end_date,
    ce.type,
    ce.status,
    ce.location,
    ce.meeting_link,
    ce.color,
    ce.priority,
    ce.participants,
    ce.course_id,
    ce.instructor_id,
    ce.student_id
  FROM calendar_events ce
  WHERE (
    ce.user_id = p_user_id OR
    ce.instructor_id = p_user_id OR
    ce.student_id = p_user_id OR
    (ce.course_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.course_id = ce.course_id
      AND enrollments.user_id = p_user_id
    ))
  )
  AND ce.start_date >= p_start_date
  AND ce.end_date <= p_end_date
  AND ce.status != 'cancelled'
  ORDER BY ce.start_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to create recurring events
DROP FUNCTION IF EXISTS create_recurring_events(uuid, jsonb);
CREATE OR REPLACE FUNCTION create_recurring_events(
  p_base_event_id uuid,
  p_recurring_config jsonb
)
RETURNS void AS $$
DECLARE
  base_event calendar_events%ROWTYPE;
  event_date timestamptz;
  end_recurring_date timestamptz;
  interval_days integer;
  new_event_id uuid;
BEGIN
  -- Get the base event
  SELECT * INTO base_event
  FROM calendar_events
  WHERE id = p_base_event_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Base event not found';
  END IF;
  
  -- Extract recurring configuration
  event_date := base_event.start_date;
  end_recurring_date := (p_recurring_config->>'endDate')::timestamptz;
  interval_days := CASE p_recurring_config->>'frequency'
    WHEN 'daily' THEN 1
    WHEN 'weekly' THEN 7
    WHEN 'monthly' THEN 30
    WHEN 'yearly' THEN 365
    ELSE 7
  END;
  
  -- Create recurring events
  WHILE event_date <= end_recurring_date LOOP
    event_date := event_date + interval '1 day' * interval_days;
    
    IF event_date <= end_recurring_date THEN
      INSERT INTO calendar_events (
        title,
        description,
        start_date,
        end_date,
        type,
        status,
        location,
        meeting_link,
        color,
        priority,
        participants,
        user_id,
        course_id,
        instructor_id,
        student_id,
        notifications,
        recurring
      ) VALUES (
        base_event.title,
        base_event.description,
        event_date,
        event_date + (base_event.end_date - base_event.start_date),
        base_event.type,
        base_event.status,
        base_event.location,
        base_event.meeting_link,
        base_event.color,
        base_event.priority,
        base_event.participants,
        base_event.user_id,
        base_event.course_id,
        base_event.instructor_id,
        base_event.student_id,
        base_event.notifications,
        p_recurring_config
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add helpful comments
COMMENT ON TABLE calendar_events IS 'Calendar events for users, courses, and mentorship sessions';
COMMENT ON COLUMN calendar_events.type IS 'Type of event: course, mentorship, workshop, meeting, deadline, reminder';
COMMENT ON COLUMN calendar_events.status IS 'Event status: scheduled, in-progress, completed, cancelled';
COMMENT ON COLUMN calendar_events.priority IS 'Event priority: low, medium, high';
COMMENT ON COLUMN calendar_events.participants IS 'Array of user IDs participating in the event';
COMMENT ON COLUMN calendar_events.notifications IS 'JSON object with notification settings';
COMMENT ON COLUMN calendar_events.recurring IS 'JSON object with recurring event configuration'; 
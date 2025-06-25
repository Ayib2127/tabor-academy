/*
  # Community Features Schema

  1. New Tables
    - `forums` - Discussion forums
    - `forum_posts` - Posts in forums
    - `forum_replies` - Replies to forum posts
    - `study_groups` - Study groups
    - `study_group_members` - Members of study groups
    - `messages` - Private messages between users

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Create forums table
CREATE TABLE IF NOT EXISTS forums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create forum_posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  forum_id uuid REFERENCES forums(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  is_pinned boolean DEFAULT false,
  is_locked boolean DEFAULT false,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create forum_replies table
CREATE TABLE IF NOT EXISTS forum_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_solution boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create study_groups table
CREATE TABLE IF NOT EXISTS study_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  creator_id uuid REFERENCES users(id) ON DELETE CASCADE,
  max_members integer DEFAULT 10,
  is_private boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create study_group_members table
CREATE TABLE IF NOT EXISTS study_group_members (
  group_id uuid REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Forums Policies
CREATE POLICY "Anyone can view forums" 
  ON forums FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage forums" 
  ON forums FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Forum Posts Policies
CREATE POLICY "Anyone can view forum posts" 
  ON forum_posts FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create forum posts" 
  ON forum_posts FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own forum posts" 
  ON forum_posts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forum posts" 
  ON forum_posts FOR DELETE 
  USING (auth.uid() = user_id);

-- Forum Replies Policies
CREATE POLICY "Anyone can view forum replies" 
  ON forum_replies FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create forum replies" 
  ON forum_replies FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own forum replies" 
  ON forum_replies FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forum replies" 
  ON forum_replies FOR DELETE 
  USING (auth.uid() = user_id);

-- Study Groups Policies
CREATE POLICY "Anyone can view public study groups" 
  ON study_groups FOR SELECT 
  USING (is_private = false OR creator_id = auth.uid() OR EXISTS (
    SELECT 1 FROM study_group_members 
    WHERE study_group_members.group_id = study_groups.id AND study_group_members.user_id = auth.uid()
  ));

CREATE POLICY "Authenticated users can create study groups" 
  ON study_groups FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Creators can update their study groups" 
  ON study_groups FOR UPDATE 
  USING (creator_id = auth.uid());

CREATE POLICY "Creators can delete their study groups" 
  ON study_groups FOR DELETE 
  USING (creator_id = auth.uid());

-- Study Group Members Policies
CREATE POLICY "Members can view study group members" 
  ON study_group_members FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM study_group_members 
      WHERE study_group_members.group_id = group_id AND study_group_members.user_id = auth.uid()
    ) OR 
    EXISTS (
      SELECT 1 FROM study_groups 
      WHERE study_groups.id = group_id AND study_groups.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can join public study groups" 
  ON study_group_members FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM study_groups 
      WHERE study_groups.id = group_id AND study_groups.is_private = false
    )
  );

CREATE POLICY "Group admins can manage members" 
  ON study_group_members FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM study_group_members 
      WHERE study_group_members.group_id = group_id AND study_group_members.user_id = auth.uid() AND study_group_members.role IN ('admin', 'moderator')
    ) OR 
    EXISTS (
      SELECT 1 FROM study_groups 
      WHERE study_groups.id = group_id AND study_groups.creator_id = auth.uid()
    )
  );

-- Messages Policies
CREATE POLICY "Users can view their own messages" 
  ON messages FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" 
  ON messages FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can mark messages as read" 
  ON messages FOR UPDATE 
  USING (auth.uid() = recipient_id);

CREATE POLICY "Users can delete their own messages" 
  ON messages FOR DELETE 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
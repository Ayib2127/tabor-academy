-- Add welcome_email_sent flag to users table
-- This flag tracks whether a welcome email has been sent to the user

-- Add the column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'welcome_email_sent'
  ) THEN
    ALTER TABLE users ADD COLUMN welcome_email_sent BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Update existing users to have welcome_email_sent = false
UPDATE users SET welcome_email_sent = FALSE WHERE welcome_email_sent IS NULL;

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_users_welcome_email_sent ON users(welcome_email_sent);

-- Create a function to mark welcome email as sent
CREATE OR REPLACE FUNCTION mark_welcome_email_sent(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET welcome_email_sent = TRUE, updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
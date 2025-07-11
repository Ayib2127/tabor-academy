-- Add a boolean column to track if a rejected course has been edited since rejection
ALTER TABLE courses ADD COLUMN IF NOT EXISTS edited_since_rejection BOOLEAN NOT NULL DEFAULT FALSE;

-- Add structured content column for BlockNote editor
ALTER TABLE module_lessons
  ADD COLUMN IF NOT EXISTS content_json jsonb;

-- Backfill existing lessons: copy plain text "content" into JSON structure if desired (optional)
-- Here we'll leave it null; frontend should handle null as empty document.

-- Add delivery_type column to courses table if it does not already exist
-- Allows distinguishing between self-paced and cohort-based courses

alter table public.courses
  add column if not exists delivery_type text not null default 'self_paced' check (delivery_type in ('self_paced', 'cohort'));

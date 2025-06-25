-- Add delivery_type and scheduling columns to courses table
-- and introduce status enum for admin approval workflow

alter table courses
	add column if not exists delivery_type text not null default 'self_paced' check (delivery_type in ('self_paced','cohort'));

alter table courses
	add column if not exists start_date date,
	add column if not exists end_date date,
	add column if not exists registration_deadline date;

-- Status column for admin approval (draft->pending_review->published/rejected)
alter table courses
	add column if not exists status text not null default 'draft' check (status in ('draft','pending_review','published','rejected'));

-- Ensure existing rows conform to new constraints
update courses set delivery_type = 'self_paced' where delivery_type is null;
update courses set status = 'draft' where status is null;

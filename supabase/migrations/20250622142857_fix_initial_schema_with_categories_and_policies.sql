-- Fixed version of the initial schema + RLS policies
-- (original file had escaped new-lines / quotes that caused a syntax error)

-- =========================
--  TABLE DEFINITIONS
-- =========================

create table if not exists public.users (
  id uuid primary key default auth.uid(),
  email text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  location text,
  role text default 'student' check (role in ('student','instructor','admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  thumbnail_url text,
  instructor_id uuid references public.users(id),
  level text check (level in ('beginner','intermediate','advanced')),
  duration integer,
  price numeric(10,2) default 0,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  description text,
  content text,
  video_url text,
  duration integer,
  position integer not null,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  enrolled_at timestamptz default now(),
  completed_at timestamptz,
  unique (user_id, course_id)
);

create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  completed boolean default false,
  last_position integer default 0,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, lesson_id)
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  created_at timestamptz default now()
);

create table if not exists public.course_categories (
  course_id uuid references public.courses(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  primary key (course_id, category_id)
);

-- =========================
--  ROW-LEVEL SECURITY
-- =========================

alter table public.users            enable row level security;
alter table public.courses          enable row level security;
alter table public.lessons          enable row level security;
alter table public.enrollments      enable row level security;
alter table public.progress         enable row level security;
alter table public.categories       enable row level security;
alter table public.course_categories enable row level security;

-- Drop old policies if they exist (allows re-running)
drop policy if exists "Users can view their own data" on public.users;
drop policy if exists "Users can update their own data" on public.users;
drop policy if exists "Authenticated users can create their own user" on public.users;

drop policy if exists "Anyone can view published courses" on public.courses;
drop policy if exists "Instructors can manage their own courses" on public.courses;

drop policy if exists "Anyone can view published lessons" on public.lessons;
drop policy if exists "Instructors can manage their own lessons" on public.lessons;

drop policy if exists "Users can view their own enrollments" on public.enrollments;
drop policy if exists "Users can enroll themselves" on public.enrollments;

drop policy if exists "Users can view their own progress" on public.progress;
drop policy if exists "Users can insert their own progress" on public.progress;
drop policy if exists "Users can update their own progress" on public.progress;

drop policy if exists "Anyone can view categories" on public.categories;
drop policy if exists "Instructors can manage course categories" on public.course_categories;

-- =========================
--  POLICY DEFINITIONS
-- =========================

-- Users
create policy "Users can view their own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own data"
  on public.users for update
  using (auth.uid() = id);

create policy "Authenticated users can create their own user"
  on public.users for insert
  with check (auth.uid() = id);

-- Courses
create policy "Anyone can view published courses"
  on public.courses for select
  using (is_published = true);

create policy "Instructors can manage their own courses"
  on public.courses for all
  using (auth.uid() = instructor_id);

-- Lessons
create policy "Anyone can view published lessons"
  on public.lessons for select
  using (
    is_published = true and
    exists (
      select 1 from public.courses
       where courses.id = lessons.course_id and courses.is_published = true
    )
  );

create policy "Instructors can manage their own lessons"
  on public.lessons for all
  using (
    exists (
      select 1 from public.courses
        where courses.id = lessons.course_id and courses.instructor_id = auth.uid()
    )
  );

-- Enrollments
create policy "Users can view their own enrollments"
  on public.enrollments for select
  using (auth.uid() = user_id);

create policy "Users can enroll themselves"
  on public.enrollments for insert
  with check (auth.uid() = user_id);

-- Progress
create policy "Users can view their own progress"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.progress for update
  using (auth.uid() = user_id);

-- Categories
create policy "Anyone can view categories"
  on public.categories for select
  using (true);

-- Course-Categories join table
create policy "Instructors can manage course categories"
  on public.course_categories for all
  using (
    exists (
      select 1 from public.courses
       where courses.id = course_categories.course_id
         and courses.instructor_id = auth.uid()
    )
  );

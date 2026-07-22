-- =========================================================
-- Kafaat Platform — Database Schema (Supabase / PostgreSQL)
-- =========================================================
-- Run this once in your Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run)
-- =========================================================

-- Enable UUID generator
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- 1) profiles — one row per authenticated user (auth.users)
-- ---------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null default 'expert' check (role in ('expert','project_owner','admin')),
  is_admin boolean not null default false,
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ---------------------------------------------------------
-- 2) expert_profiles — the "كفاءات" directory
-- ---------------------------------------------------------
create table if not exists public.expert_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  title text not null,
  email text,
  country text not null,
  city text,
  field text not null,
  years_experience int not null default 0,
  skills text[] not null default '{}',
  languages text[] not null default '{}',
  bio text,
  linkedin_url text,
  avatar_emoji text default '🧑‍💼',
  available boolean not null default true,
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.expert_profiles enable row level security;

create policy "expert profiles are viewable by everyone"
  on public.expert_profiles for select
  using (true);

create policy "anyone can submit an expert profile"
  on public.expert_profiles for insert
  with check (user_id is null or auth.uid() = user_id);

create policy "users can update their own expert profile"
  on public.expert_profiles for update
  using (
    auth.uid() = user_id
    or (user_id is null and email = auth.jwt() ->> 'email')
  )
  with check (
    auth.uid() = user_id
    or (user_id is null and email = auth.jwt() ->> 'email')
  );

-- ---------------------------------------------------------
-- 3) projects — مشاريع واستشارات
-- ---------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text not null,
  field text not null,
  budget_min int,
  budget_max int,
  duration text,
  work_type text default 'عن بُعد',
  status text not null default 'open' check (status in ('open','in-progress','closed')),
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "projects are viewable by everyone"
  on public.projects for select
  using (true);

create policy "anyone can post a project"
  on public.projects for insert
  with check (owner_id is null or auth.uid() = owner_id);

create policy "owners can update their own projects"
  on public.projects for update
  using (auth.uid() = owner_id);

-- ---------------------------------------------------------
-- 4) project_applications — طلب خبير للتقدم على مشروع
-- ---------------------------------------------------------
create table if not exists public.project_applications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  expert_id uuid not null references public.expert_profiles(id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending','accepted','rejected')),
  created_at timestamptz not null default now(),
  unique(project_id, expert_id)
);

alter table public.project_applications enable row level security;

create policy "applications viewable by project owner and applicant"
  on public.project_applications for select
  using (
    auth.uid() in (
      select owner_id from public.projects where id = project_id
      union
      select user_id from public.expert_profiles where id = expert_id
    )
  );

create policy "experts can apply to projects"
  on public.project_applications for insert
  with check (
    auth.uid() = (select user_id from public.expert_profiles where id = expert_id)
  );

-- ---------------------------------------------------------
-- 5) mentorship_sessions — برنامج الإرشاد المهني
-- ---------------------------------------------------------
create table if not exists public.mentorship_sessions (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references public.expert_profiles(id) on delete cascade,
  requester_email text not null,
  requester_name text not null,
  topic text,
  status text not null default 'requested' check (status in ('requested','scheduled','completed','cancelled')),
  created_at timestamptz not null default now()
);

alter table public.mentorship_sessions enable row level security;

create policy "mentors can view their sessions"
  on public.mentorship_sessions for select
  using (auth.uid() = (select user_id from public.expert_profiles where id = mentor_id));

create policy "anyone can request a session"
  on public.mentorship_sessions for insert
  with check (true);

-- ---------------------------------------------------------
-- 6) knowledge_articles — مركز المعرفة
-- ---------------------------------------------------------
create table if not exists public.knowledge_articles (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete set null,
  author_name text not null,
  title text not null,
  description text,
  field text,
  icon text default '📄',
  created_at timestamptz not null default now()
);

alter table public.knowledge_articles enable row level security;

create policy "articles are viewable by everyone"
  on public.knowledge_articles for select using (true);

create policy "authenticated users can publish articles"
  on public.knowledge_articles for insert
  with check (auth.uid() is not null);

-- ---------------------------------------------------------
-- 7) courses — دورات تدريبية مجانية
-- ---------------------------------------------------------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  instructor_id uuid references public.profiles(id) on delete set null,
  instructor_name text not null,
  title text not null,
  country text,
  field text,
  duration text,
  level text default 'مبتدئ',
  student_count int default 0,
  format text default 'عن بُعد',
  icon text default '📚',
  created_at timestamptz not null default now()
);

alter table public.courses enable row level security;

create policy "courses are viewable by everyone"
  on public.courses for select using (true);

create policy "authenticated users can create courses"
  on public.courses for insert
  with check (auth.uid() is not null);

-- ---------------------------------------------------------
-- 8) contact_messages — نموذج تواصل معنا
-- ---------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "anyone can send a contact message"
  on public.contact_messages for insert
  with check (true);

create policy "only admins can read contact messages"
  on public.contact_messages for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- ---------------------------------------------------------
-- Helpful indexes
-- ---------------------------------------------------------
create index if not exists idx_expert_profiles_field on public.expert_profiles(field);
create index if not exists idx_expert_profiles_country on public.expert_profiles(country);
create index if not exists idx_projects_status on public.projects(status);
create index if not exists idx_projects_field on public.projects(field);

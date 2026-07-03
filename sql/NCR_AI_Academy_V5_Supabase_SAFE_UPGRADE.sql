-- N.C.R AI Academy V5 — SAFE UPGRADE / MIGRATION
-- À utiliser si tu avais déjà installé la V3 sur Supabase.
-- Ce script ajoute les tables/colonnes manquantes et recrée proprement les policies.

create extension if not exists "pgcrypto";

-- =========================================================
-- TABLES DE BASE
-- =========================================================

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text check (role in ('stagiaire','formateur','admin')) default 'stagiaire',
  job text,
  company text,
  cohort_id text,
  created_at timestamp with time zone default now()
);

alter table profiles add column if not exists full_name text;
alter table profiles add column if not exists role text default 'stagiaire';
alter table profiles add column if not exists job text;
alter table profiles add column if not exists company text;
alter table profiles add column if not exists cohort_id text;
alter table profiles add column if not exists created_at timestamp with time zone default now();

create table if not exists courses (
  id text primary key,
  title text not null,
  audience text,
  duration text,
  level text,
  description text,
  outcomes jsonb default '[]',
  modules jsonb default '[]',
  created_at timestamp with time zone default now()
);

create table if not exists cohorts (
  id text primary key,
  name text not null,
  company text,
  course_id text references courses(id) on delete set null,
  start_date date,
  status text default 'Préparation',
  created_at timestamp with time zone default now()
);

-- =========================================================
-- MODULES
-- =========================================================

create table if not exists modules (
  id text primary key,
  sort_order int,
  track text,
  badge text,
  title text not null,
  duration text,
  difficulty text,
  outcome text,
  description text,
  lessons jsonb default '[]',
  activity text,
  criteria jsonb default '[]',
  created_at timestamp with time zone default now()
);

alter table modules add column if not exists sort_order int;
alter table modules add column if not exists track text;
alter table modules add column if not exists badge text;
alter table modules add column if not exists duration text;
alter table modules add column if not exists difficulty text;
alter table modules add column if not exists outcome text;
alter table modules add column if not exists description text;
alter table modules add column if not exists lessons jsonb default '[]';
alter table modules add column if not exists resources jsonb default '[]';
alter table modules add column if not exists activity text;
alter table modules add column if not exists criteria jsonb default '[]';
alter table modules add column if not exists created_at timestamp with time zone default now();

create table if not exists module_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  module_id text references modules(id) on delete cascade,
  completed boolean default false,
  completed_at timestamp with time zone,
  unique(user_id, module_id)
);

-- =========================================================
-- PROMPTS
-- =========================================================

create table if not exists prompts (
  id text primary key,
  role text,
  objective text,
  level text,
  title text not null,
  description text,
  content text not null,
  created_at timestamp with time zone default now()
);

alter table prompts add column if not exists role text;
alter table prompts add column if not exists objective text;
alter table prompts add column if not exists level text;
alter table prompts add column if not exists description text;
alter table prompts add column if not exists content text;
alter table prompts add column if not exists created_at timestamp with time zone default now();

create table if not exists prompt_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  prompt_id text references prompts(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, prompt_id)
);

-- =========================================================
-- DOCUMENTS
-- =========================================================

create table if not exists documents (
  id text primary key,
  title text not null,
  type text,
  category text,
  course text,
  description text,
  file_url text,
  visible boolean default true,
  created_at timestamp with time zone default now()
);

alter table documents add column if not exists type text;
alter table documents add column if not exists category text;
alter table documents add column if not exists course text;
alter table documents add column if not exists description text;
alter table documents add column if not exists file_url text;
alter table documents add column if not exists visible boolean default true;
alter table documents add column if not exists created_at timestamp with time zone default now();

-- =========================================================
-- DIAGNOSTIC / QCM / CERTIFICATS / MESSAGES
-- =========================================================

create table if not exists diagnostic_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  score int not null,
  answers jsonb not null,
  recommendation text,
  created_at timestamp with time zone default now()
);

create table if not exists quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  score int not null,
  passed boolean default false,
  answers jsonb,
  case_study text,
  certificate_id text,
  created_at timestamp with time zone default now()
);

alter table quiz_results add column if not exists certificate_id text;
alter table quiz_results add column if not exists case_study text;

create table if not exists certificates (
  id text primary key,
  user_id uuid references profiles(id) on delete cascade,
  course_id text references courses(id) on delete set null,
  score int,
  issued_at timestamp with time zone default now(),
  verification_status text default 'valid'
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references profiles(id) on delete cascade,
  receiver_id uuid references profiles(id) on delete set null,
  subject text not null,
  body text not null,
  read_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- =========================================================
-- RLS
-- =========================================================

alter table profiles enable row level security;
alter table courses enable row level security;
alter table cohorts enable row level security;
alter table modules enable row level security;
alter table module_progress enable row level security;
alter table prompts enable row level security;
alter table prompt_favorites enable row level security;
alter table documents enable row level security;
alter table diagnostic_results enable row level security;
alter table quiz_results enable row level security;
alter table certificates enable row level security;
alter table messages enable row level security;

create or replace function public.is_staff()
returns boolean
language sql
security definer
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
    and role in ('formateur','admin')
  );
$$;

-- =========================================================
-- DROP POLICIES EXISTANTES V3/V5 POUR ÉVITER LES CONFLITS
-- =========================================================

drop policy if exists "profiles_read_own" on profiles;
drop policy if exists "profiles_read_own_or_staff" on profiles;
drop policy if exists "profiles_update_own" on profiles;

drop policy if exists "courses_read" on courses;
drop policy if exists "cohorts_read_staff_or_member" on cohorts;

drop policy if exists "modules_read" on modules;
drop policy if exists "modules_read_authenticated" on modules;

drop policy if exists "prompts_read" on prompts;
drop policy if exists "prompts_read_authenticated" on prompts;

drop policy if exists "documents_read_visible" on documents;
drop policy if exists "documents_read_visible_authenticated" on documents;

drop policy if exists "progress_read_own" on module_progress;
drop policy if exists "progress_read_own_or_staff" on module_progress;
drop policy if exists "progress_write_own" on module_progress;
drop policy if exists "progress_update_own" on module_progress;

drop policy if exists "favorites_read_own" on prompt_favorites;
drop policy if exists "favorites_write_own" on prompt_favorites;
drop policy if exists "favorites_delete_own" on prompt_favorites;

drop policy if exists "diagnostic_read_own" on diagnostic_results;
drop policy if exists "diagnostic_read_own_or_staff" on diagnostic_results;
drop policy if exists "diagnostic_write_own" on diagnostic_results;

drop policy if exists "quiz_read_own" on quiz_results;
drop policy if exists "quiz_read_own_or_staff" on quiz_results;
drop policy if exists "quiz_write_own" on quiz_results;

drop policy if exists "certificates_read_own_or_staff" on certificates;

drop policy if exists "messages_read_involved_or_staff" on messages;
drop policy if exists "messages_write_own" on messages;

-- =========================================================
-- CREATE POLICIES PROPRES
-- =========================================================

create policy "profiles_read_own_or_staff"
on profiles for select
using (auth.uid() = id or public.is_staff());

create policy "profiles_update_own"
on profiles for update
using (auth.uid() = id);

create policy "courses_read"
on courses for select
to authenticated
using (true);

create policy "cohorts_read_staff_or_member"
on cohorts for select
using (public.is_staff() or id in (select cohort_id from profiles where profiles.id = auth.uid()));

create policy "modules_read"
on modules for select
to authenticated
using (true);

create policy "prompts_read"
on prompts for select
to authenticated
using (true);

create policy "documents_read_visible"
on documents for select
to authenticated
using (visible = true);

create policy "progress_read_own_or_staff"
on module_progress for select
using (auth.uid() = user_id or public.is_staff());

create policy "progress_write_own"
on module_progress for insert
with check (auth.uid() = user_id);

create policy "progress_update_own"
on module_progress for update
using (auth.uid() = user_id);

create policy "favorites_read_own"
on prompt_favorites for select
using (auth.uid() = user_id);

create policy "favorites_write_own"
on prompt_favorites for insert
with check (auth.uid() = user_id);

create policy "favorites_delete_own"
on prompt_favorites for delete
using (auth.uid() = user_id);

create policy "diagnostic_read_own_or_staff"
on diagnostic_results for select
using (auth.uid() = user_id or public.is_staff());

create policy "diagnostic_write_own"
on diagnostic_results for insert
with check (auth.uid() = user_id);

create policy "quiz_read_own_or_staff"
on quiz_results for select
using (auth.uid() = user_id or public.is_staff());

create policy "quiz_write_own"
on quiz_results for insert
with check (auth.uid() = user_id);

create policy "certificates_read_own_or_staff"
on certificates for select
using (auth.uid() = user_id or public.is_staff());

create policy "messages_read_involved_or_staff"
on messages for select
using (auth.uid() = sender_id or auth.uid() = receiver_id or public.is_staff());

create policy "messages_write_own"
on messages for insert
with check (auth.uid() = sender_id);

-- Fin du script.

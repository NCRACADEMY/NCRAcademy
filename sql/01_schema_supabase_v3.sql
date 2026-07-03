-- N.C.R AI Academy V3 — Supabase Schema
-- À exécuter dans Supabase > SQL Editor.
-- Puis créer les comptes dans Authentication.

create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text check (role in ('stagiaire','formateur','admin')) default 'stagiaire',
  job text,
  company text,
  cohort text,
  created_at timestamp with time zone default now()
);

create table if not exists modules (
  id text primary key,
  title text not null,
  track text,
  badge text,
  description text,
  outcome text,
  duration text,
  difficulty text,
  lessons jsonb default '[]',
  resources jsonb default '[]',
  sort_order int default 0,
  created_at timestamp with time zone default now()
);

create table if not exists module_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  module_id text references modules(id) on delete cascade,
  completed boolean default false,
  completed_at timestamp with time zone,
  unique(user_id, module_id)
);

create table if not exists prompts (
  id text primary key,
  title text not null,
  role text,
  objective text,
  level text,
  description text,
  content text not null,
  created_at timestamp with time zone default now()
);

create table if not exists prompt_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  prompt_id text references prompts(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, prompt_id)
);

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
  created_at timestamp with time zone default now()
);

create table if not exists documents (
  id text primary key,
  title text not null,
  type text,
  category text,
  description text,
  file_url text,
  visible boolean default true,
  created_at timestamp with time zone default now()
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

alter table profiles enable row level security;
alter table modules enable row level security;
alter table module_progress enable row level security;
alter table prompts enable row level security;
alter table prompt_favorites enable row level security;
alter table diagnostic_results enable row level security;
alter table quiz_results enable row level security;
alter table documents enable row level security;
alter table messages enable row level security;

-- Fonctions pratiques
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

-- Profils
drop policy if exists "profiles_read_own_or_staff" on profiles;
create policy "profiles_read_own_or_staff"
on profiles for select
using (auth.uid() = id or public.is_staff());

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own"
on profiles for update
using (auth.uid() = id);

-- Modules et prompts visibles pour tous les connectés
drop policy if exists "modules_read_authenticated" on modules;
create policy "modules_read_authenticated"
on modules for select
to authenticated
using (true);

drop policy if exists "prompts_read_authenticated" on prompts;
create policy "prompts_read_authenticated"
on prompts for select
to authenticated
using (true);

-- Progression
drop policy if exists "progress_read_own_or_staff" on module_progress;
create policy "progress_read_own_or_staff"
on module_progress for select
using (auth.uid() = user_id or public.is_staff());

drop policy if exists "progress_write_own" on module_progress;
create policy "progress_write_own"
on module_progress for insert
with check (auth.uid() = user_id);

drop policy if exists "progress_update_own" on module_progress;
create policy "progress_update_own"
on module_progress for update
using (auth.uid() = user_id);

-- Favoris
drop policy if exists "favorites_read_own" on prompt_favorites;
create policy "favorites_read_own"
on prompt_favorites for select
using (auth.uid() = user_id);

drop policy if exists "favorites_write_own" on prompt_favorites;
create policy "favorites_write_own"
on prompt_favorites for insert
with check (auth.uid() = user_id);

drop policy if exists "favorites_delete_own" on prompt_favorites;
create policy "favorites_delete_own"
on prompt_favorites for delete
using (auth.uid() = user_id);

-- Diagnostics
drop policy if exists "diagnostic_read_own_or_staff" on diagnostic_results;
create policy "diagnostic_read_own_or_staff"
on diagnostic_results for select
using (auth.uid() = user_id or public.is_staff());

drop policy if exists "diagnostic_write_own" on diagnostic_results;
create policy "diagnostic_write_own"
on diagnostic_results for insert
with check (auth.uid() = user_id);

-- QCM
drop policy if exists "quiz_read_own_or_staff" on quiz_results;
create policy "quiz_read_own_or_staff"
on quiz_results for select
using (auth.uid() = user_id or public.is_staff());

drop policy if exists "quiz_write_own" on quiz_results;
create policy "quiz_write_own"
on quiz_results for insert
with check (auth.uid() = user_id);

-- Documents
drop policy if exists "documents_read_visible_authenticated" on documents;
create policy "documents_read_visible_authenticated"
on documents for select
to authenticated
using (visible = true);

-- Messages
drop policy if exists "messages_read_involved_or_staff" on messages;
create policy "messages_read_involved_or_staff"
on messages for select
using (auth.uid() = sender_id or auth.uid() = receiver_id or public.is_staff());

drop policy if exists "messages_write_own" on messages;
create policy "messages_write_own"
on messages for insert
with check (auth.uid() = sender_id);

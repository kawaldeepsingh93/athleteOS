-- AthleteOS PostgreSQL schema
-- Run in Supabase SQL editor after enabling pgcrypto.

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  clerk_id text unique,
  name text not null,
  age smallint not null check (age between 13 and 90),
  height_cm numeric(5,1) not null,
  weight_kg numeric(5,1) not null,
  body_fat numeric(4,1),
  goal_weight_kg numeric(5,1),
  goal_body_fat numeric(4,1),
  activity_level text not null check (activity_level in ('sedentary','light','moderate','active','athlete')),
  equipment text not null check (equipment in ('bodyweight','dumbbells','gym')),
  diet_type text not null check (diet_type in ('vegetarian','eggetarian','non_vegetarian','vegan')),
  wake_time time not null default '05:30',
  sleep_time time not null default '22:00',
  unit_system text not null default 'metric' check (unit_system in ('metric','imperial')),
  start_date date not null default current_date,
  current_day integer not null default 1 check (current_day between 1 and 365),
  xp integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  logged_on date not null,
  weight_kg numeric(5,1) not null,
  waist_cm numeric(5,1),
  chest_cm numeric(5,1),
  arms_cm numeric(5,1),
  thigh_cm numeric(5,1),
  body_fat numeric(4,1),
  photo_url text,
  created_at timestamptz not null default now(),
  unique (user_id, logged_on)
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null check (category in ('push','pull','legs','core','run','mobility','full')),
  equipment text[] not null default array['bodyweight']
);

create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  day integer not null check (day between 1 and 365),
  logged_on date not null,
  title text not null,
  focus text[] not null,
  completed boolean not null default false,
  unique (user_id, day)
);

create table if not exists public.exercise_logs (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  exercise_id uuid references public.exercises (id),
  name text not null,
  category text not null,
  sets integer not null,
  reps integer not null,
  weight_kg numeric(5,1),
  duration_sec integer,
  completed boolean not null default false
);

create table if not exists public.runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  logged_on date not null,
  mode text not null check (mode in ('zone2','tempo','intervals','long')),
  distance_km numeric(5,2) not null,
  duration_min numeric(6,2) not null,
  pace_min_per_km numeric(5,2) not null
);

create table if not exists public.foods (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  serving text not null,
  calories numeric(6,1) not null,
  protein numeric(5,1) not null,
  carbs numeric(5,1) not null,
  fat numeric(5,1) not null,
  vegetarian boolean not null default true,
  vegan boolean not null default false,
  contains_egg boolean not null default false
);

create table if not exists public.nutrition_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  food_id uuid references public.foods (id),
  logged_on date not null,
  name text not null,
  servings numeric(4,1) not null default 1,
  calories numeric(6,1) not null,
  protein numeric(5,1) not null,
  carbs numeric(5,1) not null,
  fat numeric(5,1) not null
);

create table if not exists public.sleep_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  logged_on date not null,
  hours numeric(3,1) not null,
  recovery_score smallint not null check (recovery_score between 0 and 100),
  sunlight boolean not null default false,
  unique (user_id, logged_on)
);

create table if not exists public.water_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  logged_on date not null,
  liters numeric(3,1) not null,
  unique (user_id, logged_on)
);

create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  day integer not null check (day between 1 and 365),
  title text not null,
  brief text not null,
  unlocked boolean not null default false,
  completed boolean not null default false,
  completed_at timestamptz,
  unique (user_id, day)
);

create table if not exists public.mission_tasks (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions (id) on delete cascade,
  category text not null check (category in ('run','strength','protein','water','mobility','sleep')),
  label text not null,
  completed boolean not null default false
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null
);

create table if not exists public.user_achievements (
  user_id uuid not null references public.users (id) on delete cascade,
  achievement_id uuid not null references public.achievements (id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create table if not exists public.streaks (
  user_id uuid primary key references public.users (id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_completed_on date
);

create table if not exists public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  role text not null check (role in ('user','coach')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists measurements_user_date_idx on public.measurements (user_id, logged_on desc);
create index if not exists workouts_user_day_idx on public.workouts (user_id, day);
create index if not exists exercise_logs_user_idx on public.exercise_logs (user_id, workout_id);
create index if not exists runs_user_date_idx on public.runs (user_id, logged_on desc);
create index if not exists nutrition_logs_user_date_idx on public.nutrition_logs (user_id, logged_on);
create index if not exists sleep_logs_user_date_idx on public.sleep_logs (user_id, logged_on desc);
create index if not exists water_logs_user_date_idx on public.water_logs (user_id, logged_on desc);
create index if not exists missions_user_day_idx on public.missions (user_id, day);
create index if not exists coach_messages_user_created_idx on public.coach_messages (user_id, created_at desc);

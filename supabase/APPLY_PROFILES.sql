-- Paste into Supabase SQL Editor and Run.
-- Adds user profiles and week-by-week progress.

create table if not exists public.profiles (
  athlete_id uuid primary key references public.athletes (id) on delete cascade,
  name text not null,
  age smallint not null,
  height_cm numeric(5,1) not null,
  weight_kg numeric(5,1) not null,
  body_fat numeric(4,1),
  goal_weight_kg numeric(5,1),
  goal_body_fat numeric(4,1),
  activity_level text not null,
  equipment text not null,
  diet_type text not null,
  wake_time text not null,
  sleep_time text not null,
  unit_system text not null default 'metric',
  start_date date not null,
  current_day integer not null default 1,
  xp integer not null default 0,
  streak integer not null default 0,
  longest_streak integer not null default 0,
  daily_calories integer,
  protein_g integer,
  water_l numeric(3,1),
  updated_at timestamptz not null default now()
);

create table if not exists public.weekly_progress (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes (id) on delete cascade,
  week integer not null check (week between 1 and 53),
  start_day integer not null,
  end_day integer not null,
  days_completed integer not null default 0,
  workouts_completed integer not null default 0,
  protein_hit_days integer not null default 0,
  avg_weight_kg numeric(5,1),
  avg_sleep_hours numeric(3,1),
  water_avg_l numeric(3,1),
  run_km numeric(6,2) not null default 0,
  xp_earned integer not null default 0,
  streak integer not null default 0,
  summary text,
  updated_at timestamptz not null default now(),
  unique (athlete_id, week)
);

create index if not exists weekly_progress_athlete_week_idx
  on public.weekly_progress (athlete_id, week);

alter table public.profiles enable row level security;
alter table public.weekly_progress enable row level security;

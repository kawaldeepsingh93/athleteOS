-- AthleteOS persistence without requiring Supabase Auth / Clerk.
-- Service role writes from Next.js API routes.

create table if not exists public.athletes (
  id uuid primary key,
  snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blood_reports (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes (id) on delete cascade,
  logged_on date not null,
  lab_name text not null default 'Manual entry',
  notes text,
  markers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.supplement_logs (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes (id) on delete cascade,
  logged_on date not null,
  supplement_id text not null,
  name text not null,
  taken boolean not null default false
);

create table if not exists public.protocols (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes (id) on delete cascade,
  source text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
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

create index if not exists athletes_updated_idx on public.athletes (updated_at desc);
create index if not exists blood_reports_athlete_idx on public.blood_reports (athlete_id, logged_on desc);
create index if not exists supplement_logs_athlete_idx on public.supplement_logs (athlete_id, logged_on);
create index if not exists protocols_athlete_idx on public.protocols (athlete_id, created_at desc);

alter table public.athletes enable row level security;
alter table public.blood_reports enable row level security;
alter table public.supplement_logs enable row level security;
alter table public.protocols enable row level security;
alter table public.foods enable row level security;

drop policy if exists "foods_read" on public.foods;
create policy "foods_read" on public.foods for select using (true);

insert into public.foods (slug, name, serving, calories, protein, carbs, fat, vegetarian, vegan, contains_egg)
values
  ('egg', 'Egg', '1 large', 78, 6.3, 0.6, 5.3, true, false, true),
  ('paneer', 'Paneer', '100g', 265, 18, 1.2, 21, true, false, false),
  ('dal', 'Dal', '1 cup cooked', 198, 12, 34, 1.5, true, true, false),
  ('rajma', 'Rajma', '1 cup', 225, 15, 40, 0.9, true, true, false),
  ('chana', 'Chana', '1 cup', 269, 15, 45, 4, true, true, false),
  ('oats', 'Oats', '40g dry', 150, 5, 27, 3, true, true, false),
  ('milk', 'Milk', '250ml', 150, 8, 12, 8, true, false, false),
  ('soya', 'Soya chunks', '50g dry', 170, 26, 15, 1, true, true, false)
on conflict (slug) do nothing;

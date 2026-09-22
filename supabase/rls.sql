alter table public.users enable row level security;
alter table public.measurements enable row level security;
alter table public.workouts enable row level security;
alter table public.exercise_logs enable row level security;
alter table public.runs enable row level security;
alter table public.nutrition_logs enable row level security;
alter table public.sleep_logs enable row level security;
alter table public.water_logs enable row level security;
alter table public.missions enable row level security;
alter table public.mission_tasks enable row level security;
alter table public.user_achievements enable row level security;
alter table public.streaks enable row level security;
alter table public.coach_messages enable row level security;

-- Catalog tables are readable by authenticated users.
alter table public.foods enable row level security;
alter table public.exercises enable row level security;
alter table public.achievements enable row level security;

create policy "users_own_row" on public.users
  for all using (id = auth.uid()) with check (id = auth.uid());

create policy "measurements_own" on public.measurements
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "workouts_own" on public.workouts
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "exercise_logs_own" on public.exercise_logs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "runs_own" on public.runs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "nutrition_own" on public.nutrition_logs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "sleep_own" on public.sleep_logs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "water_own" on public.water_logs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "missions_own" on public.missions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "mission_tasks_own" on public.mission_tasks
  for all using (
    exists (select 1 from public.missions m where m.id = mission_id and m.user_id = auth.uid())
  );

create policy "user_achievements_own" on public.user_achievements
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "streaks_own" on public.streaks
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "coach_own" on public.coach_messages
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "foods_read" on public.foods for select using (true);
create policy "exercises_read" on public.exercises for select using (true);
create policy "achievements_read" on public.achievements for select using (true);

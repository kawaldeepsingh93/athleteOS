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
alter table public.foods enable row level security;
alter table public.exercises enable row level security;
alter table public.achievements enable row level security;

drop policy if exists "users_own_row" on public.users;
create policy "users_own_row" on public.users
  for all using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "measurements_own" on public.measurements;
create policy "measurements_own" on public.measurements
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "workouts_own" on public.workouts;
create policy "workouts_own" on public.workouts
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "exercise_logs_own" on public.exercise_logs;
create policy "exercise_logs_own" on public.exercise_logs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "runs_own" on public.runs;
create policy "runs_own" on public.runs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "nutrition_own" on public.nutrition_logs;
create policy "nutrition_own" on public.nutrition_logs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "sleep_own" on public.sleep_logs;
create policy "sleep_own" on public.sleep_logs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "water_own" on public.water_logs;
create policy "water_own" on public.water_logs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "missions_own" on public.missions;
create policy "missions_own" on public.missions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "mission_tasks_own" on public.mission_tasks;
create policy "mission_tasks_own" on public.mission_tasks
  for all using (
    exists (select 1 from public.missions m where m.id = mission_id and m.user_id = auth.uid())
  );

drop policy if exists "user_achievements_own" on public.user_achievements;
create policy "user_achievements_own" on public.user_achievements
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "streaks_own" on public.streaks;
create policy "streaks_own" on public.streaks
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "coach_own" on public.coach_messages;
create policy "coach_own" on public.coach_messages
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "foods_read" on public.foods;
create policy "foods_read" on public.foods for select using (true);

drop policy if exists "exercises_read" on public.exercises;
create policy "exercises_read" on public.exercises for select using (true);

drop policy if exists "achievements_read" on public.achievements;
create policy "achievements_read" on public.achievements for select using (true);

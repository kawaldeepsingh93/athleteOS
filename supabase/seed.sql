insert into public.foods (slug, name, serving, calories, protein, carbs, fat, vegetarian, vegan, contains_egg)
values
  ('egg', 'Egg', '1 large', 78, 6.3, 0.6, 5.3, true, false, true),
  ('paneer', 'Paneer', '100g', 265, 18, 1.2, 21, true, false, false),
  ('buffalo-paneer', 'Buffalo Paneer', '100g', 292, 20, 1, 23, true, false, false),
  ('dal', 'Dal', '1 cup cooked', 198, 12, 34, 1.5, true, true, false),
  ('rajma', 'Rajma', '1 cup', 225, 15, 40, 0.9, true, true, false),
  ('chana', 'Chana', '1 cup', 269, 15, 45, 4, true, true, false),
  ('oats', 'Oats', '40g dry', 150, 5, 27, 3, true, true, false),
  ('milk', 'Milk', '250ml', 150, 8, 12, 8, true, false, false),
  ('roti', 'Roti', '1 medium', 120, 3.5, 18, 3.5, true, true, false),
  ('rice', 'Rice', '1 cup cooked', 206, 4.3, 45, 0.4, true, true, false)
on conflict (slug) do nothing;

insert into public.achievements (slug, title, description)
values
  ('first-pullup', 'First Pull-up', 'You got your chin over the bar.'),
  ('hundred-pushups', '100 Push-ups', 'A hundred honest reps in a single day.'),
  ('sub30', 'Sub-30 5K', 'Five kilometers in under 30 minutes.'),
  ('eighty-club', '80kg Club', 'Logged an 80kg compound lift.'),
  ('streak-30', '30-Day Streak', 'A month without breaking the chain.')
on conflict (slug) do nothing;

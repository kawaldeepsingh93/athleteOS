# Folder Structure

```
athleteOS/
├── docs/                         Product + engineering docs
├── public/icon.svg
├── src/
│   ├── app/
│   │   ├── (app)/                Authenticated OS surfaces
│   │   │   ├── analytics/
│   │   │   ├── coach/
│   │   │   ├── dashboard/
│   │   │   ├── mission/
│   │   │   ├── nutrition/
│   │   │   ├── progress/
│   │   │   ├── run/
│   │   │   ├── settings/
│   │   │   └── workout/
│   │   ├── api/coach/            Edge AI route
│   │   ├── onboarding/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── manifest.ts
│   │   └── page.tsx              Marketing
│   ├── components/
│   │   ├── charts/
│   │   ├── layout/app-shell.tsx
│   │   ├── mission/celebration.tsx
│   │   └── ui/                   Design system
│   └── lib/
│       ├── data/                 Foods + demo athlete
│       ├── engines/              Calories, workouts, missions, XP, running
│       ├── coach.ts
│       ├── store.ts              Zustand + persist
│       └── types.ts
└── supabase/
    ├── schema.sql
    ├── rls.sql
    ├── seed.sql
    └── functions/coach/
```

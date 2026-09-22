# AthleteOS

A premium **365-Day Athlete Transformation Operating System**.

> Win Today. Unlock Tomorrow.

Duolingo progression, WHOOP recovery language, Nike Training Club programming — built as a Product Hunt-ready Next.js 15 app.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- **Begin** — generate your own Day 1
- **Preview Day 27** — live demo athlete (Arjun, streak 12)

No Clerk, Supabase, or OpenAI keys required. The coach uses a local engine until `OPENAI_API_KEY` is set.

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind v4 · shadcn-style primitives · Framer Motion · Recharts · Zustand · OpenAI (optional) · Clerk/Supabase (documented)

## Product surfaces

| Route | Role |
| --- | --- |
| `/` | Cinematic landing |
| `/onboarding` | Metrics → targets → 12-month prediction |
| `/dashboard` | Daily home |
| `/mission` | Locked-day brief |
| `/workout` | Progressive overload + timers |
| `/run` | Zone 2 / tempo / intervals / long |
| `/nutrition` | Indian foods, one-tap protein |
| `/progress` | Measurements, prediction, achievements |
| `/coach` | Supportive, disciplined AI |
| `/analytics` | Trends + streak calendar |
| `/settings` | Units, notifications, export |

## Deliverables

1. [Product Requirements](docs/PRD.md)
2. [Information Architecture](docs/INFORMATION_ARCHITECTURE.md)
3. [User Flows](docs/USER_FLOWS.md)
4. [Wireframes](docs/WIREFRAMES.md)
5. High-fidelity UI — the running app
6. [Design System](docs/DESIGN_SYSTEM.md)
7. Component library — `src/components/ui`
8. [Database Schema](supabase/schema.sql) + [RLS](supabase/rls.sql)
9. [API Specification](docs/API.md)
10. [Folder Structure](docs/FOLDER_STRUCTURE.md)
11. Full Next.js implementation — `src/`
12. [Supabase setup](docs/DEPLOYMENT.md)
13. AI integration — `src/app/api/coach` + `src/lib/coach.ts`
14. [Deployment guide](docs/DEPLOYMENT.md)
15. [Future roadmap](docs/ROADMAP.md)

## Keyboard

`⌘⇧` + `D` Dashboard · `M` Mission · `W` Workout · `R` Run · `N` Nutrition · `C` Coach · `A` Analytics · `S` Settings

# AthleteOS Product Requirements Document

## 1. Product

AthleteOS is a premium 365-day athlete transformation operating system. It is not a generic fitness tracker. Every day is a mission. Tomorrow stays locked until today is complete.

**Promise:** Win Today. Unlock Tomorrow.

**Category:** Consumer SaaS · Human performance OS  
**Launch posture:** Product Hunt + web-first, React Native later.

## 2. Problem

Ordinary people do not fail for lack of programs. They fail because:

- Apps dump infinite content instead of one locked mission
- Nutrition is Western-default and friction-heavy
- Coaching is either generic or guilt-based
- Progress is charts without a story
- Recovery is ignored until injury

## 3. Audience

Primary: 22–40, wants fat loss, athletic aesthetics, strength, posture, running, and discipline. Not bodybuilding.

Jobs to be done:

1. Tell me exactly what to do today
2. Make tomorrow feel earned
3. Help me hit protein with Indian food
4. Adjust when I sleep badly, travel, or eat out — without shame

## 4. Principles

- One unlocked day at a time
- Supportive and disciplined, never guilty
- Athletic aesthetics only
- Indian-first nutrition
- Progressive overload is automatic
- Premium, quiet, addictive

## 5. Scope (v1)

| Surface | Outcome |
| --- | --- |
| Onboarding | Profile, targets, standards, 12-month roadmap, athlete prediction |
| Dashboard | Hero (day/streak/XP), workout, protein, water, sleep, weight |
| Mission | Six-task brief; lock/unlock; celebration |
| Workout | Push/pull/legs/full/run/mobility + timers |
| Run | Zone 2, tempo, intervals, long, PB, pace trend |
| Nutrition | Indian DB + quick add |
| Progress | Measurements, prediction slider, achievements |
| Coach | Chat + local/OpenAI fallback |
| Analytics | Weight, pace, protein, sleep, streak calendar |
| Settings | Units, notifications, privacy, export |

Out of scope for v1: computer vision, HealthKit/Garmin, marketplace, billing UI.

## 6. Success metrics

- D1 mission completion ≥ 70%
- D7 streak retention ≥ 40%
- Protein target hit rate ≥ 60% of active days
- Coach used ≥ 2 times in first week
- Lighthouse performance ≥ 95 on dashboard

## 7. Non-functional

- Next.js 15 App Router, React 19, TypeScript
- Offline-ready local store; Supabase when configured
- Edge coach route
- Accessibility: focus rings, labels, reduced motion
- Haptics-ready (`navigator.vibrate` wrapper)

## 8. Risks

- Over-gamification can feel childish — keep motion restrained
- Body-fat visuals must stay labeled as estimates
- Auth/data vendors optional so the demo never bricks

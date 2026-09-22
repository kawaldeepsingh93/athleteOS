# Deployment Guide

## 1. Local

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The product is fully usable without keys.

## 2. Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Recommended | Canonical URL / OG |
| `OPENAI_API_KEY` | Optional | Live coach |
| `OPENAI_MODEL` | Optional | Default `gpt-4o-mini` |
| Clerk keys | Optional | Production auth |
| Supabase keys | Optional | Production data |

## 3. Vercel

1. Import the Git repo
2. Framework: Next.js
3. Add env vars
4. Deploy

Edge function: `src/app/api/coach/route.ts` (`export const runtime = "edge"`).

## 4. Supabase

1. Create a project
2. Run `supabase/schema.sql`
3. Run `supabase/rls.sql`
4. Run `supabase/seed.sql`
5. Deploy `supabase/functions/coach`

Clerk JWT → Supabase: map `auth.uid()` after adding a Clerk third-party auth provider, or store `clerk_id` on `users` and resolve in a server action.

## 5. Clerk (optional)

```bash
npm install @clerk/nextjs
```

Wrap `src/app/layout.tsx` with `ClerkProvider`, add `middleware.ts`, and send onboarded users to `/dashboard`.

## 6. Performance checklist

- Dashboard is client-state; keep cards memoized
- Recharts and Lucide are optimized via `optimizePackageImports`
- Images: AVIF/WebP when photo uploads land
- PWA manifest at `/manifest.webmanifest`

## 7. Notifications

When web push is enabled:

- 05:00 — “Your mission is waiting.”
- 21:30 — “Sleep wins tomorrow's workout.”

Honor Settings toggles. Never add extra daily pings in v1.

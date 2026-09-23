# Deploy AthleteOS on GitHub Pages

GitHub Pages serves static files only. The live site is a static export. Progress stays in the browser. The onboarded coach and lab engine still work. OpenAI/Supabase server routes stay available when you run `npm run dev` or Vercel.

Live URL after deploy:

**https://kawaldeepsingh93.github.io/athleteOS/**

## One-time GitHub setup

1. Open [github.com/kawaldeepsingh93/athleteOS/settings/pages](https://github.com/kawaldeepsingh93/athleteOS/settings/pages)
2. **Build and deployment → Source** = **GitHub Actions**
3. Commit and push these changes to `main`

```bash
git add .
git commit -m "Deploy AthleteOS on GitHub Pages"
git push origin main
```

4. Open **Actions** and wait for **Deploy GitHub Pages** to finish (green)
5. Visit https://kawaldeepsingh93.github.io/athleteOS/

If the first deploy fails with a Pages permission error, enable **Settings → Actions → General → Workflow permissions → Read and write**.

## Local static build

```bash
npm run pages
```

Output is `out/`. The API folder is parked during the build and restored after.

## What works on Pages

- Landing, onboarding, dashboard, missions, workouts, run, nutrition, labs, progress, coach
- Local coach + lab protocol (no server key)
- Browser save (Zustand)

## What needs Vercel for full power

- `/api/coach` with OpenAI
- `/api/athlete` service-role sync to Supabase
- `/api/migrate`

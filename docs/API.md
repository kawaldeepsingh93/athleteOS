# API Specification

AthleteOS v1 ships a local-first client. HTTP is used for AI. Supabase tables are the production contract.

## `POST /api/coach`

Edge runtime. Adjusts today's plan from natural language.

```json
{
  "message": "I slept only 5 hours.",
  "athlete": {
    "name": "Arjun",
    "day": 27,
    "streak": 12,
    "xp": 4280,
    "diet": "eggetarian",
    "equipment": "dumbbells",
    "protein": 148,
    "sleepTime": "22:00"
  }
}
```

Response:

```json
{
  "reply": "Low sleep is a recovery problem...",
  "provider": "local" 
}
```

`provider` is `openai` when `OPENAI_API_KEY` is set.

Errors: `400` missing message.

## Future REST (Supabase)

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/rest/v1/missions?day=eq.{n}` | RLS scoped |
| POST | `/rest/v1/exercise_logs` | Toggle completion |
| POST | `/rest/v1/nutrition_logs` | Quick add |
| PATCH | `/rest/v1/water_logs` | Liters 0–5 |
| POST | `/rest/v1/runs` | Computes pace |
| POST | `/functions/v1/coach` | Edge twin of `/api/coach` |

## Client store actions

`completeOnboarding`, `toggleExercise`, `addFood`, `setWater`, `logSleep`, `logRun`, `completeDay`, `export` via Settings JSON download.

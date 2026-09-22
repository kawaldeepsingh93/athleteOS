# User Flows

## First-run

```mermaid
flowchart TD
  A[Landing] -->|Begin| B[Onboarding identity]
  B --> C[Body metrics]
  C --> D[Lifestyle]
  D --> E[Targets + prediction]
  E --> F[Day 1 dashboard]
  A -->|Preview Day 27| G[Hydrated demo athlete]
```

## Daily operating loop

```mermaid
flowchart TD
  A[Wake / 5:00 brief] --> B[Open Mission]
  B --> C[Train / Run]
  C --> D[Log protein + water]
  D --> E[Sleep + sunlight]
  E --> F{All tasks done?}
  F -->|No| B
  F -->|Yes| G[Celebration + XP]
  G --> H[Tomorrow unlocks]
```

## Coach adjustment

```mermaid
flowchart LR
  U[User message] --> API[/api/coach]
  API -->|OPENAI_API_KEY| O[OpenAI]
  API -->|missing key| L[Local rule engine]
  O --> R[Supportive action]
  L --> R
```

## Lock rule

Tomorrow is a locked node until `missions[currentDay].tasks.every(completed)`. Completing the day increments streak, grants 100 XP, and generates the next workout.

# Design System

## Brand

Premium dark. Apple-level density. Linear quietness. Duolingo progression without cartoon chrome.

**Accent** `#4F8CFF`  
**Success** `#22C55E`  
**Danger** `#E11D48`  
**Background** `#0B0D10`  
**Surface** `#12151A` · **Card** `#161A21` · **Line** `#232833`  
**Ink** `#F4F6F8` · **Muted** `#8B939E`

## Type

- Display: Syne (mission titles, day numbers)
- UI: Geist Sans
- Stats: Geist Mono / tabular-nums

## Elevation

Cards: 24px radius, 6% white border, soft shadow. Glass only on landing hero and chrome.

## Motion

Spring stiffness ~220, damping ~24. Completion uses a short scale-in overlay. Honor `prefers-reduced-motion` and Settings → Reduce motion.

## Components

`Button`, `Card`, `Input`, `Badge`, `Progress`, `RingProgress`, `Switch`, `Skeleton`, `EmptyState`, `Celebration`.

All primitives live in `src/components/ui` using `cva` + `cn` (shadcn pattern).

## Accessibility

- Visible focus rings in accent
- Switch/button labels
- Color is never the only status signal (copy + icon)
- Touch targets ≥ 40px on mobile nav

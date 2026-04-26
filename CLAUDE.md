# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server (localhost:3000)
npm run dev:turbo    # start with Turbopack (faster HMR)
npm run build        # production build
npm run start        # serve production build
npm run lint         # ESLint

npm run clean        # remove .next and node_modules/.cache
npm run dev:clean    # clean then dev (use when HMR breaks or chunk errors appear)
npm run build:fresh  # clean then build
```

There is no test suite configured.

**Stale webpack runtime** (symptoms: `Cannot find module './611.js'`, DevTools 404s for `layout.css`, etc.): stop all `next dev`/`next start` processes, run `npm run clean`, restart once, hard-refresh the browser.

## Stack

Next.js 15 App Router · React 18 · TypeScript · Tailwind CSS v4 · Framer Motion · Visx (radar charts) · Lucide React · no backend (all state in localStorage)

## Architecture

### Three Domains

The entire app is organized around three named domains: **YOU**, **COMPANY**, **WORK**. Every data model, nav section, ledger record, and routing decision maps to one of these.

### Provider Stack (root layout)

```
IngestLedgerProvider           # artifact ingestion state
  SovereignCommandProvider     # global audit/personality/deposition state
    DemoFirstTimeProvider      # first-time onboarding simulation toggle
      PersonalityHookOverlay   # DISC survey modal (global)
      DepositionOverlay        # 4-round Q&A bottom sheet (global)
      AppShell                 # LeftNav + main content + RightRailDrawer
```

### AppShell & Navigation

`AppShell` (`src/components/layout/AppShell.tsx`) wraps every page with `DiagnosticFocusProvider` and `RightRailDrawerProvider`, renders `LeftNav` (fixed left sidebar) and `RightRailDrawer` (slide-out evidence panel). Nav is locked on `/welcome` and `/you` until `personalityPhase1Complete`.

### Key Contexts

- **`SovereignCommandContext`** (`src/context/SovereignCommandContext.tsx`): the main app state — `auditCalibrationPercent`, personality phases, DISC archetype verdict, the active deposition session, logged testimony. Persisted to `localStorage["arborix:sovereign-command"]`.
- **`IngestLedgerProvider`** (`src/components/providers/IngestLedgerProvider.tsx`): manages the artifact ingestion log. Persisted to `localStorage["arborix:ingest-ledger-v2"]` (v1 key is a legacy migration path).
- **`RightRailDrawerContext`**: controls open/close + which `SovereignLedgerDomain` is shown in the right rail.

### Core Domain Libraries (`src/lib/`)

| File | Purpose |
|---|---|
| `sovereignLedgerDomain.ts` | Evidence records, artifact sources, chain-of-custody copy, storage key helpers per domain |
| `ingestLedger.ts` | `IngestLogRow` type, domain routing heuristics, localStorage serialization |
| `identityRadarModel.ts` | 8-axis radar math (Dominance, Influence, Steadiness, Conscientiousness, Agility, Pace, Priority, Empathy), natural vs. adaptive arrays, gap analysis copy |
| `personalityDisc.ts` | 2-question DISC survey → quadrant (D/I/S/C) + verdict line |
| `depositionFlow.ts` | 4-round deposition Q&A sequence |
| `masterSovereignLedger.ts` | Aggregate ledger across all three domains |
| `verdictRecalibration.ts` | Verdict copy adjustments |

### Design System

Tokens are defined in `src/lib/designTokens.ts` and wired as CSS custom properties in `src/app/globals.css`.

**Colors** (CSS vars `--color-arborix-*`):
- `--color-arborix-bg` `#FFFFFF` · `--color-arborix-text` `#131517` · `--color-arborix-meta` `#5C6166`
- `--color-arborix-accent` `#06B6D4` (cyan) · `--color-arborix-line` `#C0D6E9`

**Fonts**: `font-[family-name:var(--font-sofia)]` for body (Sofia Sans), `font-code` for monospace labels and IDs (Source Code Pro).

**Shape**: sharp corners everywhere (`rounded-none`); sheets only get `rounded-sheet-top` (12px top corners). Borders are 0.5px hairlines.

**Utility classes**: `frame-museum` — sharp border, 0.5px hairline, `bg-white/85`.

### Onboarding Flow

New users land at `/welcome` → complete the DISC personality survey (`PersonalityHookOverlay`) → `personalityPhase1Complete` flips true → nav unlocks → redirect to `/you`. The deposition (4-round Q&A) can be triggered from the YOU hub to deepen the sovereign record.

### localStorage Keys

All persistence is client-side:
- `arborix:sovereign-command` — global audit/personality state
- `arborix:ingest-ledger-v2` — ingestion log rows (v1 is migrated on read)
- `arborix:sovereign-ledger-sealed:{domain}` — sealed state per domain
- `arborix:sovereign-ledger-active:{domain}` — active toggle per domain
- `arborix:sovereign-ledger-custom:{domain}` — user-added ledger rows

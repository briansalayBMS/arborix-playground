# CSS Implementation Notes
April 2026 — for Brian

## Three files, one load order

```css
/* In your root layout or globals.css — in this order */
@import 'tokens.css';      /* All CSS custom properties */
@import 'arborix-grid.css'; /* Grid, layout, cards, shell */
@import 'arborix-ds.css';   /* Typography, components, utilities */
```

Tokens must load first. Grid and DS both consume token variables.

---

## What replaces what

| Old file / class | New replacement |
|---|---|
| Legacy `#131517` | `var(--color-primary)` in tokens.css |
| Legacy `#5C6166` | `var(--color-secondary)` |
| Legacy `#06B6D4` | `var(--color-blue)` |
| `--color-arborix-*` tokens | Deleted — all replaced above |
| Tailwind `border-slate-300` | `var(--color-border)` |
| Tailwind `text-slate-500` | `var(--color-secondary)` |
| `SummaryReveal` | Retire — `SummaryInstrument` is the one-pager component |

---

## Key values to know

```
Nav width:          200px  (--nav-width)
Content max-width:  1440px (--grid-max-width)
Column width:       76px   (--grid-column-width)
Gutter:             24px   (--grid-gutter)
Command Strip:      40px   (--height-lg, fixed bottom)

Card padding standard:  40px  (--card-padding)
Card padding large:     48px  (--card-padding-large)
Between major sections: 64px  (--section-gap)
Between cards in grid:  16px  (--card-gap)
```

---

## Card class quick reference

| Card type | Class | Padding |
|---|---|---|
| Standard card | `.arb-card` | 40px |
| Narrative, inquiry | `.arb-card-large` | 48px |
| Inquiry (with blue border) | `.arb-card-inquiry` | 40px / 48px |
| Evidence (3-col grid child) | `.arb-card-evidence` | 36px / 32px |
| Pattern (2-col grid child) | `.arb-card-pattern` | 32px / 36px |
| Surface (secondary info) | `.arb-card-surface` | 40px |

---

## Typography class quick reference

| Element | Class | Font |
|---|---|---|
| 40px verdict / archetype | `.statement-hero` | Instrument Serif |
| 24px inquiry question | `.statement-question` | Instrument Serif |
| 20px pattern title | `.statement-title` | Instrument Serif |
| 42px data number | `.data-number` | Instrument Serif |
| 18px body text | `.narrative-body` | Inter 300 |
| 20px Arbor's read | `.observation-body` | Inter 300 |
| 16px what's missing | `.gap-body` | Inter 300 |
| 14px section label | `.label-card` | Inter 400 uppercase |
| 12px axis labels | `.inter-sm` | Inter 400 uppercase |
| 12px all Auditor data | `.source-code` | Source Code Pro |

---

## Inferred radar state (new — Combo entry point)

When a user completes onboarding but has no sealed sessions yet, the radar
shows inferred data from resume extraction. Visual treatment:

```css
/* Polygon — dashed stroke at 40% opacity */
stroke-dasharray: 4 4;
stroke-opacity: 0.4;

/* Polygon fill — gradient at 4% (half of normal 8%) */
fill-opacity: 0.04;

/* Nodes — flat grey, no halo */
fill: var(--color-inferred);  /* #D2D2D7 */
r: 5px;  /* var(--viz-node-weak) */

/* Center label — "INFERRED" in Source Code Pro */
font-family: var(--font-mono);
font-size: 10px;
fill: var(--color-secondary);
```

On first session seal: transition to gradient nodes + solid polygon. This is
the most satisfying moment in the product — the transformation is the reward.

---

## Command Strip — padding-bottom

The main content area needs bottom padding to prevent content hiding
behind the fixed Command Strip:

```css
.arb-content {
  padding-bottom: calc(var(--height-lg) + var(--spacing-8x));
  /* 40px strip + 32px breathing room = 72px */
}
```

Already in arborix-grid.css. Confirm AppShell applies this.

---

## Line length enforcement

Prose containers inside wide cards need a max-width cap.
Do not reduce the card width — cap the text container inside it:

```jsx
/* Narrative card observation paragraph */
<p className="observation-body" style={{ maxWidth: 'var(--measure-body)' }}>
  {observation}
</p>

/* Inquiry question */
<p className="statement-question">
  {question}
  {/* max-width: var(--measure-inquiry) already in the class */}
</p>
```

---

## What is NOT in these files

- Color migration for the 62x `#131517`, 43x `#5C6166`, 24x `#06B6D4` instances
  in existing components — run the Claude Code terminology + token pass for those.
- Tailwind slate class replacements (90+ instances) — same pass.
- SVG radar polygon, nodes, and rings — implemented in IdentityRadar component,
  consumes CSS variables via JavaScript.
- Animation for ring chart stroke-dashoffset — implemented in component,
  consumes `--viz-ring-diameter` and `--viz-ring-stroke` from tokens.
- Dark mode — light mode only for MVP.
- Icon system — deferred.

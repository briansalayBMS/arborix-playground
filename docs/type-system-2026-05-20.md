# Arborix — Type System

Date: May 20, 2026
Status: Locked
Purpose: The typographic system that all Arborix surfaces consume. Every component renders type through this system. New surfaces inherit from it. Drift from it is a system bug, not a design choice.

## The commitment

The product is editorial. Editorial register requires consistent typographic hierarchy. The hierarchy holds because every component reads from the same system, in the same way.

This document defines the system. The accompanying tokens and utility classes are its expression in code.

## The scale

Eight tiers. Semantic names. Each tier serves a distinct rhetorical purpose.

**Display (48px).** The largest type in the product. Data-heavy moments where a number or a single phrase must carry display weight. Examples: "$4.2M" on an Impact Card, the pane detail heading when the subject is a single named object.

**Hero (44px).** The verdict register. Arbor's read of who the user is — both as multi-line synthesis (hero italic) and as named finding (archetype upright). The hero tier is where the product makes its most consequential statements about the user. Italic when Arbor speaks in coaching prose; upright when the product states a named identity.

**Head Large (32px).** Primary coaching beats. Goal items, welcome paragraphs, substantial reading that is not a verdict but carries weight. One register down from Hero.

**Head Medium (20px).** Operating Profile values, context subjects, secondary section content. The italic Fraunces inner-voice register at its larger scale.

**Body Large (18px).** The italic Fraunces inner-voice register at its primary scale. POV bodies, conflict questions, descriptions in italic. This is the register where Arbor speaks in coaching prose.

**Body (16px).** Standard Public Sans body. The product's default body type. Form inputs, buttons, longer reading.

**Meta (14px).** Supporting text. Captions, secondary lines, source labels in prose form.

**Eyebrow (12px).** Mono uppercase labels. Section labels, category labels, source attributions, navigation items. The system's smallest type tier.

## The values

The eight scale tokens, with their values:

```css
--ts-display:    48px;
--ts-hero:       44px;
--ts-head-lg:    32px;
--ts-head-md:    20px;
--ts-body-lg:    18px;
--ts-body:       16px;
--ts-meta:       14px;
--ts-eyebrow:    12px;
```

The five line-height tokens, with their semantic purposes:

```css
--leading-display:  1.0;     /* Display numerics, monograms, decorative initials */
--leading-snug:     1.25;    /* Italic Fraunces at large scale — Hero, Head Large */
--leading-base:     1.4;     /* Italic Fraunces at body scale — Body Large italic */
--leading-relaxed:  1.5;     /* Public Sans body, longer reading */
--leading-loose:    1.7;     /* Long-form coaching prose */
```

The two letter-spacing tokens:

```css
--tracking-tight:    -0.01em;  /* Hero and Display Fraunces, for optical balance */
--tracking-eyebrow:  0.06em;   /* All mono uppercase eyebrow labels */
```

## The recipes

Components consume composite utility classes, not atomic tokens. The composite encodes the recipe: family, style, weight, size, line-height, and letter-spacing as a single decision. A component cannot use one recipe's size with another recipe's leading.

The ten recipes:

```css
.text-display {
  font-family: var(--font-serif);
  font-style: normal;
  font-weight: 400;
  font-size: var(--ts-display);
  line-height: var(--leading-display);
  letter-spacing: var(--tracking-tight);
}

.text-hero-italic {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 350;
  font-size: var(--ts-hero);
  line-height: 1.18;
  letter-spacing: -0.005em;
}

.text-hero-upright {
  font-family: var(--font-serif);
  font-style: normal;
  font-weight: 400;
  font-size: var(--ts-hero);
  line-height: 1.12;
  letter-spacing: var(--tracking-tight);
}

.text-head-lg {
  font-family: var(--font-serif);
  font-style: normal;
  font-weight: 400;
  font-size: var(--ts-head-lg);
  line-height: var(--leading-display);
}

.text-head-lg-italic {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 350;
  font-size: var(--ts-head-lg);
  line-height: var(--leading-snug);
}

.text-head-md-italic {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 350;
  font-size: var(--ts-head-md);
  line-height: var(--leading-snug);
}

.text-body-lg-italic {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 350;
  font-size: var(--ts-body-lg);
  line-height: var(--leading-base);
}

.text-body {
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: var(--ts-body);
  line-height: var(--leading-relaxed);
}

.text-meta {
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: var(--ts-meta);
  line-height: var(--leading-base);
}

.text-eyebrow {
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: var(--ts-eyebrow);
  line-height: 1;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
}
```

## Consumption

Component CSS modules reference recipes via `composes`:

```css
.title {
  composes: text-hero-italic from "../../styles/typography.module.css";
}
```

Components do not declare font-size, font-family, font-style, font-weight, line-height, or letter-spacing directly. The recipe handles all six properties together. If a component appears to need a property variation, the question is: does the system need a new recipe, or is the component drifting?

The rule: drift is forbidden. A new recipe requires a deliberate addition to this document, not an inline override.

## What this system replaces

This system replaces:

- All component-local type declarations across the codebase
- The dead Tier-2 `--type-*` tokens in tokens.css
- The broken utility classes in arborix-ds.css that reference undeclared tokens
- The five eyebrow tracking variants (0.04, 0.05, 0.06, 0.08, 0.10) — collapsed to one
- The fourteen distinct line-height values in component CSS — collapsed to five
- The twenty-one distinct font-sizes in component CSS — collapsed to eight

## Migration mapping

The relationship between existing component types and the new recipes is documented in the migration plan (see `Step 7c` work item). Most components map cleanly to one recipe. A small number require visible size changes:

- ExternalHero title: 46px → 44px (Hero)
- ExternalPersonality archetypeName: 32px → 44px (Hero, upright)
- PersonalitySection archetypeName: 32px → 44px (Hero, upright)
- AuthShell heading: 36px → 44px (Hero, up)
- RightPane detailHeading: 36px → 44px (Hero, up)
- HomeWelcome paragraph: 30px → 32px (Head Large, up)
- WelcomeReading paragraph: 30px → 32px (Head Large, up)
- GoalRow number: 28px → 32px (Head Large)
- GoalRow title: 24px → 32px (Head Large)
- WelcomeReading moodOption: 24px → 20px (Head Medium, down)
- HomeWelcome moodOption: 24px → 20px (Head Medium, down)
- All italic Fraunces 16/17/18/19/20px → 18px (Body Large italic, except OperatingProfile value and RightPane contextSubject which stay at Head Medium 20px italic)
- All Public Sans 13/14/15px → 14px (Meta)
- All mono uppercase 10/11/12/13/14px → 12px (Eyebrow)
- All eyebrow tracking (0.04, 0.05, 0.06, 0.08, 0.10) → 0.06em
- GoalRow activity 10px mono → 12px (Eyebrow)
- GoalImpactChip dots 8px → 12px (Eyebrow) OR retain as one-off if 8px is intentional for the chip visual

The visible changes are deliberate. The product becomes more typographically coherent at the cost of small per-component size shifts.

## What is out of scope

This pass does not address:

- Spacing system reconciliation (`--spacing-Nx` vs `--space-*` naming drift)
- Off-grid pixel literals in component CSS (28 instances identified)
- Duplicate files (WelcomeReading vs HomeWelcome)
- The `arb-*` utility class family (legacy pre-pivot, may be removable)

These are separate cleanup passes tracked for future sessions.

## The rule going forward

Every new component CSS module composes from this typography module. Every new design surface starts with a recipe choice from this document. If a recipe does not exist, this document changes first; then the surface gets built.

This document is versioned. Changes to recipes require a deliberate audit of consumers.

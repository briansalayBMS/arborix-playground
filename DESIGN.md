---
name: "Arborix"
version: "0.2.0"
status: "alpha"
description: >
  A three-tier design system for Arborix, an AI coaching product that already
  knows the user's work. The system is built to support multiple product
  concepts in a single visual language. Composition flows one direction:
  primitives to semantic to components to surfaces.

# ============================================================
# TIER 1 — PRIMITIVES
# Raw values. The atomic alphabet of the system.
# Components and surfaces never reference this tier directly.
# ============================================================
primitives:
  color:
    ink:
      0:   "#ffffff"
      50:  "#f2efe6"
      100: "#e6e2d5"
      200: "#d2ccba"
      300: "#b0a896"
      400: "#857d6c"
      500: "#5e5749"
      600: "#423d33"
      700: "#2b2823"
      800: "#181613"
      900: "#0a0908"
    sienna:
      100: "#f4e5d9"
      200: "#e5c4a7"
      300: "#d19a6e"
      500: "#b05030"
      700: "#843620"
      800: "#5e2516"
      900: "#3a150a"
    tide:
      100: "#e3eced"
      200: "#c1d3d6"
      300: "#95b3b8"
      500: "#4d7c83"
      700: "#234b52"
      800: "#173238"
      900: "#0c1f23"
    forest:
      100: "#e0e8dc"
      200: "#bdcdb3"
      300: "#8da681"
      500: "#547548"
      700: "#2e4a25"
      800: "#1c3014"
      900: "#0d1c08"

  spacing:
    "0":  "0"
    "1":  "0.25rem"
    "2":  "0.5rem"
    "3":  "0.75rem"
    "4":  "1rem"
    "6":  "1.5rem"
    "8":  "2rem"
    "12": "3rem"
    "16": "4rem"
    "24": "6rem"
    "32": "8rem"

  typography:
    family:
      sans:  "Public Sans, system-ui, sans-serif"
      serif: "Fraunces, Georgia, serif"
      mono:  "JetBrains Mono, ui-monospace, monospace"
    size:
      xs:   "0.75rem"
      sm:   "0.875rem"
      base: "1rem"
      lg:   "1.125rem"
      xl:   "1.375rem"
      "2xl": "1.75rem"
      "3xl": "2.25rem"
      "4xl": "3rem"
      "5xl": "4.5rem"
    weight:
      regular:  400
      medium:   500
      semibold: 600
    leading:
      tight:  1.15
      snug:   1.35
      normal: 1.55

  radius:
    none: "0"
    sm:   "0.25rem"
    md:   "0.5rem"
    lg:   "0.875rem"
    full: "999px"

  border:
    thin:   "1px"
    medium: "2px"

  elevation:
    sm: "0 1px 2px rgba(14, 13, 11, 0.04)"
    md: "0 4px 16px rgba(14, 13, 11, 0.06), 0 1px 2px rgba(14, 13, 11, 0.04)"
    lg: "0 12px 40px rgba(14, 13, 11, 0.08), 0 2px 6px rgba(14, 13, 11, 0.04)"

  motion:
    duration:
      quick: "80ms"
      base:  "180ms"
    ease:
      standard: "cubic-bezier(0.3, 0, 0.2, 1)"

# ============================================================
# TIER 2 — SEMANTIC
# Tokens with meaning. Components consume this tier.
# Each token references a primitive, never a raw value.
# ============================================================
semantic:
  brand:
    active: "sienna"
    options: ["sienna", "tide", "forest"]
    "100": "{primitives.color.sienna.100}"
    "300": "{primitives.color.sienna.300}"
    "500": "{primitives.color.sienna.500}"
    "700": "{primitives.color.sienna.700}"
    "800": "{primitives.color.sienna.800}"

  color:
    surface:
      default: "{primitives.color.ink.50}"
      raised:  "{primitives.color.ink.0}"
      sunken:  "{primitives.color.ink.100}"
    text:
      primary:   "{primitives.color.ink.900}"
      secondary: "{primitives.color.ink.600}"
      tertiary:  "{primitives.color.ink.500}"
      inverse:   "{primitives.color.ink.0}"
    border:
      default: "{primitives.color.ink.200}"
      strong:  "{primitives.color.ink.300}"
    action:
      default: "{semantic.brand.700}"
      hover:   "{semantic.brand.800}"
      text:    "{primitives.color.ink.0}"
    accent: "{semantic.brand.500}"

  space:
    inset:
      sm: "{primitives.spacing.2}"
      md: "{primitives.spacing.4}"
      lg: "{primitives.spacing.6}"
    stack:
      sm: "{primitives.spacing.3}"
      md: "{primitives.spacing.6}"
      lg: "{primitives.spacing.12}"
    section: "{primitives.spacing.24}"

  radius:
    control: "{primitives.radius.sm}"
    surface: "{primitives.radius.md}"

  type:
    label:      "{primitives.typography.size.sm}"
    body:       "{primitives.typography.size.base}"
    heading:
      sm: "{primitives.typography.size.lg}"
      md: "{primitives.typography.size.2xl}"
      lg: "{primitives.typography.size.4xl}"
    display:    "{primitives.typography.size.5xl}"

# ============================================================
# TIER 3 — COMPONENTS
# Components compose semantic tokens. They are the assembly layer.
# ============================================================
components:
  button:
    primary:
      background:    "{semantic.color.action.default}"
      background_hover: "{semantic.color.action.hover}"
      color:         "{semantic.color.action.text}"
      padding_y:     "{semantic.space.inset.sm}"
      padding_x:     "{semantic.space.inset.md}"
      radius:        "{semantic.radius.control}"
      font:          "{primitives.typography.family.sans}"
      font_size:     "{semantic.type.label}"
      font_weight:   "{primitives.typography.weight.medium}"
    secondary:
      background:    "transparent"
      background_hover: "{semantic.color.surface.sunken}"
      color:         "{semantic.color.text.primary}"
      border_color:  "{semantic.color.border.strong}"
      border_width:  "{primitives.border.thin}"
      padding_y:     "{semantic.space.inset.sm}"
      padding_x:     "{semantic.space.inset.md}"
      radius:        "{semantic.radius.control}"
      font_size:     "{semantic.type.label}"
      font_weight:   "{primitives.typography.weight.medium}"

  input:
    background:      "{semantic.color.surface.raised}"
    color:           "{semantic.color.text.primary}"
    border_color:    "{semantic.color.border.default}"
    border_color_focus: "{semantic.color.action.default}"
    border_width:    "{primitives.border.thin}"
    padding_y:       "{semantic.space.inset.sm}"
    padding_x:       "{semantic.space.inset.md}"
    radius:          "{semantic.radius.control}"
    font_size:       "{semantic.type.body}"

  card:
    background:    "{semantic.color.surface.raised}"
    border_color:  "{semantic.color.border.default}"
    border_width:  "{primitives.border.thin}"
    padding:       "{semantic.space.inset.lg}"
    radius:        "{semantic.radius.surface}"
    shadow:        "{primitives.elevation.sm}"
    title_font:    "{primitives.typography.family.serif}"
    title_size:    "{semantic.type.heading.sm}"
    title_weight:  "{primitives.typography.weight.regular}"
    body_size:     "{primitives.typography.size.sm}"
    body_color:    "{semantic.color.text.secondary}"

  badge:
    background:    "{semantic.color.surface.sunken}"
    color:         "{semantic.color.text.secondary}"
    border_color:  "{semantic.color.border.default}"
    border_width:  "{primitives.border.thin}"
    padding_y:     "2px"
    padding_x:     "{semantic.space.inset.sm}"
    radius:        "{primitives.radius.full}"
    font_size:     "{primitives.typography.size.xs}"

accessibility:
  contrast_minimum: "WCAG AA"
  contrast_target:  "WCAG AAA where reasonable"
  tap_target_minimum: "44px"
  focus_indicator: "border color shifts to {semantic.color.action.default}"
  motion_reduce: "respect prefers-reduced-motion; quick and base durations collapse to 0"
---

# Arborix — Design System

A working contract for any agent or collaborator generating UI in this system. Read top to bottom before producing anything.

## Visual Theme and Atmosphere

Arborix is an AI coaching product for senior professionals. The user opens it on a Tuesday morning forty-seven minutes before a meeting that matters. They arrive capable, not panicked. They want help, not reassurance. The product already knows their work and meets them in the conversation already in progress.

The aesthetic register sits in the same room as the Paris Review interview, FT Weekend magazine, the Hermès notebook, and Dieter Rams' ET 66 calculator. Editorial paper carries the surface. Deep ink carries the text. A single confident sienna carries action and accent. Italic serif handles editorial moments. The result reads as warm without sentiment, rigorous without coldness, capable without performance.

The user is treated as an adult who can handle the real thing. Microcopy says the specific thing. Decoration earns its place or stays out. The trusted-colleague register sits underneath every decision: someone who has read the record, knows the user's work as well as the user does, and tells the truth.

The system supports multiple product concepts in this register simultaneously. No concept drives the system. The discipline that holds it together is one-direction composition, described below.

## Voice

Copy generated in this system follows these rules:

Speak in positives. Frame everything as a direct positive statement of what something is or what it does. Reach for "the system holds" over "the system doesn't break."

Avoid declarative summary sentences at the end of paragraphs. Let the content land on its own.

Skip em dashes. Use commas, periods, or a new sentence instead.

Skip corporate buzzwords and AI-product jargon (synergy, leverage, unlock, supercharge, revolutionary, paradigm shift).

Read it aloud. If it sounds like a person talking, ship it. If it sounds like a deck, rewrite.

## Composition Rule

Composition flows one direction. Always.

```
primitives  →  semantic  →  components  →  surfaces
```

Each tier consumes only the tier immediately beneath it.

Surfaces use components and semantic tokens. Surfaces never reach into primitives.

Components use semantic tokens. Components never reach into primitives.

Semantic tokens reference primitives. This is the only place primitives are touched.

Adding a primitive is a deliberate, system-level decision. It happens separately from any concept and rarely.

When a concept appears to need a value the system lacks, the first move is to find the nearest existing semantic token. The second move is to escalate to the system level and decide whether the semantic mapping should shift for everyone. Concept-specific primitives are not introduced.

## Color

The palette is a cool-buff ink scale paired with one swappable brand scale. Sienna is the default.

The ink scale (`primitives.color.ink.0` through `primitives.color.ink.900`) carries all surface, text, and border roles. The scale sits in a slightly cooler buff register than typical creams, which gives surfaces a Paris Review interior quality rather than a friendly-app warmth.

The brand scale is swappable at the semantic layer. Three brand options ship with the system: Sienna (a confident burnt red-orange, the Arborix default), Tide (a deep teal for cooler editorial moments), and Forest (a deep green for grounded, naturalist registers). Only one brand is active at a time. Swapping the brand at the semantic layer propagates through every component and surface without any component code being edited.

Sienna carries the meaning. The precedent is Dieter Rams' ET 66 calculator: a quiet object in cream and dark gray with a single moment of warm color. That single moment of color is the design idea. Arborix uses sienna sparingly. Primary buttons. One italic-highlighted phrase per surface. The occasional hairline rule. Used at this volume, the color becomes the recognizable mark of the product. Used everywhere, it loses its meaning.

Semantic color tokens carry purpose, not value. `semantic.color.action.default` is the primary call to action. `semantic.color.text.primary` is body copy. `semantic.color.surface.raised` is anything that sits above the page (cards, inputs, modals). These names describe role, which lets the underlying value change without touching anything downstream.

When generating UI, reach for semantic color tokens. Component-specific color tokens already exist for the five core components below; use them.

## Typography

Three families carry the system. The pairing was chosen to step away from the contemporary "considered tech product" signature (Instrument Serif + Geist, the Anthropic + Vercel houses) and toward something that reads "editorial product made by people who do real work."

`primitives.typography.family.sans` (Public Sans) handles body, labels, and UI text. It is the workhorse. Public Sans is a neutral utility sans designed by the US Web Design System team, which lets the serif carry the voice rather than competing with it. It appears most often.

`primitives.typography.family.serif` (Fraunces) handles editorial moments: hero headings, card titles, named sections, italic emphasis on a single phrase inside a sans heading. Fraunces is a variable serif by Undercase Type with optical sizing, a SOFT axis, and a WONK axis. At display sizes it sharpens into a confident editorial face. At smaller sizes it warms toward a book serif. The italic carries genuine character and is the system's signature editorial move. Used sparingly, it carries the system's voice. Used everywhere, it loses meaning.

`primitives.typography.family.mono` (JetBrains Mono) handles labels with technical weight: eyebrow text, token names, captions, index numbers. It signals "this is software for people who do real work" rather than "this is a person speaking." JetBrains Mono has more drawn character than the standard Geist Mono or IBM Plex Mono, which makes the mono moments feel intentional.

Numerals use slashed zero, applied at the body level via `font-variant-numeric: slashed-zero`. This activates the `zero` OpenType feature in JetBrains Mono and propagates anywhere the mono is used. Timestamps, counts, version numbers, and token values all read with the slashed form.

The type scale moves from `xs` (0.75rem) to `5xl` (4.5rem) across nine steps. Semantic mappings handle most cases:

`semantic.type.body` for paragraphs.

`semantic.type.label` for small UI labels.

`semantic.type.heading.sm`, `.md`, `.lg` for card titles, section subtitles, and page titles.

`semantic.type.display` for hero moments, paired with the serif family in italic.

Mixing Fraunces italic on a single highlighted word inside a sans heading is the system's signature editorial move. Use it once per surface, at most.

## Spacing

The system uses a base-4 scale (`primitives.spacing.1` through `primitives.spacing.32`).

Semantic spacing tokens describe relationships:

`semantic.space.inset.*` is padding inside components.

`semantic.space.stack.*` is vertical rhythm between related elements.

`semantic.space.section` is the gap between top-level page sections.

Surfaces should breathe. The system favors generous space, especially around hero typography and between major sections. Cramped layouts read as engineering, not design.

## Radii

Two semantic radii cover the system:

`semantic.radius.control` (sm, 0.25rem) for buttons, inputs, and any control with rectangular shape.

`semantic.radius.surface` (md, 0.5rem) for cards, frames, and modals.

`primitives.radius.full` is reserved for pills and circular elements (badges, brand swatches).

The geometry is deliberately sharper than the typical "friendly app" register. The Hermès notebook, the ET 66 calculator, and the Paris Review masthead share this quality. The system reads as "object made seriously" rather than "soft consumer product."

## Elevation

Three shadow levels carry hierarchy:

`primitives.elevation.sm` for resting cards and subtle separation.

`primitives.elevation.md` for hover states and emphasized cards.

`primitives.elevation.lg` for the composed surface frame (the simulated product window) and modals.

Shadows are warm, not gray. They use the ink color at low opacity rather than pure black, which keeps the paper quality intact.

## Motion

Two durations and one easing curve cover most motion:

`primitives.motion.duration.quick` (80ms) for hover transitions on buttons, inputs, and small UI.

`primitives.motion.duration.base` (180ms) for larger state changes, panel reveals, annotations.

`primitives.motion.ease.standard` (`cubic-bezier(0.3, 0, 0.2, 1)`) is the easing curve for all transitions. It is neutral and lands clean.

Motion acknowledges state changes and steps aside. The system follows Rams' "less but better" principle for time. Springs, bounces, and simulated physicality belong to a different aesthetic register.

Motion respects `prefers-reduced-motion`. When the user has it on, durations collapse to 0.

## Components

Five components form the working set. Each is defined in the YAML above with full token references. When generating UI, use these components directly. Do not invent variants.

**Button (Primary)** is the default call to action. One per primary surface. Use the primary action and primary text colors from semantic.

**Button (Secondary)** is the supporting action. It uses a transparent background with a strong border. Pair it with the primary button when offering an alternative path.

**Input** is the standard text field. Focus state shifts the border to the action color. Inputs sit on raised surfaces.

**Card** is the container for grouped content. The serif family carries the title at heading-sm size. The body uses smaller sans copy at secondary text color. Cards always sit on the default page surface.

**Badge** is the small status or tag indicator. Pill-shaped, sunken surface, secondary text color. Used for categories, tags, and lightweight metadata.

## Accessibility Floor

WCAG AA contrast is the minimum, not the target. The system was designed to clear AAA on body text against surface where reasonable.

Tap targets clear 44px minimum on touch surfaces.

Focus indicators shift border color to the action color and remain visible at all times when keyboard-navigating. Focus is never removed in favor of cosmetic cleanliness.

Motion respects `prefers-reduced-motion`.

## What to Generate

When asked to build a new surface or concept in this system:

Compose from existing components first. Reach for Button, Input, Card, Badge before writing custom markup.

Use semantic tokens for any spacing, color, type, or radius decision. Token references travel through this file as `{semantic.color.action.default}` and similar.

Use the serif family for one editorial moment per surface, often a hero heading with one italic-highlighted word in the accent color.

Allow generous whitespace. The system favors air around content.

Use the mono family for eyebrow labels, section numbers, and technical metadata.

## Microcopy Register

Microcopy is where Arborix is most often felt. The voice belongs to a trusted colleague who has read the record. Examples below show the register.

Hero copy on a Tuesday morning surface:

> "Tuesday. Board update in *47 minutes.* You stalled on the staff hire last week."

What this does: specifies time, specifies context, demonstrates the product knows the prior conversation, accents one phrase in sienna italic, treats the user as someone whose time is real.

Form labels:

> "The question right now"

> "What's actually bothering you"

> "Where you left off"

What this avoids: "How can I help?" "Tell me about your week." "What would you like to work on?" The product already knows what's happening. It asks the specific question.

Button labels:

> "Continue thread" / "Open new" / "Close this out"

What this avoids: "Get started." "Begin session." "Let's go!" Generic verbs that ignore the conversation already in progress.

Card content:

> "Open · Thursday. You committed to a level decision and the conversation stalled on whether to backfill at IC or Manager."

What this does: references the prior session by day, names the specific commitment, points to the unresolved fork. Reads like a colleague's note, not a CRM entry.

Empty states, error states, and confirmations all follow the same rule. The trusted colleague would say this. If they wouldn't, rewrite.

**Attribution lines.** Attribution references only data sources the product actually uses: the user's uploaded documents and their session responses. The canonical line is "Generated from your uploaded documents and session responses." Arborix is B2C and has no integrations with Slack, Jira, GSuite, or any other workplace tool. Any surface that suggests otherwise is incorrect and should be flagged.

## What to Avoid

Skip purple-to-blue gradients, glassmorphism, and the prevailing AI-product visual idiom. The system has its own voice.

Skip introducing primitives at the surface or component level. Escalate to the system instead.

Skip filling space with decorative elements. The typography and composition carry the surface.

Skip emoji in UI labels and microcopy.

Skip "AI-flavored" microcopy ("Let me help you with that," "I noticed you might want..."). Direct is better.

Skip stacking multiple editorial flourishes on one surface. One serif moment is the budget.

## Workflow

For agents working in a codebase that consumes this file:

Read this file at the start of every UI generation task.

When a token reference appears in the YAML (`{primitives.color.ink.900}`), resolve it through the chain before applying.

When asked to make a change, propose it at the lowest tier that satisfies the change. A new variant of a button is a component-level change. A new role for a color is a semantic-level change. A new value is a primitive-level change and requires explicit confirmation.

Validate generated UI against the composition rule: surfaces should reference only components and semantic tokens. Flag anything that reaches into primitives.

Validate accessibility: contrast, tap targets, focus indicators.

## Versioning

This file follows semver. Breaking changes to token names or composition rules bump the major version. Adding new tokens or components bumps the minor. Editorial revisions to prose bump the patch.

Current version: 0.2.0 (alpha).

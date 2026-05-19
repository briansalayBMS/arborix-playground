# Type System Audit — 2026-05-20

Read-only audit of every type-related decision in the product. Output is intended to seed the type-scale design pass.

Scope:
- `src/styles/tokens.css`, `src/styles/arborix-ds.css`, `src/styles/arborix-grid.css`, `src/app/globals.css`
- 40 component-level `.module.css` files under `src/components/`
- 5 page-level `.module.css` files under `src/app/`

---

## Existing tokens in tokens.css

Tier-1 type primitives (the only type-related vars actually declared anywhere in the codebase):

| Token | Value |
| --- | --- |
| `--font-sans`  | `"Public Sans", system-ui, sans-serif` |
| `--font-serif` | `"Fraunces", Georgia, serif` |
| `--font-mono`  | `"JetBrains Mono", ui-monospace, monospace` |
| `--text-xs`   | `0.75rem`  (12px) |
| `--text-sm`   | `0.875rem` (14px) |
| `--text-base` | `1rem`     (16px) |
| `--text-lg`   | `1.125rem` (18px) |
| `--text-xl`   | `1.375rem` (22px) |
| `--text-2xl`  | `1.75rem`  (28px) |
| `--text-3xl`  | `2.25rem`  (36px) |
| `--text-4xl`  | `3rem`     (48px) |
| `--text-5xl`  | `4.5rem`   (72px) |
| `--font-weight-regular`  | `400` |
| `--font-weight-medium`   | `500` |
| `--font-weight-semibold` | `600` |
| `--leading-tight`  | `1.15` |
| `--leading-snug`   | `1.25` |
| `--leading-normal` | `1.55` |

Tier-2 semantic type tokens declared in tokens.css:

| Token | Resolves to |
| --- | --- |
| `--type-label`     | `var(--text-sm)` |
| `--type-body`      | `var(--text-base)` |
| `--type-heading-sm`| `var(--text-lg)` |
| `--type-heading-md`| `var(--text-2xl)` |
| `--type-heading-lg`| `var(--text-4xl)` |
| `--type-display`   | `var(--text-5xl)` |

**Flag — entirely unused:** A `grep` across all `.module.css` files shows zero references to `--type-label`, `--type-body`, `--type-heading-*`, or `--type-display`. The semantic tier exists but nothing consumes it.

**Flag — `--font-weight-*` and `--leading-tight`/`--leading-normal`:** Not consumed in any component file. Only `--leading-snug` is referenced (4 places). All weights and line-heights in components are hard-coded numerics.

**Flag — `--text-5xl` and weight `--font-weight-semibold` (600):** Defined but unreferenced anywhere.

---

## Existing utility classes in arborix-ds.css

Two top-of-file declarations (around L39–L210) define one set of utilities; a second pass (around L676–L731) **redeclares the same class names** with different line-heights. The cascade means the second block wins for everything except properties only declared in the first. This is a quiet source of drift.

| Class | Resolved family | Resolved size | Resolved line-height | Resolved weight | Resolved tracking / casing |
| --- | --- | --- | --- | --- | --- |
| `.statement-hero`     | serif | `var(--text-hero)`        | `1.25` (L682, overrides L43 `var(--leading-serif)`) | 400 | `0` |
| `.statement-question` | serif | `var(--text-question)`   | `1.25` (L693 overrides L52) | 400 | `0` |
| `.statement-title`    | serif | `var(--text-title)`      | `1.25` (L701 overrides L62) | 400 | `0` |
| `.data-number`        | serif | `var(--text-data-number)`| `var(--leading-serif)` | 400 | `var(--tracking-none)`, ss01 / lnum |
| `.data-unit`          | serif | `var(--text-data-unit)`  | `var(--leading-serif)` | 400 | — |
| `.narrative-body`     | sans  | `var(--text-body)`       | `1.75` (L710 overrides L94) | 300 | — |
| `.narrative-bold`     | sans  | `var(--text-body)`       | `var(--leading-body)` | 600 | — |
| `.observation-body`   | sans  | `var(--text-observation)`| `var(--leading-body)` | 300 | — |
| `.gap-body`           | sans  | `var(--text-gap)`        | `var(--leading-body)` | 300 | — |
| `.label-card`         | sans  | `var(--text-small)` (L717 changed from `--text-label`!) | `1.35` | 400 | `0.05em` uppercase |
| `.inter-sm`           | sans  | `var(--text-small)`      | `var(--leading-sm)` | 400 | `var(--tracking-label)` uppercase |
| `.text-meta`          | sans  | `var(--text-small)`      | `var(--leading-meta)` | 300 | — |
| `.text-timestamp`     | sans  | `var(--text-small)`      | `var(--leading-meta)` | 300 | — |
| `.text-live`          | sans  | `var(--text-small)`      | `var(--leading-meta)` | 400 | — |
| `.text-flag`          | sans  | `var(--text-small)`      | `var(--leading-label)` | 500 | — |
| `.text-delta-link`    | sans  | `var(--text-small)`      | `var(--leading-label)` | 400 | — |
| `.source-code`        | mono  | `var(--text-mono)`       | `1.33` (L729 overrides L203 `var(--leading-meta)`) | 400 | `0.03em` |
| `.arb-section-label`  | sans  | `13px` (L857; earlier compound rules at L229) | — | 400 | `0.05em` uppercase |
| `.arb-section-label__num` / `__text` | sans | `var(--text-label)` | — | 400 | `var(--tracking-label)` uppercase |
| `.tab-feed`           | sans  | `13px` literal | — | 500 | `0.08em` uppercase |
| `.arb-tab`            | sans  | `16px` literal | — | 300 (500 active) | `0.05em` uppercase |
| `.arb-card-label`     | sans  | `13px` literal | — | 400 | `0.05em` uppercase |
| `.arb-card-body`      | sans  | `16px` literal | `1.7` | 300 | — |
| `.arb-card-title`     | serif | `20px` literal | `1.3` | 400 | — |
| `.arb-verified-label` / `__date` | mono | `13px` literal | — | — | `0.04em` uppercase |
| `.arb-nav-header`     | sans  | `var(--text-small)` | — | 400 | `var(--tracking-label)` uppercase |
| `.arb-nav-item`       | sans  | `var(--text-small)` | — | 300 | `var(--tracking-label)` uppercase |
| `.arb-drop-zone__label` | sans | `var(--text-small)` | — | 400 | `var(--tracking-label)` uppercase |
| `.arb-confidence-pill__text` / `arb-verify-badge__timestamp` / `arb-dossier-cta__label` / `arb-radar-axis-tooltip` | sans | `var(--text-small)` | — | 300 | — |
| `.arb-verify-badge__label` | mono | `var(--text-mono)` | — | — | `var(--tracking-mono)` uppercase |
| `.arb-status` (+ modifiers) | mono | `var(--text-mono)` | — | — | `var(--tracking-mono)` uppercase |
| globals.css `@utility mono-label` | `var(--font-mono-display)` | `12px` literal | — | 500 | `0.15em` uppercase |
| globals.css `@utility cta-active` | `var(--font-ui-display)` | `14px` literal | `1.2` | 600 | — |

### Critical finding — orphan tokens

**The utility classes are largely non-functional.** Most of the `var(--…)` references above resolve to nothing because the token is not declared anywhere in `tokens.css`:

Type-sizes referenced but undeclared: `--text-hero`, `--text-question`, `--text-title`, `--text-body`, `--text-observation`, `--text-gap`, `--text-label`, `--text-small`, `--text-mono`, `--text-data-number`, `--text-data-unit`, `--text-greeting`.

Line-heights referenced but undeclared: `--leading-body`, `--leading-serif`, `--leading-label`, `--leading-meta`, `--leading-sm`.

Tracking referenced but undeclared: `--tracking-none`, `--tracking-label`, `--tracking-mono`.

Measure (max-width) referenced but undeclared: `--measure-body`, `--measure-gap`, `--measure-inquiry`.

Spacing referenced but undeclared: `--spacing-1x` … `--spacing-8x`, `--card-padding`, `--card-padding-large`, `--label-to-content`.

Where these `var()`s appear inside a property that has no built-in inherited value (e.g. `font-size: var(--text-hero)`), the browser falls back to `unset` — which for `font-size` collapses to the inherited/`medium` value (16px). In practice this means `.statement-hero`, `.narrative-body`, `.label-card`, etc. all render at body size with no special line-height. This explains why every component has gone component-local: **the system layer is silently broken, so authors bypass it.**

---

## Component-local type decisions

### Tier: Display (≥40px, Fraunces)

| File | Selector | family | style | size | line-height | letter-spacing |
| --- | --- | --- | --- | --- | --- | --- |
| [ExternalHero.module.css:8](src/components/you-hub/external/ExternalHero.module.css:8) | `.title` | serif | — | `46px` | `1.12` | `-0.01em` |
| [HeroVerdict.module.css:8](src/components/you-hub/internal/HeroVerdict.module.css:8) | `.title` | serif | italic 350 | `44px` | `1.18` | `-0.005em` |
| [RightPane.module.css:214](src/components/right-pane/RightPane.module.css:214) | `.detailHeadingDisplay` | serif | — | `var(--text-4xl)` (48px) | `1.05` | `-0.01em` |

Three near-neighbors with three different sizes, line-heights and letter-spacing values. Likely all "display verdict / hero title" register.

### Tier: Hero (30–36px, Fraunces)

| File | Selector | family | style | size | line-height | letter-spacing |
| --- | --- | --- | --- | --- | --- | --- |
| [AuthShell.module.css:16](src/components/auth-shell/AuthShell.module.css:16) | `.heading` | serif | — | `var(--text-3xl)` (36px) | `1.1` | — |
| [RightPane.module.css:204](src/components/right-pane/RightPane.module.css:204) | `.detailHeading` | serif | — | `var(--text-3xl)` (36px) | `1.15` | — |
| [WelcomeReading.module.css:10](src/components/welcome/WelcomeReading.module.css:10) | `.paragraph` | serif | italic 350 | `30px` | `var(--leading-snug)` (1.25) | — |
| [WelcomeReading.module.css:91](src/components/welcome/WelcomeReading.module.css:91) | `.primaryInvitation` | serif | italic 350 | `30px` | — | — |
| [HomeWelcome.module.css:10](src/components/whats-in-play/HomeWelcome.module.css:10) | `.paragraph` | serif | italic 350 | `30px` | `var(--leading-snug)` | — |
| [HomeWelcome.module.css:91](src/components/whats-in-play/HomeWelcome.module.css:91) | `.primaryInvitation` | serif | italic 350 | `30px` | — | — |

`WelcomeReading` and `HomeWelcome` are byte-for-byte duplicates of each other — same selectors, same values. The four italic-30px declarations could collapse into one utility.

### Tier: Head Large (24–32px)

| File | Selector | family | style | size | line-height | letter-spacing |
| --- | --- | --- | --- | --- | --- | --- |
| [ExternalPersonality.module.css:38](src/components/you-hub/external/ExternalPersonality.module.css:38) | `.archetypeName` | serif | — | `32px` | `1.1` | — |
| [PersonalitySection.module.css:37](src/components/you-hub/internal/PersonalitySection.module.css:37) | `.archetypeName` | serif | — | `32px` | `1.1` | — |
| [GoalRow.module.css:8](src/components/you-hub/internal/GoalRow.module.css:8) | `.number` | serif | — | `28px` | `1` | — |
| [GoalRow.module.css:23](src/components/you-hub/internal/GoalRow.module.css:23) | `.title` | serif | — | `24px` | `1.2` | — |
| [WelcomeReading.module.css:73](src/components/welcome/WelcomeReading.module.css:73) | `.moodOption` | sans  | — `400` | `24px` | — | — |
| [HomeWelcome.module.css:73](src/components/whats-in-play/HomeWelcome.module.css:73) | `.moodOption` | sans  | — `400` | `24px` | — | — |

Two identical archetype-name treatments. The sans-24px `.moodOption` is an outlier in the size tier (everything else here is serif).

### Tier: Head Medium (17–22px, mostly Fraunces italic)

| File | Selector | family | style | weight | size | line-height | letter-spacing |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [ArborMessage.module.css:2](src/components/arbor-message/ArborMessage.module.css:2) | `.message` | serif | italic | 400 | `var(--text-xl)` (22px) | `1.45` | — |
| [SideNav.module.css:16](src/components/side-nav/SideNav.module.css:16) | `.wordmark` | serif | italic | 400 | `var(--text-xl)` (22px) | — | `-0.02em` |
| [RightPane.module.css:125](src/components/right-pane/RightPane.module.css:125) | `.contextSubject` | serif | italic | 350 | `20px` | `var(--leading-snug)` | — |
| [OperatingProfile.module.css:29](src/components/you-hub/internal/OperatingProfile.module.css:29) | `.value` | serif | italic | 350 | `20px` | `var(--leading-snug)` | — |
| [HeroVerdict.module.css:19](src/components/you-hub/internal/HeroVerdict.module.css:19) | `.body` | serif | italic | 350 | `19px` | `1.55` | — |
| [ExternalHero.module.css:18](src/components/you-hub/external/ExternalHero.module.css:18) | `.narrative` | sans  | — | 400 | `19px` | `1.6` | — |
| [PersonalitySection.module.css:53](src/components/you-hub/internal/PersonalitySection.module.css:53) | `.description` | serif | italic | 350 | `19px` | `1.5` | — |
| [AuthTopBar.module.css:15](src/components/auth-top-bar/AuthTopBar.module.css:15) | `.logo` | serif | italic | 400 | `var(--text-lg)` (18px) | — | — |
| [WhatsInPlayItem.module.css:16](src/components/whats-in-play/WhatsInPlayItem.module.css:16) | `.pov` | serif | italic | 350 | `18px` | `1.45` | — |
| [PlaceholderDialog.module.css:32](src/components/you-hub/PlaceholderDialog.module.css:32) | `.message` | serif | italic | 350 | `18px` | `1.45` | — |
| [GoalRow.module.css:48](src/components/you-hub/internal/GoalRow.module.css:48) | `.pov` | serif | italic | 350 | `18px` | `1.5` | — |
| [RecordRow.module.css:21](src/components/record/RecordRow.module.css:21) | `.claim` | serif | — | 400 | `17px` | `1.4` | — |
| [ConflictsSection.module.css:71](src/components/you-hub/internal/ConflictsSection.module.css:71) | `.question` | serif | italic | 350 | `17px` | `1.45` | — |
| [RightPane.module.css:28](src/components/right-pane/RightPane.module.css:28) | `.label` | serif | italic | — | `var(--text-base)` (16px) | — | — |
| [SovereignBeacon.module.css:17](src/components/sovereign-beacon/SovereignBeacon.module.css:17) | `.letter` | serif | italic | 400 | `1rem` (16px) | `1` | — |
| [ExternalOperatingProfile.module.css:23](src/components/you-hub/external/ExternalOperatingProfile.module.css:23) | `.value` | serif | italic | 350 | `16px` | `1.4` | — |
| [RecordCategory.module.css:29](src/components/record/RecordCategory.module.css:29) | `.emptyCopy` | serif | italic | 350 | `16px` | `1.55` | — |

The italic Fraunces 350 / 18–20px register is the most heavily-duplicated tier in the whole codebase (8+ near-identical declarations differing only in size by 1–2px and line-height by 0.05).

### Tier: Body Large (16px, Public Sans)

| File | Selector | family | weight | size | line-height |
| --- | --- | --- | --- | --- | --- |
| [SkillsSection.module.css:37](src/components/you-hub/internal/SkillsSection.module.css:37) | `.name` | sans | 400 | `16px` | — |
| [RightPane.module.css:136](src/components/right-pane/RightPane.module.css:136) | `.placeholderText` | sans | — | `16px` | `1.5` |
| [RightPane.module.css:68](src/components/right-pane/RightPane.module.css:68) | `.textarea` | sans | — | `var(--text-base)` | — |
| [RightPane.module.css:96](src/components/right-pane/RightPane.module.css:96) | `.sendButton` | sans | — | `var(--text-base)` | — |
| [WelcomeIntro.module.css:6](src/components/welcome/WelcomeIntro.module.css:6) | `.button` | sans | 500 | `var(--text-base)` | — |
| [WelcomeReadback.module.css:8](src/components/welcome/WelcomeReadback.module.css:8) | `.textarea` | sans | — | `var(--text-base)` | — |
| [WelcomeReadback.module.css:35](src/components/welcome/WelcomeReadback.module.css:35) | `.submitButton` | sans | 500 | `var(--text-base)` | — |
| [WhatsInPlay.module.css:31](src/components/whats-in-play/WhatsInPlay.module.css:31) | `.button` | sans | 400 | `var(--text-base)` | `1.5` |
| [UploadZone.module.css:68](src/components/upload-zone/UploadZone.module.css:68) | `.filename` | sans | — | `var(--text-base)` | — |
| [page.module.css:13](src/app/(auth)/login/page.module.css:13) | `.submitButton` | sans | 500 | `var(--text-base)` | — |
| [page.module.css:45](src/app/(auth)/login/page.module.css:45) | `.input` | sans | — | `var(--text-base)` | — |
| [page.module.css:13](src/app/(auth)/signup/page.module.css:13) | `.submitButton` | sans | 500 | `var(--text-base)` | — |
| [page.module.css:45](src/app/(auth)/signup/page.module.css:45) | `.input` | sans | — | `var(--text-base)` | — |

### Tier: Body / Small Body (13–15px, Public Sans)

| File | Selector | family | style | weight | size | line-height |
| --- | --- | --- | --- | --- | --- | --- |
| [ConflictsSection.module.css:54](src/components/you-hub/internal/ConflictsSection.module.css:54) | `.title` | sans | — | 500 | `15px` | `1.4` |
| [RecordRow.module.css:30](src/components/record/RecordRow.module.css:30) | `.supporting` | sans | — | 400 | `14px` | `1.5` |
| [ConflictsSection.module.css:62](src/components/you-hub/internal/ConflictsSection.module.css:62) | `.body` | sans | — | 400 | `14px` | `1.55` |
| [HeroVerdict.module.css:56](src/components/you-hub/internal/HeroVerdict.module.css:56) | `.talkAction` | sans | — | 400 | `14px` | `1.4` |
| [ExternalPersonality.module.css:46](src/components/you-hub/external/ExternalPersonality.module.css:46) | `.subtitle` | sans | — | 400 | `14px` | `1.4` |
| [PersonalitySection.module.css:45](src/components/you-hub/internal/PersonalitySection.module.css:45) | `.subtitle` | sans | — | 400 | `14px` | `1.4` |
| [WhatsInPlayItem.module.css:54](src/components/whats-in-play/WhatsInPlayItem.module.css:54) | `.action` | sans | — | 400 | `14px` | `1.4` |
| [ExternalSkills.module.css:34](src/components/you-hub/external/ExternalSkills.module.css:34) | `.name` | sans | — | 500 | `14px` | — |
| [ExternalSkills.module.css:41](src/components/you-hub/external/ExternalSkills.module.css:41) | `.separator` | sans | — | — | `14px` | — |
| [ExternalOperatingProfile.module.css:51](src/components/you-hub/external/ExternalOperatingProfile.module.css:51) | `.separator` | sans | — | — | `14px` | — |
| [RightPane.module.css:166](src/components/right-pane/RightPane.module.css:166) | `.sourceTitle` | sans | — | 400 | `14px` | `1.4` |
| [RightPane.module.css:225](src/components/right-pane/RightPane.module.css:225) | `.detailSubtitle` | sans | — | — | `var(--text-sm)` (14px) | `1.4` |
| [RightPane.module.css:256](src/components/right-pane/RightPane.module.css:256) | `.detailLinkedItem` | sans | — | — | `var(--text-sm)` | `1.4` |
| [RightPane.module.css:174](src/components/right-pane/RightPane.module.css:174) | `.sourceExcerpt` | sans | italic | 400 | `13px` | `1.5` |
| [SideNav.module.css:120](src/components/side-nav/SideNav.module.css:120) | `.name` | sans | — | 400 | `13px` | `1.3` |
| [GoalImpactChip.module.css:18](src/components/whats-in-play/GoalImpactChip.module.css:18) | `.title` | sans | — | 400 | `13px` | `1` |
| [WhatsInPlayItem.module.css:106](src/components/whats-in-play/WhatsInPlayItem.module.css:106) | `.moreGoalsLabel` | sans | — | 400 | `13px` | `1` |
| [AuthShell.module.css:32](src/components/auth-shell/AuthShell.module.css:32) | `.footer` | sans | — | — | `var(--text-sm)` | — |
| [PlaceholderDialog.module.css:43](src/components/you-hub/PlaceholderDialog.module.css:43) | `.closeButton` | sans | — | — | `var(--text-sm)` | — |
| [WelcomeReadback.module.css:57](src/components/welcome/WelcomeReadback.module.css:57) | `.footerLink a` | sans | — | — | `var(--text-sm)` | — |
| [UploadZone.module.css:44](src/components/upload-zone/UploadZone.module.css:44) | `.chooseLink` | sans | — | — | `var(--text-sm)` | — |
| [ZenHome.module.css:14](src/components/zen-home/ZenHome.module.css:14) | `.recordLink` | sans | — | — | `var(--text-sm)` | — |
| [page.module.css:8](src/app/(auth)/login/page.module.css:8) | `.error` | sans | — | — | `var(--text-sm)` | — |
| [page.module.css:8](src/app/(auth)/signup/page.module.css:8) | `.error` | sans | — | — | `var(--text-sm)` | — |

The 14px sans 400 1.4 group repeats verbatim 6 times — clear consolidation candidate.

### Tier: Eyebrow / Mono Uppercase Label

By far the most-duplicated register in the codebase. Sub-groups by tracking + size:

**Mono 14px / 500 / 0.05em / uppercase** — section headers:

| File | Selector |
| --- | --- |
| [ConflictsSection.module.css:7](src/components/you-hub/internal/ConflictsSection.module.css:7) | `.header` |
| [GoalsSection.module.css:7](src/components/you-hub/internal/GoalsSection.module.css:7) | `.header` |
| [PersonalitySection.module.css:8](src/components/you-hub/internal/PersonalitySection.module.css:8) | `.header` |
| [SkillsSection.module.css:7](src/components/you-hub/internal/SkillsSection.module.css:7) | `.header` |
| [ExternalSkills.module.css:7](src/components/you-hub/external/ExternalSkills.module.css:7) | `.header` |
| [ExternalPersonality.module.css:8](src/components/you-hub/external/ExternalPersonality.module.css:8) | `.header` |
| [ModeToggle.module.css:6](src/components/you-hub/ModeToggle.module.css:6) | `.tab` |
| [SideNav.module.css:32](src/components/side-nav/SideNav.module.css:32) | `.navLink` |
| [Record.module.css:26](src/components/record/Record.module.css:26) | `.title` |
| [Record.module.css:41](src/components/record/Record.module.css:41) | `.count` |
| [page.module.css:7](src/app/(zen)/company/page.module.css:7) | `.title` |
| [page.module.css:7](src/app/(zen)/work/page.module.css:7) | `.title` |

12 byte-identical declarations.

**Mono 13px / 500 / 0.05em / uppercase** — affordances / CTAs:

| File | Selector |
| --- | --- |
| [BottomAffordances.module.css:17](src/components/you-hub/external/BottomAffordances.module.css:17) | `.affordance` |
| [GoalsSection.module.css:29](src/components/you-hub/internal/GoalsSection.module.css:29) | `.affordance` |
| [PersonalitySection.module.css:92](src/components/you-hub/internal/PersonalitySection.module.css:92) | `.affordance` |
| [SkillsSection.module.css:81](src/components/you-hub/internal/SkillsSection.module.css:81) | `.affordance` |
| [ConflictsSection.module.css:88](src/components/you-hub/internal/ConflictsSection.module.css:88) | `.respondButton` |
| [ConflictsSection.module.css:110](src/components/you-hub/internal/ConflictsSection.module.css:110) | `.estimate` |
| [RecordCategory.module.css:13](src/components/record/RecordCategory.module.css:13) | `.label` (tracking 0.06em — near match) |

**Mono 12px / 500 / 0.05em / uppercase**:

| File | Selector |
| --- | --- |
| [WhatsInPlayItem.module.css:6](src/components/whats-in-play/WhatsInPlayItem.module.css:6) | `.typeLabel` |
| [RecordCategory.module.css:22](src/components/record/RecordCategory.module.css:22) | `.count` (no transform) |

**Mono 11px / 500 / 0.08em / uppercase** — badges & micro-meta:

| File | Selector |
| --- | --- |
| [ExternalHero.module.css:39](src/components/you-hub/external/ExternalHero.module.css:39) | `.verifiedLabel` |
| [ExternalHero.module.css:54](src/components/you-hub/external/ExternalHero.module.css:54) | `.verifiedDate` |
| [ExternalHero.module.css:48](src/components/you-hub/external/ExternalHero.module.css:48) | `.verifiedSeparator` (no caps, no tracking) |
| [ExternalOperatingProfile.module.css:14](src/components/you-hub/external/ExternalOperatingProfile.module.css:14) | `.label` |
| [OperatingProfile.module.css:20](src/components/you-hub/internal/OperatingProfile.module.css:20) | `.label` |

**Mono 11px / 500 / 0.06em / uppercase** — near-duplicate of the 0.08em group, different tracking:

| File | Selector |
| --- | --- |
| [RecordRow.module.css:39](src/components/record/RecordRow.module.css:39) | `.meta` |
| [RecordRow.module.css:70](src/components/record/RecordRow.module.css:70) | `.source` |
| [ExternalSkills.module.css:47](src/components/you-hub/external/ExternalSkills.module.css:47) | `.rating` |
| [SkillsSection.module.css:50](src/components/you-hub/internal/SkillsSection.module.css:50) | `.rating` |
| [SideNav.module.css:100](src/components/side-nav/SideNav.module.css:100) | `.avatar` (tracking 0.04em — third variant) |

**Mono 10px / 500 / 0.08em / uppercase** — single instance:

- [GoalRow.module.css:85](src/components/you-hub/internal/GoalRow.module.css:85) `.activity`

**Mono `var(--text-xs)` (12px) / 500 / 0.08em / uppercase** — token-based variant of the 11px-0.08em group:

| File | Selector |
| --- | --- |
| [RightPane.module.css:195](src/components/right-pane/RightPane.module.css:195) | `.detailMonoLabel` |
| [RightPane.module.css:238](src/components/right-pane/RightPane.module.css:238) | `.detailSectionHeader` |
| [PlaceholderDialog.module.css:23](src/components/you-hub/PlaceholderDialog.module.css:23) | `.title` |
| [ShareDialog.module.css:20](src/components/you-hub/ShareDialog.module.css:20) | `.header` |
| [ShareDialog.module.css:47](src/components/you-hub/ShareDialog.module.css:47) | `.copyButton` |

**Mono `var(--text-xs)` / 0.06em / uppercase** — yet another close neighbor:

| File | Selector |
| --- | --- |
| [WhatsInPlay.module.css:7](src/components/whats-in-play/WhatsInPlay.module.css:7) | `.label` (weight 400) |
| [UploadZone.module.css:35](src/components/upload-zone/UploadZone.module.css:35) | `.label` |
| [page.module.css:35](src/app/(auth)/login/page.module.css:35) | `.label` |
| [page.module.css:35](src/app/(auth)/signup/page.module.css:35) | `.label` |

**Mono `var(--text-xs)` / 0.04em / no caps**:

- [ShareDialog.module.css:35](src/components/you-hub/ShareDialog.module.css:35) `.input`

### Tier: Special / outliers

| File | Selector | Notes |
| --- | --- | --- |
| [GoalImpactChip.module.css:25](src/components/whats-in-play/GoalImpactChip.module.css:25) | `.dots` | `monospace` (raw keyword, not the token), `8px`, tracking `0.1em`. Smallest type in the system. |
| [WelcomeReading.module.css:30](src/components/welcome/WelcomeReading.module.css:30) | `.moodToggle` | `line-height: 1` declared without a font-size — inherits sans. |

---

## Drift findings

1. **The DS utility layer is silently broken.** Every `var()` listed under "orphan tokens" above (~25 distinct identifiers) is referenced by `arborix-ds.css` and `arborix-grid.css` but never declared. Affected classes — `.statement-hero`, `.statement-question`, `.statement-title`, `.narrative-body`, `.observation-body`, `.gap-body`, `.label-card` (token name mismatch), `.source-code`, `.arb-status`, `.arb-nav-*`, `.arb-drop-zone__label`, `.arb-verify-badge__label`, etc. — fall back to inherited values. This is why every component implements its own typography locally. Fixing the utility layer is precondition for anything else.

2. **Self-overriding utilities.** `arborix-ds.css` declares `.statement-hero`, `.statement-question`, `.statement-title`, `.narrative-body`, `.label-card`, and `.source-code` twice (~L39–L210, then again ~L676–L731). The second block uses different line-heights and, in the case of `.label-card`, swaps `var(--text-label)` for `var(--text-small)`. Same class, two intents.

3. **The semantic type tier is dead code.** `--type-label`, `--type-body`, `--type-heading-sm`, `--type-heading-md`, `--type-heading-lg`, `--type-display` are defined in tokens.css and never referenced anywhere. The component layer skips Tier-2 entirely and pulls from `--text-*` primitives (or hard-coded px).

4. **The italic-serif body register (16–20px) has 8+ near-identical local definitions.** All on Fraunces italic, weight 350, sizes 16/17/18/19/20px, line-height variations 1.4/1.45/1.5/1.55/snug. This is one of two clear places where the codebase is asking for a utility class.

5. **The mono-uppercase eyebrow register has at least 25+ near-identical local definitions** clustered around 5 size+tracking variants (14/0.05, 13/0.05, 12/0.05, 11/0.08, 11/0.06). The tracking variance (0.04 / 0.05 / 0.06 / 0.08 / 0.10) is the most chaotic axis — likely no intentional reason for the difference between `.meta`'s `0.06em` and `.verifiedLabel`'s `0.08em` at the same size and weight. This is the other clear utility-class candidate.

6. **Display tier disagrees with itself.** `ExternalHero.title` (46px / 1.12 / -0.01em), `HeroVerdict.title` (44px italic 350 / 1.18 / -0.005em), and `RightPane.detailHeadingDisplay` (48px / 1.05 / -0.01em) are all "single big display" treatments with three sets of values.

7. **Welcome and HomeWelcome are bit-for-bit duplicates.** [WelcomeReading.module.css](src/components/welcome/WelcomeReading.module.css) and [HomeWelcome.module.css](src/components/whats-in-play/HomeWelcome.module.css) define the same `.paragraph`, `.moodOption`, `.primaryInvitation`, `.moodToggle` etc. with identical type values. Either the file was forked or shared treatments should be hoisted.

8. **Tracking values use both `em` units (0.04em / 0.05em / 0.06em / 0.08em / 0.10em) and `var(--tracking-*)` tokens that don't exist.** No single tracking literal is consistently used for the same register.

9. **`monospace` keyword is used raw in `GoalImpactChip.dots`** ([line 25](src/components/whats-in-play/GoalImpactChip.module.css:25)) instead of `var(--font-mono)`.

10. **Hard-coded literals where tokens exist.** Roughly half of the size declarations bypass the existing `--text-*` primitives even though the values line up (or nearly do): `14px` ≈ `--text-sm`, `12px` = `--text-xs`, `28px` = `--text-2xl`, `36px` = `--text-3xl`, `48px` = `--text-4xl`. The other half (`13px`, `15px`, `17px`, `19px`, `30px`, `32px`, `44px`, `46px`) are bespoke values not on the existing scale.

---

## Spacing system survey (quick)

- **Base unit:** Yes, 4px (`--space-1` = `0.25rem`). The Tier-1 scale is well-defined: `--space-0 / 1 / 2 / 3 / 4 / 6 / 8 / 12 / 16 / 24 / 32` (0 / 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 px).
- **Tier-2 semantic spacing exists** but is sparse: `--space-inset-{sm,md,lg}`, `--space-stack-{sm,md,lg}`, `--space-section`. Components rarely consume these — they pull from the Tier-1 primitives directly.
- **Naming conflict with the DS layer.** `arborix-ds.css` and `arborix-grid.css` reference `--spacing-1x` … `--spacing-8x` (singular `--spacing-`, undeclared) while `tokens.css` declares `--space-*` (singular `--space-`). Two different naming conventions, one of which doesn't resolve. Every DS class that uses `var(--spacing-Nx)` is broken in the same silent way as the type tokens.
- **Token vs literal usage in components:** of 186 spacing-related declarations across the audited module CSS files, **158 use `var(--space-*)` tokens (≈85%)**, and **28 use literal `px` or `rem` values (≈15%)**.
- **Where the literals cluster:** the `whats-in-play/` group (`HomeWelcome`, `WhatsInPlayItem`, `GoalImpactChip`), `record/` group, and `RightPane` source-list (8px / 10px / 12px / 18px / 32px / 48px gaps and margins). These are mostly off-grid values (10px, 18px, 6px) that don't map cleanly onto the `--space-*` scale.
- **Overall verdict on spacing:** the spacing system is **already coherent** at the Tier-1 primitive level. The drift is concentrated in (a) the DS layer's orphan `--spacing-Nx` references, (b) the few off-grid pixel literals in the `whats-in-play` and `record` regions, and (c) an unused Tier-2 semantic layer. This is a much smaller cleanup than the type system needs.

---

## Initial design recommendations

### Type scale

A clean scale built from the actual usage above would have ~9 tiers, mapped to existing primitives where possible:

| Proposed tier | Family / style | Size | Line-height | Tracking | Notes |
| --- | --- | --- | --- | --- | --- |
| `display`    | serif, regular | 44–48px (`--text-4xl` 48 is close) | 1.05–1.12 | -0.01em | Collapses ExternalHero / HeroVerdict / detailHeadingDisplay. Italic flag is per-instance. |
| `hero`       | serif, regular | 30–36px (`--text-3xl` 36 / new 30) | 1.15–1.25 | 0 | AuthShell heading, RightPane detail heading, Welcome paragraph. Italic variant. |
| `head-lg`    | serif, regular | 28–32px (`--text-2xl` 28; consider also 32px) | 1.1–1.2 | 0 | Archetype names, GoalRow number / title. |
| `head-md`    | serif italic 350 | 18–20px (`--text-lg` 18) | 1.45–1.5 | 0 | The italic body-quote register — the single most duplicated tier. |
| `head-sm`    | serif, regular | 17–18px | 1.4 | 0 | RecordRow.claim. |
| `body-lg`    | sans, 400 | 19–20px | 1.55–1.6 | 0 | HeroVerdict body, ExternalHero narrative, PersonalitySection description. |
| `body`       | sans, 400 | 16px (`--text-base`) | 1.5 | 0 | Default text. |
| `body-sm`    | sans, 400 | 14px (`--text-sm`) | 1.4 | 0 | The 14/sans/1.4 cluster — currently the largest single duplicate group. |
| `small`      | sans, 400 | 13px | 1.3 | 0 | SideNav.name, sourceExcerpt, etc. |
| `eyebrow`    | mono, 500 | 14px / 13px / 12px / 11px (consider one canonical 13px + one 11px badge) | — | 0.05em | The mono-uppercase swarm. Collapse to two sizes max. |
| `mono-data`  | mono, 400/500 | 12px | 1.33 | 0.03–0.04em | Source code, status, IDs. |

What I'd suggest in the design pass:
1. **Fix the foundation first.** Declare every orphan token in `tokens.css` (`--text-hero`, `--leading-body`, `--tracking-label`, `--measure-body`, `--spacing-Nx`, etc.) or rename the DS-layer references to use the tokens that exist. The current state is undiagnosed silent breakage.
2. **Drop the duplicate utility blocks** in `arborix-ds.css` (the two declarations of `.statement-hero` etc.). Decide which set of line-heights wins.
3. **Codify the italic-serif 18px register as one utility** (`narrative-quote` or similar). It already exists at 8+ sites.
4. **Codify the mono-uppercase eyebrow as two utilities — one section header (13–14px), one micro-badge (11–12px) — and normalize tracking** to a single value per size (e.g. `0.05em` for header, `0.08em` for badge).
5. **Decide whether `--type-*` semantic tier survives.** Right now it is defined but unused. Either route component consumption through it, or remove it.
6. **The display tier should pick one size.** 44/46/48 isn't a meaningful distinction.

### Spacing

The spacing system needs **clean-up, not redesign**. Specifically:
1. Decide between `--space-*` (current Tier-1) and `--spacing-Nx` (current DS-layer references) as the canonical naming. Recommend keeping `--space-*` and rewriting `arborix-ds.css` / `arborix-grid.css` references.
2. Audit the 28 literal-pixel spacing values in `whats-in-play/`, `record/`, and `RightPane` and either round to the 4px grid or accept them as off-grid affordances with justification.
3. Either remove the Tier-2 semantic spacing tokens (`--space-inset-*`, `--space-stack-*`, `--space-section`) or build a small set of layout utilities that consume them.

No standalone spacing design pass is needed unless you want to revisit the scale itself.

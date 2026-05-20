# Arborix — Ledger Requirements
Date: May 14, 2026
Status: Locked
Purpose: The ledger is the foundation of Arborix. Everything else sits on top of it. Without the ledger, Arborix is just another chat product. With it, Arborix is the coach that knows your work. This doc defines what the ledger must be.

## The trust contract

The ledger is the user's record. They can see all of it, at any time, and the product is honest about every entry.

- No claim exists without a source. Every row records where the claim came from: resume, LinkedIn paste, conversation, self-reported, feedback.
- No claim is invented. The AuditorAgent extracts claims from material the user provided. It does not invent or infer beyond what the source supports.
- Confidence is honest. Low-confidence claims are not hidden. They are surfaced for the user to validate, flag, or correct.
- The user is the final arbiter. They can validate, flag, or remove any claim. They can add their own.
- The user can read every claim about themselves in readable English. The ledger is not a database dump. It is the user's record in their own product.

This is the single most important property of the system. If the user ever feels Arborix knows something it should not, or invented something it should not have, the trust contract is broken and the product fails.

Every other requirement in this doc serves the trust contract. Types, states, rendering, vocabulary, schema guardrails. All downstream of trust.

## The three domains

The ledger splits into three Postgres tables, not one with a domain column. Separation enforces clarity at the schema layer.

**YOU ledger.** Identity, strengths, values, working style, growth areas. Things about the user as a professional. Powers the radar chart, the one-pager identity section, Arbor's understanding of who they're talking to.

**COMPANY ledger.** Manager, team, OKRs, values, stakeholders, company context. Manually entered by the user (B2C pivot, no integrations). Powers Arbor's understanding of the user's workplace.

**WORK ledger.** Specific projects, outcomes, decisions, recent impact. The verifiable evidence of what the user has done. Powers the one-pager achievements section, the recent impact bullets, the case for promotion or a new role.

A `master_ledger` view unions all three for read patterns that need everything. Writes always target a specific domain.

## The atomic claim

Each row is one claim, not a paragraph. Specific, not general.

Wrong: "Good leader."

Right: "Led a team of 8 through the platform reorg in Q2 2024. Retained all reports. Shipped the migration two weeks early."

Required fields:
- `claim` — the atomic statement
- `supporting_detail` — the evidence that backs it
- `category` — the type of claim within the domain (see Types section)
- `source` — resume / linkedin / conversation / feedback / self_reported
- `confidence` — 0 to 1, set by the AuditorAgent based on source strength and corroboration
- `confidence_band` — conflict / flagged / action / verified, computed from confidence by the backend
- `validated` — boolean, flipped to true when the user confirms
- `created_by` — auditor / user / arbor (for traceability)
- `created_at`, `updated_at`

## Types via category

Decision: types are implicit via the `category` field, not modeled as separate tables or shape-affecting variants.

One schema. One shape per row. The `category` field carries the type information. Within a domain, categories distinguish kinds of claims:

YOU domain categories:
- `skill` — a capability the user has
- `strength` — a pattern of working the user is known for
- `value` — a principle the user works by
- `growth_area` — a development goal the user is pursuing
- `identity` — a self-described professional identity

WORK domain categories:
- `achievement` — a specific outcome the user produced
- `project` — a sustained piece of work
- `decision` — a strategic or tactical choice the user made
- `impact` — a measurable result the user generated

COMPANY domain categories:
- `manager_relationship` — facts about the user's manager
- `stakeholder` — facts about a specific stakeholder
- `team_context` — facts about the user's team
- `company_context` — facts about the company itself

Categories are not closed at the database level. New categories can emerge as the product learns more about its users. The rendering layer is category-aware: when category is `skill`, the surface shows a proficiency rating; when category is `achievement`, the surface shows a metric. The data model stays one shape; the presentation layer handles the differentiation.

Why this approach: simpler schema, no migration required when categories evolve, rendering is component-level concern, not data-level concern.

## State model

The state of a ledger item lives on two orthogonal axes.

**Axis one: validation.** A boolean.
- `pending` — claim exists in the ledger, not yet user-confirmed (validated = false)
- `validated` — user-confirmed (validated = true)

**Axis two: confidence.** A continuous score from 0 to 1, mapped to four bands by the backend:
- `conflict` (0–30%) — claim contradicts another claim or has no support
- `flagged` (31–60%) — claim has thin support or conflicting signals
- `action` (61–85%) — claim is plausible, awaiting user attention
- `verified` (86–100%) — claim is corroborated

The two axes are independent. A claim can be `pending` and in any of the four bands. A `validated` claim is typically in the verified band but does not have to be. The user can validate something the system rated as low confidence (the user knows something the data does not show). The system can hold high-confidence claims that the user has not yet validated (the user has not gotten around to reviewing them yet).

The validation state and the confidence band are both stored. The frontend renders both. Validated claims get a verified-green check mark; pending claims show the confidence band color on the evidence bar.

## Provenance and confidence

Provenance is the `source` field. Confidence is computed from provenance plus corroboration.

Source enum is closed:
- `resume` — extracted from the user's uploaded resume PDF
- `linkedin` — extracted from the user's uploaded LinkedIn export
- `conversation` — extracted from a session with Arbor
- `feedback` — extracted from a feedback giver's response (Phase 6+)
- `self_reported` — entered directly by the user

New sources require a schema migration, not a free-text field. This is deliberate: the source enum is a trust contract with the user, and adding sources changes the contract.

Confidence is set by the AuditorAgent at extraction time. Heuristics:
- A claim extracted from a resume with specific numbers and dates: high (0.7+).
- A claim extracted from a resume with vague language: medium (0.4–0.6).
- A claim extracted from a single conversation turn: low (0.3–0.5).
- A claim corroborated across multiple sources: boosted toward verified.
- A claim contradicted by another claim: dropped toward conflict.
- A claim validated by the user: pinned to verified.

The frontend never computes the confidence band from the value. The backend returns the band name (`conflict` / `flagged` / `action` / `verified`) and the frontend applies the matching semantic color token. This is one of the audit rules in DESIGN.md.

## Rendering a claim in the pane

When the user opens a single ledger item in the right pane (from Your Record, or by tapping a Sovereign Beacon mark on an evidence row), the pane renders this structure:

```
[Sovereign Beacon] [Category label · domain]

[Claim text · serif, upright, --tt-h-sm]

[Supporting detail · sans, --tt-body, --c-text-2]

[Status indicator]
  └─ confidence band color
  └─ "Validated by you" or "Awaiting validation"

[Evidence list]
  └─ Source 1: [source name, date, link to original]
  └─ Source 2: [if corroborating evidence exists]

[Arbor's voice · serif italic, --tXL]
  └─ One sentence on what this claim tells us about the user

[Actions]
  └─ "Validate" (if pending)
  └─ "Flag as incorrect"
  └─ "Remove from record"
```

Notes on the rendering:
- The Sovereign Beacon appears because Arbor is speaking about this claim. The Beacon and Arbor's voice always appear together.
- The category label uses JetBrains Mono in --c-text-3, all caps, --tx size. Same treatment as eyebrow labels elsewhere.
- The claim itself is the hero of the pane. Fraunces upright. Product voice (the system stating what it knows about the user).
- Arbor's voice is italic Fraunces, exactly as on HOME. This is the only place in the pane where italic appears.
- The evidence list is unstyled text with source name, date, and a quiet link to the original document if applicable.
- Actions are secondary buttons (transparent, --c-border-s border), not primary. Primary action color is reserved for the main CTA per surface, and on this pane there is no single primary action.

## Rendering the Record on each hub

The Record is the user's complete view of their ledger within a hub. It renders every claim across every category, in surface-shape, browseable. It exists because the trust contract requires that the user can read every claim about themselves at any time, in their own product. Curated typed views (Skills, Operating Profile, Impact Cards) surface specific categories with bespoke presentation. The Record is the catch-all that completes the hub.

**Placement.** The Record lives at the bottom of each hub (YOU, WORK, COMPANY), below all curated typed views. It is the last section on the surface.

**Single accordion.** The Record collapses and expands as one moment at the section level. There are no per-row toggles. The user either sees the section header, or sees the full Record.

**Collapsed state (default).** One line. Section header in mono uppercase, item count, expansion chevron.

```
YOUR RECORD · 23 claims ▾
```

The item count comes from the backend. It includes every claim across every category in the hub's domain. Visual treatment matches other section headers on the hub — restrained, quietly inviting expansion.

**Expanded state.** Chevron flips to `▴`. Below the header, every category in the domain renders as a subsection, in the order documented under "Types via category". Each category subsection carries its own header and item count:

```
YOUR RECORD · 23 claims ▴

SKILLS (8)
  [single-item row]
  [single-item row]
  …

STRENGTHS (4)
  [single-item row]
  …

VALUES (3)
  …

GROWTH AREAS (5)
  …

IDENTITY (3)
  …
```

Empty categories render the header with `(0)` followed by an empty-state coaching line (specified below).

**The single-item in-context row.** Different from the pane detail view. Smaller, surface-shaped, editorial. Reads like a list, not a database export. No grid lines.

```
[Claim · serif, upright, --tt-body]

[Supporting detail · sans, --tt-sm, --c-text-2 · optional]

[Bottom metadata · mono, --tx, --c-text-3]
  └─ Confidence band indicator (small filled dot in band's semantic color)
  └─ Validation state (verified check if validated, nothing if pending)
  └─ Source label in plain language ("from your resume" / "from your last session" / "added by you")
  └─ Chainlink (Link2 14px) opens the pane in detail mode for this claim
  └─ Inline affordance on pending items: "Validate →" sienna mono, hover-revealed, far right
```

The row breathes. Spacing between rows is editorial, not table-tight. The chainlink and the row itself are the same click target — both open the pane detail view.

**Empty states per category.** Each category has its own coaching empty state. One sentence, italic Fraunces, names what would unlock that category. Clicking the empty-state line opens chat with Arbor pre-loaded with that category's context.

YOU domain:
- `skill` — *Tell me about a project you're proud of and I'll start mapping your skills. Or upload your resume.*
- `strength` — *Strengths emerge from patterns across sessions. Talk to me a few times and I'll start picking them up.*
- `value` — *Tell me what you work by and I'll start surfacing your values.*
- `growth_area` — *Mention what you're working on improving and I'll start tracking it.*
- `identity` — *Tell me how you'd describe yourself to a recruiter.*

WORK domain:
- `achievement` — *Tell me about something you shipped. Specific numbers help.*
- `project` — *Tell me about a project you've been leading.*
- `decision` — *Share a decision you made recently that mattered.*
- `impact` — *Tell me what changed because of your work.*

COMPANY domain:
- `manager_relationship` — *Tell me about your manager — name, style, where you sit on each other's radar.*
- `stakeholder` — *Tell me about someone you work with across the org.*
- `team_context` — *Tell me about your team — size, your role, how you came together.*
- `company_context` — *Tell me about your company — mission, your team's place in it.*

**Interaction model.**
- Click section header → expand or collapse the entire Record. Single accordion at the section level.
- Click any row → open the right pane with that claim's detail view (the rendering specified under "Rendering a claim in the pane").
- Click the chainlink on a row → same destination as clicking the row. The chainlink is the affordance hint, not a separate target.
- Hover any row → reveal inline affordances. For pending items: `Validate →`. Other affordances (Flag, Remove) are also available; the exact hover treatment is its own focused interaction design pass.
- Click an empty-state line → open chat with Arbor pre-loaded with that category context.

**Category map per hub.** The Record renders the full set of categories defined under "Types via category" for each domain. YOU: `skill`, `strength`, `value`, `growth_area`, `identity`. WORK: `achievement`, `project`, `decision`, `impact`. COMPANY: `manager_relationship`, `stakeholder`, `team_context`, `company_context`.

The Record is canonical and complete. Categories that are already surfaced in curated typed views above the Record (Skills section on YOU, Operating Profile triplet, Impact Cards on the external surface, future curated views on WORK and COMPANY) also appear in the Record. The redundancy is intentional — the Record is the user's complete view, and the trust contract requires that the user can read every claim, not just the ones a typed view chose to elevate.

**Future work flagged.** WORK and COMPANY hubs do not have full surface designs yet. Their heroes, typed views, and other sections are future design work. The Record is the only component designed across all three hubs in this pass — when WORK and COMPANY hub designs land, the Record drops in cleanly at the bottom of each. The visual treatment of inline hover affordances (Validate, Flag, Remove) needs its own focused interaction design pass; the Record spec specifies that they exist, the exact visual treatment is designed when the wire-up happens.

## What the ledger powers

- One-pager generation. The `exec_recruiter_v1.txt` prompt reads the YOU and WORK ledgers and synthesizes the headline, pitch, achievements.
- Arbor's register switch. If the YOU ledger is under 60% complete, Arbor switches to audit mode and asks specifically about the gaps.
- The HOME completeness line ("Profile is 42% complete").
- The dossier on Your Record (evidence bars, identity radar, claim list).
- The trust signal in attribution. Every output references the ledger entries that supported it: "Generated from your uploaded documents and session responses."

## What the ledger does not do

These are the B2C constraints. The boundary conditions of the product.

- Does not pull from Slack, Jira, GSuite, or any workplace tool.
- Does not pull from public sources (LinkedIn API, company websites). Only the user's manual uploads.
- Does not infer claims beyond what the source explicitly supports.
- Does not store claims about anyone other than the user. Stakeholders and managers are referenced, not characterized.
- Does not delete claims silently. Removal is user-initiated and visible.
- Does not share claims with any third party. The ledger is the user's record alone.

## The schema-level guardrails

- RLS on every table. A user only sees their own claims.
- Foreign key from every claim to `users.id`.
- Versioning on claim updates. The history of a claim is preserved, not overwritten. If confidence shifts from 0.4 to 0.9 after validation, both versions exist with timestamps.
- Source enum is closed. New sources require a schema migration, not a free-text field.
- Confidence band is computed server-side and stored on the row. Frontend reads the band name and applies the matching semantic color token.

## Vocabulary

The post-pivot product uses precise vocabulary. The pre-pivot vocabulary is retired.

**We say:**
- Ledger item, claim, row, entry
- YOU ledger, COMPANY ledger, WORK ledger
- Validated, pending
- Conflict, flagged, action, verified (confidence bands)
- Source, supporting detail
- Session response, uploaded document

**We do not say:**
- Asset (replaced by claim or ledger item)
- Sealed (replaced by validated)
- Mounted, mount artifact (replaced by uploaded, upload)
- Deposition (replaced by session)
- Sovereign Career Infrastructure (pre-pivot framing, retired)
- Forensic Audit (was the Auditor's framing, retired as user-facing language; still acceptable as internal architecture description)

Future surfaces, prompts, and docs use the current vocabulary. Old vocabulary in surviving project files is a flag for cleanup, not a model to follow.

## Questions for Jawahar

Two open questions to confirm with the current backend implementation:

1. Is versioning on claim updates implemented, or do updates overwrite the existing row? DESIGN-level requirement: history is preserved with timestamps. If the current implementation overwrites, that is a quality gap to close before Phase 2.

2. Is the confidence band computed server-side and returned in the API response, or is the API returning just the raw confidence number? DESIGN.md requires server-side computation. If the current implementation returns only the number, the API response shape needs a small extension to include the band name.

Both are answerable in a 15-minute conversation. Worth doing in the next sync.

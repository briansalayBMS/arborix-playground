# Arborix — Architecture

Version 0.3 · May 2026 · Status: alpha · DRAFT for review

This document captures the structural decisions about Arborix as a product: what surfaces exist, how they relate, where Arbor lives, how the user moves through it. It sits alongside DESIGN.md, which governs how Arborix looks, and the Coaching Principles section of DESIGN.md, which governs how Arbor behaves.

The decisions here are load-bearing. Changes to this document affect every surface and should be deliberate.

---

## Structural Decisions

### Arbor is everpresent

Arbor lives in the right pane — a focused-context surface reachable from every screen in the product. The user never navigates to Arbor; Arbor is always there.

The right pane is the conversational chrome of the product. The top bar is the navigational chrome. Both are persistent. Everything else is content that lives between them.

### The right pane is a focused-context surface

The right pane is not exclusively Arbor's panel. It is a general-purpose surface for *focused context*: information that is closely related to what the user is looking at, but does not belong on the underlying surface itself.

Arbor's conversation is the primary occupant of the right pane. Other contexts that use the same pane include:

- **Evidence details.** Click a sentence in Arbor's synthesis; the rows that support it appear in the pane.
- **Stakeholder details.** Click a stakeholder on COMPANY; their profile, Arbor's read, and the relationship history appear in the pane.
- **Past conversation reference.** Open a past conversation; it appears in the pane while the user stays on the surface they were on.
- **Record row details.** Click a goal, an OKR, a project, or another ledger row; everything Arbor knows about it appears in the pane.
- **Public View preview.** When the user is generating or editing a Public View; the live preview appears in the pane.

The right pane's collapsed state is a small Sovereign Beacon affordance in the bottom-right corner. The expanded state takes the right portion of the screen — typically about a third — with the underlying surface remaining visible to the left. The user can widen the pane to take more screen real estate when focused work in the pane requires it, but the pane does not go full-screen by default.

### The right pane supports a context stack

When the user opens a new context in the right pane (clicks a Sovereign Beacon mark, opens a stakeholder, opens an evidence detail) while a prior context is still active, the prior context goes into a stack. The user can navigate back through the stack to return to anything that was open before.

This is how a real coach works: *let me come back to that in a second; first, about that thing you just mentioned.* The pane preserves the conversation thread the user came from while the new context takes the foreground.

The user can dismiss any context in the stack at any time. The pane treats the stack as a history, not as a rigid sequence.

### HOME is the curated week-view

HOME is the surface the user arrives on. It is dynamically composed by Arbor each time the user opens the product. It contains a small set of items Arbor thinks the user should engage with right now — moves to consider, observations from recent activity, deadlines approaching, patterns Arbor has noticed.

HOME is not a dashboard. It is a presentation of what is on top, with Arbor offering specific ways into each piece.

HOME does not contain the user's full record, their full synthesis, or their full ledger. Those live on YOU, WORK, and COMPANY.

### The user has one record. Three hubs surface it.

The user's record is one thing. The schema separates it into three ledgers (YOU, COMPANY, WORK), and the product surfaces the record through three hubs that map onto the same cut.

**YOU** holds who the user is. Identity, personality, skills, goals, personal priorities. The dimensions that span a career and accumulate over time.

**WORK** holds what the user is doing right now in their current role. OKRs, active projects, the weekly accomplishments log, the rolling rhythm of work. The operational hub. Where the engagement loop lives.

**COMPANY** holds the people and place around the user. Company context (mission, goals at the company level, recent events), the user's manager, peers, reports, and key stakeholders. Each stakeholder is its own view, with Arbor's read on how to work with that person.

Each hub is one surface. Sections within the hub render the dimensions inside it (Personality, Skills, Goals under YOU; OKRs+Projects, Your Week under WORK; Context, Stakeholders under COMPANY). Where a section warrants a focused experience — a personality assessment, a skills audit, a goals entry — that experience launches from the hub and returns to it on completion.

At the top of each hub, the synthesized view: Arbor's read of who the user is (YOU), how their work has been going (WORK), how their context is shaping things (COMPANY). Below, the constituent inputs and evidence the synthesis is built from.

### One inside view. Many public views.

The user has one private record. The user has zero or more public views generated from the record, each targeted at a specific audience and purpose. A public view is a curated, shareable rendering of the record. It has its own URL.

The user can have several active at once: one targeted at Head of Product roles, one for speaking engagements, one for a board director slot. The user names each one and tells Arbor what it is for; Arbor curates the content.

Public views are not modes the user toggles into. They are artifacts the user generates.

### Generated Artifacts are outputs, not destinations

Several things in the product are *outputs the user produces from their record*, not destinations they navigate to. They are generated on demand, used in a specific moment, and live wherever the user puts them (downloaded, shared via URL, copied to clipboard, sent in an email).

The Generated Artifacts in scope:

**Public Views** — curated, shareable renderings of the record for external audiences. Each has its own URL.

**Brag Sheet** — a polished accomplishments document, generated from WORK data, for the user's own use or to share with a manager.

**My Performance review** — a recurring (typically quarterly) reflection on how the user did against their goals, drawing from YOU and WORK data, resulting in a written read the user can save or share.

The user generates each one through a contextual action on the relevant hub. None of them appears in the main navigation. The architecture is open to more Generated Artifacts being added without restructuring.

### Conversations are discrete and browsable

The user's history with Arbor is organized into discrete conversations. Each has a beginning, an end, a title Arbor produces, a summary, and a date. The user can browse past conversations and revisit anything that was discussed or decided.

The current conversation lives in the right pane. Past conversations live in a browse surface (Past Conversations) reachable from the top bar or the pane itself. A past conversation can be opened in the right pane for reference while the user is on any other surface.

### Material enters through the right pane

The primary path for the user to add to their record — file or text — is the right pane, while Arbor is its active occupant. The *Chat is the way in* principle from DESIGN.md applies. Deliberate flows (Personality assessment, Skills audit, Goals entry) are an alternative path for users who prefer structured input. Both paths write to the same record.

### Arbor's marks are a system primitive

The Sovereign Beacon is Arbor's mark. It appears in two roles: as the speaker indicator above Arbor's words (in ArborSpeech), and as a contextual handle next to a specific piece of content that Arbor has a take on. Tapping the mark in its contextual-handle role opens the right pane with that subject loaded — Arbor speaking about that specific thing.

The mark is the same component in both roles. Its placement and behavior differ.

---

## Surface Inventory

The following surfaces exist or will exist in the product. Each one has a name, a purpose, and a list of what it contains.

### HOME

**Purpose:** The curated week-view. The first surface the user lands on. Arbor's presentation of what is on top right now.

**Contains:**
- Arbor's open turn (greeting, continuity from last conversation, suggested focus) — surfaced in the right pane
- A small set of curated items Arbor thinks the user should engage with this week — directives to consider, observations Arbor has surfaced, deadlines approaching, patterns Arbor has noticed
- A Sovereign Beacon mark on each item, click-to-converse

**Does not contain:** Full synthesis, full record, full ledger. Those live on YOU, WORK, and COMPANY.

### YOU

**Purpose:** The hub for the user's professional identity. Who they are, what they care about, what they aspire to.

**Contains:**
- The synthesized view at the top — Arbor's read of who the user is, in prose, with attribution
- **Personality.** A summary of the user's personality results, with a deliberate flow available to take the assessment.
- **Skills.** A summary of the user's skills, with self-ratings and (eventually) peer ratings. A deliberate flow available to do a skills audit.
- **Goals.** The user's goals, life-and-career-spanning. Pairwise priority calibration lives here. A deliberate flow available to add or refine goals.
- A way to validate, edit, reject, or exclude individual evidence rows that underlie the synthesis
- A completeness signal, conversational in tone
- An action to generate a Public View

**Does not contain:** What the user is doing operationally. That is WORK. The people and place around the user. That is COMPANY.

### WORK

**Purpose:** The hub for the operational dimension of the user's current role. What they are doing right now.

**Contains:**
- The synthesized view at the top — Arbor's read of how the user's work has been going
- **OKRs and Active Projects.** Combined operational view of the user's quarterly targets and the work in flight. The user can add, edit, or update these manually or via chat with Arbor.
- **Your Week.** The rolling weekly accomplishments log. The user enters what they did this week (in chat or via a deliberate weekly flow). Impact Velocity view shows the user's output over time as a longitudinal trend.
- An action to generate a Brag Sheet
- An action to generate a My Performance review

**Does not contain:** Who the user is. That is YOU. The people and place around the user. That is COMPANY.

### COMPANY

**Purpose:** The hub for the people and place around the user's work.

**Contains:**
- The synthesized view at the top — Arbor's read of the user's context: their company, their relationships, where the friction is, where the support is
- **Context.** The user's company. Mission, goals at the company level, recent events the user has noted, the user's read on the culture and competitive environment. Material is entered by chat or uploaded; Arbor extracts the evidence.
- **Stakeholders.** The people around the user — manager, peers, reports, key collaborators. Each stakeholder is a view inside this section, accessible by clicking the stakeholder; the view appears in the right pane. For each, Arbor surfaces: the user's described relationship, Arbor's read on how to work better with that person, the history of how the relationship has been trending.

**Does not contain:** Who the user is. That is YOU. The user's work product. That is WORK.

### Public View

**Purpose:** A curated, shareable rendering of the user's record, targeted at a specific audience.

**Contains:**
- One synthesized presentation of the user, written for the target audience
- The Sovereign Beacon as the brand mark
- Nothing else — no chat, no record, no ledger, no evidence list

**Reached by:** A URL the user generates from YOU. The user can create, name, target, revoke, and see usage for each Public View.

**Visible to:** Anyone with the URL. Gating (login wall, expiration, view tracking) is a future design decision.

### Past Conversations

**Purpose:** The user's browseable history with Arbor.

**Contains:**
- A list of past conversations, each with a date, a title Arbor produced, and a summary
- Filter or search affordances
- A way to open any past conversation in the right pane for reference

**Reached by:** A link in the top bar or in the right pane.

### Settings

**Purpose:** Where the user configures Arborix and manages their account.

**Contains:**
- **Persona Tuner** — the four parameters (ambitious, collaborative, pragmatic, voice tone) that adjust Arbor's voice
- **Default upload mood** — drop-off or hand-off
- **Account management** — email, password, sign out, delete account
- **Exclusion list** — claims the user has marked as excluded from Public Views
- **Public View management** — list of active Public Views, with the ability to revoke or update each
- **Generated Artifacts** — past Brag Sheets, past Performance reviews, downloadable

**Reached by:** The avatar in the top right.

### Sign In / Sign Up

**Purpose:** Authentication. Already designed and built.

### Welcome

**Purpose:** The first meeting with Arbor after signup. Already designed and built. Three states: intro, reading, readback.

---

## Navigation Model

### Persistent chrome

Two elements are always present on every authenticated surface:

**The top bar.** Wordmark on the left. Avatar on the right. The avatar opens Settings. The top bar may also contain a quick access to Past Conversations. It does not contain links to YOU, WORK, COMPANY, or HOME — those are reached through other means.

**The right pane.** Always present in collapsed form (a small Sovereign Beacon affordance in the bottom-right corner). Expandable to its full state — a right-side panel taking roughly a third of the screen, with the underlying surface visible to the left. Widenable when the user wants more space to focus on the pane's content. Specific dimensions, animations, and breakpoints are a design decision for the build.

### Movement between hubs

The user moves between HOME, YOU, WORK, COMPANY, and Past Conversations through navigation that is accessible from the top bar or from within the right pane when Arbor is its active occupant. Specific placement (a small set of links in the top bar, a side navigation, a command palette) is a design decision for the build.

The architecture commits only to: these five destinations are reachable from anywhere in the product in one click or one keypress.

### Movement within a hub

Each hub is one surface with sections. The user moves between sections by scrolling, by tabs, by anchor links, or by some other means. Specific placement is a design decision for the build.

When a section warrants a focused experience (the personality assessment, the skills audit, the goals entry flow, the pairwise calibration), that experience launches from the section and returns to the hub on completion. The hub state updates to reflect the new input.

### Movement into the right pane

The user opens the right pane in one of several ways:

**By Sovereign Beacon click.** The user taps a Sovereign Beacon mark next to a piece of content. The right pane expands with Arbor pre-loaded on that subject.

**By collapsed pane click.** The user taps the Sovereign Beacon affordance in the bottom-right corner. The right pane expands with Arbor's current conversation (continuity turn, or fresh greeting if no recent conversation).

**By contextual link.** The user clicks an evidence row, a stakeholder, a past conversation reference, or another context-bearing link. The right pane expands with that context loaded.

When the right pane is already open with one context and a new context is opened, the prior context goes into the stack. The user can navigate back through the stack via a back affordance in the pane.

The user can dismiss the right pane at any time. The pane's collapsed state remains as a Sovereign Beacon affordance.

### Movement into Generated Artifacts

The user generates an artifact through a contextual action on the relevant hub. The Brag Sheet is generated from WORK. The My Performance review is generated from a contextual action that pulls from both YOU and WORK. The Public View is generated from YOU.

Each artifact, once generated, has its own representation. Public Views have URLs. Brag Sheets and Performance reviews can be downloaded, copied, or sent. Past artifacts are listed in Settings under Generated Artifacts.

### Empty and edge states

These are not surfaces. They are conditions any surface might be in. The architecture commits that:

- Every hub has an empty state appropriate to the moment (e.g., YOU before the user has added enough material; WORK before the user has logged any accomplishments; COMPANY before the user has described their stakeholders)
- Every surface has an unavailable state (e.g., Arbor is offline; the backend is unreachable)
- The right pane has its own loading and waiting states (e.g., Arbor is reading newly uploaded material; Arbor is regenerating a synthesis; a context is loading)

The exact treatment of each state is a design decision per surface.

---

## What This Architecture Does Not Yet Decide

These are real questions that this version of the architecture does not commit to. They are listed here so the next conversation knows where to start.

- **Proactive Arbor outside the website.** Whether Arbor reaches the user via SMS, email, or push notifications between sessions. The current architecture commits only to Arbor being proactive on the website itself.

- **Public view gating.** Whether Public Views are open URLs, password-protected, time-limited, or require the recipient to identify themselves.

- **Outbound feedback collection.** Whether Arborix can email peers to gather feedback on the user. The current architecture commits only to the user uploading feedback they have already received.

- **Job search capabilities.** Whether Arborix offers job matching, application tracking, or related career navigation features.

- **Interview prep as a named capability.** Whether interview rehearsal is a deliberate flow, an Arbor mode, or just something the user can do in chat.

- **Calendar and external event integration.** Whether Arborix is aware of the user's calendar, external news, or other context outside what the user provides directly.

These decisions can be made when each becomes pressing. The architecture is built so that any of them can be added without restructuring.

---

## Versioning

This document is versioned alongside DESIGN.md. Changes that affect structural decisions (the sections under Structural Decisions above) require a version bump and a deliberate audit. Changes to the surface inventory or navigation model can ship within the current version as the surfaces are built.

The next session of architecture work picks up at *What This Architecture Does Not Yet Decide* and selects one to resolve.

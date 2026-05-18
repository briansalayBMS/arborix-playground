# Pre-Pivot Arborix Review

Date: 2026-05-17
Context: Captured during an extended session where the dev server was inadvertently pointed at the pre-pivot main branch. The accident became an opportunity. We walked through ten surfaces of the pre-pivot product, evaluated what was substantive, and identified what should be brought forward into the post-pivot architecture.

This document is reference material. It is not a roadmap. Each pattern named here gets evaluated case-by-case when its build session arrives.

## What Pre-Pivot Arborix Was

Pre-pivot Arborix was an enterprise-adjacent forensic career accountability system. The product treated the user's career as a balance sheet to be audited. An Auditor agent extracted, verified, and instrumented commercial signals from the user's record. A Coach (Arbor) translated those signals into strategic career moves. The user accumulated sealed records, watched Strategic Signal and Narrative Debt scores move, and tracked progress toward a specific promotion level (L5 → L6).

The metaphors were legal-forensic: depositions, mounts, seals, chain of custody, sources of truth, ledger, evidence, verdict, conflict reconciliation. The aesthetic was data-dashboard-quiet: white cards on grey, restrained typography, status colors in muted green/amber/red. The voice was clinical and authoritative.

The pivot, locked May 13 2026, abandoned this for B2C individual coaching with a trusted-colleague register, conversational entry points, and the Hermès-editorial aesthetic that DESIGN.md commits to. The pivot was correct.

But the pre-pivot product had built more than the visual register suggests. Underneath the forensic vocabulary was a substantially developed information architecture. This document catalogs the patterns worth bringing forward.

## Ten Surfaces Reviewed

1. Welcome (PDF upload + stressor input + name/email)
2. HOME (verdict, evidence bars, directive cards, radar, conflict, ledger)
3. Signal Breakdown expanded (seven-dimension health view)
4. Auditor Session / Deposition Overlay (structured four-step session with lock pattern)
5. Asset Inspector (right pane evidence detail)
6. Ledger expanded (itemized records with seal status and impact weights)
7. Dossier Internal (operating profile, radar, conflict reconciliation)
8. Dossier External (Public View with impact cards and Sovereign Share Link)
9. Priorities / Pairwise ROI (ranked priorities with quantified impact and Arbor recommendation)
10. Artifact Ingestion / Universal Mount Station (structured ingestion surface)

## Six Structural Patterns That Held the Pre-Pivot Product Together

### 1. Dimension-tagged coaching artifact

Every actionable item — directive on HOME, priority on Pairwise ROI, open conflict on Dossier, evidence row in Ledger — was tagged with the radar axis it touched (STRATEGY, INFLUENCE, EXECUTION) and quantified with its impact on that axis (+0.18 STRATEGIC, +0.12 INFLUENCE). The user always saw not just what to do but which dimension it advanced and by how much.

The pre-pivot version had this implemented at four levels: directive, priority, evidence, conflict. The post-pivot impact gauges feature (committed 2026-05-17) brings this forward at the POV level. Other levels remain to be wired.

A caveat for the post-pivot register: the radar is a tool for visualizing the user to themselves. It is not the user's goal. Dimension tags help Arbor and the user see patterns. Quantified radar movement is not what the user is working toward; the user is working toward their stated goals. The dimension layer serves goal advancement, not the other way around.

### 2. Two-mode same-surface view

The Dossier had YOUR SUMMARY and EXTERNAL SUMMARY tabs. Same underlying record. Shared dimension cards. Shared radar. Different hero verdict (second-person coaching vs third-person pitch). Different body voicing. Different bottom section (open conflicts internally, impact cards externally). The Sovereign Share Link generated a public URL pointing at the external view.

This is the "one inside view, many public views" principle from ARCHITECTURE.md already implemented. The post-pivot has it in writing but not yet in code.

### 3. Right pane as evidence inspector

Clicking a ledger record opened a side panel showing source metadata, type, timestamp, Arbor's analysis of the artifact in voice, sources-of-truth chain (the documents the artifact itself was derived from), download original, view full transcript.

This is the right pane's evidence-detail context exactly as ARCHITECTURE.md describes it, with a working implementation already designed.

### 4. Session structure with locked turns

The Deposition Overlay implemented a structured four-step session: previous turn locked above (Arbor's question plus user's response), Arbor's acknowledgment of what was just said, the next follow-up question in italic, an optional source-mount field, the user's response area, continue and save-and-exit actions. Turns once submitted became immutable.

This is the structural backbone for chat wiring. The post-pivot has a right-pane chat placeholder but has not designed the conversation pattern.

### 5. The Arbor Recommendation card

A bottom-of-surface coaching read in voice. The pre-pivot version followed a specific six-part structure: attribution to data point, recommended move, quantified projection, underlying problem named, post-action state projected, clear directive ("Commit to this first.").

The structure is too mechanical for the post-pivot register. Arbor is a coach, not a drill sergeant. Arbor does not tell the user what to commit to. Arbor surfaces what it sees and invites the user to engage.

The radar quantification piece ("+0.18 radar lift," "Strategy axis from 42% to 60%") also lands wrong. The radar is a tool to help the user visualize themselves. It is not the user's goal. The user's goals are the user's goals. Modeling radar movement as the projected outcome confuses the instrument for the destination.

What survives, translated:
- Grounding in evidence stays. Arbor names what it sees and where it sees it.
- Naming the underlying tension stays. Arbor identifies what the move addresses without lecturing.
- The mechanical six-point structure does not. Recommendations live in voice — a paragraph of Arbor speaking, not a template.
- The directive close does not. Arbor invites, asks, surfaces. The user decides what to commit to.
- Quantified outcome projection is questionable. We can model what we model, but we are honest that we do not know exactly what will happen. The user's real outcomes are the user's goals, not radar movement.

Worth pulling forward: the register of grounding recommendations in evidence and naming the underlying tension. Not the template or the directive close.

### 6. Verified/pending lifecycle on every claim

Records were either SEALED (verified, locked) or Pending seal (Arbor's inference, awaiting confirmation). Every artifact had an impact weight (+0.03 YOU radar weight) that became active when sealed. Users could see the chain of custody from claim back to source documents.

The post-pivot has VERIFIED/PENDING tags on placeholder rows but has not built the full lifecycle, the impact weights, or the chain-of-custody traversal.

## What Is Substantive and Worth Bringing Forward

### Tier 1 — Foundational patterns the post-pivot is missing

**A. Dimension-tagged quantified-impact artifact as architectural commitment.** Every POV, every priority, every evidence row, every claim should be tagged with the axes it touches. Quantified impact is useful as Arbor's internal model and as user-facing visualization, but the radar serves goal advancement; it is not itself the goal. Foundation for the Jawahar conversation and for everything downstream.

**B. Two-mode Dossier (internal/external).** The post-pivot YOU is currently scaffolding. The pre-pivot Dossier is a working spec. Two-mode toggle pattern, shared dimension cards (Operating Mode / Environment / Priority Bias), complete radar treatment (radar + archetype name + per-axis bars), differentiated bottom sections (conflicts internally, impact cards externally). Target for the next YOU build session.

**C. Right pane as evidence inspector.** The Asset Inspector pattern is exactly how the right pane's evidence-detail context should look. The post-pivot has the right pane as a primitive but has not built what evidence looks like in the pane. The pattern was designed; bring it forward.

**D. Session structure with locked turns.** Append-only turns, Arbor's acknowledgment between user response and follow-up, optional source attachment, bounded sessions where appropriate. Apply when chat is wired.

### Tier 2 — Patterns worth deliberately considering

**E. The Arbor Recommendation register.** Grounded in evidence, naming the underlying tension, in voice, inviting rather than commanding. Not a six-part template — a register. Worth canonizing as the shape of any substantive observation Arbor surfaces.

**F. Priorities as user-input output, not Arbor ranking.** Numbered list, axis tag per priority, quantified impact. Arbor should not prioritize the user's life unilaterally — that assumes Arbor knows enough to rank the user's goals for them. Pairwise comparison is how the user contributes their honest priority stack. The destination for the Priorities sub-page under YOU is the *output of pairwise calibration*, not Arbor's autonomous ranking.

**G. Verified/pending lifecycle with chain of custody.** Full lifecycle (sealed/pending, impact weights per record, chain back to source documents, drill-through to original).

**H. Operating profile triplet (Operating Mode / Environment / Priority Bias).** Three short phrases summarizing the user's professional posture. Coaching read compressed to three labels. Goes at the top of YOU below the hero.

**K. Weekly summary / Brag Sheet.** End-of-week synthesis of what the user accomplished, drawn from session inputs and any tracked activity. The user can send it to their manager or use it themselves to reflect on what they did. Not in the post-pivot scope yet. Worth carrying forward as a destination once weekly accomplishment logging exists. (Originated in the cofounder's first-use spec under WORK > Your Week.)

### Tier 3 — Worth surfacing as design tensions

**I. Promotion Tracker as persistent target signal.** Pre-pivot had a single target (L5 → L6) with progress (68% competency match) always visible in the bottom-left. The post-pivot has nothing equivalent. The completeness-of-record signal currently rendered at the bottom of HOME does not communicate anything actionable to the user. Replace with goal-progress indicators against user-named active goals once Goals exist as a data model.

**J. Public View "Request ledger access" affordance.** Two-stage trust model: pitch first, receipts on request. Keep as space-claimed-but-not-built in v1. Build out when public views become real.

### Tier 4 — Correctly retired

- The green-teal logo. Pivot wordmark in Fraunces italic is correct.
- The card-on-card layout. Pivot's card-less editorial layout is correct.
- The blue CTA pill button. Pivot's sienna invitations are correct.
- The Auditor as a visible coaching voice. The pivot correctly collapsed Arbor and the Auditor into one agent with auditing and coaching skills.
- Forensic-legal vocabulary (Deposition, Mount, Seal, Verdict, Chain of Custody, Sources of Truth, AUDITOR'S VERDICT, AUDITOR'S ANALYSIS). The concepts often carry forward; the language does not.
- The bright-status color palette (orange/red/green dashboard signals).
- The bottom utility row (CALIBRATE / REQUEST FEEDBACK / LOG SIGNAL / JOURNAL) as persistent buttons.
- Hash-based record IDs (AX-309, AX-8F2C). Domain-prefixed sequential is better (YOU-001, COMPANY-001).
- The chat-bubble icon as the speaker indicator. The Sovereign Beacon is correct.
- The structured ingestion Universal Mount Station. The pivot's "chat is the way in" commitment stands.
- The directive close on Arbor recommendations ("Commit to this first."). Arbor invites, asks, surfaces. The user decides what to commit to.

## The Editorial-Register Principle Surfaced During Review

While building impact gauges as visible chips below each POV, the principle revealed itself: the chips violated the editorial register DESIGN.md commits to. They added a row of pinned metadata to every POV item, treating the reader as someone who needed everything labeled up front rather than someone who could ask if they wanted depth.

The principle in one sentence:

> Metadata defaults to the right pane, not to the surface. HOME is Arbor speaking; the pane is Arbor's receipts. The annotation mark on a POV is the bridge — depth on demand, never by default.

Applied first to the attribution line ("Based on N resume passages") via Step 3.5 (committed 14fe13b 2026-05-17): replaced with a small chainlink icon at the end of the POV body opening the right pane's sources view on click.

Worth formalizing in DESIGN.md as a Coaching Principle. The impact gauges chips themselves remain on the surface in v1 because they carry coaching value (goal linkages with strength) rather than receipts. Future review may collapse the chips into the pane too if the same friction surfaces.

## How This Document Should Be Used

This is reference material for the next 4-6 sessions of porting work. Pre-pivot Arborix is prior art. Each pattern named here gets a real "should this come forward, in what form, with what changes" conversation when its build session arrives.

The visual register is correctly abandoned. The voice is correctly translated (one Arbor with skills, no Auditor as visible identity). The information architecture is partially worth porting and partially worth reinventing in the post-pivot register.

The discipline that holds is reading the surface and trusting the editorial register and the brand voice over the architectural commitment. Patterns that survived their pre-pivot implementation deserve a re-evaluation against the trusted-colleague register before being brought forward unchanged.

# Arborix — Status Report for Jawahar Meeting

Date: May 19, 2026
From: Brian
Re: Where the frontend is, what is blocked, what we need

---

## Where the frontend is

The post-pivot YOU surface is built and wired to your deployed backend. The architectural commitment that YOU is ledger-derived is now live in code. Every place ledger-derived content can appear on the YOU surface has a wire to your backend; placeholder content fills wherever the backend has empty data.

Built and committed:

- YOU surface, two modes
  - Internal mode: hero + Operating Profile + Goals + Personality + Skills + Open Questions + Record
  - External mode: hero + Impact Cards + Operating Profile strip + Personality (slim) + Skills + bottom affordances
- WORK and COMPANY surfaces as minimal hubs with the Record component
- All right pane interactions wired (chainlinks, empty-state coaching lines, Talk-about-this on hero)

Endpoints currently wired and returning 200:

- `GET /users/me` — single fetch per zen session, hydrates SideNav
- `GET /one-pager/` — single fetch per zen session, hydrates hero
- `GET /ledger/` — single fetch per zen session via shared LedgerProvider, feeds typed views on YOU and Record component on all three hubs

Wires use defensive translators: real backend data overlays placeholder where shape matches; placeholder fills the rest. Falls back gracefully on every field.

---

## What is rendered right now

For Brian's user, the backend returns:

- `/one-pager/` → `performance_content: {}`, `job_search_content: {}`, `completeness_pct: 0.0`
- `/ledger/` → `you: []`, `company: []`, `work: []`, `total_items: 0`, `validated_items: 0`

So the YOU surface renders entirely placeholder content. The hero shows hand-written placeholder copy. The Operating Profile triplet, Skills, Open Questions, and Impact Cards all render hardcoded placeholder data (not generated from a real resume). The Record on YOU/WORK/COMPANY shows empty-state coaching copy across all 13 categories.

The plumbing is complete. The water has not started flowing.

---

## Why it is empty

The root cause is one blocked endpoint:

**`POST /onboarding/resume` returns 404 on Railway**

Without this, no user can upload a resume, so the AuditorAgent has nothing to extract claims from, so the YOU ledger stays empty, so the one-pager has nothing to synthesize, so every surface renders placeholder.

This is the critical path. Resolving it unlocks the entire post-upload demo flow.

---

## What we need from you to unblock

1. **`POST /onboarding/resume` deploy to Railway.** Highest priority. Your summary indicated the endpoint works locally; the latest commit just needs to be deployed. Estimated unblock time?

2. **`POST /profile/chat` debugging.** The right pane chat affordances need this to be a real conversation, not a placeholder dialog. What is broken specifically, and what is the estimated fix time?

3. **A populated test user.** We need to verify the shape of an individual ledger item inside the `you[]/company[]/work[]` arrays. The OpenAPI spec declares them as untyped arrays. Either:
   - Populate one test user (yours or a seeded test account) with sample claims across categories, OR
   - Paste a sample item shape in writing for our docs

4. **Two architectural confirmations** (both 15-minute answers):
   a. Is versioning on claim updates implemented? Doctrine requires history is preserved with timestamps; current implementation unknown to us.
   b. Is the confidence band computed server-side and returned in the API response? Doctrine requires this; current implementation unknown to us.

5. **Confirmation that `/ledger/{domain}` endpoints are or are not coming.** The existing client had `/ledger/you` which 404s in production; we removed it. If `/ledger/you`, `/ledger/work`, `/ledger/company` are coming, we would wire them as a per-domain optimization. If you would rather we continue using `/ledger/` with client-side filter by domain, that works too.

---

## Docs attached for your review

1. **`arborix-ledger-requirements.md`** (307 lines) — Foundational ledger doctrine. Specifies the trust contract, the three domains, the atomic claim shape, types via category, the two-axis state model, provenance and confidence rules, rendering specs for both the pane detail view and the Record component on each hub, retired vocabulary, and two open questions for you.

2. **`ARCHITECTURE.md`** (modified) — Three-layer model added: raw inputs → ledger items → synthesized reads. This is the architectural language we are using to describe how the user's record is structured.

3. **`docs/backend-shapes-2026-05-18.md`** — Probe findings from yesterday. Captured what `/one-pager/` and `/ledger/` actually return for an empty user, with specific questions about response field shapes.

Read order if pressed for time: ledger-requirements first (foundational), ARCHITECTURE.md second (one-page reference), backend-shapes last (probe detail).

---

## The demo tomorrow

If `/onboarding/resume` deploys before our meeting, we can do the full upload-to-render loop live. Brian uploads his real resume, you watch the wire fill, we both see Arborix actually do the thing it was built to do.

If it does not deploy before the meeting, we walk through the working wire with empty data, look at the empty states, walk through the doctrine docs, and confirm the deploy timeline.

Either path is productive. The `/onboarding/resume` deploy is the difference between a demo and a working-architecture review.

— Brian

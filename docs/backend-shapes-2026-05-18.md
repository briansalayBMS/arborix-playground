# Backend response shapes — captured 2026-05-18

Source: `GET https://arborix-production.up.railway.app/openapi.json` (FastAPI OpenAPI 3.0 spec).

Reference material for the Jawahar meeting tomorrow. Not committed.

## All exposed paths

```
GET    /health
GET    /users/me
PUT    /users/me
OPTIONS /users/me
GET    /one-pager/
POST   /one-pager/generate
POST   /onboarding/resume
GET    /ledger/
GET    /chat/init
POST   /chat/
GET    /chat/history
POST   /chat/reset
POST   /profile/chat
POST   /profile/regenerate
```

## Endpoints NOT exposed (relevant for tonight's wire)

- `/ledger/you` — does **not** exist on the deployed API. The current frontend `client.ts` has a `getLedgerYou()` that calls this path; it would 404.
- `/goals` — does **not** exist. The optional Goals wire planned for tonight is not achievable against this backend.
- `/onboarding/onboarding-resume` — the current frontend `client.ts:96` calls this; the real path is `/onboarding/resume`. Worth fixing when resume upload is unblocked.

## Schema typo to flag

The OpenAPI spec defines `CompletennessResponse` (double-n). Used by `LedgerResponse.completeness`. Cosmetic but worth flagging.

## GET /health

Response schema not declared in OpenAPI (status 200, empty content schema). Live response shape needs to be discovered via a real call. Assume `{ status: "ok" }` or similar until we see one.

## GET /users/me → UserResponse

```ts
interface UserResponse {
  id: string;           // required
  email: string;        // required
  name: string | null;
  roles: string[];      // default ["user"]
  mode: string;         // default "performance"
  resume_text: string | null;
  linkedin_text: string | null;
  profile_notes: string | null;
}
```

**Fields NOT present that the wiring plan assumed:**
- `completeness_pct` — not on `/users/me`. Lives on `/one-pager/` and `/ledger/`.
- `current_level`, `target_level` — not on `/users/me`. Not exposed anywhere in the OpenAPI spec.

So the left-nav user-name hydration is the only `/users/me`-driven concern tonight. Level data is a backend-add-later question for Jawahar.

## GET /one-pager/ → OnePagerResponse

```ts
interface OnePagerResponse {
  id: string;                                       // required
  user_id: string;                                  // required
  completeness_pct: number;                         // required
  performance_content: Record<string, unknown> | null;  // free-form JSONB blob
  job_search_content: Record<string, unknown> | null;   // free-form JSONB blob
}
```

The two content blobs are typed only as "object with arbitrary keys" in the OpenAPI spec. The actual keys (`headline`, `pitch`, `summary`, `strengths`, `achievements`, `recent_impact`, `market_position`) come from Jawahar's summary, not from the spec — we have to trust the summary and validate against a real response at wire time.

**Translation mapping (tentative — confirm against real response shape):**

| Source field | Frontend target | Notes |
|---|---|---|
| `performance_content.headline` | `internalHero.title` | If present |
| `performance_content.summary` or `.pitch` | `internalHero.body` | Whichever reads as paragraph |
| `performance_content.strengths` | (TBD — possibly skills) | Shape unknown |
| `performance_content.achievements` | (TBD — possibly impact cards on Internal? but Internal has no impact cards) | Shape unknown |
| `performance_content.recent_impact` | (TBD) | Shape unknown |
| `performance_content.market_position` | (TBD — possibly hero?) | Shape unknown |
| `job_search_content.headline` | `externalHero.title` | If present |
| `job_search_content.pitch` | `externalHero.narrative` | If present |
| `job_search_content.achievements` | `impactCards[]` | Shape-dependent |

## GET /ledger/ → LedgerResponse

```ts
interface LedgerResponse {
  you: unknown[];        // item shape NOT specified in OpenAPI
  company: unknown[];    // item shape NOT specified
  work: unknown[];       // item shape NOT specified
  completeness: {
    you: number;
    company: number;
    work: number;
    overall: number;
  };
  total_items: number;
  validated_items: number;
}
```

**Blocker for tonight's optional extension:** item shapes for `you[]`, `company[]`, `work[]` are not declared. We'd need to either probe a real response or ask Jawahar before we can write a translator. Recommend deferring to tomorrow.

### Live probe — 2026-05-18

Ran a disposable probe via a temporary `useEffect` in `YouHub.tsx` calling `getLedger()`. Authenticated as Brian's user. Result:

```js
{
  you: [],          // Array(0)
  company: [],      // Array(0)
  work: [],         // Array(0)
  completeness: { /* not expanded — presumably { you: 0, company: 0, work: 0, overall: 0 } per OpenAPI */ },
  total_items: 0,
  validated_items: 0,
}
```

**Confirmed**: top-level shape matches the OpenAPI schema exactly. The three domain arrays exist as plain arrays at the root, not wrapped in any envelope.

**Still unknown**: shape of individual items inside `you[]`, `company[]`, `work[]`. The user is empty because `/onboarding/resume` is blocked — no content has been generated yet. Same root cause as the empty `performance_content` and `job_search_content` on `/one-pager/`.

**Ask Jawahar tomorrow**: populate a test user (his own, or seed one) so we can see the actual item shape. Key questions for that conversation:
- Does an item have a `dimension` / `name` field? (e.g., "Cognitive Endurance", "Strategic Patience")
- Does it have a `value` / `weight` / `score`?
- Does it carry source citations or evidence references?
- Is there a `verified` / `sealed` flag, matching the pre-pivot VERIFIED/PENDING pattern?
- Does it have a `domain` discriminator on each item, or is the domain implicit in which array (`you`/`company`/`work`) it sits in?

The translator and surface design for Operating Profile / Skills hydration are blocked on this shape. No code written tonight for the ledger wire — pure observation.

## OPTIONS /users/me

Present in the spec — CORS preflight wired on the backend side. Worth confirming `Access-Control-Allow-Origin: http://localhost:3000` is in the response headers from a real browser-side preflight call.

## Notes for the Jawahar meeting

1. **Confirm `performance_content` and `job_search_content` JSONB key conventions.** OpenAPI spec leaves them untyped; the summary lists keys but a real response would let us pin a transformer-level type.
2. **`/ledger/` item shape for `you[]`, `company[]`, `work[]`.** Needed to wire Operating Profile / Skills hydration.
3. **`/goals` endpoint.** Doesn't exist. Is this on the backend roadmap, or are goals lived in another shape (e.g., a section of `performance_content`)?
4. **`/onboarding/resume` vs `/onboarding/onboarding-resume`.** Frontend client has the wrong path. Confirm `/onboarding/resume` is canonical, then fix in `client.ts` (currently blocked on the 404 anyway).
5. **`CompletennessResponse` typo** — worth correcting when convenient.
6. **`current_level` / `target_level` for the user.** Not in `/users/me`. Where do these live, if anywhere? (Promotion-tracker UI is a future feature, not tonight.)

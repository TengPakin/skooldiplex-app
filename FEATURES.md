# Candidate Features — where to build them

> In **B6 (PRD)** you chose ONE feature to ship. In **B8 (Vibe Coding)** you build it into
> this codebase. Below: each candidate feature and the exact extension point.
> Use `ui-ux-pro-max` for design patterns and the **Browser MCP** to screenshot + refine.

---

## Feature A — Streamlined booking
**Goal:** cut booking abandonment (currently 61%) by reducing steps.
**Where:** `app/booking/page.tsx`
- The flow is deliberately **5 steps** (Seats → Snacks → Coupon → Payment → Confirm).
- Collapse it: merge Snacks + Coupon, or move Coupon into the Confirm summary, so a user
  can book in ≤ 3 taps. Keep the seat picker; trim the friction after it.
**Done when:** a user can complete a booking in fewer steps, and the step indicator reflects it.

---

## Feature B — SkooldiFan loyalty dashboard  ★ non-tech default
**Goal:** lift loyalty active rate (currently 18%) by making rewards feel alive.
**Where:** `app/loyalty/page.tsx` + `data/loyalty.json`
- `data/loyalty.json` already has `rewards[]` and `history[]` that the page does **not** render yet.
- Build: a **redeemable rewards grid** (cost in points, redeem button) and a **points history**
  timeline below the member card.
**Done when:** the rewards from the JSON appear as cards, and recent point activity is listed.
**Why this is the safe default:** it's additive (you render existing data), no flow logic to rewire.

---

## Feature C — Resume booking (saved state)
**Goal:** recover users who drop out mid-booking.
**Where:** `app/booking/page.tsx`
- State currently lives only in `useState`, so a refresh loses everything.
- Persist the booking `state` to `localStorage` on each step; on load, if a draft exists,
  show a **"Resume your booking?"** banner that restores it.
**Done when:** refreshing mid-flow offers to restore the previous seats/snacks/step.

---

## Tips
- Run `npm run dev` and keep the browser open; ask Claude Code to screenshot via the Browser MCP and compare to your Nano Banana mockup.
- Stay inside the 420px mobile frame and the amber/navy brand (see `CLAUDE.md`).
- Behind on time? `git switch half-built` has Feature B partially done — finish the last mile.

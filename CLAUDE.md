# Skooldiplex App — Codebase Guide

> Baseline product for the **Claude Code for PM** workshop (PMB#9). Students clone this
> repo, ask Claude Code to explain it, then build a feature they spec'd earlier in the day.
> Keep this file accurate — it's what makes "explain this codebase" produce a great answer.

## What this app is
A **mobile-first cinema app** for Skooldiplex (a fictional Thai cinema chain, 38 branches).
It is intentionally small and readable so a PM can understand it in minutes.

## Stack
- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS v3** (brand tokens in `tailwind.config.ts`)
- **Rubik** (English) + **IBM Plex Sans Thai** (Thai) via `next/font/google`. UI chrome is bilingual (Thai primary).
- No backend — data is mock JSON in `data/`, typed through `lib/movies.ts`
- Icons are inline SVG in `components/icons.tsx` (no emoji in UI chrome, no icon library)

## Run it
```bash
npm install
npm run dev      # http://localhost:3000
```
> Heads-up: a `#` in the absolute folder path (`pmb#9`) breaks Next's config
> resolver. If `npm run dev` 500s on `globals.css`, run from a path without `#`
> (e.g. copy to `/tmp/skooldiplex`), or rename the parent folder.

## Where things live
| Path | Responsibility |
|------|----------------|
| `app/layout.tsx` | Root layout: fonts, phone-ratio device frame, scrollable `main` + sticky `BottomNav` |
| `app/page.tsx` | **Home** — branch bar, featured hero, now-showing + coming-soon rails, loyalty teaser |
| `app/movies/page.tsx` | **Movies** — format filter + film cards + today's showtimes + coming-soon (client component) |
| `app/showtimes/page.tsx` | **Showtimes** — booking entry: branch + date + movie(s); a showtime tap carries context to `/booking` (client component) |
| `app/booking/page.tsx` | **Booking** — 5-step flow (Seats → Snacks → Coupon → Payment → Confirm). Reads the chosen movie/branch/hall/date/time from URL params; shows an empty state if entered with no showtime. Client component. |
| `app/loyalty/page.tsx` | **Rewards** — membership card + tier benefits (reads `data/loyalty.json`) |
| `app/tickets/page.tsx` | **My Tickets** — upcoming / past e-tickets with entry QR codes (reads `data/tickets.json`). Reached from the home "ตั๋วของฉัน" quick action + the booking confirmation |
| `components/BottomNav.tsx` | 4-tab sticky bottom bar (Home / Movies / Booking / Rewards) |
| `components/Poster.tsx` | Cinematic key-art tile (mood gradient + glow + grain + vignette) + `FormatChip` |
| `components/QrCode.tsx` | Deterministic QR-style code for e-tickets (visual stand-in — no backend; stable across SSR/CSR) |
| `components/icons.tsx` | Inline SVG icon set (currentColor, strokeWidth 1.8) |
| `lib/movies.ts` | Typed movie model + `nowShowing` / `comingSoon` / `runtime` helpers, plus `branches` + `dateChips` for the selection step |
| `lib/tickets.ts` | `upcomingTickets` / `pastTickets`, each joined to its movie |
| `data/movies.json` | Movies: EN + Thai titles, ratings, formats, now/soon status, key-art palette, showtimes |
| `data/tickets.json` | Mock upcoming + past tickets (the e-ticket "wallet") |
| `data/loyalty.json` | Member, tiers — plus **unused** `rewards[]` / `history[]` (see FEATURES.md) |

## Brand (locked — see `../skooldiplex/brand-spec.md`)
- Amber `#FAA91A` (single accent) + warm amber `#FFB300` (highlights, sparingly); navy `#0B101E` premium dark surfaces; warm off-white `#FFF8F0` page. **No reds/oranges** (off-brand).
- Tailwind tokens: `brand.amber`, `brand.amberWarm`, `brand.amberInk` (accessible amber text), `brand.amberSoft`, `brand.navy`, plus warm neutrals `ink` / `muted` / `faint` / `paper` / `surface` / `line`. Use these, not raw hex.

## Conventions (please follow when extending)
- One amber accent only; warm neutrals (paper / surface / line), navy for premium dark surfaces.
- Touch targets ≥ 44px; transitions 150–300ms; respect `prefers-reduced-motion` (already in `globals.css`).
- Inline SVG icons only — never emoji in UI chrome.
- Bilingual chrome: Thai primary with English secondary where it adds clarity.
- Keep new UI inside the phone-ratio mobile frame.

## Booking flow (real customer journey)
`Home / Movies` → pick a movie → **`/showtimes`** (choose branch + date + showtime) → **`/booking`** (Seats → Snacks → Coupon → Payment → Confirm). The "จองตั๋ว" nav tab opens `/showtimes` (it never jumps straight to a seat map). Context passes via URL params: `m` (movie id), `t` (time), `h` (hall), `f` (format), `b` (branch), `d` (date).

## Building a feature?
Read **FEATURES.md** — it lists the three candidate features and the exact file each one plugs into. The 5-step `/booking` flow is intentionally unchanged for Features A & C.

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
- **Outfit** font via `next/font/google`
- No backend — data is mock JSON in `data/`
- Icons are inline SVG in `components/icons.tsx` (no emoji, no icon library)

## Run it
```bash
npm install
npm run dev      # http://localhost:3000
```

## Where things live
| Path | Responsibility |
|------|----------------|
| `app/layout.tsx` | Root layout: font, 420px mobile frame, renders `BottomNav` |
| `app/page.tsx` | **Home** — hero, "Now showing" scroller, loyalty teaser |
| `app/movies/page.tsx` | **Movies** — list of films + today's showtimes (reads `data/movies.json`) |
| `app/booking/page.tsx` | **Booking** — 5-step flow (Seats → Snacks → Coupon → Payment → Confirm). Client component. |
| `app/loyalty/page.tsx` | **Rewards** — member card + points + tier progress (reads `data/loyalty.json`) |
| `components/BottomNav.tsx` | 4-tab bottom navigation (Home / Movies / Booking / Rewards) |
| `components/icons.tsx` | Inline SVG icon set (currentColor, strokeWidth 1.8) |
| `data/movies.json` | Movies, ratings, showtimes |
| `data/loyalty.json` | Member, tiers — plus **unused** `rewards[]` / `history[]` (see FEATURES.md) |

## Brand
- Amber `#FAA91A` (single accent), navy `#0B101E` (dark surfaces), slate neutrals, white background.
- Tailwind tokens: `brand.amber`, `brand.amberDark`, `brand.navy`. Use these, not raw hex.

## Conventions (please follow when extending)
- One amber accent only; keep neutrals slate/white.
- Touch targets ≥ 44px; transitions 150–300ms; respect `prefers-reduced-motion` (already in `globals.css`).
- Inline SVG icons only — never emoji.
- Keep new UI inside the 420px mobile frame.

## Building a feature?
Read **FEATURES.md** — it lists the three candidate features and the exact file each one plugs into.

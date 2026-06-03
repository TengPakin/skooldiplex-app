# Skooldiplex App

Mobile-first cinema booking & loyalty app — the baseline product for the **Claude Code for PM** workshop (Skooldio PMB#9).

```bash
git clone <this-repo-url>
cd skooldiplex-app
npm install
npm run dev          # open http://localhost:3000
```

## What's inside
- **Home** · **Movies + showtimes** · **5-step Booking** · **Loyalty/Rewards**
- Next.js 14 (App Router) + TypeScript + Tailwind. Mock data in `data/`. No backend.

## For the workshop
You'll extend this with the feature you spec'd earlier today. See **[FEATURES.md](./FEATURES.md)** for the three candidate features and exactly where each one plugs in, and **[CLAUDE.md](./CLAUDE.md)** for the codebase map.

Tip: open it in Claude Code and ask *"Explain this codebase and where my feature should go — @FEATURES.md"*.

## Deploy
Works out of the box on Vercel (`vercel` or connect the repo). No env vars required.

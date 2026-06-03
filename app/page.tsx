import Link from "next/link";
import movies from "@/data/movies.json";
import loyalty from "@/data/loyalty.json";
import { StarIcon, TicketIcon, CrownIcon, ChevronRight } from "@/components/icons";

export default function HomePage() {
  const nowShowing = movies.slice(0, 5);
  const { member } = loyalty;

  return (
    <div>
      {/* Hero — navy, brand, asymmetric left-aligned */}
      <header className="rounded-b-[2rem] bg-brand-navy px-5 pb-8 pt-10 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-amber">
          Skooldiplex
        </p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight">
          Tonight&apos;s the night.
          <br />
          Pick your seat.
        </h1>
        <p className="mt-2 max-w-[34ch] text-sm text-slate-300">
          38 branches nationwide · book in seconds · earn points on every ticket.
        </p>
        <Link
          href="/booking"
          className="mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-brand-amber px-5 text-sm font-semibold text-brand-navy transition-transform duration-150 active:scale-[0.98]"
        >
          <TicketIcon width={18} height={18} />
          Book a ticket
        </Link>
      </header>

      {/* Now showing — horizontal scroll */}
      <section className="px-5 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Now showing</h2>
          <Link href="/movies" className="flex items-center gap-0.5 text-sm font-medium text-brand-amberDark">
            All movies <ChevronRight width={16} height={16} />
          </Link>
        </div>

        <div className="no-scrollbar -mx-5 mt-3 flex gap-3 overflow-x-auto px-5 pb-2">
          {nowShowing.map((m) => (
            <Link key={m.id} href="/movies" className="w-[140px] shrink-0">
              <div
                className="flex h-[190px] w-[140px] flex-col justify-end rounded-2xl p-3 shadow-card"
                style={{ background: `linear-gradient(160deg, ${m.accentTo}, ${m.accentFrom})` }}
              >
                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
                  <StarIcon width={11} height={11} className="text-brand-amber" />
                  {m.rating}
                </span>
              </div>
              <p className="mt-2 line-clamp-1 text-sm font-semibold text-slate-900">{m.title}</p>
              <p className="line-clamp-1 text-xs text-slate-500">{m.genre}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Loyalty teaser */}
      <section className="px-5 pt-4">
        <Link
          href="/loyalty"
          className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition-transform duration-150 active:scale-[0.99]"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-amber/15 text-brand-amberDark">
            <CrownIcon width={22} height={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">{member.tier} member</p>
            <p className="text-xs text-slate-500">
              {member.points.toLocaleString()} pts · {member.pointsToNextTier} to {member.nextTier}
            </p>
          </div>
          <ChevronRight width={18} height={18} className="text-slate-400" />
        </Link>
      </section>
    </div>
  );
}

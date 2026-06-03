import Link from "next/link";
import movies from "@/data/movies.json";
import { StarIcon, ClockIcon } from "@/components/icons";

export default function MoviesPage() {
  return (
    <div className="px-5 pt-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Movies</h1>
      <p className="mt-1 text-sm text-slate-500">In cinemas now at Skooldiplex</p>

      <div className="mt-5 flex flex-col gap-4">
        {movies.map((m) => (
          <article
            key={m.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
          >
            <div className="flex gap-3 p-3">
              {/* Poster tile */}
              <div
                className="grid h-[112px] w-[80px] shrink-0 place-items-end rounded-xl p-2"
                style={{ background: `linear-gradient(160deg, ${m.accentTo}, ${m.accentFrom})` }}
              >
                <span className="rounded-md bg-black/30 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                  {m.ageRating}
                </span>
              </div>

              {/* Meta */}
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold leading-snug text-slate-900">{m.title}</h2>
                <p className="text-xs text-slate-500">{m.genre}</p>
                <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                    <StarIcon width={13} height={13} className="text-brand-amber" />
                    {m.rating}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ClockIcon width={13} height={13} />
                    {Math.floor(m.durationMin / 60)}h {m.durationMin % 60}m
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                  {m.synopsis}
                </p>
              </div>
            </div>

            {/* Showtimes */}
            <div className="border-t border-slate-100 px-3 py-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Today
              </p>
              <div className="flex flex-wrap gap-2">
                {m.showtimes.map((s, i) => (
                  <Link
                    key={i}
                    href="/booking"
                    className="flex min-h-[44px] flex-col items-center justify-center rounded-xl border border-slate-200 px-3 py-1.5 transition-colors duration-150 hover:border-brand-amber active:scale-[0.98]"
                  >
                    <span className="text-sm font-semibold text-slate-900">{s.time}</span>
                    <span className="text-[10px] text-slate-500">{s.format} · {s.hall}</span>
                  </Link>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

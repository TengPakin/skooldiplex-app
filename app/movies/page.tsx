"use client";

import { useState } from "react";
import Link from "next/link";
import { nowShowing, comingSoon, runtime, type Movie } from "@/lib/movies";
import Poster from "@/components/Poster";
import { StarIcon, ClockIcon, SearchIcon, ChevronRight } from "@/components/icons";

const FILTERS = ["ทั้งหมด", "IMAX", "4DX", "2D"] as const;

export default function MoviesPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ทั้งหมด");
  const list =
    filter === "ทั้งหมด" ? nowShowing : nowShowing.filter((m) => m.formats.includes(filter));

  return (
    <div>
      {/* Sticky header */}
      <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/85 px-5 pb-3 pt-[max(env(safe-area-inset-top),1.25rem)] backdrop-blur-xl">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-thai text-2xl font-bold leading-none text-ink">หนัง</h1>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-faint">Now in cinemas</p>
          </div>
          <button
            aria-label="Search"
            className="grid h-10 w-10 place-items-center rounded-full bg-surface text-muted shadow-card ring-1 ring-line active:scale-95"
          >
            <SearchIcon width={19} height={19} />
          </button>
        </div>

        {/* Format filter */}
        <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5">
          {FILTERS.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={
                  "font-thai shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors duration-150 " +
                  (active
                    ? "bg-brand-navy text-white"
                    : "bg-surface text-muted ring-1 ring-line hover:text-ink")
                }
              >
                {f}
              </button>
            );
          })}
        </div>
      </header>

      {/* Now showing list */}
      <div className="flex flex-col gap-4 px-5 pt-4">
        {list.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
        {list.length === 0 && (
          <p className="font-thai py-10 text-center text-sm text-faint">
            ไม่มีรอบ {filter} ในวันนี้
          </p>
        )}
      </div>

      {/* Coming soon */}
      <div className="mt-7 px-5 pb-7">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-thai text-lg font-bold leading-none text-ink">เร็วๆ นี้</h2>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-faint">Coming soon</p>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {comingSoon.map((m) => (
            <article
              key={m.id}
              className="flex items-center gap-3.5 rounded-2xl border border-line bg-surface p-3 shadow-card"
            >
              <Poster movie={m} rounded="rounded-xl" className="h-[84px] w-[84px] shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-ink">{m.title}</p>
                <p className="font-thai truncate text-xs text-muted">{m.titleTh}</p>
                <p className="font-thai mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-amberInk">
                  เข้าฉาย {m.releaseDate}
                </p>
              </div>
              <button className="font-thai shrink-0 rounded-full bg-brand-amberSoft px-3.5 py-2 text-[12px] font-semibold text-brand-amberInk active:scale-95">
                เตือนฉัน
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function MovieCard({ movie: m }: { movie: Movie }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <Link href={`/showtimes?m=${m.id}`} className="flex gap-3.5 p-3">
        <Poster movie={m} rounded="rounded-xl" className="h-[138px] w-[96px] shrink-0">
          <div className="mt-auto p-2">
            <span className="rounded-md bg-black/40 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur">
              {m.ageRating}
            </span>
          </div>
        </Poster>

        <div className="min-w-0 flex-1 py-0.5">
          <h2 className="text-[17px] font-bold leading-tight text-ink">{m.title}</h2>
          <p className="font-thai text-xs text-muted">{m.titleTh}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span className="inline-flex items-center gap-1 font-semibold text-ink">
              <StarIcon width={13} height={13} className="text-brand-amber" />
              {m.rating}
            </span>
            <span className="inline-flex items-center gap-1">
              <ClockIcon width={13} height={13} />
              {runtime(m.durationMin)}
            </span>
            <span className="rounded border border-line2 px-1.5 py-px text-[10px] font-semibold text-muted">
              {m.ageRating}
            </span>
          </div>
          <p className="font-thai mt-1.5 text-xs text-muted">{m.genreTh}</p>
        </div>
      </Link>

      {/* Showtimes */}
      <div className="border-t border-line px-3 py-3">
        <p className="font-thai mb-2 text-[11px] font-semibold text-faint">รอบฉายวันนี้ · CentralWorld</p>
        <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3">
          {m.showtimes.map((s, i) => (
            <Link
              key={i}
              href={`/booking?m=${m.id}&t=${encodeURIComponent(s.time)}&h=${encodeURIComponent(s.hall)}&f=${encodeURIComponent(s.format)}&b=CentralWorld&d=${encodeURIComponent("วันนี้")}`}
              className="flex min-h-[48px] shrink-0 flex-col items-center justify-center rounded-xl border border-line2 px-3.5 py-1.5 transition-colors duration-150 hover:border-brand-amber hover:bg-brand-amberSoft/40 active:scale-[0.97]"
            >
              <span className="text-sm font-bold text-ink">{s.time}</span>
              <span className="text-[10px] font-medium text-muted">
                {s.format} · {s.hall}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}

"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  nowShowing,
  getMovie,
  runtime,
  branches,
  dateChips,
  type Movie,
  type Showtime,
} from "@/lib/movies";
import Poster from "@/components/Poster";
import {
  ChevronLeft,
  ChevronDown,
  StarIcon,
  ClockIcon,
  PinIcon,
  CheckIcon,
  CalendarIcon,
} from "@/components/icons";

function ShowtimesInner() {
  const router = useRouter();
  const params = useSearchParams();
  const movieId = params.get("m");
  const focus = movieId ? getMovie(movieId) : null;

  const [branchId, setBranchId] = useState(branches[0].id);
  const [dateId, setDateId] = useState(dateChips[0].id);
  const [branchOpen, setBranchOpen] = useState(false);

  const branch = branches.find((b) => b.id === branchId)!;
  const date = dateChips.find((d) => d.id === dateId)!;
  const dateLabel = date.dow === "วันนี้" || date.dow === "พรุ่งนี้" ? date.dow : `${date.dow} ${date.day} มิ.ย.`;

  function pick(m: Movie, s: Showtime) {
    const qs = new URLSearchParams({
      m: m.id,
      t: s.time,
      h: s.hall,
      f: s.format,
      b: branch.name,
      d: dateLabel,
    });
    router.push(`/booking?${qs.toString()}`);
  }

  const list = focus ? [focus] : nowShowing;
  const isSoon = focus?.status === "soon";

  return (
    <div>
      {/* Header */}
      <header className="bg-brand-navy px-5 pb-5 pt-[max(env(safe-area-inset-top),1.25rem)] text-white">
        <div className="flex items-center gap-3">
          <Link
            href={focus ? "/movies" : "/"}
            aria-label="Back"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white active:scale-95"
          >
            <ChevronLeft width={20} height={20} />
          </Link>
          <div>
            <h1 className="font-thai text-lg font-bold leading-none">เลือกรอบฉาย</h1>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-white/45">Select a showtime</p>
          </div>
        </div>

        {/* Branch selector */}
        <div className="mt-4">
          <button
            onClick={() => setBranchOpen((o) => !o)}
            aria-expanded={branchOpen}
            className="flex w-full items-center gap-3 rounded-2xl bg-white/8 px-4 py-3 text-left transition-colors hover:bg-white/12"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-amber/15 text-brand-amber">
              <PinIcon width={18} height={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-thai block text-[10px] uppercase tracking-wide text-white/45">
                โรงภาพยนตร์
              </span>
              <span className="block text-sm font-semibold">
                Skooldiplex {branch.name}
                <span className="font-thai font-normal text-white/55"> · {branch.area}</span>
              </span>
            </span>
            <ChevronDown
              width={18}
              height={18}
              className={"text-white/50 transition-transform duration-200 " + (branchOpen ? "rotate-180" : "")}
            />
          </button>

          {branchOpen && (
            <div className="mt-2 overflow-hidden rounded-2xl bg-white/8">
              {branches.map((b) => {
                const active = b.id === branchId;
                return (
                  <button
                    key={b.id}
                    onClick={() => {
                      setBranchId(b.id);
                      setBranchOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/8"
                  >
                    <span>
                      <span className="block text-sm font-medium">Skooldiplex {b.name}</span>
                      <span className="font-thai block text-[11px] text-white/45">{b.nameTh} · {b.area}</span>
                    </span>
                    {active && <CheckIcon width={17} height={17} className="text-brand-amber" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Date selector */}
        <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5">
          {dateChips.map((d) => {
            const active = d.id === dateId;
            return (
              <button
                key={d.id}
                onClick={() => setDateId(d.id)}
                className={
                  "flex shrink-0 flex-col items-center rounded-xl px-3.5 py-2 transition-colors duration-150 " +
                  (active ? "bg-brand-amber text-brand-navy" : "bg-white/8 text-white/70")
                }
              >
                <span className="font-thai text-[11px] font-medium leading-none">{d.dow}</span>
                <span className="font-thai mt-1 text-base font-bold leading-none">{d.day}</span>
                <span className="font-thai mt-0.5 text-[9px] leading-none opacity-70">มิ.ย.</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Soon state */}
      {isSoon && focus && (
        <div className="px-5 pt-5">
          <article className="flex items-center gap-3.5 rounded-2xl border border-line bg-surface p-3 shadow-card">
            <Poster movie={focus} rounded="rounded-xl" className="h-[96px] w-[68px] shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold text-ink">{focus.title}</p>
              <p className="font-thai text-xs text-muted">{focus.titleTh}</p>
              <p className="font-thai mt-2 inline-flex items-center gap-1 rounded-lg bg-brand-amberSoft px-2.5 py-1 text-[11px] font-semibold text-brand-amberInk">
                <CalendarIcon width={13} height={13} /> เข้าฉาย {focus.releaseDate}
              </p>
            </div>
          </article>
          <p className="font-thai mt-4 text-center text-sm text-muted">
            ภาพยนตร์เรื่องนี้ยังไม่เปิดจำหน่ายบัตร
          </p>
          <Link
            href="/movies"
            className="font-thai mt-3 flex min-h-[48px] items-center justify-center rounded-xl bg-brand-navy text-sm font-semibold text-white active:scale-[0.98]"
          >
            ดูหนังที่เข้าฉายแล้ว
          </Link>
        </div>
      )}

      {/* Showtime list */}
      {!isSoon && (
        <div className="flex flex-col gap-4 px-5 pb-7 pt-5">
          {list.map((m) => (
            <ShowtimeCard key={m.id} movie={m} focused={!!focus} onPick={(s) => pick(m, s)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ShowtimeCard({
  movie: m,
  focused,
  onPick,
}: {
  movie: Movie;
  focused: boolean;
  onPick: (s: Showtime) => void;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="flex gap-3.5 p-3">
        <Poster movie={m} rounded="rounded-xl" className={focused ? "h-[150px] w-[104px] shrink-0" : "h-[120px] w-[84px] shrink-0"}>
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
          </div>
          <p className="font-thai mt-1.5 text-xs text-muted">{m.genreTh}</p>
          {focused && <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">{m.synopsis}</p>}
        </div>
      </div>

      <div className="border-t border-line px-3 py-3">
        <p className="font-thai mb-2 text-[11px] font-semibold text-faint">เลือกรอบที่ต้องการ</p>
        <div className="flex flex-wrap gap-2">
          {m.showtimes.map((s, i) => (
            <button
              key={i}
              onClick={() => onPick(s)}
              className="flex min-h-[48px] flex-col items-center justify-center rounded-xl border border-line2 px-3.5 py-1.5 transition-colors duration-150 hover:border-brand-amber hover:bg-brand-amberSoft/40 active:scale-[0.97]"
            >
              <span className="text-sm font-bold text-ink">{s.time}</span>
              <span className="text-[10px] font-medium text-muted">
                {s.format} · {s.hall}
              </span>
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function ShowtimesPage() {
  return (
    <Suspense fallback={<div className="min-h-[60dvh] bg-brand-navy" />}>
      <ShowtimesInner />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { upcomingTickets, pastTickets, type TicketWithMovie } from "@/lib/tickets";
import Poster, { FormatChip } from "@/components/Poster";
import QrCode from "@/components/QrCode";
import { TicketIcon, PinIcon, CalendarIcon, SeatIcon, ClockIcon } from "@/components/icons";

export default function TicketsPage() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const list = tab === "upcoming" ? upcomingTickets : pastTickets;

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/85 px-5 pb-0 pt-[max(env(safe-area-inset-top),1.25rem)] backdrop-blur-xl">
        <h1 className="font-thai text-2xl font-bold leading-none text-ink">ตั๋วของฉัน</h1>
        <p className="mt-1 text-[11px] uppercase tracking-wide text-faint">My tickets</p>

        {/* Tabs */}
        <div className="mt-4 flex gap-6">
          <Tab active={tab === "upcoming"} onClick={() => setTab("upcoming")} label="กำลังจะถึง" count={upcomingTickets.length} />
          <Tab active={tab === "past"} onClick={() => setTab("past")} label="ดูแล้ว" count={pastTickets.length} />
        </div>
      </header>

      <div className="px-5 pb-7 pt-5">
        {list.length === 0 ? (
          <EmptyState upcoming={tab === "upcoming"} />
        ) : tab === "upcoming" ? (
          <div className="flex flex-col gap-5">
            {list.map((t) => (
              <Eticket key={t.id} ticket={t} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {list.map((t) => (
              <PastRow key={t.id} ticket={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Tab({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button onClick={onClick} className="relative pb-3">
      <span className={"font-thai text-sm font-semibold " + (active ? "text-ink" : "text-faint")}>
        {label}
        <span className={"ml-1.5 " + (active ? "text-brand-amberInk" : "text-faint")}>{count}</span>
      </span>
      {active && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-brand-amber" />}
    </button>
  );
}

/** Premium e-ticket: art header + details + perforation + QR stub. */
function Eticket({ ticket: t }: { ticket: TicketWithMovie }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
      {/* Art header */}
      {t.movie && (
        <Poster movie={t.movie} rounded="rounded-none" className="h-[96px]">
          <div className="flex h-full flex-col justify-between p-3.5">
            <div className="flex justify-end">
              <FormatChip format={t.format} dark />
            </div>
            <div>
              <p className="text-base font-bold leading-tight text-white">{t.movie.title}</p>
              <p className="font-thai text-xs text-white/70">{t.movie.titleTh}</p>
            </div>
          </div>
        </Poster>
      )}

      {/* Details */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-3.5 p-4">
        <Field icon={<PinIcon width={14} height={14} />} label="สาขา" value={`${t.branch}`} sub={t.hall} />
        <Field icon={<CalendarIcon width={14} height={14} />} label="วันที่" value={t.dateFull} sub={t.date} />
        <Field icon={<ClockIcon width={14} height={14} />} label="รอบฉาย" value={t.time} sub={`${t.format}`} />
        <Field icon={<SeatIcon width={14} height={14} />} label="ที่นั่ง" value={t.seats.join(", ")} sub={`${t.seats.length} ที่นั่ง`} />
      </div>

      {/* Perforation */}
      <div className="relative">
        <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-paper" />
        <div className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-paper" />
        <div className="mx-4 border-t border-dashed border-line2" />
      </div>

      {/* QR stub */}
      <div className="flex flex-col items-center px-4 py-5">
        <div className="rounded-xl bg-white p-2 ring-1 ring-line">
          <QrCode value={t.code ?? t.id} size={128} />
        </div>
        <p className="mt-3 text-sm font-bold tracking-wide text-ink tabular-nums">{t.code}</p>
        <p className="font-thai mt-0.5 text-[11px] text-faint">แสดง QR นี้ที่ทางเข้าโรงภาพยนตร์</p>
      </div>
    </article>
  );
}

function Field({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div>
      <p className="font-thai flex items-center gap-1 text-[10px] uppercase tracking-wide text-faint">
        <span className="text-brand-amberInk">{icon}</span> {label}
      </p>
      <p className="mt-1 text-sm font-bold leading-tight text-ink">{value}</p>
      {sub && <p className="font-thai text-[11px] text-muted">{sub}</p>}
    </div>
  );
}

function PastRow({ ticket: t }: { ticket: TicketWithMovie }) {
  return (
    <article className="flex items-center gap-3.5 rounded-2xl border border-line bg-surface p-3">
      {t.movie && (
        <Poster movie={t.movie} rounded="rounded-xl" className="h-[72px] w-[52px] shrink-0 opacity-90" />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-ink">{t.movie?.title}</p>
        <p className="font-thai truncate text-xs text-muted">
          {t.branch} · {t.hall}
        </p>
        <p className="font-thai mt-1 text-[11px] text-faint">
          {t.dateFull} · {t.time} · ที่นั่ง {t.seats.join(", ")}
        </p>
      </div>
      <span className="font-thai shrink-0 self-start rounded-full bg-paper2 px-2.5 py-1 text-[10px] font-semibold text-muted">
        ดูแล้ว
      </span>
    </article>
  );
}

function EmptyState({ upcoming }: { upcoming: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-amberSoft text-brand-amberInk">
        <TicketIcon width={30} height={30} />
      </div>
      <h2 className="font-thai mt-5 text-lg font-bold text-ink">
        {upcoming ? "ยังไม่มีตั๋วที่กำลังจะถึง" : "ยังไม่มีประวัติการชม"}
      </h2>
      <p className="font-thai mt-2 max-w-[28ch] text-sm text-muted">
        {upcoming ? "จองรอบหนังแล้วตั๋วจะมาอยู่ที่นี่ พร้อม QR สำหรับเข้าโรง" : "หนังที่คุณดูแล้วจะแสดงที่นี่"}
      </p>
      {upcoming && (
        <Link
          href="/showtimes"
          className="font-thai mt-6 inline-flex min-h-[50px] items-center rounded-full bg-brand-amber px-7 text-sm font-bold text-brand-navy shadow-amber active:scale-[0.98]"
        >
          จองรอบฉาย
        </Link>
      )}
    </div>
  );
}

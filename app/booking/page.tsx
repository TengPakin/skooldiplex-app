"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getMovie } from "@/lib/movies";
import {
  ChevronLeft,
  PlusIcon,
  MinusIcon,
  CheckIcon,
  PinIcon,
  QrIcon,
  StarIcon,
  SeatIcon,
} from "@/components/icons";

/**
 * Seat-selection → confirm flow — Skooldiplex baseline.
 *
 * Entered from /showtimes once the user has chosen a movie + branch + date +
 * showtime; that context arrives via URL params (m, t, h, f, b, d). With no
 * context the page shows an empty state instead of jumping into a seat map.
 *
 * NOTE FOR THE WORKSHOP (see FEATURES.md):
 *  - Feature A "Streamlined booking": this flow is DELIBERATELY 5 steps. Collapse
 *    Seats + Snacks (or Coupon + Payment) to reduce abandonment.
 *  - Feature C "Resume booking": state lives only in useState, so a refresh loses
 *    everything. Persist `state` to localStorage and offer a "Resume" banner.
 */

const TICKET_PRICE = 220;
const ROWS = ["A", "B", "C", "D", "E"];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8];
const TAKEN = new Set(["A3", "A4", "C5", "D1", "D2", "E7"]);

const SNACKS = [
  { id: "popcorn", name: "Caramel Popcorn (L)", nameTh: "ป็อปคอร์นคาราเมล (ใหญ่)", price: 150, emoji: "🍿" },
  { id: "combo", name: "Combo: Popcorn + 2 Drinks", nameTh: "ชุดป็อปคอร์น + เครื่องดื่ม 2 แก้ว", price: 290, emoji: "🥤" },
  { id: "nachos", name: "Loaded Nachos", nameTh: "นาโชส์ราดชีส", price: 180, emoji: "🧀" },
];

const PAYMENTS = [
  { id: "card", label: "Credit / Debit card", sub: "บัตรเครดิต / เดบิต", tag: "VISA · MC" },
  { id: "promptpay", label: "PromptPay QR", sub: "พร้อมเพย์", tag: "QR" },
  { id: "wallet", label: "Skooldiplex Wallet", sub: "วอลเล็ต · ฿1,250", tag: "฿" },
];

const STEPS = [
  { en: "Seats", th: "ที่นั่ง" },
  { en: "Snacks", th: "ของว่าง" },
  { en: "Coupon", th: "โค้ด" },
  { en: "Payment", th: "ชำระเงิน" },
  { en: "Confirm", th: "ยืนยัน" },
];

function BookingInner() {
  const params = useSearchParams();
  const movie = getMovie(params.get("m") ?? "");
  const time = params.get("t") ?? "";
  const hall = params.get("h") ?? "";
  const branch = params.get("b") ?? "CentralWorld";
  const dateLabel = params.get("d") ?? "วันนี้";
  const ready = Boolean(movie && time);
  const where = `${branch} · ${hall} · ${dateLabel} ${time}`;

  const [step, setStep] = useState(0);
  const [seats, setSeats] = useState<string[]>([]);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [payment, setPayment] = useState("");
  const [done, setDone] = useState(false);

  const snackTotal = useMemo(
    () => SNACKS.reduce((sum, s) => sum + (qty[s.id] || 0) * s.price, 0),
    [qty],
  );
  const subtotal = seats.length * TICKET_PRICE + snackTotal;
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  const canNext =
    (step === 0 && seats.length > 0) ||
    step === 1 ||
    step === 2 ||
    (step === 3 && payment !== "") ||
    step === 4;

  function toggleSeat(id: string) {
    if (TAKEN.has(id)) return;
    setSeats((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }
  function setQ(id: string, delta: number) {
    setQty((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));
  }
  function applyCoupon() {
    if (coupon.trim().toUpperCase() === "SKOOL10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponApplied(false);
      setCouponError("โค้ดไม่ถูกต้อง ลองใช้ SKOOL10 รับส่วนลด 10%");
    }
  }

  // No showtime chosen → don't drop the user into a seat map.
  if (!ready) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-8 py-16 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-amberSoft text-brand-amberInk">
          <SeatIcon width={32} height={32} />
        </div>
        <h1 className="font-thai mt-5 text-xl font-bold text-ink">ยังไม่ได้เลือกรอบฉาย</h1>
        <p className="font-thai mt-2 max-w-[30ch] text-sm leading-relaxed text-muted">
          เลือกหนัง สาขา และรอบเวลาก่อน แล้วเราจะพาไปเลือกที่นั่ง
        </p>
        <Link
          href="/showtimes"
          className="font-thai mt-6 inline-flex min-h-[50px] items-center rounded-full bg-brand-amber px-7 text-sm font-bold text-brand-navy shadow-amber active:scale-[0.98]"
        >
          เลือกรอบฉาย
        </Link>
        <Link href="/movies" className="font-thai mt-3 text-sm font-semibold text-brand-amberInk">
          หรือดูหนังทั้งหมด
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-6 py-10 text-center">
        <div className="relative grid h-20 w-20 place-items-center rounded-full bg-brand-amberSoft text-brand-amberInk">
          <CheckIcon width={40} height={40} />
          <span className="absolute inset-0 animate-ping rounded-full bg-brand-amber/20" />
        </div>
        <h1 className="font-thai mt-5 text-2xl font-bold text-ink">จองสำเร็จ!</h1>
        <p className="font-thai mt-1 text-sm text-muted">
          {seats.length} ที่นั่ง · {seats.join(", ")}
        </p>

        <div className="mt-6 w-full max-w-[300px] rounded-3xl bg-brand-navy p-6 text-white shadow-poster">
          <p className="text-xs uppercase tracking-brand text-brand-amber">Skooldiplex · {branch}</p>
          <p className="mt-2 text-lg font-bold">{movie!.title}</p>
          <p className="font-thai text-xs text-white/60">{hall} · {dateLabel} {time}</p>
          <div className="my-5 grid h-32 w-32 mx-auto place-items-center rounded-2xl bg-white text-brand-navy">
            <QrIcon width={84} height={84} />
          </div>
          <p className="text-3xl font-bold tabular-nums">฿{total.toLocaleString()}</p>
          <p className="font-thai mt-1 text-[11px] text-white/55">บันทึกตั๋วไว้ในวอลเล็ตแล้ว</p>
        </div>

        <div className="mt-7 flex w-full max-w-[300px] flex-col gap-2.5">
          <Link
            href="/tickets"
            className="font-thai inline-flex min-h-[50px] items-center justify-center rounded-full bg-brand-amber px-7 text-sm font-bold text-brand-navy shadow-amber active:scale-[0.98]"
          >
            ดูตั๋วของฉัน
          </Link>
          <Link
            href="/showtimes"
            className="font-thai inline-flex min-h-[48px] items-center justify-center rounded-full border border-line2 bg-surface px-7 text-sm font-semibold text-ink active:scale-[0.98]"
          >
            จองรอบอื่น
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Header — film context + step indicator */}
      <header className="bg-brand-navy px-5 pb-5 pt-[max(env(safe-area-inset-top),1.25rem)] text-white">
        <div className="flex items-center gap-3">
          <Link
            href={`/showtimes?m=${movie!.id}`}
            aria-label="Back"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white active:scale-95"
          >
            <ChevronLeft width={20} height={20} />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold leading-tight">{movie!.title}</p>
            <p className="font-thai flex items-center gap-1.5 text-[11px] text-white/60">
              <PinIcon width={12} height={12} className="text-brand-amber" />
              <span className="truncate">{where}</span>
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[11px] font-semibold text-brand-amber">
            <StarIcon width={11} height={11} /> {movie!.rating}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <div key={s.en} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={
                  "h-1 w-full rounded-full transition-colors duration-300 " +
                  (i <= step ? "bg-brand-amber" : "bg-white/15")
                }
              />
              <span
                className={
                  "font-thai text-[10px] leading-none transition-colors " +
                  (i === step ? "font-semibold text-white" : "text-white/40")
                }
              >
                {s.th}
              </span>
            </div>
          ))}
        </div>
      </header>

      {/* Step content */}
      <div key={step} className="flex-1 animate-fade-up px-5 py-5">
        {step === 0 && (
          <div>
            {/* Screen */}
            <div className="mb-7">
              <div className="mx-auto h-1.5 w-3/4 rounded-[100%] bg-gradient-to-b from-brand-amber to-brand-amber/0 shadow-amber" />
              <p className="font-thai mt-2 text-center text-[10px] uppercase tracking-[0.3em] text-faint">
                จอภาพยนตร์
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              {ROWS.map((row) => (
                <div key={row} className="flex items-center gap-2.5">
                  <span className="w-3 text-center text-[11px] font-medium text-faint">{row}</span>
                  <div className="flex gap-1.5">
                    {COLS.map((col) => {
                      const id = `${row}${col}`;
                      const taken = TAKEN.has(id);
                      const selected = seats.includes(id);
                      return (
                        <button
                          key={id}
                          onClick={() => toggleSeat(id)}
                          disabled={taken}
                          aria-label={`Seat ${id}${taken ? " (taken)" : selected ? " (selected)" : ""}`}
                          aria-pressed={selected}
                          className={
                            "grid h-7 w-7 place-items-center rounded-md text-[10px] font-semibold transition-all duration-150 " +
                            (col === 4 ? "mr-3 " : "") +
                            (taken
                              ? "cursor-not-allowed bg-line2 text-faint/60"
                              : selected
                                ? "scale-105 bg-brand-amber text-brand-navy shadow-amber"
                                : "bg-surface text-muted ring-1 ring-line2 hover:ring-brand-amber active:scale-95")
                          }
                        >
                          {col}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center gap-5 text-[11px] text-muted">
              <Legend className="bg-surface ring-1 ring-line2" label="ว่าง" />
              <Legend className="bg-brand-amber" label="ที่เลือก" />
              <Legend className="bg-line2" label="ถูกจองแล้ว" />
            </div>

            {seats.length > 0 && (
              <div className="mt-6 rounded-2xl border border-line bg-surface p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="font-thai text-sm text-muted">
                    เลือกแล้ว {seats.length} ที่นั่ง
                  </span>
                  <span className="text-sm font-bold text-ink">
                    ฿{(seats.length * TICKET_PRICE).toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {seats.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-brand-amberSoft px-2 py-0.5 text-xs font-semibold text-brand-amberInk"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-3">
            <p className="font-thai text-sm text-muted">เพิ่มของว่าง (ไม่บังคับ)</p>
            {SNACKS.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5 shadow-card"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-paper2 text-2xl">
                  {s.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{s.name}</p>
                  <p className="font-thai truncate text-xs text-muted">{s.nameTh}</p>
                  <p className="mt-0.5 text-sm font-bold text-ink">฿{s.price}</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <IconBtn onClick={() => setQ(s.id, -1)} disabled={!qty[s.id]}>
                    <MinusIcon width={16} height={16} />
                  </IconBtn>
                  <span className="w-4 text-center text-sm font-bold tabular-nums">
                    {qty[s.id] || 0}
                  </span>
                  <IconBtn onClick={() => setQ(s.id, 1)} amber>
                    <PlusIcon width={16} height={16} />
                  </IconBtn>
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div>
            <label htmlFor="coupon" className="font-thai text-sm font-semibold text-ink">
              โค้ดส่วนลด
            </label>
            <p className="font-thai mt-0.5 text-xs text-muted">มีโค้ดโปรโมชันไหม? กรอกที่นี่</p>
            <div className="mt-3 flex gap-2">
              <input
                id="coupon"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="เช่น SKOOL10"
                className="font-thai min-h-[50px] flex-1 rounded-xl border border-line2 bg-surface px-4 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-brand-amber"
              />
              <button
                onClick={applyCoupon}
                className="font-thai min-h-[50px] rounded-xl bg-brand-navy px-6 text-sm font-semibold text-white active:scale-[0.98]"
              >
                ใช้โค้ด
              </button>
            </div>
            {couponError && <p className="font-thai mt-2 text-xs text-red-600">{couponError}</p>}
            {couponApplied && (
              <p className="font-thai mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                <CheckIcon width={14} height={14} /> ใช้ส่วนลด 10% เรียบร้อยแล้ว
              </p>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-3">
            <p className="font-thai text-sm text-muted">เลือกวิธีชำระเงิน</p>
            {PAYMENTS.map((p) => {
              const active = payment === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPayment(p.id)}
                  className={
                    "flex min-h-[64px] items-center gap-3 rounded-2xl border px-4 text-left transition-colors duration-150 " +
                    (active
                      ? "border-brand-amber bg-brand-amberSoft/50"
                      : "border-line bg-surface shadow-card")
                  }
                >
                  <span className="grid h-10 w-12 shrink-0 place-items-center rounded-lg bg-paper2 text-[11px] font-bold text-muted">
                    {p.tag}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink">{p.label}</span>
                    <span className="font-thai block text-xs text-muted">{p.sub}</span>
                  </span>
                  <span
                    className={
                      "grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors " +
                      (active
                        ? "border-brand-amber bg-brand-amber text-brand-navy"
                        : "border-line2")
                    }
                  >
                    {active && <CheckIcon width={13} height={13} />}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {step === 4 && (
          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
            <div className="bg-brand-navy px-4 py-3 text-white">
              <p className="text-sm font-bold">{movie!.title}</p>
              <p className="font-thai text-[11px] text-white/60">{where}</p>
            </div>
            <div className="p-4">
              <Row label={`ที่นั่ง (${seats.join(", ") || "—"})`} value={`฿${(seats.length * TICKET_PRICE).toLocaleString()}`} />
              <Row label="ของว่าง" value={`฿${snackTotal.toLocaleString()}`} />
              {discount > 0 && (
                <Row label="ส่วนลด (SKOOL10)" value={`– ฿${discount.toLocaleString()}`} accent />
              )}
              <div className="my-3 border-t border-dashed border-line2" />
              <Row label="ยอดชำระทั้งหมด" value={`฿${total.toLocaleString()}`} bold />
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <footer className="sticky bottom-0 border-t border-line bg-surface/95 px-5 py-3 backdrop-blur-xl">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-thai text-muted">
            {seats.length} ที่นั่ง{snackTotal > 0 ? " · ของว่าง" : ""}
          </span>
          <span className="text-lg font-bold tabular-nums text-ink">฿{total.toLocaleString()}</span>
        </div>
        <div className="flex gap-2">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="grid min-h-[52px] w-14 place-items-center rounded-xl border border-line2 text-muted active:scale-[0.98]"
              aria-label="Back"
            >
              <ChevronLeft width={20} height={20} />
            </button>
          )}
          <button
            disabled={!canNext}
            onClick={() => (step < 4 ? setStep((s) => s + 1) : setDone(true))}
            className="font-thai min-h-[52px] flex-1 rounded-xl bg-brand-amber text-[15px] font-bold text-brand-navy shadow-amber transition-transform duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-line2 disabled:text-faint disabled:shadow-none"
          >
            {step < 4 ? "ถัดไป" : "ยืนยันการจอง"}
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-full bg-paper" />}>
      <BookingInner />
    </Suspense>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="font-thai flex items-center gap-1.5">
      <span className={"h-3.5 w-3.5 rounded " + className} />
      {label}
    </span>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  amber,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  amber?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={
        "grid h-9 w-9 place-items-center rounded-full transition-colors duration-150 active:scale-90 disabled:opacity-40 " +
        (amber
          ? "bg-brand-amber text-brand-navy"
          : "border border-line2 bg-surface text-muted")
      }
    >
      {children}
    </button>
  );
}

function Row({
  label,
  value,
  bold,
  accent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className={"font-thai text-sm " + (bold ? "font-bold text-ink" : "text-muted")}>
        {label}
      </span>
      <span
        className={
          "tabular-nums " +
          (bold
            ? "text-lg font-bold text-ink"
            : accent
              ? "text-sm font-semibold text-emerald-700"
              : "text-sm text-ink")
        }
      >
        {value}
      </span>
    </div>
  );
}

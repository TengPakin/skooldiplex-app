"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, PlusIcon, MinusIcon, CheckIcon, PinIcon } from "@/components/icons";

/**
 * Multi-step booking flow — Skooldiplex baseline.
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
  { id: "popcorn", name: "Caramel Popcorn (L)", price: 150 },
  { id: "combo", name: "Combo: Popcorn + 2 Drinks", price: 290 },
  { id: "nachos", name: "Loaded Nachos", price: 180 },
];

const PAYMENTS = [
  { id: "card", label: "Credit / Debit card" },
  { id: "promptpay", label: "PromptPay QR" },
  { id: "wallet", label: "Skooldiplex Wallet" },
];

const STEPS = ["Seats", "Snacks", "Coupon", "Payment", "Confirm"];

export default function BookingPage() {
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
    [qty]
  );
  const subtotal = seats.length * TICKET_PRICE + snackTotal;
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  const canNext =
    (step === 0 && seats.length > 0) ||
    (step === 1) ||
    (step === 2) ||
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
      setCouponError("Invalid code. Try SKOOL10 for 10% off.");
    }
  }

  if (done) {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center px-6 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckIcon width={32} height={32} />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-slate-900">Booking confirmed</h1>
        <p className="mt-1 text-sm text-slate-500">
          {seats.length} seat{seats.length > 1 ? "s" : ""} · {seats.join(", ")}
        </p>
        <p className="mt-4 text-3xl font-semibold text-slate-900">
          THB {total.toLocaleString()}
        </p>
        <p className="mt-1 text-xs text-slate-400">A QR ticket has been sent to your wallet.</p>
        <button
          onClick={() => {
            setStep(0);
            setSeats([]);
            setQty({});
            setCoupon("");
            setCouponApplied(false);
            setPayment("");
            setDone(false);
          }}
          className="mt-8 min-h-[48px] rounded-full bg-brand-navy px-6 text-sm font-semibold text-white active:scale-[0.98]"
        >
          Book another
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Header + step indicator */}
      <header className="px-5 pt-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Book tickets</h1>
        <p className="mt-1 text-sm text-slate-500">Echoes of Tomorrow · IMAX 1 · 18:40</p>

        <div className="mt-4 flex items-center gap-1.5">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={
                  "h-1 w-full rounded-full transition-colors duration-200 " +
                  (i <= step ? "bg-brand-amber" : "bg-slate-200")
                }
              />
              <span
                className={
                  "text-[10px] " + (i === step ? "font-semibold text-brand-navy" : "text-slate-400")
                }
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </header>

      {/* Step content */}
      <div className="flex-1 px-5 py-5">
        {step === 0 && (
          <div>
            <div className="mb-4 rounded-xl bg-slate-900 py-2 text-center text-[11px] font-medium uppercase tracking-widest text-slate-300">
              Screen
            </div>
            <div className="flex flex-col items-center gap-2">
              {ROWS.map((row) => (
                <div key={row} className="flex items-center gap-2">
                  <span className="w-3 text-xs text-slate-400">{row}</span>
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
                          aria-label={`Seat ${id}${taken ? " (taken)" : ""}`}
                          className={
                            "h-7 w-7 rounded-md text-[10px] font-medium transition-colors duration-150 " +
                            (taken
                              ? "cursor-not-allowed bg-slate-200 text-slate-300"
                              : selected
                              ? "bg-brand-amber text-brand-navy"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200 active:scale-95")
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
            <div className="mt-5 flex justify-center gap-4 text-xs text-slate-500">
              <Legend className="bg-slate-100" label="Available" />
              <Legend className="bg-brand-amber" label="Selected" />
              <Legend className="bg-slate-200" label="Taken" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-500">Add snacks (optional)</p>
            {SNACKS.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{s.name}</p>
                  <p className="text-xs text-slate-500">THB {s.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <IconBtn onClick={() => setQ(s.id, -1)} disabled={!qty[s.id]}>
                    <MinusIcon width={16} height={16} />
                  </IconBtn>
                  <span className="w-4 text-center text-sm font-semibold">{qty[s.id] || 0}</span>
                  <IconBtn onClick={() => setQ(s.id, 1)}>
                    <PlusIcon width={16} height={16} />
                  </IconBtn>
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div>
            <label htmlFor="coupon" className="text-sm font-medium text-slate-700">
              Promo code
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="coupon"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="e.g. SKOOL10"
                className="min-h-[48px] flex-1 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-brand-amber focus:ring-2 focus:ring-brand-amber/30"
              />
              <button
                onClick={applyCoupon}
                className="min-h-[48px] rounded-xl bg-brand-navy px-5 text-sm font-semibold text-white active:scale-[0.98]"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="mt-2 text-xs text-red-600">{couponError}</p>}
            {couponApplied && (
              <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                <CheckIcon width={14} height={14} /> 10% discount applied
              </p>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-500">Choose a payment method</p>
            {PAYMENTS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPayment(p.id)}
                className={
                  "flex min-h-[56px] items-center justify-between rounded-2xl border px-4 text-left transition-colors duration-150 " +
                  (payment === p.id
                    ? "border-brand-amber bg-brand-amber/10"
                    : "border-slate-200 bg-white")
                }
              >
                <span className="text-sm font-medium text-slate-900">{p.label}</span>
                <span
                  className={
                    "grid h-5 w-5 place-items-center rounded-full border " +
                    (payment === p.id ? "border-brand-amber bg-brand-amber text-brand-navy" : "border-slate-300")
                  }
                >
                  {payment === p.id && <CheckIcon width={13} height={13} />}
                </span>
              </button>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <Row label={`Seats (${seats.join(", ") || "—"})`} value={`THB ${(seats.length * TICKET_PRICE).toLocaleString()}`} />
            <Row label="Snacks" value={`THB ${snackTotal.toLocaleString()}`} />
            {discount > 0 && <Row label="Promo (SKOOL10)" value={`– THB ${discount.toLocaleString()}`} accent />}
            <div className="my-3 border-t border-slate-100" />
            <Row label="Total" value={`THB ${total.toLocaleString()}`} bold />
            <p className="mt-3 inline-flex items-center gap-1 text-xs text-slate-500">
              <PinIcon width={13} height={13} /> Skooldiplex CentralWorld · Hall IMAX 1
            </p>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <footer className="sticky bottom-[72px] border-t border-slate-200 bg-white px-5 py-3">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-500">{seats.length} seat{seats.length === 1 ? "" : "s"}</span>
          <span className="font-semibold text-slate-900">THB {total.toLocaleString()}</span>
        </div>
        <div className="flex gap-2">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="grid min-h-[48px] w-12 place-items-center rounded-xl border border-slate-300 text-slate-600 active:scale-[0.98]"
              aria-label="Back"
            >
              <ChevronLeft width={20} height={20} />
            </button>
          )}
          <button
            disabled={!canNext}
            onClick={() => (step < 4 ? setStep((s) => s + 1) : setDone(true))}
            className="min-h-[48px] flex-1 rounded-xl bg-brand-amber text-sm font-semibold text-brand-navy transition-transform duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            {step < 4 ? "Continue" : "Confirm booking"}
          </button>
        </div>
      </footer>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={"h-3 w-3 rounded " + className} />
      {label}
    </span>
  );
}

function IconBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-700 transition-colors duration-150 active:scale-95 disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function Row({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className={"text-sm " + (bold ? "font-semibold text-slate-900" : "text-slate-500")}>{label}</span>
      <span className={"text-sm " + (bold ? "text-lg font-semibold text-slate-900" : accent ? "font-medium text-emerald-700" : "text-slate-700")}>
        {value}
      </span>
    </div>
  );
}

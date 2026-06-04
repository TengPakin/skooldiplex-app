import loyalty from "@/data/loyalty.json";
import { CrownIcon, CheckIcon, QrIcon, StarIcon } from "@/components/icons";

/**
 * Loyalty — Skooldiplex baseline (DELIBERATELY MINIMAL).
 *
 * NOTE FOR THE WORKSHOP (see FEATURES.md):
 *  - Feature B "SkooldiFan loyalty dashboard" (non-tech default):
 *    data/loyalty.json already contains `rewards[]` and `history[]` that this
 *    page does NOT render yet. Build them into a real dashboard: redeemable
 *    rewards grid, points history timeline, and tier benefits.
 *
 * This page was restyled for production-grade craft; the rewards grid + history
 * timeline are intentionally still absent so Feature B remains a real exercise.
 */

export default function LoyaltyPage() {
  const { member, tiers } = loyalty;
  const progress = Math.min(
    100,
    Math.round(((member.points - member.tierFloor) / (member.tierCeiling - member.tierFloor)) * 100),
  );
  const currentIdx = tiers.findIndex((t) => t.name === member.tier);

  return (
    <div>
      {/* Header */}
      <header className="bg-brand-navy px-5 pb-16 pt-[max(env(safe-area-inset-top),1.25rem)] text-white">
        <p className="text-[11px] uppercase tracking-brand text-brand-amber">SkooldiFan</p>
        <h1 className="font-thai mt-1 text-2xl font-bold leading-none">รางวัลของฉัน</h1>
      </header>

      {/* Membership card — overlaps the navy edge */}
      <div className="-mt-10 px-5">
        <div
          className="poster-grain relative isolate overflow-hidden rounded-3xl p-5 text-white shadow-poster"
          style={{ backgroundImage: "linear-gradient(135deg, #243357 0%, #0B101E 70%)" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-brand-amber/35 blur-3xl"
          />
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-brand text-brand-amber">
                  {member.tier} Member
                </p>
                <p className="mt-1.5 text-base font-semibold">{member.name}</p>
                <p className="font-thai text-[11px] text-white/50">
                  ID {member.memberId} · สมาชิกตั้งแต่ {member.memberSince}
                </p>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-amber/15 text-brand-amber ring-1 ring-brand-amber/30">
                <CrownIcon width={26} height={26} />
              </span>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <p className="text-4xl font-bold tabular-nums leading-none">
                {member.points.toLocaleString()}
                <span className="ml-1.5 text-base font-normal text-white/55">pts</span>
              </p>
            </div>

            {/* Progress to next tier */}
            <div className="mt-4">
              <div className="font-thai mb-1.5 flex justify-between text-[11px] text-white/65">
                <span>{member.tier}</span>
                <span>
                  อีก {member.pointsToNextTier} แต้มถึง {member.nextTier}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/12">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-amber to-brand-amberWarm"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Scan to earn */}
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/8 p-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-brand-navy">
                <QrIcon width={30} height={30} />
              </span>
              <div className="font-thai min-w-0 flex-1 text-xs">
                <p className="font-semibold text-white">แตะเพื่อสะสมแต้ม</p>
                <p className="text-white/55">สแกนบัตรนี้ที่เคาน์เตอร์ทุกครั้งที่ชมภาพยนตร์</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tier benefits */}
      <section className="mt-7 px-5 pb-7">
        <h2 className="font-thai text-lg font-bold leading-none text-ink">สิทธิ์ตามระดับสมาชิก</h2>
        <p className="mt-1 text-[11px] uppercase tracking-wide text-faint">Tier benefits</p>

        <div className="mt-3 flex flex-col gap-2.5">
          {tiers.map((t, i) => {
            const isCurrent = i === currentIdx;
            const unlocked = i <= currentIdx;
            return (
              <div
                key={t.name}
                className={
                  "flex items-center gap-3.5 rounded-2xl border p-4 transition-colors " +
                  (isCurrent
                    ? "border-brand-amber bg-brand-amberSoft/50 shadow-card"
                    : "border-line bg-surface")
                }
              >
                <span
                  className={
                    "grid h-10 w-10 shrink-0 place-items-center rounded-full " +
                    (unlocked
                      ? "bg-brand-amber text-brand-navy"
                      : "bg-paper2 text-faint ring-1 ring-line2")
                  }
                >
                  {unlocked ? <CheckIcon width={18} height={18} /> : <StarIcon width={16} height={16} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={"text-sm font-bold " + (isCurrent ? "text-brand-amberInk" : "text-ink")}>
                      {t.name}
                    </p>
                    {isCurrent && (
                      <span className="font-thai rounded-full bg-brand-amber px-2 py-0.5 text-[10px] font-bold text-brand-navy">
                        ระดับปัจจุบัน
                      </span>
                    )}
                  </div>
                  <p className="font-thai mt-0.5 text-xs text-muted">{t.perk}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold tabular-nums text-faint">
                  {t.min.toLocaleString()}+
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* EXTENSION POINT (Feature B): rewards grid + points history go here.
          The data already exists in data/loyalty.json (rewards[], history[]). */}
    </div>
  );
}

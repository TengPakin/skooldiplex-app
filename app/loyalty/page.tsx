import loyalty from "@/data/loyalty.json";
import { CrownIcon, StarIcon } from "@/components/icons";

/**
 * Loyalty — Feature B (SkooldiFan dashboard) HALF-BUILT.
 *
 * DONE so far:   member card + tier progress + tier list + a Rewards grid (below).
 * LAST MILE for you to finish:
 *   1. Wire a "Redeem" button on each reward (disable if points < cost; deduct on redeem).
 *   2. Add a "Points history" timeline from loyalty.history[] under the rewards.
 *   3. Empty state when no rewards are affordable.
 * (Switch back to a clean start with: git switch main)
 */

export default function LoyaltyPage() {
  const { member, tiers, rewards } = loyalty;
  const progress = Math.min(
    100,
    Math.round(
      ((member.points - member.tierFloor) / (member.tierCeiling - member.tierFloor)) * 100
    )
  );

  return (
    <div className="px-5 pt-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Rewards</h1>
      <p className="mt-1 text-sm text-slate-500">SkooldiFan loyalty</p>

      {/* Member card */}
      <section className="mt-5 overflow-hidden rounded-[1.5rem] bg-brand-navy p-5 text-white shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-amber">{member.tier} member</p>
            <p className="mt-1 text-lg font-semibold">{member.name}</p>
            <p className="text-xs text-slate-400">ID {member.memberId} · since {member.memberSince}</p>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-amber/15 text-brand-amber">
            <CrownIcon width={24} height={24} />
          </div>
        </div>
        <div className="mt-6">
          <p className="text-4xl font-semibold tabular-nums tracking-tight">
            {member.points.toLocaleString()}
            <span className="ml-1 text-base font-normal text-slate-400">pts</span>
          </p>
        </div>
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs text-slate-300">
            <span>{member.tier}</span>
            <span>{member.pointsToNextTier} pts to {member.nextTier}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-brand-amber transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      {/* Rewards grid — HALF-BUILT: renders rewards, but no redeem action yet */}
      <section className="mt-6">
        <h2 className="text-sm font-semibold text-slate-900">Redeem your points</h2>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {rewards.map((r) => (
            <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-amber/15 text-brand-amberDark">
                <StarIcon width={16} height={16} />
              </div>
              <p className="mt-2 text-sm font-semibold leading-snug text-slate-900">{r.title}</p>
              <p className="mt-1 text-xs tabular-nums text-slate-500">
                {r.cost === 0 ? "Free" : `${r.cost.toLocaleString()} pts`}
              </p>
              {/* TODO (Feature B, last mile): add a Redeem button here.
                  Disable when member.points < r.cost; on click, deduct points. */}
            </div>
          ))}
        </div>
      </section>

      {/* TODO (Feature B, last mile): Points history timeline from loyalty.history[] goes here. */}

      {/* Tier benefits */}
      <section className="mt-6">
        <h2 className="text-sm font-semibold text-slate-900">Your tiers</h2>
        <div className="mt-2 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
          {tiers.map((t) => (
            <div key={t.name} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className={"text-sm font-medium " + (t.name === member.tier ? "text-brand-amberDark" : "text-slate-900")}>
                  {t.name}
                </p>
                <p className="text-xs text-slate-500">{t.perk}</p>
              </div>
              <span className="text-xs tabular-nums text-slate-400">{t.min.toLocaleString()}+</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

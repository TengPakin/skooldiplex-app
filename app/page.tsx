import Link from "next/link";
import { nowShowing, comingSoon, runtime } from "@/lib/movies";
import loyalty from "@/data/loyalty.json";
import Poster, { FormatChip } from "@/components/Poster";
import {
  StarIcon,
  TicketIcon,
  CrownIcon,
  ChevronRight,
  ChevronDown,
  PinIcon,
  BellIcon,
  SearchIcon,
  PlayIcon,
  QrIcon,
  GiftIcon,
} from "@/components/icons";

export default function HomePage() {
  const featured = nowShowing[0];
  const rail = nowShowing;
  const { member } = loyalty;

  return (
    <div className="pb-7">
      {/* ── Top app bar + featured hero (navy) ───────────────────────── */}
      <section className="rounded-b-[2rem] bg-brand-navy px-5 pb-12 pt-[max(env(safe-area-inset-top),1.25rem)] text-white">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 text-left">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/8 text-brand-amber">
              <PinIcon width={17} height={17} />
            </span>
            <span>
              <span className="block font-thai text-[10px] leading-none text-white/55">
                สาขาของคุณ
              </span>
              <span className="mt-0.5 flex items-center gap-0.5 text-sm font-semibold leading-none">
                CentralWorld <ChevronDown width={14} height={14} className="text-white/55" />
              </span>
            </span>
          </button>
          <div className="flex items-center gap-1.5">
            <IconButton label="Search">
              <SearchIcon width={19} height={19} />
            </IconButton>
            <IconButton label="Notifications">
              <span className="relative">
                <BellIcon width={19} height={19} />
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand-amber ring-2 ring-brand-navy" />
              </span>
            </IconButton>
          </div>
        </div>

        {/* Featured film */}
        <p className="mt-7 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-brand text-brand-amber">
          Skooldiplex
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span className="font-thai font-medium normal-case tracking-normal text-white/60">
            แนะนำคืนนี้
          </span>
        </p>

        <Link href={`/showtimes?m=${featured.id}`} className="group mt-3 block">
          <Poster movie={featured} rounded="rounded-3xl" className="h-[260px] shadow-poster">
            <div className="flex h-full flex-col justify-end p-5">
              <div className="mb-auto flex items-center gap-1.5">
                {featured.formats.map((f) => (
                  <FormatChip key={f} format={f} dark />
                ))}
              </div>
              <h1 className="text-[28px] font-bold leading-[1.05] tracking-tight">
                {featured.title}
              </h1>
              <p className="font-thai mt-1 text-sm font-medium text-white/75">
                {featured.titleTh}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/80">
                <span className="inline-flex items-center gap-1 font-semibold text-brand-amber">
                  <StarIcon width={13} height={13} /> {featured.rating}
                </span>
                <span>{runtime(featured.durationMin)}</span>
                <span className="rounded border border-white/25 px-1.5 py-px text-[10px] font-medium">
                  {featured.ageRating}
                </span>
                <span className="font-thai text-white/65">{featured.genreTh}</span>
              </div>
            </div>
          </Poster>
        </Link>

        <div className="mt-4 flex items-center gap-2.5">
          <Link
            href={`/showtimes?m=${featured.id}`}
            className="flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-full bg-brand-amber text-[15px] font-semibold text-brand-navy shadow-amber transition-transform duration-150 active:scale-[0.98]"
          >
            <TicketIcon width={19} height={19} />
            <span className="font-thai">จองเลย</span>
          </Link>
          <Link
            href="/movies"
            aria-label="Watch trailer"
            className="grid min-h-[50px] w-[50px] place-items-center rounded-full bg-white/10 text-white transition-colors duration-150 hover:bg-white/15 active:scale-[0.98]"
          >
            <PlayIcon width={18} height={18} />
          </Link>
        </div>
      </section>

      {/* ── Quick actions (overlap the navy edge) ───────────────────── */}
      <section className="px-5">
        <div className="-mt-7 grid grid-cols-3 gap-2 rounded-2xl border border-line bg-surface p-2 shadow-card">
          <QuickAction href="/tickets" icon={<QrIcon width={20} height={20} />} label="ตั๋วของฉัน" />
          <QuickAction
            href="/showtimes"
            icon={<TicketIcon width={20} height={20} />}
            label="จองด่วน"
            highlight
          />
          <QuickAction href="/loyalty" icon={<GiftIcon width={20} height={20} />} label="สิทธิพิเศษ" />
        </div>
      </section>

      {/* ── Now showing rail ─────────────────────────────────────────── */}
      <section className="pt-7">
        <SectionHead titleTh="โปรแกรมวันนี้" titleEn="Now showing" href="/movies" />
        <div className="no-scrollbar flex gap-3.5 overflow-x-auto px-5 pb-1 pt-3">
          {rail.map((m) => (
            <Link key={m.id} href={`/showtimes?m=${m.id}`} className="w-[150px] shrink-0">
              <Poster movie={m} className="h-[214px] shadow-card">
                <div className="flex justify-end p-2.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/35 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                    <StarIcon width={11} height={11} className="text-brand-amber" />
                    {m.rating}
                  </span>
                </div>
                <div className="mt-auto flex items-center gap-1 p-2.5">
                  {m.formats.slice(0, 2).map((f) => (
                    <FormatChip key={f} format={f} dark />
                  ))}
                </div>
              </Poster>
              <p className="mt-2 line-clamp-1 text-sm font-semibold text-ink">{m.title}</p>
              <p className="font-thai line-clamp-1 text-xs text-muted">{m.genreTh}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Coming soon rail ─────────────────────────────────────────── */}
      <section className="pt-6">
        <SectionHead titleTh="เร็วๆ นี้" titleEn="Coming soon" href="/movies" />
        <div className="no-scrollbar flex gap-3.5 overflow-x-auto px-5 pb-1 pt-3">
          {comingSoon.map((m) => (
            <Link key={m.id} href={`/showtimes?m=${m.id}`} className="w-[232px] shrink-0">
              <Poster movie={m} className="h-[132px] shadow-card">
                <div className="flex h-full flex-col justify-between p-3.5">
                  <span className="font-thai inline-flex w-fit items-center gap-1 rounded-full bg-brand-amber px-2.5 py-1 text-[11px] font-semibold text-brand-navy">
                    เข้าฉาย {m.releaseDate}
                  </span>
                  <div>
                    <p className="text-base font-bold leading-tight text-white">{m.title}</p>
                    <p className="font-thai text-xs text-white/70">{m.titleTh}</p>
                  </div>
                </div>
              </Poster>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SkooldiFan loyalty teaser ────────────────────────────────── */}
      <section className="px-5 pt-6">
        <Link
          href="/loyalty"
          className="flex items-center gap-4 overflow-hidden rounded-2xl bg-brand-navy p-4 text-white shadow-card transition-transform duration-150 active:scale-[0.99]"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-amber/15 text-brand-amber">
            <CrownIcon width={24} height={24} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-thai text-[11px] text-brand-amber">สมาชิก SkooldiFan · {member.tier}</p>
            <p className="mt-0.5 text-base font-semibold">
              {member.points.toLocaleString()}{" "}
              <span className="text-sm font-normal text-white/60">pts</span>
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/12">
              <div
                className="h-full rounded-full bg-brand-amber"
                style={{
                  width: `${Math.round(
                    ((member.points - member.tierFloor) /
                      (member.tierCeiling - member.tierFloor)) *
                      100,
                  )}%`,
                }}
              />
            </div>
            <p className="font-thai mt-1.5 text-[11px] text-white/55">
              อีก {member.pointsToNextTier} แต้มถึงระดับ {member.nextTier}
            </p>
          </div>
          <ChevronRight width={18} height={18} className="text-white/40" />
        </Link>
      </section>
    </div>
  );
}

/* ── small building blocks ──────────────────────────────────────────── */

function IconButton({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full bg-white/8 text-white/90 transition-colors duration-150 hover:bg-white/14 active:scale-95"
    >
      {children}
    </button>
  );
}

function QuickAction({
  href,
  icon,
  label,
  highlight = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1.5 rounded-xl px-1 py-2.5 transition-colors duration-150 hover:bg-paper2 active:scale-[0.98]"
    >
      <span
        className={
          "grid h-11 w-11 place-items-center rounded-full " +
          (highlight ? "bg-brand-amber text-brand-navy" : "bg-brand-amberSoft text-brand-amberInk")
        }
      >
        {icon}
      </span>
      <span className="font-thai text-[11px] font-medium text-ink">{label}</span>
    </Link>
  );
}

function SectionHead({
  titleTh,
  titleEn,
  href,
}: {
  titleTh: string;
  titleEn: string;
  href: string;
}) {
  return (
    <div className="flex items-end justify-between px-5">
      <div>
        <h2 className="font-thai text-lg font-bold leading-none text-ink">{titleTh}</h2>
        <p className="mt-1 text-[11px] uppercase tracking-wide text-faint">{titleEn}</p>
      </div>
      <Link
        href={href}
        className="font-thai flex items-center gap-0.5 text-sm font-semibold text-brand-amberInk"
      >
        ดูทั้งหมด <ChevronRight width={15} height={15} />
      </Link>
    </div>
  );
}

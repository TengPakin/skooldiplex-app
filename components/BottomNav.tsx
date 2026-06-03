"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, FilmIcon, TicketIcon, CrownIcon } from "@/components/icons";

const items = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/movies", label: "Movies", Icon: FilmIcon },
  { href: "/booking", label: "Booking", Icon: TicketIcon },
  { href: "/loyalty", label: "Rewards", Icon: CrownIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 z-40 mx-auto w-full max-w-[420px] border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-nav backdrop-blur"
    >
      <ul className="flex items-stretch justify-around">
        {items.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-xl py-2 transition-colors duration-200"
              >
                <Icon
                  width={22}
                  height={22}
                  className={active ? "text-brand-amberDark" : "text-slate-400"}
                />
                <span
                  className={
                    "text-[11px] font-medium " +
                    (active ? "text-brand-navy" : "text-slate-400")
                  }
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

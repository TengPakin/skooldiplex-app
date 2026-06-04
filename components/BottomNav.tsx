"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, FilmIcon, TicketIcon, CrownIcon } from "@/components/icons";

const items = [
  { href: "/", label: "หน้าแรก", en: "Home", Icon: HomeIcon },
  { href: "/movies", label: "หนัง", en: "Movies", Icon: FilmIcon },
  { href: "/showtimes", label: "จองตั๋ว", en: "Book", Icon: TicketIcon, match: ["/showtimes", "/booking"] },
  { href: "/loyalty", label: "รางวัล", en: "Rewards", Icon: CrownIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="z-40 shrink-0 border-t border-line bg-surface px-2 pb-[max(env(safe-area-inset-bottom),0.45rem)] pt-1.5 shadow-nav"
    >
      <ul className="flex items-stretch justify-around">
        {items.map(({ href, label, en, Icon, match }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : (match ?? [href]).some((p) => pathname.startsWith(p));
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                aria-label={en}
                className="group flex flex-col items-center gap-1 rounded-2xl py-1.5"
              >
                <span
                  className={
                    "grid h-9 w-14 place-items-center rounded-full transition-all duration-200 " +
                    (active
                      ? "bg-brand-amberSoft text-brand-navy"
                      : "text-faint group-hover:text-muted")
                  }
                >
                  <Icon width={21} height={21} strokeWidth={active ? 2.1 : 1.8} />
                </span>
                <span
                  className={
                    "font-thai text-[10.5px] leading-none transition-colors duration-200 " +
                    (active ? "font-semibold text-brand-navy" : "font-medium text-faint")
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

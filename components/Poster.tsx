import type { Movie } from "@/lib/movies";

/**
 * Cinematic key-art tile for a film. Layered like real poster art:
 * mood gradient + colored glow + film grain + bottom vignette.
 * Callers compose badges/titles as children on the z-10 layer.
 */
export default function Poster({
  movie,
  className = "",
  rounded = "rounded-2xl",
  children,
}: {
  movie: Movie;
  className?: string;
  rounded?: string;
  children?: React.ReactNode;
}) {
  const { from, to, glow } = movie.art;
  return (
    <div
      className={`relative isolate flex flex-col overflow-hidden ${rounded} ${className}`}
      style={{ backgroundImage: `linear-gradient(155deg, ${from} 8%, ${to} 120%)` }}
    >
      {/* colored key light */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full opacity-50 blur-2xl"
        style={{ background: glow }}
      />
      {/* film grain */}
      <div aria-hidden className="poster-grain pointer-events-none absolute inset-0" />
      {/* bottom vignette so any overlaid text stays legible */}
      <div aria-hidden className="poster-vignette pointer-events-none absolute inset-0" />
      {/* content layer */}
      <div className="relative z-10 flex h-full w-full flex-col">{children}</div>
    </div>
  );
}

/** Small format chip (IMAX / 4DX / 2D) used on posters and cards. */
export function FormatChip({ format, dark = false }: { format: string; dark?: boolean }) {
  const accent =
    format === "IMAX"
      ? "text-brand-amber"
      : format === "4DX"
        ? "text-brand-amberWarm"
        : dark
          ? "text-white/70"
          : "text-muted";
  return (
    <span
      className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        dark ? "bg-white/12 backdrop-blur" : "bg-paper2 ring-1 ring-line2"
      } ${accent}`}
    >
      {format}
    </span>
  );
}

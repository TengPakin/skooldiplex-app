/**
 * A believable QR-style code rendered deterministically from a seed string.
 * Not a real scannable QR — it's a stable visual stand-in for the e-ticket
 * (the app has no backend). Deterministic ⇒ identical on server + client
 * (no hydration mismatch) and no Math.random.
 */
function buildMatrix(value: string, n: number): boolean[][] {
  const m: boolean[][] = Array.from({ length: n }, () => Array<boolean>(n).fill(false));

  // FNV-1a hash → mulberry32 PRNG seed
  let h = 2166136261 >>> 0;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  let seed = h;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) m[r][c] = rand() > 0.52;

  // Classic finder patterns at three corners + white separator ring
  const stamp = (fr: number, fc: number) => {
    for (let r = -1; r <= 7; r++)
      for (let c = -1; c <= 7; c++) {
        const rr = fr + r,
          cc = fc + c;
        if (rr < 0 || cc < 0 || rr >= n || cc >= n) continue;
        if (r === -1 || r === 7 || c === -1 || c === 7) {
          m[rr][cc] = false; // separator
        } else {
          const border = r === 0 || r === 6 || c === 0 || c === 6;
          const center = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          m[rr][cc] = border || center;
        }
      }
  };
  stamp(0, 0);
  stamp(0, n - 7);
  stamp(n - 7, 0);
  return m;
}

export default function QrCode({
  value,
  size = 128,
  className = "",
}: {
  value: string;
  size?: number;
  className?: string;
}) {
  const n = 25;
  const matrix = buildMatrix(value, n);
  return (
    <svg
      width={size}
      height={size}
      viewBox={`-1 -1 ${n + 2} ${n + 2}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label="QR ticket code"
      className={className}
    >
      <rect x={-1} y={-1} width={n + 2} height={n + 2} fill="#ffffff" />
      {matrix.flatMap((row, r) =>
        row.map((on, c) =>
          on ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#0B101E" /> : null,
        ),
      )}
    </svg>
  );
}

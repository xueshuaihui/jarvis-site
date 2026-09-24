/**
 * ReactorLogo：弧反应堆小标——同心环 + 内三角。
 * spin 时外环慢转（L4，只转 SVG transform）。
 */
export function ReactorLogo({ size = 28, spin = false, dim = false }: { size?: number; spin?: boolean; dim?: boolean }) {
  const arc = dim ? "var(--color-lo)" : "var(--color-arc)";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden className={spin ? "animate-spin-slow" : ""}>
      <circle cx="24" cy="24" r="21" stroke={arc} strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="7 5" />
      <circle cx="24" cy="24" r="14" stroke={arc} strokeWidth="2" />
      <path d="M24 14 L32.7 29 L15.3 29 Z" stroke={arc} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="3" fill={arc} />
    </svg>
  );
}

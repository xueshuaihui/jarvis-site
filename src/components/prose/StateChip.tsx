import { STATES, type StateKey } from "../../content/manual";

/** 七状态徽章：与工具同色相，看板演示/矩阵/表格共用 */
export function StateChip({ state, small = false }: { state: StateKey; small?: boolean }) {
  const s = STATES.find((x) => x.key === state)!;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 ${small ? "py-0 text-[10px]" : "py-0.5 text-[11px]"} font-mono`}
      style={{ borderColor: `color-mix(in srgb, ${s.color} 45%, transparent)`, color: s.color, background: `color-mix(in srgb, ${s.color} 8%, transparent)` }}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}

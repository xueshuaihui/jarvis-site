import { useState } from "react";
import { STATES, TRANSITION_ROWS, type Cell } from "../../content/manual";
import { MATRIX_NOTES } from "../../content/manual";

/**
 * 交互版 7×7 流转矩阵：hover 十字高亮（行+列），单元格三态符号。
 * direct=青 ✓ / form=金 ⌗ / forbid=灰 × / self=虚线。静态无动画（正文区纪律）。
 */
const GLYPH: Record<Cell["k"], string> = { self: "·", direct: "✓", form: "⌗", forbid: "×" };
const CELL_CLS: Record<Cell["k"], string> = {
  self: "text-lo",
  direct: "text-arc",
  form: "text-gold",
  forbid: "text-st-failed/40",
};

export function TransitionMatrix() {
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);
  return (
    <div>
      <div
        className="overflow-x-auto rounded-xl border border-arc-dim/30 bg-void-1/50"
        style={{
          maskImage: "linear-gradient(to right, transparent 0, black 12px, black calc(100% - 12px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0, black 12px, black calc(100% - 12px), transparent 100%)",
        }}
      >
        <table className="w-full min-w-[560px] border-collapse text-center font-mono text-[12px]" onMouseLeave={() => setHover(null)}>
          <thead>
            <tr>
              <th className="px-3 py-2.5 text-left text-[10px] uppercase tracking-[0.2em] text-lo">从 \ 到</th>
              {STATES.map((s, c) => (
                <th key={s.key} className={`px-2 py-2.5 text-[11px] font-normal ${hover?.c === c ? "text-hi" : "text-lo"}`} style={hover?.c === c ? { color: s.color } : undefined}>
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TRANSITION_ROWS.map((row, r) => (
              <tr key={row.from}>
                <th
                  className={`whitespace-nowrap px-3 py-2 text-left text-[11px] font-normal ${hover?.r === r ? "text-hi" : "text-lo"}`}
                  style={hover?.r === r ? { color: STATES[r].color } : undefined}
                >
                  {STATES[r].label}
                </th>
                {row.cells.map((cell, c) => (
                  <td
                    key={c}
                    title={cell.why}
                    onMouseEnter={() => setHover({ r, c })}
                    className={`h-9 border border-arc-dim/10 transition-colors duration-100 ${
                      hover && (hover.r === r || hover.c === c) ? "bg-arc-faint" : ""
                    }`}
                  >
                    <span className={CELL_CLS[cell.k]}>{GLYPH[cell.k]}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-[11px] text-lo">
        <span>
          <span className="text-arc">✓</span> 直接生效
        </span>
        <span>
          <span className="text-gold">⌗</span> 弹表单（审核 / 强制停止）
        </span>
        <span>
          <span className="text-st-failed/60">×</span> 禁止（含「仅 Agent」路径）
        </span>
        <span className="text-lo/70">悬停格子看理由</span>
      </div>
      <ul className="mt-4 space-y-2">
        {MATRIX_NOTES.map((n) => (
          <li key={n} className="flex gap-3 text-[13px] leading-6 text-mid">
            <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/70" />
            <span>{n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

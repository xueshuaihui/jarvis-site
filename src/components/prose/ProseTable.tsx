import type { ReactNode } from "react";

/** HUD 表格：表头等宽大写字距、行 hover、移动端外层横滚 + 边缘渐隐 */
export function ProseTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div
      className="my-5 overflow-x-auto rounded-xl border border-arc-dim/30 bg-void-1/50"
      style={{
        maskImage: "linear-gradient(to right, transparent 0, black 12px, black calc(100% - 12px), transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0, black 12px, black calc(100% - 12px), transparent 100%)",
      }}
    >
      <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
        <thead>
          <tr className="border-b border-arc-dim/40">
            {head.map((h) => (
              <th key={h} className="whitespace-nowrap px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-arc/70">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-arc-dim/15 transition-colors duration-140 last:border-0 hover:bg-void-2/60">
              {r.map((c, j) => (
                <td key={j} className={`px-4 py-3 align-top leading-6 ${j === 0 ? "whitespace-nowrap font-mono text-[12px] text-hi" : "text-mid"}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { useMemo, useState } from "react";
import { MCP_TOOL_GROUPS, FACTS } from "../../content/manual";
import { RELEASE_BADGE } from "../../content/docs-nav";

/**
 * MCP 工具参考表：28 工具分三组，顶部单行本地过滤（空白切词 AND、子序列兜底）。
 * 行：名称 mono + 作用 + 等价 REST（无则 —）。
 */
function hit(query: string, text: string) {
  const q = query.toLowerCase();
  if (text.toLowerCase().includes(q)) return true;
  let i = 0;
  for (const ch of text.toLowerCase()) if (ch === q[i]) i++;
  return i === q.length;
}

export function ToolRefTable() {
  const [q, setQ] = useState("");
  const groups = useMemo(() => {
    const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return MCP_TOOL_GROUPS;
    return MCP_TOOL_GROUPS.map((g) => ({
      ...g,
      tools: g.tools.filter((t) => terms.every((term) => hit(term, `${t.name} ${t.what} ${t.rest ?? ""}`))),
    })).filter((g) => g.tools.length > 0);
  }, [q]);
  const shown = groups.reduce((n, g) => n + g.tools.length, 0);

  return (
    <div>
      <label className="mb-4 flex items-center gap-2 rounded-lg border border-arc-dim/40 bg-void-2/60 px-3 py-2">
        <span aria-hidden className="font-mono text-xs text-lo">/</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`过滤 ${FACTS.toolCount} 个工具：名称、作用或 REST 路径`}
          className="w-full bg-transparent font-mono text-[12px] text-hi outline-none placeholder:text-lo/70"
          aria-label="过滤 MCP 工具"
        />
        {q && (
          <button onClick={() => setQ("")} className="font-mono text-[11px] text-lo transition-colors duration-140 hover:text-arc" aria-label="清除过滤">
            ×
          </button>
        )}
      </label>
      {groups.map((g) => (
        <div key={g.title} className="mb-6">
          <div className="mb-2 flex items-baseline gap-3">
            <h3 className="font-mono text-[12px] tracking-[0.15em] text-gold">{g.title}</h3>
            <span className="text-[11px] text-lo">{g.note}</span>
          </div>
          <div className="divide-y divide-arc-dim/15 overflow-hidden rounded-xl border border-arc-dim/30 bg-void-1/50">
            {g.tools.map((t) => (
              <div key={t.name} className="grid gap-1 px-4 py-3 transition-colors duration-140 hover:bg-void-2/60 md:grid-cols-[220px_1fr_auto] md:gap-4">
                <code className="h-fit font-mono text-[12px] text-arc">{t.name}</code>
                <p className="text-[13px] leading-6 text-mid">{t.what}</p>
                <p className="h-fit font-mono text-[11px] text-lo">{t.rest ?? "—"}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      {groups.length === 0 && (
        <p className="rounded-xl border border-arc-dim/30 bg-void-1/50 px-4 py-6 text-center font-mono text-[12px] text-lo">
          NO MATCH · 没有命中「{q}」的工具
        </p>
      )}
      <p className="mt-2 font-mono text-[11px] text-lo">
        {q ? `命中 ${shown} / ${FACTS.toolCount}` : `tools/list 全集 ${FACTS.toolCount} 工具 · ${RELEASE_BADGE} 口径`}
      </p>
    </div>
  );
}

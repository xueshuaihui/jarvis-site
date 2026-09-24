/* S4 五张模块线框构图：统一 HUD 线框语言，抽象示意（非真实截图）。 */

const bar = (w: string, c = "bg-arc/20") => <div className={`h-1.5 rounded-full ${c}`} style={{ width: w }} />;

/** 看板：三列格子 + 一张金卡 */
export function SketchBoard() {
  return (
    <div className="grid h-full grid-cols-3 gap-2.5">
      {["需求池", "执行中", "待审核"].map((col, i) => (
        <div key={col} className="rounded-lg border border-arc-dim/30 bg-void-1/60 p-2">
          <p className="mb-2 font-mono text-[9px] text-lo">{col}</p>
          <div className="space-y-2">
            {Array.from({ length: 3 - (i === 1 ? 1 : 0) }).map((_, k) => (
              <div key={k} className={`rounded border p-1.5 ${i === 1 && k === 0 ? "border-gold/60 bg-void-2" : "border-arc-dim/20 bg-void-2/60"}`}>
                {bar(i === 1 && k === 0 ? "70%" : "60%", i === 1 && k === 0 ? "bg-gold/60" : "bg-arc/20")}
                <div className="mt-1.5">{bar("40%", "bg-arc/10")}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** 审核：diff 行 + 通过/驳回按钮 */
export function SketchReview() {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex-1 rounded-lg border border-arc-dim/30 bg-void-1/60 p-2.5 font-mono text-[10px] leading-5">
        <p className="text-st-done">+ agent: 重构完成，附回归结果</p>
        <p className="text-st-done">+ src/payment/refund.ts</p>
        <p className="text-st-failed">- const legacy = true</p>
        <p className="text-st-done">+ const legacy = false</p>
        <p className="text-lo">@@ -12,7 +12,7 @@</p>
      </div>
      <div className="flex justify-end gap-2">
        <span className="rounded border border-st-failed/60 px-3 py-1 font-mono text-[10px] text-st-failed">驳回</span>
        <span className="rounded bg-st-done/90 px-3 py-1 font-mono text-[10px] text-void-0">通过</span>
      </div>
    </div>
  );
}

/** 技能库：搜索框 + 分类 chips + 列表 */
export function SketchSkills() {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center gap-2 rounded-lg border border-arc-dim/40 bg-void-2/80 px-2.5 py-1.5">
        <span className="font-mono text-[10px] text-arc">⌕</span>
        <span className="font-mono text-[10px] text-mid">搜索技能…</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {["写作教练", "分析", "考研", "前端", "效率"].map((c, i) => (
          <span key={c} className={`rounded-full border px-2 py-0.5 font-mono text-[9px] ${i === 1 ? "border-arc text-arc" : "border-arc-dim/30 text-lo"}`}>
            {c}
          </span>
        ))}
      </div>
      <div className="flex-1 space-y-1.5 overflow-hidden rounded-lg border border-arc-dim/20 bg-void-1/50 p-2">
        {["financial-analysis-18steps", "boge-kaoyan-writing-coach", "math-drill-explainer"].map((s) => (
          <div key={s} className="flex items-center justify-between rounded border border-arc-dim/20 bg-void-2/60 px-2 py-1.5">
            <span className="truncate font-mono text-[9px] text-mid">{s}</span>
            <span className="ml-2 shrink-0 font-mono text-[8px] text-arc/60">v1</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Agent 接入：终端滚出 tools/list */
export function SketchAgent() {
  return (
    <div className="h-full rounded-lg border border-arc-dim/30 bg-void-0/90 p-3 font-mono text-[10px] leading-5">
      <p className="text-lo">$ POST /mcp · tools/list</p>
      <p className="text-arc">▸ list_ready_tasks</p>
      <p className="text-arc">▸ claim_next_task</p>
      <p className="text-arc">▸ update_progress · append_log</p>
      <p className="text-arc">▸ heartbeat · block_task</p>
      <p className="text-arc">▸ complete_task · begin_breakdown</p>
      <p className="text-gold">▸ create_task <span className="text-lo">// 唤醒词「贾维斯，…」</span></p>
      <p className="mt-2 text-mid">
        25 tools · lease 30min <span className="animate-blink">▌</span>
      </p>
    </div>
  );
}

/** 设置与审计：分组列表 */
export function SketchSettings() {
  return (
    <div className="grid h-full grid-cols-2 gap-2">
      {["通用", "视图", "Token", "字段定义", "模板", "数据", "审计日志", "备份"].map((t, i) => (
        <div key={t} className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 font-mono text-[10px] ${i === 2 ? "border-gold/50 text-gold" : "border-arc-dim/25 text-lo"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${i === 2 ? "bg-gold" : "bg-arc/30"}`} />
          {t}
        </div>
      ))}
    </div>
  );
}

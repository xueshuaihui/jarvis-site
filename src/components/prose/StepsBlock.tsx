import type { ReactNode } from "react";

/** 纵向操作序列：编号圆 + 连接线（QuickStart RailLine 的文档区收紧版，静态） */
export function StepsBlock({ items }: { items: { title?: string; body: ReactNode }[] }) {
  return (
    <ol className="my-5 space-y-0">
      {items.map((it, i) => (
        <li key={i} className="relative grid grid-cols-[32px_1fr] gap-3 pb-6 last:pb-0">
          {i < items.length - 1 && (
            <span aria-hidden className="absolute left-4 top-8 bottom-0 w-px -translate-x-px bg-arc-dim/25" />
          )}
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-arc-dim/50 bg-void-2 font-mono text-[11px] text-arc">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="pt-1">
            {it.title ? <p className="text-sm font-semibold text-hi">{it.title}</p> : null}
            <div className="text-[13px] leading-6 text-mid [&_p]:my-1">{it.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** 带主语标签的闭环步骤（Agent 执行循环用：who + step + what） */
export function LoopSteps({ items }: { items: { who: string; step: string; what: string; rest: string }[] }) {
  return (
    <ol className="my-5 space-y-0">
      {items.map((it, i) => (
        <li key={it.step} className="relative grid grid-cols-[32px_1fr] gap-3 pb-6 last:pb-0">
          {i < items.length - 1 && <span aria-hidden className="absolute left-4 top-8 bottom-0 w-px -translate-x-px bg-arc-dim/25" />}
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 bg-void-2 font-mono text-[11px] text-gold">
            {i + 1}
          </span>
          <div className="pt-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <code className="font-mono text-[12px] text-arc">{it.step}</code>
              <span className="rounded-full border border-arc-dim/40 px-2 font-mono text-[10px] text-lo">{it.who}</span>
            </div>
            <p className="mt-1 text-[13px] leading-6 text-mid">{it.what}</p>
            <p className="mt-0.5 font-mono text-[11px] text-lo">{it.rest}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

import { Info, ShieldAlert, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

const TONES = {
  info: { icon: Info, cls: "border-arc/40 border-l-arc", iconCls: "text-arc" },
  warn: { icon: TriangleAlert, cls: "border-gold/50 border-l-gold", iconCls: "text-gold" },
  danger: { icon: ShieldAlert, cls: "border-st-failed/50 border-l-st-failed", iconCls: "text-st-failed" },
} as const;

/** 三级提示：info(青)/warn(金)/danger(红)，左 2px 色边语义沿用一期色彩哲学 */
export function Callout({ tone, title, children }: { tone: keyof typeof TONES; title: string; children: ReactNode }) {
  const t = TONES[tone];
  const Icon = t.icon;
  return (
    <div className={`my-5 rounded-r-xl border border-l-2 ${t.cls} bg-void-1/60 p-4`}>
      <div className={`flex items-center gap-2 ${t.iconCls}`}>
        <Icon size={14} aria-hidden />
        <span className="font-mono text-[11px] font-semibold tracking-[0.15em]">{title}</span>
      </div>
      <div className="mt-2 text-[13px] leading-6 text-mid [&_p]:my-1.5">{children}</div>
    </div>
  );
}

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useState, type ReactNode } from "react";
import { SPRING_GENTLE } from "../../lib/motion";

/** 终端式代码块：复制按钮常驻右上（文档区无 hover-only 空间），clipboard 静默失败 */
export function CodeBlock({ label, code, lang }: { label?: string; code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* 无剪贴板权限时静默 */
    }
  };
  return (
    <div className="my-5 overflow-hidden rounded-xl border border-arc-dim/30 bg-void-0/80">
      <div className="flex items-center justify-between border-b border-arc-dim/25 px-4 py-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-lo">{label ?? lang ?? "code"}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md border border-arc-dim/40 px-2 py-1 font-mono text-[10px] text-lo transition-colors duration-140 hover:border-arc/60 hover:text-arc"
          aria-label="复制代码"
        >
          {copied ? (
            <motion.span animate={{ scale: [0.7, 1.15, 1] }} transition={SPRING_GENTLE} className="text-arc">
              <Check size={12} />
            </motion.span>
          ) : null}
          {copied ? "已复制" : "复制"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[12px] leading-6 text-mid">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/** 单行命令（QuickStart CopyLine 的文档区简化版：常显复制） */
export function CmdLine({ children, code }: { children?: ReactNode; code: string }) {
  return (
    <div className="my-3">
      {children ? <p className="mb-1.5 text-[12px] text-lo">{children}</p> : null}
      <CodeBlock code={code} label="shell" />
    </div>
  );
}

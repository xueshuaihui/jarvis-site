import { motion, useReducedMotion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { QUICKSTART } from "../../content/copy";
import { easeOverlay, SPRING_GENTLE } from "../../lib/motion";
import { PanelTitle } from "../hud/PanelTitle";
import { Typewriter } from "../hud/Typewriter";

/**
 * 可复制命令小条：终端窗质感；hover 浮现复制钮，点击后对勾 pop。
 * typed=true 时命令走打字机（仅该卡首次可见后启动，播一次）。
 */
function CopyLine({ label, cmd, typed = false }: { label: string; cmd: string; typed?: boolean }) {
  const [visible, setVisible] = useState(!typed);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
    } catch {
      /* 无剪贴板权限时静默：命令文本仍可手动选中复制 */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="mt-4">
      <p className="mb-1.5 font-mono text-[10px] tracking-wider text-lo">{label}</p>
      <motion.div
        onViewportEnter={() => setVisible(true)}
        viewport={{ once: true, amount: 0.6 }}
        className="group flex items-stretch overflow-hidden rounded-lg border border-arc-dim/40 bg-void-0/85"
      >
        <code className="min-w-0 flex-1 px-3 py-2.5 font-mono text-xs leading-5 text-arc/90">
          {typed && !visible ? (
            <span aria-hidden className="inline-block h-3.5 w-16 bg-arc/15 align-middle" />
          ) : typed ? (
            <Typewriter text={cmd} speed={22} className="select-all" />
          ) : (
            <span className="select-all">{cmd}</span>
          )}
        </code>
        <button
          onClick={copy}
          aria-label={copied ? "已复制" : "复制命令"}
          className="flex w-10 shrink-0 items-center justify-center border-l border-arc-dim/40 text-lo opacity-0 transition-[opacity,color] duration-140 focus-visible:opacity-100 group-hover:opacity-100 hover:text-arc"
        >
          {copied ? (
            <motion.span key="ok" initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={SPRING_GENTLE} className="text-st-done">
              <Check size={15} />
            </motion.span>
          ) : (
            <Copy size={14} />
          )}
        </button>
      </motion.div>
    </div>
  );
}

/** 步骤塔竖向连线：滚动经过时自上而下描亮（一次性 clip 高度，非 scroll-linked） */
function RailLine() {
  const reduce = useReducedMotion();
  const [lit, setLit] = useState(false);
  return (
    <span className="relative mt-2 w-px flex-1 bg-arc-dim/25">
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 h-full bg-arc/70"
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        animate={lit || reduce ? { clipPath: "inset(0 0 0% 0)" } : {}}
        onViewportEnter={() => setLit(true)}
        viewport={{ once: true, amount: 0.95 }}
        transition={{ duration: reduce ? 0 : 0.4, ease: [0.32, 0.72, 0, 1] }}
      />
    </span>
  );
}

type QStep = (typeof QUICKSTART.steps)[number];

/** 单步：左步骤塔 + 右内容卡 */
function Step({ step, last }: { step: QStep; last: boolean }) {
  return (
    <div className="grid grid-cols-[44px_1fr] gap-4 md:grid-cols-[64px_1fr] md:gap-8">
      <div className="flex flex-col items-center">
        <motion.span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-arc-dim bg-void-1 font-mono text-[11px] text-arc md:h-11 md:w-11 md:text-xs"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={easeOverlay}
        >
          {step.no}
        </motion.span>
        {!last && <RailLine />}
      </div>
      <motion.div
        className={`min-w-0 ${last ? "" : "pb-12"}`}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={easeOverlay}
      >
        <div className="rounded-xl border border-arc-dim/30 bg-void-1/70 p-5 transition-[border-color,box-shadow] duration-140 hover:border-arc/50 hover:shadow-glow md:p-6">
          <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-lg font-semibold text-hi">{step.title}</h3>
            <span className="font-mono text-[10px] tracking-wider text-gold/80">⏱ {step.time}</span>
          </div>
          <p className="text-sm leading-7 text-mid">{step.body}</p>
          {step.copyCmd && step.copyLabel && (
            <CopyLine label={step.copyLabel} cmd={step.copyCmd} typed={step.no === "03"} />
          )}
          {step.no === "03" && (
            <p className="mt-3 font-mono text-[11px] leading-5 text-lo">
              Token 在 设置 → Token 签发（atb_ 前缀 + 40 位），明文只显示一次，妥存。
            </p>
          )}
          {step.no === "04" && (
            <div className="mt-4 rounded-lg border border-gold/30 bg-gold/[0.05] p-3.5">
              <p className="font-mono text-xs text-gold">贾维斯，认领一块任务。</p>
              <p className="mt-2 text-xs leading-5 text-mid">
                产出物不过你的手，不算完成 —— 「待审核」的出口只有人工审核一条路。
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/** S5 上手引导「四步开机」 */
export function QuickStart() {
  return (
    <section id="quickstart" className="relative z-10 mx-auto max-w-4xl px-4 py-24 md:px-8 md:py-32">
      <PanelTitle kicker={QUICKSTART.kicker} title={QUICKSTART.title} />
      <div>
        {QUICKSTART.steps.map((s, i) => (
          <Step key={s.no} step={s} last={i === QUICKSTART.steps.length - 1} />
        ))}
      </div>
    </section>
  );
}

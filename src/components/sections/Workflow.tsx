import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Pause, Play, StepBack, StepForward } from "lucide-react";
import { useEffect, useState } from "react";
import { WORKFLOW_BRANCHES, WORKFLOW_STEPS } from "../../content/copy";
import { EASE_SETTLE, SPRING_GENTLE, easeOverlay, slotSwap } from "../../lib/motion";
import { PanelTitle } from "../hud/PanelTitle";

/**
 * S3「一块任务卡的旅程」：7 态状态机播放器（5 主节点 + 受阻/异常分支）。
 * 播放时金卡沿流水线逐节点行进（layoutId 飞行），详情槽随步切换（L2 退140/入200）；
 * 播放中上报 onPlayingChange=true，Hero 常驻循环让位（同屏仅一组编排）。
 */
export function Workflow({ onPlayingChange }: { onPlayingChange: (playing: boolean) => void }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => onPlayingChange(playing), [playing, onPlayingChange]);

  useEffect(() => {
    if (!playing) return;
    if (step >= WORKFLOW_STEPS.length - 1) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), 700);
    return () => window.clearTimeout(t);
  }, [playing, step]);

  const cur = WORKFLOW_STEPS[step];
  const atEnd = step === WORKFLOW_STEPS.length - 1;

  const toggle = () => {
    if (!playing && atEnd) setStep(0);
    setPlaying((p) => !p);
  };
  const stepTo = (n: number) => {
    setPlaying(false);
    setStep(Math.min(Math.max(n, 0), WORKFLOW_STEPS.length - 1));
  };

  const btn =
    "flex h-9 w-9 items-center justify-center rounded-lg border border-arc-dim/40 text-arc transition-[border-color,color,box-shadow] duration-140 hover:border-arc hover:shadow-glow active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-arc-dim/40 disabled:hover:shadow-none";

  return (
    <section id="workflow" className="relative z-10 mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-32">
      <PanelTitle kicker="ONE CARD'S JOURNEY" title="一块任务卡的旅程" />
      <p className="-mt-6 mb-12 max-w-2xl text-sm leading-6 text-mid">
        七个状态、一条硬规矩：「执行中」只能由 Agent 认领产生，「待审核」只能由人的点击流出。按下播放，看一块任务卡走完全程。
      </p>

      {/* 控制条 */}
      <div className="mb-10 flex items-center gap-2.5">
        <button className={btn} onClick={toggle} aria-label={playing ? "暂停" : "播放"} disabled={!!reduce}>
          {playing ? <Pause size={15} /> : <Play size={15} />}
        </button>
        <button className={btn} onClick={() => stepTo(step - 1)} aria-label="上一步" disabled={step === 0}>
          <StepBack size={15} />
        </button>
        <button className={btn} onClick={() => stepTo(step + 1)} aria-label="下一步" disabled={atEnd}>
          <StepForward size={15} />
        </button>
        <span className="ml-3 font-mono text-[11px] tracking-wider text-lo tnum">
          STEP {String(step + 1).padStart(2, "0")} / 05
          {reduce && <span className="ml-3 text-gold/70">· reduced-motion：步进阅读模式</span>}
        </span>
      </div>

      {/* 流水线：桌面横排 / 窄屏纵排 */}
      <div className="flex flex-col items-stretch md:flex-row md:items-start">
        {WORKFLOW_STEPS.map((s, i) => {
          const passed = i <= step;
          const here = i === step;
          return (
            <div key={s.key} className="flex flex-col items-center md:flex-1 md:flex-row md:items-start">
              {/* 节点 */}
              <button
                className="group flex w-24 shrink-0 flex-col items-center gap-2 focus-visible:outline-none"
                onClick={() => stepTo(i)}
                aria-label={`跳到 ${s.label}`}
              >
                {/* 行进中的金卡（layoutId 在节点间飞行） */}
                <span className="relative flex h-12 w-full items-center justify-center">
                  {here && (
                    <motion.span
                      layoutId="travel-card"
                      transition={reduce ? { duration: 0 } : SPRING_GENTLE}
                      className="absolute rounded-md border border-gold/70 bg-void-2 px-2 py-1 font-mono text-[9px] text-gold shadow-glow-gold"
                    >
                      任务卡
                      {atEnd && (
                        <motion.span
                          aria-hidden
                          className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-st-done text-void-0"
                          initial={reduce ? false : { scale: 0.6 }}
                          animate={{ scale: 1 }}
                          transition={SPRING_GENTLE}
                        >
                          <Check size={10} />
                        </motion.span>
                      )}
                    </motion.span>
                  )}
                </span>
                {/* 六边形徽标 */}
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-lg border transition-[border-color,box-shadow] duration-140 ${
                    here ? "" : passed ? "opacity-80" : "opacity-45 group-hover:opacity-80"
                  }`}
                  style={{
                    borderColor: passed ? s.color : "var(--color-arc-dim)",
                    boxShadow: here ? `0 0 18px ${s.color}55` : undefined,
                  }}
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: passed ? s.color : "var(--color-arc-dim)" }} />
                </span>
                <span className={`text-xs font-medium ${here ? "text-hi" : "text-mid"}`}>{s.label}</span>
                <span className="hidden font-mono text-[9px] leading-4 text-lo md:block">{s.desc}</span>
              </button>
              {/* 连线 */}
              {i < WORKFLOW_STEPS.length - 1 && (
                <div className="mx-1 my-2 h-6 w-px self-center shrink-0 md:mx-0 md:mt-[46px] md:h-px md:w-auto md:flex-1 md:self-auto">
                  <div className="h-full w-full relative">
                    <span className="absolute inset-0 bg-arc-dim/25" />
                    <motion.span
                      className="absolute inset-0 origin-left bg-arc/80 md:origin-left"
                      initial={false}
                      animate={{ opacity: step > i ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: EASE_SETTLE }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 分支节点：受阻 / 异常 */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-10">
        {WORKFLOW_BRANCHES.map((b) => (
          <div key={b.key} className="flex items-center gap-2.5">
            <span aria-hidden className="h-px w-10 border-t border-dashed" style={{ borderColor: `${b.color}88` }} />
            <span
              className="flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px]"
              style={{ borderColor: `${b.color}66`, color: b.color }}
            >
              {b.label}
            </span>
            <span className="hidden text-[11px] text-lo sm:block">{b.desc}</span>
          </div>
        ))}
      </div>

      {/* 详情槽 */}
      <div className="mt-10 min-h-28 rounded-xl border border-arc-dim/30 bg-void-1/60 p-6">
        <AnimatePresence mode="wait">
          <motion.div key={cur.key} {...slotSwap}>
            <p className="mb-2 flex items-center gap-2.5 font-mono text-xs tracking-wider" style={{ color: cur.color }}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {cur.label} · {cur.desc}
            </p>
            <p className="max-w-3xl text-sm leading-7 text-mid">{cur.detail}</p>
          </motion.div>
        </AnimatePresence>
        {atEnd && !reduce && (
          <motion.p
            className="mt-3 font-mono text-xs text-st-done"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...easeOverlay, delay: 0.2 }}
          >
            ✓ 人已核准 —— 这块任务才算完成。
          </motion.p>
        )}
      </div>
    </section>
  );
}

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { HERO, LINKS } from "../../content/copy";
import { EASE_EMPHASIS, SPRING_GENTLE, easeEmphasis } from "../../lib/motion";
import { BracketFrame } from "../hud/BracketFrame";
import { ScanSweep } from "../hud/ScanSweep";
import { Typewriter } from "../hud/Typewriter";

/**
 * S1 Hero：左文案（打字机问候）+ 右全息看板投影。
 * 常驻循环：金边卡片 需求池→执行中→待审核 飞行（layoutId），
 * reduced-motion 定格在「待审核」终态；S3 播放器运行时由外部 paused 暂停。
 */
const PHASES = ["backlog", "running", "review"] as const;
type Phase = (typeof PHASES)[number];

export function Hero({ paused = false }: { paused?: boolean }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(reduce ? "review" : "backlog");
  const [typeStart, setTypeStart] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setTypeStart(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (reduce || paused) return;
    const timer = window.setInterval(() => {
      setPhase((p) => PHASES[(PHASES.indexOf(p) + 1) % PHASES.length]);
    }, 2400);
    return () => window.clearInterval(timer);
  }, [reduce, paused]);

  const card = (
    <motion.div
      layoutId="hero-card"
      transition={SPRING_GENTLE}
      className="rounded-lg border border-gold/60 bg-void-2/95 px-3 py-2.5 shadow-glow-gold"
    >
      <div className="mb-1.5 h-1 w-8 rounded-full bg-gold/70" />
      <p className="text-xs leading-4 text-hi">{HERO.board.cardTitle}</p>
      <div className="mt-2 flex gap-1.5">
        <span className="h-1.5 w-10 rounded-full bg-arc/30" />
        <span className="h-1.5 w-5 rounded-full bg-arc/20" />
      </div>
    </motion.div>
  );

  return (
    <section id="hero" className="relative z-10 flex min-h-[100svh] items-center pt-16">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-4 py-16 md:px-8 lg:grid-cols-[55fr_45fr]">
        {/* 左：文案 */}
        <div>
          <motion.p
            className="mb-5 font-mono text-xs tracking-[0.25em] text-gold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0, duration: 0.3 }}
          >
            {HERO.statusLine}
          </motion.p>
          <motion.h1
            className="text-4xl font-semibold leading-[1.18] text-hi md:text-5xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...easeEmphasis, delay: 0.12 }}
          >
            {HERO.h1}
            <br />
            <span className="bg-gradient-to-r from-arc to-st-ready bg-clip-text text-transparent">{HERO.h1Accent}</span>
          </motion.h1>
          <motion.p
            className="mt-5 min-h-7 text-sm text-arc/90 md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <Typewriter text={HERO.typed} start={typeStart} />
          </motion.p>
          <motion.p
            className="mt-5 max-w-xl leading-7 text-mid"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...easeEmphasis, delay: reduce ? 0.3 : 1.0 }}
          >
            {HERO.lede}
          </motion.p>
          <motion.div
            className="mt-9 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...easeEmphasis, delay: reduce ? 0.35 : 1.15 }}
          >
            <a
              href={LINKS.releasesLatest}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-void-0 transition-[filter] duration-140 hover:brightness-110 active:scale-[0.98] animate-breathe-gold"
            >
              {HERO.ctaMain}
            </a>
            <a
              href="#workflow"
              className="rounded-lg border border-arc-dim px-6 py-3 font-mono text-sm text-arc transition-[border-color,box-shadow] duration-140 hover:border-arc hover:shadow-glow active:scale-[0.98]"
            >
              {HERO.ctaGhost}
            </a>
          </motion.div>
          <motion.p
            className="mt-5 font-mono text-xs text-lo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0.4 : 1.3, duration: 0.4 }}
          >
            {HERO.finePrint}
          </motion.p>
        </div>

        {/* 右：全息看板投影 */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(100% 0 0 0)" }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0% 0 0 0)" }}
          transition={{ duration: 0.6, ease: EASE_EMPHASIS, delay: 0.6 }}
        >
          <BracketFrame className="bg-void-1/60 p-5 backdrop-blur-sm">
            <ScanSweep trigger="hero" className="rounded" />
            <p className="mb-4 font-mono text-[10px] tracking-[0.3em] text-arc/70">{HERO.board.title}</p>
            <div className="grid grid-cols-3 gap-3">
              {HERO.board.columns.map((col, i) => {
                const p: Phase = PHASES[i];
                const colColor = p === "backlog" ? "text-st-backlog" : p === "running" ? "text-st-running" : "text-st-review";
                const activeCol = phase === p;
                return (
                  <div
                    key={col}
                    className={`min-h-44 rounded-lg border p-2.5 transition-[border-color,box-shadow] duration-140 ${
                      activeCol
                        ? p === "review"
                          ? "border-st-review/70 shadow-[0_0_18px_rgba(157,107,255,0.2)]"
                          : "border-st-running/60 shadow-[0_0_18px_rgba(251,176,36,0.15)]"
                        : "border-arc-dim/30"
                    }`}
                  >
                    <p className={`mb-2.5 flex items-center gap-1.5 text-[11px] ${colColor}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {col}
                    </p>
                    {/* 骨架占位卡（非当前阶段的环境元素） */}
                    <div className="space-y-2">
                      {["w-full", "w-4/5"].map((w, k) => (
                        <div key={k} className={`h-9 rounded border border-arc-dim/25 bg-void-2/70 ${w}`}>
                          <div className="p-1.5">
                            <div className="h-1 w-6 rounded bg-arc/20" />
                            <div className="mt-1 h-1 w-10 rounded bg-arc/10" />
                          </div>
                        </div>
                      ))}
                      {activeCol && card}
                    </div>
                    <AnimatePresence>
                      {activeCol && p === "review" && (
                        <motion.p
                          className="mt-2 font-mono text-[9px] tracking-wider text-st-review"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0.55, 1] }}
                          exit={{ opacity: 0, transition: { duration: 0.14 } }}
                          transition={{ duration: 1.2 }}
                        >
                          ⏸ {HERO.board.reviewStamp}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
            {/* 底部雷达环：卡片仿佛由其上投影而出 */}
            <div aria-hidden className="mt-5 flex justify-center">
              <svg width="180" height="40" viewBox="0 0 180 40" className="animate-spin-drift" style={{ transformBox: "fill-box" }}>
                <ellipse cx="90" cy="20" rx="84" ry="17" fill="none" stroke="var(--color-arc)" strokeOpacity="0.25" strokeDasharray="5 7" />
                <ellipse cx="90" cy="20" rx="52" ry="10" fill="none" stroke="var(--color-arc)" strokeOpacity="0.4" strokeDasharray="3 6" />
              </svg>
            </div>
          </BracketFrame>
        </motion.div>
      </div>
    </section>
  );
}

import type { Transition, Variants } from "motion";

/* ============================================================
   本站动画 token（《区块结构与动画设计》§A.2）
   分层纪律移植工具 motion-spec v1.2：允许值以本文件为全集，表外禁止。
   L1 微交互走 CSS（duration-140 + ease-settle）；此处只放 JS 轨。
   ============================================================ */

export const EASE_SETTLE = [0.2, 0, 0, 1] as const;
export const EASE_EMPHASIS = [0.32, 0.72, 0, 1] as const;
export const EASE_OUT = [0, 0, 0.2, 1] as const;

/** 档位时长（秒）：L2 入 200/退 140；L3 rise 400、stagger 60、单项 ≤300 */
export const DUR = {
  fadeExit: 0.14,
  overlayIn: 0.2,
  rise: 0.4,
  item: 0.3,
} as const;

export const SPRING_GENTLE: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.9,
};

export const easeEmphasis: Transition = { duration: DUR.rise, ease: EASE_EMPHASIS };
export const easeOverlay: Transition = { duration: DUR.overlayIn, ease: EASE_EMPHASIS };
export const easeExit: Transition = { duration: DUR.fadeExit, ease: EASE_OUT };

/** L3 区块/卡片入场（whileInView 一次，不重播） */
export const rise = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: easeEmphasis,
} as const;

export const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.item, ease: EASE_EMPHASIS } },
};

/** 浮层/槽位切换：退场 ≤ 入场×0.7 */
export const slotSwap = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4, transition: easeExit },
  transition: easeOverlay,
} as const;

/** 按压反馈（工具 Button 语言：active scale .98） */
export const tapPress = { whileTap: { scale: 0.98 } } as const;

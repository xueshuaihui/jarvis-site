import { motion } from "motion/react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { PanelTitle } from "../hud/PanelTitle";
import { DOC_PAGES, type DocPageMeta } from "../../content/docs-nav";

/* ============================================================
   文档区正文原语（《二级页面架构与内容设计》§4.2）
   纪律：正文段落/表格一律不做 scroll reveal（§5）——动画只到 PageHeader 为止。
   ============================================================ */

/** 页头：kicker + 大标题 + 一句话定位（本页唯一 L3 编排组由 DocsLayout 的页面切换承担淡入） */
export function PageHeader({ meta }: { meta: DocPageMeta }) {
  return (
    <header className="mb-4">
      <PanelTitle kicker={meta.kicker} title={meta.title} />
      <p className="-mt-6 max-w-2xl text-sm leading-7 text-mid">{meta.summary}</p>
    </header>
  );
}

/** 小节：id 供右栏 TOC 锚定；H2 静态（无 scroll 动画），hover 出现锚点 */
export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-14 scroll-mt-24">
      <a href={`#${id}`} className="group flex items-baseline gap-2" aria-label={`小节锚点 ${title}`}>
        <span aria-hidden className="font-mono text-xs text-gold">
          ▸
        </span>
        <h2 className="text-xl font-semibold tracking-wide text-hi">{title}</h2>
        <span className="font-mono text-xs text-lo opacity-0 transition-opacity duration-140 group-hover:opacity-100">#</span>
      </a>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="my-4 text-sm leading-7 text-mid">{children}</p>;
}

export function UL({ items }: { items: ReactNode[] }) {
  return (
    <ul className="my-4 space-y-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-sm leading-7 text-mid">
          <span aria-hidden className="mt-3 h-1 w-1 shrink-0 rounded-full bg-arc/70" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return <code className="rounded border border-arc-dim/40 bg-void-2/80 px-1.5 py-0.5 font-mono text-[12px] text-arc/90">{children}</code>;
}

/** 页脚依据行：mono 灰字，出点对账用 */
export function BasisLine({ text }: { text: string }) {
  return <p className="mt-16 border-t border-arc-dim/20 pt-4 font-mono text-[11px] text-lo">{text}</p>;
}

/** 上/下篇翻页器（顺序取 DOC_PAGES 注册表） */
export function DocPager({ slug }: { slug: string }) {
  const idx = DOC_PAGES.findIndex((p) => p.slug === slug);
  if (idx < 0) return null;
  const prev = idx > 0 ? DOC_PAGES[idx - 1] : null;
  const next = idx < DOC_PAGES.length - 1 ? DOC_PAGES[idx + 1] : null;
  return (
    <nav aria-label="文档翻页" className="mt-10 grid gap-3 sm:grid-cols-2">
      {prev ? (
        <Link
          to={`/docs/${prev.slug}`}
          className="rounded-xl border border-arc-dim/30 bg-void-1/60 px-4 py-3 transition-colors duration-140 hover:border-arc/50"
        >
          <span className="font-mono text-[10px] tracking-[0.2em] text-lo">← 上篇</span>
          <p className="mt-1 text-sm text-mid">{prev.title}</p>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          to={`/docs/${next.slug}`}
          className="rounded-xl border border-arc-dim/30 bg-void-1/60 px-4 py-3 text-right transition-colors duration-140 hover:border-arc/50"
        >
          <span className="font-mono text-[10px] tracking-[0.2em] text-lo">下篇 →</span>
          <p className="mt-1 text-sm text-mid">{next.title}</p>
        </Link>
      )}
    </nav>
  );
}

/** 复制按钮（Check pop 微反馈，L1） */
export function CopyChip({ text, copied }: { text: string; copied: boolean }) {
  return (
    <span className="pointer-events-none font-mono text-[10px] text-arc">
      {copied ? (
        <motion.span initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.9 }}>
          ✓ 已复制
        </motion.span>
      ) : (
        text
      )}
    </span>
  );
}

export function HomeLink() {
  return (
    <Link to="/" className="font-mono text-xs text-lo transition-colors duration-140 hover:text-arc">
      ← 返回首页
    </Link>
  );
}

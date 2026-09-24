import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { DOC_PAGES } from "../../content/docs-nav";

/**
 * 首页常驻侧边二级导航（xl+）：HUD 悬浮面板——边框 + 四角 L 括角 + 青辉光投影。
 * ≥2xl 全量显示「章号+章名」；xl–2xl 之间收窄为章号轨（hover 向右浮出章名），不压版心。
 * 动效仅 L1（140ms 色彩/底色）。
 */
export function DocsSideRail() {
  const corners = [
    "left-0 top-0 border-l border-t",
    "right-0 top-0 border-r border-t",
    "left-0 bottom-0 border-l border-b",
    "right-0 bottom-0 border-r border-b",
  ];
  return (
    <nav aria-label="操作手册侧栏" className="fixed left-3 top-1/2 z-30 hidden -translate-y-1/2 xl:block">
      <div className="relative rounded-xl border border-arc-dim/40 bg-void-1/85 px-2 py-3 shadow-[0_0_28px_rgba(63,217,243,0.12),0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        {corners.map((c) => (
          <span key={c} aria-hidden className={`pointer-events-none absolute h-2.5 w-2.5 border-arc/70 ${c}`} />
        ))}
        <Link
          to="/docs"
          title="文档首页"
          className="mb-2.5 flex items-center justify-center gap-1.5 rounded-md px-1 py-1 font-mono text-[9px] tracking-[0.25em] text-arc/80 transition-colors duration-140 hover:bg-arc-faint hover:text-arc"
        >
          <BookOpen size={11} aria-hidden className="hidden 2xl:block" />
          <span className="2xl:hidden [writing-mode:vertical-rl]">FIELD MANUAL</span>
          <span className="hidden 2xl:inline">FIELD MANUAL</span>
        </Link>
        <ul className="space-y-0.5">
          {DOC_PAGES.map((p) => (
            <li key={p.slug} className="group relative">
              <Link
                to={`/docs/${p.slug}`}
                className="flex items-center gap-2 rounded-md px-1.5 py-1 font-mono text-[11px] text-lo/80 transition-colors duration-140 hover:bg-arc-faint hover:text-arc"
                aria-label={`${p.no} ${p.title}`}
              >
                <span>{p.no}</span>
                <span className="hidden whitespace-nowrap font-sans text-[12px] 2xl:inline">{p.title}</span>
              </Link>
              <span
                aria-hidden
                className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 pl-2 opacity-0 transition-opacity duration-140 group-hover:opacity-100 2xl:hidden"
              >
                <span className="whitespace-nowrap rounded-lg border border-arc-dim/40 bg-void-1/95 px-2.5 py-1 text-[11px] text-hi backdrop-blur-xl">
                  {p.title}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

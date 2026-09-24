import { Link } from "react-router-dom";
import { DOC_PAGES } from "../../content/docs-nav";

/**
 * 首页常驻侧边二级导航轨（xl+）：手册 9 章窄轨，hover 向右浮出章名。
 * 只占 ≈40px，不推让 Landing 居中版心；动效仅 L1（140ms 色彩/透明）。
 */
export function DocsSideRail() {
  return (
    <nav aria-label="操作手册侧栏" className="fixed left-3 top-1/2 z-20 hidden -translate-y-1/2 xl:block">
      <Link
        to="/docs"
        className="mb-4 block font-mono text-[9px] tracking-[0.3em] text-lo transition-colors duration-140 hover:text-arc [writing-mode:vertical-rl]"
        title="文档首页"
      >
        FIELD MANUAL
      </Link>
      <ul className="space-y-1">
        {DOC_PAGES.map((p) => (
          <li key={p.slug} className="group relative">
            <Link
              to={`/docs/${p.slug}`}
              className="flex items-center rounded px-1.5 py-0.5 font-mono text-[11px] text-lo/80 transition-colors duration-140 hover:text-arc"
              aria-label={`${p.no} ${p.title}`}
            >
              {p.no}
              <span
                aria-hidden
                className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 pl-2 opacity-0 transition-opacity duration-140 group-hover:opacity-100"
              >
                <span className="whitespace-nowrap rounded-lg border border-arc-dim/40 bg-void-1/95 px-2.5 py-1 text-[11px] text-hi backdrop-blur-xl">
                  {p.title}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

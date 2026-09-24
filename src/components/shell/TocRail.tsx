import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { DOC_PAGES } from "../../content/docs-nav";

/** 右栏本页 TOC（xl 显示）：IO 高亮当前小节，layoutId 圆点滑动 */
export function TocRail({ slug }: { slug: string }) {
  const page = DOC_PAGES.find((p) => p.slug === slug);
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!page) return;
    setActive(page.toc[0]?.id ?? "");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    for (const s of page.toc) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [page]);

  if (!page || page.toc.length === 0) return null;
  return (
    <aside className="hidden w-44 shrink-0 xl:block">
      <div className="sticky top-24 pt-8">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-lo">On this page</p>
        <nav aria-label="本页小节" className="space-y-1">
          {page.toc.map((t) => (
            <a key={t.id} href={`#${t.id}`} className={`relative block py-1 pl-3 text-[12px] transition-colors duration-140 ${active === t.id ? "text-arc" : "text-lo hover:text-mid"}`}>
              {active === t.id && (
                <motion.span
                  layoutId="toc-dot"
                  aria-hidden
                  className="absolute left-0 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-arc"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {t.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

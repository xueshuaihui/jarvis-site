import { FOOTER } from "../../content/copy";
import { ReactorLogo } from "../hud/ReactorLogo";

/** Footer：灰版 Logo + GitHub 链接 + 回顶。无动画。 */
export function Footer() {
  return (
    <footer className="relative z-10 border-t border-arc-dim/30 bg-void-1/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 font-mono text-xs text-lo md:flex-row md:justify-between md:px-8">
        <div className="flex items-center gap-2.5">
          <ReactorLogo size={20} dim />
          <span>{FOOTER.tagline}</span>
        </div>
        <div className="flex items-center gap-6">
          {FOOTER.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="transition-colors duration-140 hover:text-arc">
              {l.label}
            </a>
          ))}
          <a href="#hero" className="transition-colors duration-140 hover:text-arc">
            ↑ TOP
          </a>
        </div>
      </div>
    </footer>
  );
}

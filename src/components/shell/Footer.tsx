import { Link } from "react-router-dom";
import { FOOTER } from "../../content/copy";
import { ReactorLogo } from "../hud/ReactorLogo";

/** Footer：灰版 Logo + 文档区内链（F3 拍板：首页互链走卡片+Footer）+ GitHub 链接 + 回顶。无动画。 */
export function Footer() {
  return (
    <footer className="relative z-10 border-t border-arc-dim/30 bg-void-1/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 font-mono text-xs text-lo md:flex-row md:justify-between md:px-8">
        <div className="flex items-center gap-2.5">
          <ReactorLogo size={20} dim />
          <span>{FOOTER.tagline}</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link to="/docs" className="text-arc/80 transition-colors duration-140 hover:text-arc">
            操作手册
          </Link>
          <Link to="/docs/agent" className="transition-colors duration-140 hover:text-arc">
            Agent 接入
          </Link>
          <Link to="/docs/changelog" className="transition-colors duration-140 hover:text-arc">
            版本记录
          </Link>
          {FOOTER.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="transition-colors duration-140 hover:text-arc">
              {l.label}
            </a>
          ))}
          <Link to="/" onClick={() => window.scrollTo({ top: 0 })} className="transition-colors duration-140 hover:text-arc">
            ↑ TOP
          </Link>
        </div>
      </div>
    </footer>
  );
}

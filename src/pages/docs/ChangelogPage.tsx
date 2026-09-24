import { ArrowUpRight } from "lucide-react";
import { docPage } from "../../content/docs-nav";
import { ASSET_NOTES, CHANGELOG, CHANGELOG_NOTES } from "../../content/manual";
import { LINKS } from "../../content/copy";
import { PageHeader, Section, UL } from "../../components/prose/primitives";
import { Callout } from "../../components/prose/Callout";
import { BracketFrame } from "../../components/hud/BracketFrame";

const meta = docPage("changelog")!;

/** /docs/changelog 版本记录（F4-d 拍板新增）：全站版本号唯一豁免面 */
export default function ChangelogPage() {
  return (
    <div>
      <PageHeader meta={meta} />

      <Callout tone="info" title="通道口径">
        <p>{CHANGELOG_NOTES[0]}</p>
        <p>{CHANGELOG_NOTES[1]}</p>
        <p>{CHANGELOG_NOTES[2]}</p>
      </Callout>

      <Section id="log" title="发布历史">
        <ol className="space-y-6">
          {CHANGELOG.map((r) => (
            <li key={r.version}>
              <BracketFrame className="rounded-lg">
                <div className="rounded-lg border border-arc-dim/20 bg-void-1/60 p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-mono text-[15px] font-semibold text-hi">{r.version}</h3>
                      {r.current ? (
                        <span className="rounded-full border border-gold/60 bg-gold/10 px-2 py-0.5 font-mono text-[10px] text-gold">当前推荐</span>
                      ) : (
                        <span className="rounded-full border border-arc-dim/40 px-2 py-0.5 font-mono text-[10px] text-lo">prerelease</span>
                      )}
                    </div>
                    <time className="font-mono text-[11px] text-lo">{r.date}</time>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-arc/90">{r.headline}</p>
                  <ul className="mt-3 space-y-1.5">
                    {r.points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-[13px] leading-6 text-mid">
                        <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-arc/60" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </BracketFrame>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="assets" title="产物与校验">
        <UL items={ASSET_NOTES} />
        <a
          href={LINKS.releases}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-arc transition-colors duration-140 hover:text-gold"
        >
          打开 GitHub Releases 查看完整资产 <ArrowUpRight size={13} />
        </a>
      </Section>
    </div>
  );
}

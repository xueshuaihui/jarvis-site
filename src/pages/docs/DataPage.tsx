import { Link } from "react-router-dom";
import { docPage } from "../../content/docs-nav";
import {
  AUDIT_FACTS,
  BACKUP_FACTS,
  BOUNDARY_POINTS,
  DATA_DIR_TREE,
  ERROR_CODES,
  FACTS,
  MIGRATION_FACTS,
  TROUBLE_OPS,
  TROUBLE_STARTUP,
} from "../../content/manual";
import { PageHeader, Section, P, UL, Code } from "../../components/prose/primitives";
import { ProseTable } from "../../components/prose/ProseTable";
import { Callout } from "../../components/prose/Callout";

const meta = docPage("data")!;

/** /docs/data 数据与安全（手册 §6、§7） */
export default function DataPage() {
  return (
    <div>
      <PageHeader meta={meta} />

      <Section id="boundary" title="本地优先的网络边界">
        <ProseTable head={["边界", "规则"]} rows={BOUNDARY_POINTS.map((b) => [b.t, b.d])} />
        <Callout tone="info" title="一句话">
          <p>这台电脑自己就是一个完整的指挥所：不上传、不出网、不依赖远端，拔掉网线功能完整。</p>
        </Callout>
      </Section>

      <Section id="backup" title="备份与恢复">
        <UL items={BACKUP_FACTS} />
      </Section>

      <Section id="portable" title="数据导入导出">
        <UL
          items={[
            "导出：设置 → 数据 → JSON 导出（可选范围 / 是否含归档），拿到的是带文件名的下载。",
            "导入四步：选文件 → 预览 → 冲突策略（跳过 / 覆盖）→ 确认。确认前服务端先备份当前库，结果页给出该备份文件名。",
            "换机迁移：拷走整个数据目录即完整迁移（见下文目录结构）。",
          ]}
        />
      </Section>

      <Section id="audit" title="审计日志">
        <UL items={AUDIT_FACTS} />
      </Section>

      <Section id="dir" title="数据目录与迁移">
        <P>一切业务数据都在这一个目录里（日志独立在系统日志目录，备份不含日志）：</P>
        <div className="my-5 overflow-hidden rounded-xl border border-arc-dim/30 bg-void-0/80 p-4 font-mono text-[12px] leading-7">
          {DATA_DIR_TREE.map(([line, note]) => (
            <p key={line} className={line.startsWith(FACTS.dataDir) ? "text-arc" : "text-mid"}>
              {line}
              <span className="ml-3 text-lo"># {note}</span>
            </p>
          ))}
        </div>
        <UL items={MIGRATION_FACTS} />
        <Callout tone="warn" title="迁移是一次性的、不可逆的">
          <p>
            首启搬迁成功后旧库被封存为 <Code>atb.db.migrated</Code>、旧目录留下 MIGRATED.md 指引——想回退 v0.0.3 请找迁移前自动备份。详见
            <Link to="/docs/install" className="text-arc underline decoration-arc/40"> 安装与起步 · 升级与旧数据</Link>。
          </p>
        </Callout>
      </Section>

      <Section id="trouble" title="故障排查">
        <ProseTable head={["现象", "原因 / 处理"]} rows={TROUBLE_STARTUP.map((t) => [t.symptom, t.fix])} />
        <P>操作层「像是 bug 其实不是」的拦截：</P>
        <UL items={TROUBLE_OPS} />
      </Section>

      <Section id="codes" title="错误码速查">
        <P>给自研执行器与排障用（REST 与 MCP 同一份码表；MCP 侧以 isError + structuredContent.code 承载）：</P>
        <ProseTable
          head={["状态码", "错误名", "含义", "处理"]}
          rows={ERROR_CODES.map((e) => [
            <span key="c" className="tnum text-hi">{e.code}</span>,
            <Code key="n">{e.name}</Code>,
            e.meaning,
            e.fix,
          ])}
        />
      </Section>
    </div>
  );
}

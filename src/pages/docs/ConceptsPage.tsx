import { Link } from "react-router-dom";
import { docPage } from "../../content/docs-nav";
import { ARTIFACT_KINDS, CUSTOM_FIELD_RULES, FACTS, SETTINGS_KEYS, STATES, TOKEN_TYPES } from "../../content/manual";
import { PageHeader, Section, P, UL, Code } from "../../components/prose/primitives";
import { ProseTable } from "../../components/prose/ProseTable";
import { Callout } from "../../components/prose/Callout";
import { StateChip } from "../../components/prose/StateChip";
import { TransitionMatrix } from "../../components/prose/TransitionMatrix";

const meta = docPage("concepts")!;

/** /docs/concepts 核心概念（手册 §3）：七态 + 交互版流转矩阵是本页招牌件 */
export default function ConceptsPage() {
  return (
    <div>
      <PageHeader meta={meta} />

      <Section id="states" title="任务与七状态">
        <P>
          看板固定 <strong className="text-hi">7 列 = 7 状态</strong>，列顺序不变；「过滤」只影响卡片的显示，不改变列本身。每块任务永远落在自己状态对应的列里：
        </P>
        <ProseTable
          head={["状态", "枚举", "由谁产生", "含义"]}
          rows={STATES.map((s) => [
            <StateChip key={s.key} state={s.key} small />,
            <Code key={s.enumName}>{s.enumName}</Code>,
            s.who,
            s.meaning,
          ])}
        />
      </Section>

      <Section id="matrix" title="状态流转矩阵">
        <P>
          谁能把任务拖去哪，由一份前后端共用的流转矩阵决定（服务端兜底，界面放行的操作接口层不会二次拒绝）。
          鼠标悬停任意格子看具体理由：
        </P>
        <TransitionMatrix />
        <Callout tone="info" title="为什么这么严">
          <p>
            这套矩阵就是「人建任务、Agent 执行、必经人工审核」三条铁律的代码化形态：
            <Link to="/docs/review" className="text-arc underline decoration-arc/40"> 审核流程 </Link>
            锁死 REVIEW 出口，
            <Link to="/docs/agent" className="text-arc underline decoration-arc/40"> 认领与租约 </Link>
            锁死 RUNNING 入口。
          </p>
        </Callout>
      </Section>

      <Section id="review-contract" title="产出物与强制审核">
        <UL
          items={[
            <>产出物是 Agent 执行中交付的文件或链接，共 {ARTIFACT_KINDS.length} 类：<Code>{ARTIFACT_KINDS.join(" / ")}</Code>。</>,
            "产出物挂在「执行记录（Run）」上；审核发生在任务层面——Agent 完成交付后任务进「待审核」，人通过才 DONE、驳回则退回可执行状态。",
            <>上传限额：单文件 ≤<Code>{FACTS.artifactMaxMb}MB</Code>（可配置），单 Run 累计 ≤{FACTS.artifactRunMaxMb}MB；link 类型不占额度。</>,
            <>查看交付内容走一次性 HMAC 签名 URL（{FACTS.signUrlTtl} 秒有效），响应强制 nosniff + CSP sandbox，防止 Agent 内容被当脚本执行。</>,
          ]}
        />
      </Section>

      <Section id="tokens" title="鉴权：UI 与 Agent 两面">
        <P>v0.0.4 起没有账号体系，鉴权只回答一个问题——「这是人用的界面，还是 Agent 用的接口？」两套凭证互斥：</P>
        <ProseTable
          head={["凭证", "作用域", "怎么获得", "要点"]}
          rows={TOKEN_TYPES.map((t) => [t.name, t.scope, t.how, <ul key={t.name} className="space-y-1">{t.notes.map((n) => <li key={n}>{n}</li>)}</ul>])}
        />
        <P>跨面调用一律 403：Agent Token 动不了你的界面接口，UI Token 也走不了 Agent 的写回通道。</P>
      </Section>

      <Section id="lease" title="租约与心跳">
        <UL
          items={[
            <>认领成功即建立租约，时长 <Code>lease_ttl_minutes</Code>（默认 {FACTS.leaseTtlDefault} 分钟）。执行中的卡片上能看到租约倒计时与进度条。</>,
            <>Agent 按 <Code>heartbeat_interval_seconds</Code>（建议 {FACTS.heartbeatDefault} 秒）周期性续租。</>,
            <>租约过期任务自动转「异常」——<strong className="text-hi">谁在干什么、还干不干得下去，永远查得到</strong>。</>,
            "并发认领由 SQLite 事务原子保证：同一任务只会有一个持有者。",
          ]}
        />
      </Section>

      <Section id="custom-fields" title="自定义字段">
        <P>让看板长出你团队自己的维度——字段定义驱动创建表单与看板卡片：</P>
        <UL items={CUSTOM_FIELD_RULES} />
      </Section>

      <Section id="settings-keys" title="设置键总表">
        <P>
          设置改动即写库、热生效（无需重启）；仅 <Code>backup_keep</Code> 下次启动生效。越界写入返回 422，端口不在设置内。
          界面入口在「设置 → 通用 / Token」（详见 <Link to="/docs/org" className="text-arc underline decoration-arc/40">分组与设置</Link>）：
        </P>
        <ProseTable
          head={["设置键", "类型 / 区间", "默认", "热生效"]}
          rows={SETTINGS_KEYS.map((k) => [
            <>
              <Code key="c">{k.key}</Code>
              {k.note ? <span className="ml-2 text-[11px] text-lo">· {k.note}</span> : null}
            </>,
            k.range,
            <span key="d" className="tnum">{k.def}</span>,
            k.hot ? "✓" : "✗",
          ])}
        />
      </Section>
    </div>
  );
}

import { Link } from "react-router-dom";
import { docPage } from "../../content/docs-nav";
import {
  BREAKDOWN_STEPS,
  CREATION_MODES,
  CREATION_NOTES,
  FACTS,
  GROUP_DIMENSIONS,
  GROUP_FACTS,
  GROUP_LAYERS,
  SETTINGS_TABS,
} from "../../content/manual";
import { PageHeader, Section, P, UL, Code } from "../../components/prose/primitives";
import { ProseTable } from "../../components/prose/ProseTable";
import { Callout } from "../../components/prose/Callout";
import { StepsBlock } from "../../components/prose/StepsBlock";

const meta = docPage("org")!;

/** /docs/org 分组、设置与协作链路（手册 §3.7、§4.7、§4.9、§4.11、§4.12） */
export default function OrgPage() {
  return (
    <div>
      <PageHeader meta={meta} />

      <Section id="group-model" title="分组三层模型">
        <P>三个容易混的「分组」概念，先分清：</P>
        <ProseTable head={["层", "语义", "落在哪"]} rows={GROUP_LAYERS.map((g) => [<Code key={g.name}>{g.name}</Code>, g.semantic, g.where])} />
        <P>
          分组维度实际 {GROUP_DIMENSIONS.length} 个：{GROUP_DIMENSIONS.join(" / ")}（标签维度可一卡多组）。
        </P>
      </Section>

      <Section id="group-page" title="分组页与泳道操作">
        <UL items={GROUP_FACTS} />
        <P>
          看板上的分组操作集中在两处：工具栏「分组」选择器（主维度单选 + 次维度下拉，点「应用」才提交），
          以及泳道头的 <Code>⋯</Code> 菜单（重命名 / 折叠 / 只看本组 / 隐藏 / 组内排序 / 导出 / 归档分组）。
          分组切换器多选超过一个时，主维度自动切为分组。
        </P>
      </Section>

      <Section id="settings" title="设置中心九 Tab">
        <P>
          没有「保存」按钮——改动即写库热生效。Tab 值可深链直达（<Code>#/settings?tab=tokens</Code>），未知值回落「通用」。
        </P>
        <ProseTable head={["Tab", "可配置 / 操作"]} rows={SETTINGS_TABS.map((t) => [t.name, t.what])} />
        <Callout tone="info" title="两个细节">
          <p>
            自动备份（<Code>backup_time</Code> / <Code>backup_keep</Code>）存在于设置契约但阶段一不进表单——当前只有手动备份。
            看板偏好（分组方式 / 视图参数）不在设置里，走独立的 prefs 持久化，工具栏改了就存。
          </p>
        </Callout>
      </Section>

      <Section id="breakdown" title="需求拆解链路">
        <P>「一段需求 → 一组带依赖的任务草案」的确认链路：Agent 拆解上报，人侧确认后落库。</P>
        <StepsBlock items={BREAKDOWN_STEPS.map((s) => ({ title: s.who, body: <p>{s.what}</p> }))} />
        <Callout tone="warn" title="5 秒撤销窗口">
          <p>
            点「确认创建」后不会立即落库：倒计时 {FACTS.undoWindowSec} 秒内点「撤销」= 零副作用，归零才真正提交。
            这是拍板过的防误触设计（需求 §7.8），不是卡顿。
          </p>
        </Callout>
        <P>
          超时收敛：拆解会话 <Code>receiving</Code> 超 30 分钟无进展、<Code>reviewing</Code> 超 7 天未确认会被定时任务收掉，届时不可再确认；抢先流转后写端点统一 409。
        </P>
      </Section>

      <Section id="creation" title="会话直建三模式">
        <P>
          Agent 在对话里直接建任务（不等认领队列），确认强度由 <Code>agent_creation_mode</Code> 决定——入口「设置 → 通用 → Agent 创建任务」：
        </P>
        <ProseTable
          head={["模式", "行为", "兜底"]}
          rows={CREATION_MODES.map((m) => [m.key === "light" ? `${m.name}（默认）` : m.name, m.what, m.undo])}
        />
        <UL items={CREATION_NOTES} />
        <Callout tone="info" title="三模式的优先级">
          <p>
            单次请求可用 <Code>confirmation_mode</Code> 参数覆盖全局设置；「轻确认」卡片带倒计时条，超时按不创建处理——
            详见 <Link to="/docs/agent" className="text-arc underline decoration-arc/40">Agent 接入 · board.* 工具</Link>。
          </p>
        </Callout>
      </Section>
    </div>
  );
}

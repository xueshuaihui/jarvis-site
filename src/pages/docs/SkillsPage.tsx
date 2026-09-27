import { Link } from "react-router-dom";
import { docPage } from "../../content/docs-nav";
import {
  FACTS,
  SKILL_BLOCKS,
  SKILL_DETAIL_TABS,
  SKILL_EDITOR_MODES,
  SKILL_PUBLISH_CHECKS,
  SKILL_SOURCES,
  SKILL_TYPES,
} from "../../content/manual";
import { PageHeader, Section, P, UL, Code } from "../../components/prose/primitives";
import { ProseTable } from "../../components/prose/ProseTable";
import { Callout } from "../../components/prose/Callout";

const meta = docPage("skills")!;

/** /docs/skills 技能工作台（手册 §3.8、§4.10） */
export default function SkillsPage() {
  return (
    <div>
      <PageHeader meta={meta} />

      <Section id="sources" title="技能的三个来源">
        <P>技能 = 可复用的执行说明，随任务下发给 Agent。三个来源，权限边界完全不同：</P>
        <ProseTable
          head={["来源", "怎么来", "规则"]}
          rows={SKILL_SOURCES.map((s) => [<Code key={s.key}>{s.name}</Code>, s.how, s.note])}
        />
        <Callout tone="info" title="身份与命名">
          <p>
            技能允许重名——身份由唯一 id 决定并随导出/导入持久；导入冲突按「同 ID」判定。两级分类（{FACTS.skillCategoryGroups} 个一级 / {FACTS.skillCategories} 个叶子）+ 自由标签共同支撑检索。
          </p>
        </Callout>
      </Section>

      <Section id="anatomy" title="类型与块模型">
        <P>
          技能 {FACTS.skillTypes} 类型：
          <Code>{SKILL_TYPES.join(" / ")}</Code>。正文由 {FACTS.blockKinds} 类「块」组装：
        </P>
        <div className="my-4 flex flex-wrap gap-2">
          {SKILL_BLOCKS.map((b) => (
            <span key={b} className={`rounded-md border px-2 py-0.5 font-mono text-[11px] ${b === "human" ? "border-gold/50 text-gold" : "border-arc-dim/40 text-lo"}`}>
              {b}
            </span>
          ))}
        </div>
        <Callout tone="warn" title="人工块（human）">
          <p>
            技能流程里放了人工块的，Agent 执行到这里会把任务上报为
            <strong className="text-hi">「人工阻塞」</strong>并附处理指引——你去处理（线下审批、补物料等），处理完把任务拖回「待执行」，
            Agent 用 <Code>wait_for_resume</Code> 等的就是这一步。
          </p>
        </Callout>
      </Section>

      <Section id="editor" title="编辑器与画布">
        <P>四个模式共用同一份块 JSON，切换即同步：</P>
        <ProseTable head={["模式", "形态"]} rows={SKILL_EDITOR_MODES.map((m) => [m.name, m.what])} />
        <P>默认技能三模式与画布全只读（随安装包更新）；想改造，从页顶横幅「复制为自定义技能」起步。</P>
      </Section>

      <Section id="versioning" title="发布、版本与测试">
        <UL
          items={[
            "语义化版本；「发布」产生版本快照——纯本地动作，可回滚到任意历史版。",
            ...SKILL_PUBLISH_CHECKS,
            "测试用例随版本快照保存，可在详情抽屉「测试」Tab 输入→运行→看 logs/output，也可批量跑。",
          ]}
        />
        <P>详情抽屉五个 Tab：{SKILL_DETAIL_TABS.join(" / ")}。</P>
      </Section>

      <Section id="import" title="导入与导出">
        <UL
          items={[
            <>导入三种格式：<Code>.atskill</Code>（本工具包）、<Code>SKILL.md</Code>（通用 Markdown+frontmatter）、Cursor <Code>.mdc</Code>。</>,
            "导出同样两路：.atskill 与 SKILL.md；frontmatter 必带唯一 id，保证跨机导入身份不断。",
            <>还支持本机目录扫描导入（技能源配置 + 一键扫描；git/http 源未实现，调用回 501）。</>,
          ]}
        />
      </Section>

      <Section id="binding" title="技能绑定任务">
        <UL
          items={[
            "任务详情「技能」Tab 增删绑定（全量提交）；候选含草稿与已发布（排除归档），选择器带搜索与循环引用检测。",
            "Agent 认领时，按绑定版本把技能正文与 MCP 依赖随任务下发。",
            "卡片上的技能角标只反映手动绑定——系统不会按任务描述「推荐」技能。",
          ]}
        />
        <Callout tone="info" title="往下读">
          <p>Agent 侧只读面三工具（list / get / search_skills）与技能在闭环里的用法，见 <Link to="/docs/agent" className="text-arc underline decoration-arc/40">Agent 接入 · 工具参考</Link>。</p>
        </Callout>
      </Section>
    </div>
  );
}

import { Link } from "react-router-dom";
import { docPage } from "../../content/docs-nav";
import {
  BOARD_KEYS,
  CREATE_ENTRIES,
  CREATE_FIELDS,
  DETAIL_TABS,
  FACTS,
  FILTER_PRESETS,
  NAV_PAGES,
  NAV_TOPBAR,
  TASK_LIST_FILTERS,
} from "../../content/manual";
import { PageHeader, Section, P, UL, Code } from "../../components/prose/primitives";
import { ProseTable } from "../../components/prose/ProseTable";
import { Callout } from "../../components/prose/Callout";
import { KbdList } from "../../components/prose/KbdList";

const meta = docPage("board")!;

/** /docs/board 看板与任务（手册 §4.1–4.4、§4.6） */
export default function BoardPage() {
  return (
    <div>
      <PageHeader meta={meta} />

      <Section id="nav-map" title="界面导航">
        <P>左导航五页 + 顶部工具栏，打开窗口即是工作台：</P>
        <ProseTable head={["页面", "路由", "作用"]} rows={NAV_PAGES.map((p) => [p.name, <Code key={p.route}>{p.route}</Code>, p.role])} />
        <UL items={NAV_TOPBAR} />
        <Callout tone="info" title="任务列表页">
          <p>
            <Code>/tasks</Code> 不进主导航——由看板工具栏「列表」视图跳入；筛选状态与看板共用同一份 store。
          </p>
        </Callout>
      </Section>

      <Section id="views" title="三视图与分组呈现">
        <UL
          items={[
            <>看板工具栏段控件切换 <strong className="text-hi">看板 / 列表 / 流程图</strong> 三视图：看板与流程图同页切换（偏好持久化），列表是独立页面。</>,
            "列 = 状态且恒为 7 列——过滤只影响显示哪些卡片，不隐藏列本身。",
            <>呈现分组支持主 / 次维度（7 个维度可选，见 <Link to="/docs/org" className="text-arc underline decoration-arc/40">分组三层模型</Link>）、泳道折叠与拖排。</>,
            <>看板每列默认最多渲染 <Code>{FACTS.boardColLimit}</Code> 张卡（可配置），其余折叠在列底。</>,
            <>「执行中」卡片额外显示：租约倒计时、进度条与百分比；租约过期变红。</>,
          ]}
        />
      </Section>

      <Section id="drag-keys" title="拖拽与键盘操作">
        <P>
          用鼠标把卡片拖到目标列，落点合法性由
          <Link to="/docs/concepts" className="text-arc underline decoration-arc/40"> 流转矩阵 </Link>
          判定：合法直接改状态；需表单的先弹表单（审核 / 强制停止）；禁止的只提示不动。跨分组拖拽若改变归属会先弹确认。
        </P>
        <KbdList items={BOARD_KEYS} />
      </Section>

      <Section id="create" title="创建任务">
        <P>四个入口：</P>
        <UL items={CREATE_ENTRIES} />
        <P>快速创建表单字段：</P>
        <ProseTable
          head={["字段", "必填", "约束"]}
          rows={CREATE_FIELDS.map((f) => [f.name, f.req ? "✓" : "—", f.rule])}
        />
        <Callout tone="warn" title="两个行为约定">
          <p>普通「新建任务」落需求池；「新建并进待执行」= 创建后再流转一步。必填自定义字段没填齐时任务留在需求池，流转「待执行」会被 422 拦下。</p>
        </Callout>
      </Section>

      <Section id="detail" title="任务详情七 Tab">
        <P>点卡片（或 Space）打开右侧抽屉：</P>
        <ProseTable head={["Tab", "内容与规则"]} rows={DETAIL_TABS.map((t) => [t.name, t.what])} />
        <P>
          底部状态动作按钮全部由流转矩阵生成（确认可执行 / 重试 / 退回需求池 / 强制停止 / 审核 / 归档 / 删除），危险动作需二次确认。
          <strong className="text-hi">执行中（RUNNING）禁止编辑字段</strong>——停止或完成后再改。
        </P>
      </Section>

      <Section id="filters" title="筛选、搜索与排序">
        <P>
          看板过滤为「分段选择器（视图作用域）+ 条件 chip」的统一模型：预设 <strong className="text-hi">{FILTER_PRESETS.join(" / ")}</strong>，
          叠加优先级 / 标签 / 类型 chip；chip 上逐条 × 或「清除全部」复位——注意「全部」只复位视图作用域，不清条件 chip。
        </P>
        <UL items={TASK_LIST_FILTERS} />
        <Callout tone="info" title="全局搜索">
          <p>任意页面 ⌘K 唤起：搜任务标题 / ID，↑↓ 移动、Enter 直接打开任务详情。</p>
        </Callout>
      </Section>
    </div>
  );
}

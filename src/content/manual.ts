/* ============================================================
   文档区（/docs/*）数据中枢——《二级页面架构与内容设计》§6 治理：
   所有页面结构与数字事实集中于此，页组件不写字面数字。
   出处：agent-task-board《系统操作使用手册》§n（下称 M）、
   《任务创建模版（Agent 协助）》（T）、发版记录/tag 注记（R）。
   事实口径锁 v0.0.4-beta.8；update_task/update_skill 已随 beta.7 发布，工具面必须收录。
   ============================================================ */

/* ---------------- 通用事实数字 ---------------- */

export const FACTS = {
  mcpPort: 7788,
  mcpEndpoint: "http://127.0.0.1:7788/mcp",
  toolCount: 28,
  defaultSkills: 125,
  skillTypes: 7,
  blockKinds: 15,
  skillCategories: 16,
  skillCategoryGroups: 7,
  leaseTtlDefault: 30,
  heartbeatDefault: 300,
  artifactMaxMb: 20,
  artifactRunMaxMb: 200,
  groupCap: 50,
  auditPageSize: 50,
  boardColLimit: 50,
  titleMax: 200,
  descMax: 20000,
  tagMax: 10,
  tagLenMax: 16,
  capMax: 20,
  dependsMax: 50,
  reviewOpinionMax: 2000,
  signUrlTtl: 60,
  lightConfirmTimeout: 30,
  undoWindowSec: 5,
  dataDir: "~/.jarvis-workbench",
  legacyDir: "~/.agent-board",
  dbFile: "jarvis.db",
} as const;

/* ---------------- /docs/concepts ---------------- */

export type StateKey = "backlog" | "ready" | "running" | "blocked" | "review" | "done" | "failed";

export const STATES: { key: StateKey; label: string; enumName: string; color: string; who: string; meaning: string }[] = [
  { key: "backlog", label: "需求池", enumName: "BACKLOG", color: "var(--color-st-backlog)", who: "人", meaning: "新建任务默认落此列，尚未可执行。" },
  { key: "ready", label: "待执行", enumName: "READY", color: "var(--color-st-ready)", who: "人", meaning: "已具备执行条件，等待 Agent 认领。" },
  { key: "running", label: "执行中", enumName: "RUNNING", color: "var(--color-st-running)", who: "仅 Agent", meaning: "Agent 已认领并持租约执行，只能由认领产生。" },
  { key: "blocked", label: "人工阻塞", enumName: "BLOCKED", color: "var(--color-st-blocked)", who: "仅 Agent", meaning: "执行到技能的「人工块」时上报转人工，等人处理后回待执行。" },
  { key: "review", label: "待审核", enumName: "REVIEW", color: "var(--color-st-review)", who: "Agent 交付", meaning: "Agent 已完成交付，只有人工审核能决定它的去向。" },
  { key: "done", label: "已完成", enumName: "DONE", color: "var(--color-st-done)", who: "人（审核）", meaning: "审核通过，终态；归档后可恢复。" },
  { key: "failed", label: "异常", enumName: "FAILED", color: "var(--color-st-failed)", who: "系统/人", meaning: "强制停止、租约过期或执行失败，可重试。" },
];

/** 流转矩阵：k = self | direct | form | forbid；why 为 hover 说明 */
export type CellKind = "self" | "direct" | "form" | "forbid";
export type Cell = { k: CellKind; why: string };
export const TRANSITION_ROWS: { from: StateKey; cells: Cell[] }[] = [
  {
    from: "backlog",
    cells: [
      { k: "self", why: "当前列" },
      { k: "direct", why: "直接生效：确认可执行" },
      { k: "forbid", why: "禁止：RUNNING 只能由 Agent 认领产生" },
      { k: "forbid", why: "禁止：BLOCKED 只能由 Agent 上报产生" },
      { k: "forbid", why: "禁止：需先进入待执行" },
      { k: "forbid", why: "禁止：需先进入待执行" },
      { k: "forbid", why: "禁止：需先进入待执行" },
    ],
  },
  {
    from: "ready",
    cells: [
      { k: "direct", why: "直接生效：退回需求池" },
      { k: "self", why: "当前列" },
      { k: "forbid", why: "禁止：RUNNING 只能由 Agent 认领产生" },
      { k: "forbid", why: "禁止：BLOCKED 只能由 Agent 上报产生" },
      { k: "forbid", why: "禁止：需 Agent 执行并交付后进入" },
      { k: "forbid", why: "禁止：需 Agent 执行并交付后进入" },
      { k: "forbid", why: "禁止：需 Agent 执行并交付后进入" },
    ],
  },
  {
    from: "running",
    cells: [
      { k: "forbid", why: "禁止：执行中不可直接退回" },
      { k: "forbid", why: "禁止：执行中不可直接退回" },
      { k: "self", why: "当前列" },
      { k: "forbid", why: "禁止：只由 Agent 端点产生" },
      { k: "forbid", why: "禁止：由 Agent complete 回写进入" },
      { k: "forbid", why: "禁止：由 Agent complete + 人工审核进入" },
      { k: "form", why: "强制停止表单：填写后转异常" },
    ],
  },
  {
    from: "blocked",
    cells: [
      { k: "direct", why: "直接生效：退回需求池" },
      { k: "direct", why: "直接生效：人工处理完，重试再认领" },
      { k: "forbid", why: "禁止：RUNNING 只能由 Agent 认领产生" },
      { k: "self", why: "当前列" },
      { k: "forbid", why: "禁止：需重新执行并交付" },
      { k: "forbid", why: "禁止：需重新执行并交付" },
      { k: "forbid", why: "禁止：需重新执行并交付" },
    ],
  },
  {
    from: "review",
    cells: [
      { k: "form", why: "审核表单：驳回退回需求池" },
      { k: "form", why: "审核表单：驳回退回待执行" },
      { k: "forbid", why: "禁止：审核出口只有三条" },
      { k: "forbid", why: "禁止：审核出口只有三条" },
      { k: "self", why: "当前列" },
      { k: "form", why: "审核表单：通过 → 已完成" },
      { k: "forbid", why: "禁止：审核出口只有三条" },
    ],
  },
  {
    from: "done",
    cells: [
      { k: "forbid", why: "禁止：终态（归档后可恢复回需求池/待执行）" },
      { k: "forbid", why: "禁止：终态（归档后可恢复回需求池/待执行）" },
      { k: "forbid", why: "禁止：终态" },
      { k: "forbid", why: "禁止：终态" },
      { k: "forbid", why: "禁止：终态" },
      { k: "self", why: "当前列" },
      { k: "forbid", why: "禁止：终态" },
    ],
  },
  {
    from: "failed",
    cells: [
      { k: "direct", why: "直接生效：退回需求池" },
      { k: "direct", why: "直接生效：重试" },
      { k: "forbid", why: "禁止：RUNNING 只能由 Agent 认领产生" },
      { k: "forbid", why: "禁止：BLOCKED 只能由 Agent 上报产生" },
      { k: "forbid", why: "禁止：需重新执行并交付" },
      { k: "forbid", why: "禁止：需重新执行并交付" },
      { k: "self", why: "当前列" },
    ],
  },
];

export const MATRIX_NOTES = [
  "RUNNING 只能由 Agent 认领产生——人把卡片拖进「执行中」一律被拒。",
  "BLOCKED 只能由 Agent 上报产生（REST /blocked 端点或 MCP block_task）。",
  "REVIEW 的三条出口全部只能走审核接口，不能靠拖拽直接改。",
  "DONE 为终态；归档后可恢复回需求池/待执行。",
  "服务端以同一份流转矩阵兜底校验，界面放行的操作接口层不会二次拒绝。",
];

export const TOKEN_TYPES = [
  {
    name: "UI Token",
    scope: "前端全部接口 + WebSocket",
    how: "由桌面端自动生成注入，普通用户无需关心",
    notes: ["固定代表「本机的人」", "开发态退化为 dataDir/dev-ui-token 文件"],
  },
  {
    name: "Agent Token",
    scope: "Agent 经 MCP / REST 的全部写回与查询",
    how: "「设置 → Token」签发，格式 atb_ + 40 位，明文仅返回一次",
    notes: ["吊销而非删行，执行归属保留", "可携带 capabilities 过滤可认领任务", "两套接口面互斥，跨面调用一律 403"],
  },
];

export const ARTIFACT_KINDS = ["diff", "image", "text", "log", "markdown", "json", "html", "pdf", "link", "file"];

export const SETTINGS_KEYS: { key: string; range: string; def: string; hot: boolean; note?: string }[] = [
  { key: "lease_ttl_minutes", range: "1–1440", def: "30", hot: true, note: "认领租约时长" },
  { key: "heartbeat_interval_seconds", range: "30–600", def: "300", hot: true, note: "心跳建议周期" },
  { key: "board_column_limit", range: "10–200", def: "50", hot: true, note: "看板每列渲染上限" },
  { key: "auto_archive_days", range: "0–365", def: "30", hot: true, note: "已完成自动归档天数" },
  { key: "artifact_max_mb", range: "1–200", def: "20", hot: true, note: "产出物单文件上限" },
  { key: "backup_time", range: "off 或 HH:MM", def: "03:00", hot: true, note: "存在契约但不进设置页表单（阶段一仅手动备份）" },
  { key: "backup_keep", range: "1–30", def: "7", hot: false, note: "同上；改动下次启动生效" },
  { key: "log_retention_days", range: "1–90", def: "14", hot: true },
  { key: "log_level", range: "debug/info/warn/error", def: "info", hot: true },
  { key: "task_types", range: "数组 1–20", def: "需求/缺陷/子任务/巡检/重构", hot: true },
  { key: "ui_theme", range: "system/light/dark", def: "system", hot: true },
  { key: "review_reuse_last_opinion", range: "bool", def: "true", hot: true, note: "审核表单预填上次意见" },
  { key: "agent_creation_mode", range: "direct/light/silent", def: "light", hot: true, note: "Agent 会话直建确认模式" },
  { key: "light_confirm_timeout_seconds", range: "1–300", def: "30", hot: true },
  { key: "mcp_wake_mode", range: "single/continuous", def: "single", hot: true, note: "唤醒模式；改动需 MCP 客户端重连生效" },
];

export const CUSTOM_FIELD_RULES = [
  "key 唯一，正则 ^[a-z][a-z0-9_]{1,31}$；保存后 key 与 type 不可改。",
  "类型八种：text / textarea / number / select / multiselect / date / bool / url。",
  "全表最多 2 个字段可「显示在卡片」（限 text/number/select/bool）。",
  "required 字段必须在任务进入「待执行」前填齐，否则流转被 422 拒绝。",
  "删除仅当无任务引用，否则应「停用」。",
];

/* ---------------- /docs/board ---------------- */

export const NAV_PAGES = [
  { name: "看板", route: "/board", role: "主工作区：三视图 + 分组呈现，拖拽流转；工具栏含分组切换器与过滤 chip" },
  { name: "分组", route: "/groups", role: "分组独立列表页：增删改、归档、带任务迁移删除" },
  { name: "技能", route: "/skills", role: "技能库：三来源筛选、创建/导入、编辑器、版本发布与回滚" },
  { name: "审核", route: "/review", role: "待审核队列，逐条审核并自动跳下一条" },
  { name: "设置", route: "/settings", role: "九个 Tab：通用/视图/Token/字段定义/模板/数据/日志与审计/备份/关于" },
];

export const NAV_TOPBAR = [
  "全局搜索框：⌘/Ctrl + K 唤起，↑↓ 移动、Enter 打开任务",
  "主题三态切换：浅色 → 深色 → 跟随系统",
  "通知铃铛：未读角标，点击打开通知中心面板",
  "侧栏折叠：品牌菱形按钮，折叠态 64px，偏好有记忆",
];

export const BOARD_KEYS = [
  { k: "← / →", what: "在合法目标列之间移动卡片" },
  { k: "⌘ / Ctrl + P", what: "置顶 / 取消置顶" },
  { k: "Space / Enter", what: "打开任务详情抽屉" },
  { k: "⌘ / Ctrl + K", what: "全局搜索（任意页面）" },
];

export const CREATE_FIELDS: { name: string; req: boolean; rule: string }[] = [
  { name: "标题", req: true, rule: `必填，≤${FACTS.titleMax} 字` },
  { name: "描述", req: false, rule: "Markdown，给执行 Agent 的作业说明书" },
  { name: "类型", req: true, rule: "来自 task_types 词表（默认五类）" },
  { name: "优先级", req: false, rule: "0 紧急 / 1 高 / 2 中 / 3 低" },
  { name: "标签", req: false, rule: `逗号分隔，单标签 ≤${FACTS.tagLenMax} 字，每任务 ≤${FACTS.tagMax} 个` },
  { name: "归属分组", req: false, rule: "默认取分组切换器「恰好只选一个」的场景，否则留空=未分配" },
  { name: "所需能力", req: false, rule: `namespace:value 格式，≤${FACTS.capMax} 个` },
  { name: "自定义字段", req: false, rule: "由启用的字段定义驱动，模板可预填" },
];

export const CREATE_ENTRIES = [
  "看板工具栏「＋ 新建任务 ▾」（可选直接进待执行）",
  "列底「新建任务 / 新建并进待执行」",
  "任务列表页「新建」",
  "发给 AI 助手的创建模版（见 Agent 接入页）",
];

export const DETAIL_TABS = [
  { name: "概览", what: "标题行内编辑；字段编辑（描述/类型/优先级/标签/所需能力/截止时间/自定义字段），仅提交变化过的键；执行中禁止编辑" },
  { name: "执行", what: "当前与历史 Run、按 Run 归组的产出物、可展开实时日志" },
  { name: "审核", what: "审核 / 退回重跑入口，历史审核意见" },
  { name: "依赖", what: "前置与后继任务、依赖图" },
  { name: "评论", what: "仅新增，人写评论" },
  { name: "审计", what: "该任务全部操作留痕" },
  { name: "技能", what: "绑定/解绑技能（全量 PATCH），选择器带搜索与循环引用检测" },
];

export const FILTER_PRESETS = ["全部", "待审核", "可认领", "受阻", "异常"];

export const TASK_LIST_FILTERS = [
  "筛选面板：状态 / 优先级 / 类型 / 标签 / 自定义字段 / 归档 / 依赖状态",
  `搜索框：标题 / 描述 / ID，300ms 防抖，≤120 字`,
  "排序白名单：id / 优先级 / 状态 / 创建时间 / 更新时间（点列头切升降）",
  "分页：默认 50，上限 200",
];

/* ---------------- /docs/review ---------------- */

export const REVIEW_ENTRIES = [
  "看板把卡片拖进「待审核」列（弹出表单）",
  "任务详情抽屉「审核 / 退回重跑」按钮",
  "审核页行内「审核」按钮",
];

export const REVIEW_FORM = [
  "上半区：任务信息、执行摘要、内嵌 diff 预览、产出物列表、历史审核意见",
  `必填三项：审核建议 suggestion / 原因 reason / 详情 detail（单字段 ≤${FACTS.reviewOpinionMax} 字）`,
  "结论单选：通过 APPROVE / 驳回 REJECT",
  "驳回专属：退回目标 return_to（READY / BACKLOG，默认 READY）+ 可选优先级调整",
  "草稿按任务自动保存；review_reuse_last_opinion（默认开）预填上次三项",
];

export const NOTIFY_KINDS = {
  pending: ["review_pending（待审核）", "creation_request（Agent 创建请求）"],
  general: ["run_failed（执行失败）", "lease_expired（租约过期）", "review_rejected（驳回）", "task_unblocked（解除阻塞）"],
};

/* ---------------- /docs/skills ---------------- */

export const SKILL_SOURCES = [
  { key: "default", name: "默认技能", how: "随安装包预置、只读", note: `当前 ${FACTS.defaultSkills} 条；三模式与画布仅供查看，页顶横幅可「复制为自定义技能」改造` },
  { key: "custom", name: "自定义技能", how: "本地创建 / 复制 / 模板起步", note: "自由编辑、发布、回滚" },
  { key: "imported", name: "三方技能", how: "导入 .atskill / SKILL.md / Cursor .mdc", note: "不记录导入来源；身份由唯一 id 决定，允许重名" },
];

export const SKILL_TYPES = ["prompt", "steps", "workflow", "flow", "script", "knowledge", "composite"];

export const SKILL_BLOCKS = [
  "prompt", "step", "decision", "loop", "parallel", "tool", "knowledge",
  "script", "subskill", "human", "input", "output", "constraint", "error_handler", "comment",
];

export const SKILL_EDITOR_MODES = [
  { name: "可视化", what: "块卡片流，点击编辑" },
  { name: "结构化", what: "表单化逐块编辑" },
  { name: "源码", what: "直接改块 JSON" },
  { name: "流程图", what: "@xyflow 画布视图，有向图渲染" },
];

export const SKILL_PUBLISH_CHECKS = [
  "元数据完整（名称/描述/分类等）",
  "入口块存在",
  "无悬空连线、无循环引用（error 级阻断，warn 级只提示）",
];

export const SKILL_DETAIL_TABS = ["概览（内容块预览）", "版本（回滚到此版）", "测试（输入→运行→logs/output）", "MCP 依赖（配置片段复制）", "绑定任务"];

/* ---------------- /docs/org ---------------- */

export const GROUP_LAYERS = [
  { name: "group_id", semantic: "任务的归属字段；跨组拖拽会改写它", where: "任务表" },
  { name: "groupIds", semantic: "作用域多选过滤器，空数组 = 全部", where: "看板工具栏分组切换器；偏好持久化" },
  { name: "grouping", semantic: "呈现层偏好：主/次维度、顺序、折叠、组内筛选", where: "同上（prefs board.grouping）" },
];

export const GROUP_DIMENSIONS = ["分组", "需求（父任务）", "类型", "优先级", "负责 Agent", "标签", "状态"];

export const GROUP_FACTS = [
  `预置「默认」分组不可删除、不可归档；预置之外活跃分组上限 ${FACTS.groupCap} 个（归档不占额）`,
  "归档分组不进候选，组内任务不进认领队列；删除可选「把任务迁走」或「连任务一起删」",
  "分组泳道的呈现形态三种：单级、主+次两级、列表分节",
  "偏好持久化双层：先落 localStorage，再镜像到 prefs；sidecar 不可达时静默留本地，启动时以库内值水合",
];

export const SETTINGS_TABS = [
  { name: "通用", what: "主题、任务类型词表、审核预填、产物上限、每列渲染上限、租约与轮询周期；Agent 创建任务分区（三模式+轻确认超时）" },
  { name: "视图", what: "看板/流程图共用显示参数：简化阈值、性能档位、缩放范围、默认方向、关键路径开关" },
  { name: "Token", what: "签发 / 吊销 Agent Token；贾维斯唤醒模式两档单选" },
  { name: "字段定义", what: "创建 / 编辑 / 停用 / 删除自定义字段" },
  { name: "模板", what: "任务创建模板管理" },
  { name: "数据", what: "自动归档天数、已归档查看、JSON 导出、导入四步（确认前先备份当前库）" },
  { name: "日志与审计", what: `审计流每页 ${FACTS.auditPageSize} 条；log_level 与保留天数；MCP 动作显示中文标签` },
  { name: "备份", what: "立即备份、备份列表、恢复（确认前先对当前库做安全备份）" },
  { name: "关于", what: "版本、数据/产物/日志/备份目录、一键打开目录" },
];

export const BREAKDOWN_STEPS = [
  { who: "Agent", what: "MCP board.begin_breakdown 上报「一段需求 → N 条任务草案」开工，随后 report_progress / report_task_draft 逐条上报（标题/优先级/技能名/验收标准/草案间依赖）" },
  { who: "Agent", what: "board.finish_breakdown 收尾，会话转「待确认」" },
  { who: "人", what: "看板出现待确认覆盖层：进度清单 + 草案卡片流 + 草案依赖流程图；支持最小编辑（增删改、调依赖，检出环后禁确认）与验收标准编辑，单条可重新生成" },
  { who: "人", what: "确认创建 → 弹 5 秒撤销窗口，倒计时归零才真正落库；期间点「撤销」零副作用" },
  { who: "系统", what: "确认后生成父任务（需求）+ 子任务与依赖边；receiving 超 30 分钟无进展、reviewing 超 7 天未确认由定时任务收敛" },
];

export const CREATION_MODES = [
  { key: "direct", name: "直接创建", what: "不弹卡片；重复检测命中时升级为轻确认卡片", undo: "5 秒撤销浮层" },
  { key: "light", name: "轻确认（默认）", what: "右下角浮层卡片「取消 / 编辑 / 创建」+ 倒计时条", undo: `超时（默认 ${FACTS.lightConfirmTimeout}s）按不创建处理` },
  { key: "silent", name: "静默创建", what: "不弹卡片、仅发通知（kind creation_request）", undo: "5 秒撤销" },
];

export const CREATION_NOTES = [
  "模式优先级：请求参数 ＞ 设置 agent_creation_mode ＞ 默认 light",
  "撤销守卫：仅 origin=agent 且未被领取的任务可撤；撤销即删",
  "留痕：agent_sessions 按会话 upsert，task_creation_logs 记创建/取消/超时",
];

/* ---------------- /docs/agent ---------------- */

export const CAPABILITY_NS = ["language", "framework", "repo", "tool"];

export const MCP_CONFIG_JSON = `{
  "url": "http://127.0.0.1:7788/mcp",
  "headers": { "Authorization": "Bearer atb_<你的Agent Token>" }
}`;

export const WAKE_MODES = [
  { key: "single", name: "单次对话（默认）", what: "本轮唤醒对应的操作完成即退出工作模式" },
  { key: "continuous", name: "连续对话", what: "唤醒后保持工作模式，后续请求继续按看板操作处理，直到说「退出贾维斯」" },
];

export const AGENT_LOOP = [
  { who: "只读", step: "list_ready_tasks", what: "查可领取任务（按能力/类型过滤，只读无租约）", rest: "GET /api/v1/tasks/ready" },
  { who: "写回", step: "claim_next_task", what: "原子认领 + 建立租约，任务转 RUNNING", rest: "POST /api/v1/tasks/claim" },
  { who: "只读", step: "get_task", what: "取详情：自定义字段 / 依赖 / 历史审核意见", rest: "GET /api/v1/tasks/:id" },
  { who: "写回", step: "update_progress · append_log · heartbeat", what: "执行中回写进度与日志、按建议周期续租", rest: "POST …/progress · …/logs · …/heartbeat" },
  { who: "写回", step: "complete_task / fail_task", what: "完成 → 进待审核（幂等）；失败 → 异常。产出物需在 complete 前经 POST /artifacts 上传（link 类型直接插入）", rest: "POST …/complete · …/fail" },
  { who: "写回", step: "block_task / wait_for_resume", what: "技能含人工块时上报 BLOCKED，可阻塞等待人工恢复", rest: "POST /api/v1/tasks/:id/blocked" },
  { who: "只读", step: "get_review_feedback", what: "读取最近审核意见（驳回原因等），进入下一轮", rest: "GET …/review-feedback" },
];

export const TRIPLE_NOTE =
  "所有写回工具必须携带三元组 task_id + run_id + lease_id（只读工具除外），用于租约校验与防越权；同一三元组在 block/complete/fail 后即刻失效，再回写返回 410。";

export type McpTool = { name: string; what: string; rest: string | null };
export const MCP_TOOL_GROUPS: { title: string; note: string; tools: McpTool[] }[] = [
  {
    title: "任务执行核心",
    note: "认领到交付的主干循环",
    tools: [
      { name: "list_ready_tasks", what: "查可领取任务（只读，无租约）", rest: "GET /api/v1/tasks/ready" },
      { name: "claim_next_task", what: "原子认领 + 建立租约", rest: "POST /api/v1/tasks/claim" },
      { name: "get_task", what: "任务详情（含审核意见/字段/依赖）", rest: "GET /api/v1/tasks/:id" },
      { name: "update_progress", what: "更新进度（需三元组）", rest: "POST /api/v1/tasks/:id/progress" },
      { name: "append_log", what: "追加执行日志", rest: "POST /api/v1/tasks/:id/logs" },
      { name: "complete_task", what: "完成回写 → 待审核（幂等）", rest: "POST /api/v1/tasks/:id/complete" },
      { name: "fail_task", what: "失败上报 → 异常", rest: "POST /api/v1/tasks/:id/fail" },
      { name: "heartbeat", what: "续租", rest: "POST /api/v1/tasks/:id/heartbeat" },
      { name: "get_review_feedback", what: "最近审核意见", rest: "GET /api/v1/tasks/:id/review-feedback" },
      { name: "update_task", what: "全字段 PATCH 编辑任务，只改提交了的字段；RUNNING 需租约三元组，BACKLOG/READY 免租约，终态不可编辑", rest: "PATCH /api/v1/tasks/:id" },
    ],
  },
  {
    title: "阻塞 · 技能 · 策略 · 词表",
    note: "人工块、技能读写面与自纠错",
    tools: [
      { name: "block_task", what: "人工块上报 → BLOCKED（与 REST 双入口）", rest: "POST /api/v1/tasks/:id/blocked" },
      { name: "wait_for_resume", what: "阻塞等待人工解除 BLOCKED", rest: null },
      { name: "list_skills", what: "技能列表（只读）", rest: "GET /api/v1/skills" },
      { name: "get_skill", what: "技能详情与正文", rest: "GET /api/v1/skills/:id" },
      { name: "search_skills", what: "技能检索", rest: null },
      { name: "update_skill", what: "全字段 PATCH 编辑技能（内置默认技能只读，回 SKILL_READONLY）；content/tags/test_cases 整体覆盖", rest: "PATCH /api/v1/skills/:id" },
      { name: "check_mcp_policy", what: "MCP 依赖策略校验", rest: null },
      { name: "report_mcp_call", what: "MCP 调用审计上报", rest: null },
      { name: "get_vocabulary", what: "一次拿全服务端词表（类型/优先级/状态机/技能口径/产物枚举），杜绝试错造数据", rest: null },
    ],
  },
  {
    title: "board.* 拆解与直建",
    note: "需求拆解上报链路与会话直接建任务",
    tools: [
      { name: "board.begin_breakdown", what: "开始拆解（需求原文 + 拟拆任务数）", rest: null },
      { name: "board.report_progress", what: "上报阶段进度", rest: null },
      { name: "board.report_task_draft", what: "逐条上报任务草案", rest: null },
      { name: "board.finish_breakdown", what: "收尾转「待确认」", rest: null },
      { name: "board.cancel_breakdown", what: "撤销拆解会话", rest: null },
      { name: "board.create_task", what: "会话直建任务，可带 confirmation_mode", rest: "POST /api/v1/creation-requests" },
      { name: "board.create_tasks_batch", what: "批量直建", rest: null },
      { name: "board.get_creation_status", what: "轮询创建请求决策状态", rest: "GET /api/v1/creation-requests" },
      { name: "board.wait_for_confirmation", what: "阻塞等待轻确认决策（含 5 秒宽限）", rest: null },
    ],
  },
];

export const REST_AGENT_ENDPOINTS = [
  ["GET /tasks/ready", "可领取任务"],
  ["POST /tasks/claim", "认领"],
  ["POST /tasks/:id/progress", "进度"],
  ["POST /tasks/:id/logs", "日志"],
  ["POST /tasks/:id/complete", "完成"],
  ["POST /tasks/:id/fail", "失败"],
  ["POST /tasks/:id/blocked", "人工块上报 → BLOCKED"],
  ["POST /tasks/:id/heartbeat", "续租"],
  ["GET /tasks/:id/review-feedback", "审核意见"],
  ["POST /artifacts", "上传产出物（仅 Agent）"],
];

export const TASK_TEMPLATE_JSON = `{
  "title": "【必填】任务标题，≤200 字符，一句话说清做什么",
  "type": "需求",
  "priority": 2,
  "description": "【强烈建议】给 Agent 的执行说明：目标、范围、验收标准、涉及文件/模块。",
  "tags": ["前端"],
  "required_capabilities": ["repo:agent-task-board"],
  "custom_fields": {},
  "due_at": "2026-09-30",
  "depends_on": [],
  "dependency_type": "blocks",
  "pinned": false
}`;

export const TEMPLATE_FIELDS: { field: string; req: boolean; rule: string }[] = [
  { field: "title", req: true, rule: "1–200 字符，去首尾空白；越界 400" },
  { field: "type", req: true, rule: "1–16 字符；默认五类：需求/缺陷/子任务/巡检/重构" },
  { field: "priority", req: false, rule: "整数 0–3（0 紧急…3 低），缺省 3" },
  { field: "description", req: false, rule: `≤${FACTS.descMax} 字符` },
  { field: "tags", req: false, rule: `数组 ≤${FACTS.tagMax} 项，每项 ≤${FACTS.tagLenMax} 字符，自动去重` },
  { field: "required_capabilities", req: false, rule: `≤${FACTS.capMax} 项，格式 namespace:value（language/framework/repo/tool）` },
  { field: "due_at", req: false, rule: "YYYY-MM-DD 或 ISO 8601" },
  { field: "depends_on", req: false, rule: `前置任务 id 数组 ≤${FACTS.dependsMax} 项` },
  { field: "dependency_type", req: false, rule: "blocks（默认）| relates" },
  { field: "pinned", req: false, rule: "布尔，缺省 false" },
];

export const TEMPLATE_RULES = [
  "创建任务是 UI 作用域接口——必须用 UI Token；Agent Token 调用直接 403。",
  "新任务一律进 BACKLOG（需求池）；status 不是可写字段。",
  "description 是给执行 Agent 的作业说明书：写清做什么、不做什么、验收标准；模糊任务会被驳回浪费一轮。",
  "priority 慎用 0（紧急）：会抢占认领顺序，仅用于真实阻塞。",
  "有前置先建前置、后建依赖方；批量创建按依赖拓扑排序提交。",
];

export const TEMPLATE_CURL = `curl -s -X POST http://127.0.0.1:7788/api/v1/tasks \\
  -H "Authorization: Bearer $ATB_UI_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d @task.json`;

export const TEMPLATE_SPEECH = `请阅读《任务创建模版》文档，按其中的字段约束与填写守则，把我下面的需求整理成任务 JSON，
给我确认后用 UI Token 调 POST /api/v1/tasks 创建，并把返回的任务 id 告诉我。
需求：<在这里写你的需求描述>`;

export const CURSOR_ENV = `ATB_URL=http://127.0.0.1:7788 \\
ATB_AGENT_TOKEN=atb_xxx \\
ATB_CAPABILITIES="language:go,tool:maven" \\
ATB_EXEC='cursor-agent -p "{prompt}" --print' \\
node scripts/cursor-agent-poll.mjs`;

export const CURSOR_NOTES = [
  "脚本行为：认领一个任务（队列空则静默退出等下次调度）→ 注入 {prompt}（含历史审核意见）→ 期间心跳续租、输出增量回传为日志 → 退出码 0 走 complete（可设 ATB_ARTIFACTS_DIR 上传目录产物）、非 0 或超时（默认 1800s）走 fail。",
  "无人值守 = 系统级调度（macOS launchd / cron）周期拉起本脚本；Cursor 云端 / 后台 Agent 运行在你机器之外，访问不到 127.0.0.1，不在支持范围。",
  "在 .cursor/rules/*.mdc 写会话规则驱动认领不是无人值守方案——别把预期写成「自动执行」。",
];

/* ---------------- /docs/data ---------------- */

export const BOUNDARY_POINTS = [
  { t: "只绑 127.0.0.1", d: "任何情况下不监听 0.0.0.0；不暴露局域网/公网。" },
  { t: "零出站请求", d: "服务端组件已整体移除；断网时应用功能完整可用。" },
  { t: "一次性签名 URL", d: `产出物原始内容经 HMAC 签名 URL（${FACTS.signUrlTtl} 秒有效）访问，响应强制 nosniff + CSP sandbox。` },
  { t: "路径白名单", d: "资源路径做白名单 + realpath 前缀校验，防目录穿越。" },
  { t: "CORS 精确匹配", d: "仅放行桌面壳与开发端口来源，不回显任意 Origin。" },
  { t: "两面 Token 互斥", d: "UI Token 调不了 Agent 写回接口，Agent Token 调不了用户接口，互相 403。" },
];

export const BACKUP_FACTS = [
  `备份为手动：设置 → 备份 →「立即备份」，产物是 VACUUM INTO 一致性快照，文件名 atb-YYYYMMDD-HHMMSS.db，落在 ${FACTS.dataDir}/backups/。`,
  "恢复是整库换文件：点确认后服务端先对当前库做一次安全备份，失败即中止，再覆盖为所选备份。",
  "导入同样前置备份：数据导入确认前服务端先备份当前库，结果页给出该文件名。",
  "backup_time / backup_keep 存在于设置契约但不进设置页表单（阶段一仅手动备份）；需要定时备份请对外部备份目录自行 cron/rsync。",
];

export const AUDIT_FACTS = [
  "关键动作全部留痕：签发/吊销 Token、设置变更、审核提交、数据导入、分组归档、拆解超时、MCP 调用等。",
  `查看入口：设置 → 日志与审计，每页固定 ${FACTS.auditPageSize} 条。`,
  "MCP 动作在审计流显示为中文标签。",
  "日志目录独立于数据目录（macOS ~/Library/Logs/AgentTaskBoard）；备份不含日志。",
];

export const DATA_DIR_TREE = [
  [FACTS.dataDir, "数据根目录（ATB_DATA_DIR 可覆盖）"],
  ["├─ jarvis.db", "SQLite 主库（+WAL）"],
  ["├─ artifacts/", "产出物文件"],
  ["├─ backups/", "手动备份快照"],
  ["└─ config.json", "本地配置（含端口）"],
];

export const MIGRATION_FACTS = [
  `升级 v0.0.4 后首启检测到旧目录 ${FACTS.legacyDir} 时一次性自动搬迁：整库备份 → 复制并在副本上 checkpoint → integrity_check → 续跑 schema 迁移 → 旧库改名封存、留 MIGRATED.md。`,
  "任一步失败即回滚：旧库分毫未动、旧版仍可启动；搬迁成功即不可逆。",
  "bundle identifier 已随产品更名变更：macOS 视新旧包为两个应用——升级前先把旧 Jarvis Workbench.app 移到废纸篓，否则通知授权等权限不继承。",
  "业务数据在 SQLite 里，不属于 WebView 缓存层；换 identifier 后只有界面偏好回默认值。",
];

export const TROUBLE_STARTUP: { symptom: string; fix: string }[] = [
  { symptom: "端口被占用", fix: "用 ATB_PORT 环境变量或 config.json 的 port 换端口" },
  { symptom: "数据库未初始化", fix: "开发模式先执行 npm run prisma" },
  { symptom: "前端连不上后端", fix: "确认 sidecar 就绪、127.0.0.1:7788 可达" },
  { symptom: "首次打开被 Gatekeeper 拦", fix: "右键 →「打开」确认一次；或 xattr -cr 清除隔离属性" },
  { symptom: "升级后看不到旧数据", fix: "检查新目录应有 jarvis.db、旧目录应有 MIGRATED.md 与封存的 atb.db.migrated" },
];

export const ERROR_CODES: { code: string; name: string; meaning: string; fix: string }[] = [
  { code: "401", name: "UNAUTHORIZED", meaning: "Token 缺失 / 无效 / 已撤销", fix: "重新签发 Agent Token；确认 UI Token 已注入" },
  { code: "403", name: "FORBIDDEN", meaning: "作用域不匹配（UI↔Agent 互调）", fix: "用正确作用域的 Token" },
  { code: "409", name: "ILLEGAL_TRANSITION", meaning: "状态流转非法（服务端兜底）", fix: "对照流转矩阵，勿试图拖到 RUNNING / 拖出 DONE" },
  { code: "410", name: "LEASE_EXPIRED", meaning: "租约已过期", fix: "Agent 重新认领任务" },
  { code: "413", name: "ARTIFACT_TOO_LARGE", meaning: "产出物超过单文件/单 Run 上限", fix: "调大 artifact_max_mb 或拆分交付" },
  { code: "422", name: "VALIDATION_FAILED", meaning: "必填自定义字段缺失 / 设置键非法 / 值越界", fix: "补齐必填项或修正设置" },
];

export const TROUBLE_OPS = [
  "拖拽没反应/被拒：目标流转属「禁止」或需「表单」，属正常拦截。",
  "执行中任务不能编辑字段：RUNNING 锁定编辑，停止或完成后再改。",
  "审核页为空：确认存在 REVIEW 且未归档任务；铃铛红点 = 有待审核。",
  "WebSocket 断线：前端自动指数退避重连（1s→30s），重连后全量刷新。",
  "数据库锁（SQLITE_BUSY）：避免用外部工具直接写同一 db 文件。",
];

/* ---------------- /docs/changelog ---------------- */

export const CHANGELOG: {
  version: string;
  date: string;
  channel: "prerelease";
  headline: string;
  points: string[];
  current?: boolean;
}[] = [
  {
    version: "v0.0.4-beta.8",
    date: "2026-09-28",
    channel: "prerelease",
    current: true,
    headline: "Windows x64 安装包首批上线",
    points: [
      "新增 Windows x64 NSIS 安装包（.exe）：未签名，首启按 SmartScreen 提示「更多信息 → 仍要运行」放行；per-user 安装、不需管理员权限",
      "安装时需联网下载 WebView2 运行库（Win11 与更新过的 Win10 通常已自带）",
      "macOS 侧无功能改动；Windows 真机双击安装验证仍在进行中",
    ],
  },
  {
    version: "v0.0.4-beta.7",
    date: "2026-09-25",
    channel: "prerelease",
    headline: "Agent 编辑面扩展 + 技能库扩容与分类两级化",
    points: [
      "MCP 新增 update_task、update_skill 两个工具，tools/list 由 26 升至 28",
      "内置技能 94 → 125：新收录 31 条编码技能",
      "技能分类改为两级树：7 个一级 / 16 个叶子",
      "任务列表列宽不再随筛选跳变",
    ],
  },
  {
    version: "v0.0.4-beta.6",
    date: "2026-09-24",
    channel: "prerelease",
    headline: "审核与接入细节修复 + 分组过滤重构",
    points: [
      "B12→B15：分组呈现重构，过滤统一（分段选择器 + chip，看板 7 列恒在与过滤解耦）",
      "B8–B11 修复批：审核产物归属标注、Agent 接入状态 chip 相对时间等",
      "MCP 面 tools/list 工具 26 个；任务列表列宽与滚动解耦",
    ],
  },
  {
    version: "v0.0.4-beta.5",
    date: "2026-09-23",
    channel: "prerelease",
    headline: "交互修复批 + 动效系统 v1.2",
    points: ["B1–B7 修复批与唤醒细节", "动效系统分层规范（L1–L4）落地进界面"],
  },
  {
    version: "v0.0.4-beta.4",
    date: "2026-09-23",
    channel: "prerelease",
    headline: "贾维斯唤醒词上线",
    points: [
      "「贾维斯，…」MCP 工作模式（单次/连续两档，设置 → Token 切换）",
      "94 条默认技能随包预置（千问工作台迁移 + code-review）",
      "设置深链 tabs 修复、手册重写",
    ],
  },
  {
    version: "v0.0.4-beta.3",
    date: "2026-09-22",
    channel: "prerelease",
    headline: "CI 稳定性修复",
    points: ["发布链路回归断言冻结时钟，消除构建 flaky"],
  },
  {
    version: "v0.0.4-beta.2",
    date: "2026-09-21",
    channel: "prerelease",
    headline: "CI 稳定性修复",
    points: ["arm64 dmg 兜底二次生成复用 tauri 产物，不再挤爆构建机磁盘"],
  },
  {
    version: "v0.0.4-beta.1",
    date: "2026-09-21",
    channel: "prerelease",
    headline: "v0.0.4 整期落地：纯本地单机形态",
    points: [
      "移除账号体系与服务端组件，全部数据收归本机 SQLite",
      "数据目录迁至 ~/.jarvis-workbench（旧目录首启自动搬迁）",
      "Project 改名分组；技能三来源；需求拆解与会话直建链路；通知中心；BLOCKED 纳入七状态",
      "发布链路切到推 tag 走 CI，双架构原生包",
    ],
  },
  {
    version: "v0.0.3",
    date: "2026-09-20",
    channel: "prerelease",
    headline: "0919 需求批次 + 整体回归修复",
    points: [
      "看板分组泳道、技能库与四类编辑器形态引入（当时含账号体系与服务端市场，均已随 v0.0.4 移除）",
      "发布前 18 场景整体回归，修掉 12 项缺陷",
    ],
  },
  {
    version: "v0.0.2",
    date: "2026-09-19",
    channel: "prerelease",
    headline: "UI 全面改版",
    points: ["双主题设计 token 与组件体系", "审核通过免必填与执行摘要增强", "发布链路迁移 CI：推 tag 双架构自动发布"],
  },
  {
    version: "v0.0.1",
    date: "2026-09-16",
    channel: "prerelease",
    headline: "首个可分发 macOS 包",
    points: ["看板 + 任务生命周期 + Agent MCP 认领执行闭环 MVP", "x64 单架构、未签名（Gatekeeper 降级口径文档化）"],
  },
];

export const CHANGELOG_NOTES = [
  "全部发布批次均为 prerelease：项目至今未发布过任何正式版。",
  "包内版本与批次 tag 是两套口径（包内 0.1.0，批次 v0.0.x）。",
  "产物经 ad-hoc 签名、未公证；Apple Silicon 双击不再判「已损坏」，首启仍可能拦「无法验证开发者」。",
];

export const ASSET_NOTES = [
  "每个 Release 附双架构 dmg（arm64 / x64）与合并 SHA256SUMS.txt。",
  "GitHub 上传后资产文件名中的空格会被替换为点号，属正常行为；对账以 SHA-256 哈希为准。",
  "Apple Silicon 用 arm64 原生包，不需要 Rosetta。",
];


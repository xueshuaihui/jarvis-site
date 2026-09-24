/* ============================================================
   全站文案与事实中枢（《网站架构设计》§2 内容事实基线）
   每条事实均有仓库出处；改文案只改这里。禁止虚构能力。
   ============================================================ */
import { RELEASE_BADGE } from "./docs-nav";

export const LINKS = {
  /** 统一指向 latest，避免版本号写死过期 */
  releasesLatest: "https://github.com/xueshuaihui/agent-task-board/releases/latest",
  releases: "https://github.com/xueshuaihui/agent-task-board/releases",
  repo: "https://github.com/xueshuaihui/agent-task-board",
};

/** 版本徽章：版本号唯一事实源是 docs-nav 的 RELEASE_BADGE（来源：v0.0.4-beta.6 发布记录，2026-09-24） */
export const LATEST_BADGE = `${RELEASE_BADGE} · macOS · prerelease 通道`;

export const NAV_SECTIONS = [
  { id: "workflow", label: "工作流" },
  { id: "modules", label: "功能" },
  { id: "quickstart", label: "上手" },
  { id: "download", label: "下载" },
] as const;

/* ---------------- S1 Hero ---------------- */
export const HERO = {
  statusLine: "● SYSTEM ONLINE · LOCAL 127.0.0.1",
  h1: "你的 AI Agent 团队，",
  h1Accent: "需要一块真正的看板。",
  typed: "「贾维斯，把需求拆解后交给 Agent 执行。」",
  lede: "Jarvis Workbench（贾维斯客户端）是一块纯本地桌面任务看板：人建任务，Agent 经 MCP / REST 认领执行，一切产出必经人工审核才生效。",
  ctaMain: "下载 for macOS",
  ctaGhost: "看它怎么转 ↓",
  finePrint: "支持 Apple Silicon / Intel · 仅本机运行，数据不出电脑",
  board: {
    title: "HOLOGRAM · 看板投影",
    columns: ["需求池", "执行中", "待审核"],
    cardTitle: "示例任务：重构支付模块",
    reviewStamp: "等待人工审核",
  },
};

/* ---------------- S2 三条铁律 ---------------- */
export const PRINCIPLES = {
  kicker: "PRIME DIRECTIVES",
  title: "三条铁律",
  items: [
    {
      numeral: "Ⅰ",
      title: "任务由人建立并排序",
      body: "看板上每一块任务都来自你的手：优先级、描述、期望产出，由人定义。Agent 没有权限往需求池里塞东西。",
      anti: "Agent 自作主张开任务 ✗",
    },
    {
      numeral: "Ⅱ",
      title: "Agent 凭租约认领执行",
      body: "执行方（Qoder / Claude Code / Codex / Cursor…）经 MCP 工具认领任务，30 分钟租约 + 心跳续租，过期自动转异常——谁在干什么，随时查得到。",
      anti: "黑盒并行、无人认领 ✗",
    },
    {
      numeral: "Ⅲ",
      title: "一切产出必经人工审核",
      body: "Agent 完成 ≠ 完成。diff、文件、链接等产出物进入待审核队列，你逐条批通过或驳回，它才算落地。",
      anti: "Agent 自己验收自己 ✗",
    },
  ],
};

/* ---------------- S3 状态机播放器 ---------------- */
export type WorkflowStep = {
  key: string;
  label: string;
  color: string;
  desc: string;
  detail: string;
};

/** 7 态口径（v0.0.4 实现；六列旧口径作废） */
export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    key: "backlog",
    label: "需求池",
    color: "var(--color-st-backlog)",
    desc: "任务在此排队",
    detail: "在看板 UI 快速新建，或用任务模版让 AI 助手代建。新任务一律落在这里，由人排定优先级。",
  },
  {
    key: "ready",
    label: "待执行",
    color: "var(--color-st-ready)",
    desc: "等待 Agent 领取",
    detail: "你确认「可以做」后任务转入待执行。可在任务上标注能力要求（如 repo 范围），供 Agent 精准认领。",
  },
  {
    key: "running",
    label: "执行中",
    color: "var(--color-st-running)",
    desc: "Agent 持租约干活",
    detail: "RUNNING 只能由 Agent 认领产生：建 30 分钟租约、心跳续租，边干边回写进度与日志。租约过期任务自动转异常。",
  },
  {
    key: "review",
    label: "待审核",
    color: "var(--color-st-review)",
    desc: "到此必须经你的手",
    detail: "产出物（diff / 文件 / 链接等十类）随任务进入审核队列。REVIEW 的出口只有人工审核一条路——通过或驳回，驳回必填原因。",
  },
  {
    key: "done",
    label: "已完成",
    color: "var(--color-st-done)",
    desc: "人点过头，才算数",
    detail: "审核通过后任务归档为已完成，全部操作留在本机审计日志里，可回溯谁在何时改了什么。",
  },
];

export const WORKFLOW_BRANCHES = [
  {
    key: "blocked",
    label: "受阻",
    color: "var(--color-st-blocked)",
    desc: "Agent 报告阻塞，等人处理",
  },
  {
    key: "failed",
    label: "异常",
    color: "var(--color-st-failed)",
    desc: "租约过期或执行失败，回到人的视野",
  },
];

/* ---------------- S4 能力模块 ---------------- */
export const MODULES = [
  {
    key: "board",
    title: "看板",
    body: "七列任务流三视图切换，拖拽换列即时生效；分组泳道与统一过滤，让一百块任务也各就各位。",
    bullets: ["列表 / 看板 / 分组三视图", "拖拽换列 + 跨列飞行动画", "自定义字段与模板"],
  },
  {
    key: "review",
    title: "审核",
    body: "待审核队列逐条批：diff 直接看、产出物直接开，通过 / 驳回 + 三字段意见，批完自动跳下一条。",
    bullets: ["diff / 文件 / 链接十类产出物", "通过 · 驳回（意见必填）", "审核完自动跳到下一条"],
  },
  {
    key: "skills",
    title: "技能库",
    body: "预置 94 条内置技能开箱即用，支持自定义与三方导入（.atskill / SKILL.md / .mdc），12 类分类统一检索。",
    bullets: ["94 条内置技能随包发布", "三来源：内置 / 自定义 / 导入", "任务绑定技能，随单下发"],
  },
  {
    key: "agent",
    title: "Agent 接入",
    body: "设置里签发 Agent Token，配上 MCP 地址，你的 AI 助手即刻上岗：26 个 MCP 工具覆盖认领、心跳、回写、拆解全流程。",
    bullets: ["MCP 26 工具 + REST 通道", "Token 分组：UI 与 Agent 互不可越", "唤醒词「贾维斯，…」或定时认领"],
  },
  {
    key: "settings",
    title: "设置与审计",
    body: "字段定义、模板、数据导入导出、备份与审计日志集中一处。所有操作本机留痕，随时可对账。",
    bullets: ["9 个设置分区", "SQLite 一键备份/迁移", "全量审计日志"],
  },
] as const;

/* ---------------- S5 四步开机 ---------------- */
export const QUICKSTART = {
  kicker: "MISSION SETUP",
  title: "四步开机",
  steps: [
    {
      no: "01",
      title: "安装上线",
      time: "约 1 分钟",
      body: "下载对应架构的 .dmg，把 Jarvis Workbench 拖进「应用程序」。首次打开若被 Gatekeeper 拦截（应用未公证属预期），右键 →「打开」确认一次即可。",
      copyLabel: "或终端一键解除隔离：",
      copyCmd: 'xattr -cr "/Applications/Jarvis Workbench.app"',
    },
    {
      no: "02",
      title: "建第一块任务",
      time: "约 1 分钟",
      body: "打开即工作台，无需注册登录。在看板「需求池」新建一块真实需求：标题、描述、优先级。不想手写？把任务模版发给你的 AI 助手，让它按字段约束代建。",
      copyLabel: "发给 AI 助手的指令（示意）：",
      copyCmd: "请按 Jarvis 任务模版，为我创建任务：标题「整理 9 月报销单」，优先级 P2。",
    },
    {
      no: "03",
      title: "接入你的 Agent",
      time: "约 2 分钟",
      body: "设置 → Token 签发一个 Agent Token（明文只显示一次，妥存）。在 Qoder / Claude Code / Cursor 等支持 MCP 的助手里加上下面的端点，Agent 即可认领任务、回写进度。",
      copyLabel: "MCP 配置：",
      copyCmd: '{ "url": "http://127.0.0.1:7788/mcp", "headers": { "Authorization": "Bearer atb_<你的Token>" } }',
    },
    {
      no: "04",
      title: "唤醒与验收",
      time: "长期",
      body: "对你的助手说「贾维斯，认领一块任务」，它就会自主执行。完成后任务带着产出物进入待审核——你逐条批，通过才算完成，驳回带意见退回。人的判断，始终是最后一道闸。",
      copyLabel: null,
      copyCmd: null,
    },
  ],
};

/* ---------------- S6 本地优先 ---------------- */
export const LOCAL = {
  kicker: "LOCAL-FIRST",
  title: "一台电脑，就是一个完整的指挥中心",
  points: [
    { t: "只监听本机", d: "API 仅绑定 127.0.0.1:7788，不对外暴露任何端口，无远端服务依赖。" },
    { t: "数据在本机", d: "任务、产出物、设置统一存于 ~/.jarvis-workbench/ 的 SQLite 与产物文件。" },
    { t: "无账号体系", d: "本机单用户，没有注册、登录与云端同步——也就没有可被拖走的账号。" },
    { t: "全程留痕", d: "认领、回写、审核、配置变更……所有操作写入本地审计日志，可回溯、可导备份。" },
  ],
  satellites: ["看板数据", "Agent 通道", "产出物", "审计日志"],
  boundaryLabel: "外网 · NO EXIT",
};

/* ---------------- S7 下载 ---------------- */
export const DOWNLOAD = {
  kicker: "READY TO DEPLOY",
  title: "启动",
  badge: LATEST_BADGE,
  cards: [
    {
      name: "Apple Silicon",
      chip: "arm64",
      models: "M 系列机型",
      note: "原生构建，无需 Rosetta",
    },
    {
      name: "Intel",
      chip: "x64",
      models: "2020 年前机型",
      note: "x86_64 原生包",
    },
  ],
  cta: "前往 GitHub Releases 下载",
  finePrint: [
    "每个版本附带 SHA256SUMS.txt，建议下载后校验；GitHub 上传后文件名中的空格变为点号属正常。",
    "当前为 beta 验证通道：核心工作流已可用，仍在真机验收迭代中；升级新版本前建议先删除旧版 .app。",
    "Windows / Linux 尚未交付（Coming later）。本站下载链接均指向官方 GitHub Releases。",
  ],
};

/* ---------------- S8 FAQ ---------------- */
export const FAQ = {
  kicker: "TROUBLESHOOTING",
  title: "常见问题",
  items: [
    {
      q: "双击打开提示「无法验证开发者」或「已损坏」怎么办？",
      a: "当前发布为 ad-hoc 签名、未做公证，首次打开被 Gatekeeper 拦截属预期行为。两种解法任选：右键 .app →「打开」→ 再点「打开」；或终端执行 xattr -cr \"/Applications/Jarvis Workbench.app\" 清除隔离属性。若 Apple Silicon 上提示「已损坏」且右键无效，多为旧版零签名包，请升级到最新 beta 包。",
    },
    {
      q: "现在是 beta 版本，可以放心日常用吗？",
      a: "v0.0.x 属 prerelease 验证通道：任务看板、审核、技能、Agent 接入等核心链路已按清单做真机验收，但仍在快速迭代。数据全部在你本机，升级前用设置里的备份功能导出一份即可安心。",
    },
    {
      q: "支持哪些 Agent / AI 助手？",
      a: "一切支持 MCP 的客户端均可接入（Qoder、Claude Code、Cursor、Codex 等），也提供 REST 通道给自研执行器。Cursor 用户可直接用仓库自带的轮询调度脚本，免写接入代码。",
    },
    {
      q: "Agent 会不会绕过审核自己改我的任务？",
      a: "不会。审核是状态机的硬约束：「待审核」只能由人工审核流出；Agent 侧 Token 与 UI Token 分组，互不可调用对方接口；「执行中」状态只能由认领租约产生。此外所有 Agent 操作都留在审计日志里。",
    },
    {
      q: "数据存在哪里？怎么备份或迁移？",
      a: "统一在 ~/.jarvis-workbench/（早期版本目录名为 ~/.agent-board，升级首启会自动搬迁）。设置 → 备份/数据 里可导出导入；换机时拷走整个目录即可完整迁移。",
    },
    {
      q: "Windows / Linux 版本什么时候有？",
      a: "尚未列入已交付清单，当前仅 macOS 双架构。跨平台属阶段二规划，请关注仓库 Releases。",
    },
    {
      q: "收费吗？",
      a: "项目为私有开发中的开源前形态，beta 分发免费；正式授权与许可口径以仓库后续公告为准。",
    },
  ],
};

export const FOOTER = {
  tagline: "Jarvis Workbench · Local-first mission control",
  links: [
    { label: "GitHub 仓库", href: LINKS.repo },
    { label: "Releases", href: LINKS.releases },
  ],
};

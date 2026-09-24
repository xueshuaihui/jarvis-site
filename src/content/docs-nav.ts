/* ============================================================
   文档区导航元数据（轻量模块）：只放壳层与树/TOC 需要的最小数据，
   保证首页 index chunk 不被 manual.ts 全量内容拖大（预算纪律）。
   ============================================================ */

export type DocToc = { id: string; label: string };

export type DocPageMeta = {
  slug: string;
  no: string;
  title: string;
  kicker: string;
  summary: string;
  /** 依据行（页脚小字） */
  basis: string;
  toc: DocToc[];
};

export const DOC_PAGES: DocPageMeta[] = [
  {
    slug: "install",
    no: "01",
    title: "安装与起步",
    kicker: "BOOT SEQUENCE",
    summary: "双架构 dmg 选包、Gatekeeper 首启解除、升级注意与端口口径。",
    basis: "依据：系统操作使用手册 §2",
    toc: [
      { id: "sys-req", label: "系统与分发形态" },
      { id: "install-steps", label: "安装四步" },
      { id: "gatekeeper", label: "首次启动被拦截" },
      { id: "upgrade", label: "升级与旧数据" },
      { id: "ports", label: "端口与地址" },
    ],
  },
  {
    slug: "concepts",
    no: "02",
    title: "核心概念",
    kicker: "CORE SYSTEM",
    summary: "七状态与流转矩阵、双 Token 鉴权、租约、产出物、设置键总表。",
    basis: "依据：系统操作使用手册 §3",
    toc: [
      { id: "states", label: "任务与七状态" },
      { id: "matrix", label: "状态流转矩阵" },
      { id: "review-contract", label: "产出物与强制审核" },
      { id: "tokens", label: "鉴权：UI 与 Agent 两面" },
      { id: "lease", label: "租约与心跳" },
      { id: "custom-fields", label: "自定义字段" },
      { id: "settings-keys", label: "设置键总表" },
    ],
  },
  {
    slug: "board",
    no: "03",
    title: "看板与任务",
    kicker: "BOARD OPS",
    summary: "界面导航、三视图与拖拽规则、键盘操作、创建字段、详情七 Tab、筛选搜索。",
    basis: "依据：系统操作使用手册 §4.1–4.4、§4.6",
    toc: [
      { id: "nav-map", label: "界面导航" },
      { id: "views", label: "三视图与分组呈现" },
      { id: "drag-keys", label: "拖拽与键盘操作" },
      { id: "create", label: "创建任务" },
      { id: "detail", label: "任务详情七 Tab" },
      { id: "filters", label: "筛选、搜索与排序" },
    ],
  },
  {
    slug: "review",
    no: "04",
    title: "审核与通知",
    kicker: "HUMAN GATE",
    summary: "审核表单解剖、审核队列、通知中心的归类与交互。",
    basis: "依据：系统操作使用手册 §4.5、§4.8",
    toc: [
      { id: "entry", label: "三种进入方式" },
      { id: "form", label: "审核表单解剖" },
      { id: "queue", label: "审核队列页" },
      { id: "notify", label: "通知中心" },
    ],
  },
  {
    slug: "skills",
    no: "05",
    title: "技能工作台",
    kicker: "SKILL FORGE",
    summary: "三来源与 94 条内置、七类型 15 块、四种编辑模式、导入导出与任务绑定。",
    basis: "依据：系统操作使用手册 §3.8、§4.10",
    toc: [
      { id: "sources", label: "技能的三个来源" },
      { id: "anatomy", label: "类型与块模型" },
      { id: "editor", label: "编辑器与画布" },
      { id: "versioning", label: "发布、版本与测试" },
      { id: "import", label: "导入与导出" },
      { id: "binding", label: "技能绑定任务" },
    ],
  },
  {
    slug: "org",
    no: "06",
    title: "分组、设置与协作链路",
    kicker: "COMMAND SETUP",
    summary: "分组三层模型、设置九 Tab、需求拆解链路与 Agent 会话直建三模式。",
    basis: "依据：系统操作使用手册 §3.7、§4.7、§4.9、§4.11、§4.12",
    toc: [
      { id: "group-model", label: "分组三层模型" },
      { id: "group-page", label: "分组页与泳道操作" },
      { id: "settings", label: "设置中心九 Tab" },
      { id: "breakdown", label: "需求拆解链路" },
      { id: "creation", label: "会话直建三模式" },
    ],
  },
  {
    slug: "agent",
    no: "07",
    title: "Agent 接入",
    kicker: "UPLINK PROTOCOL",
    summary: "签发 Token、MCP 端点与 26 工具参考、执行闭环、唤醒词协议、创建模版速查。",
    basis: "依据：系统操作使用手册 §5；任务创建模版（Agent 协助）",
    toc: [
      { id: "token", label: "第一步：签发 Agent Token" },
      { id: "endpoint", label: "MCP 端点与配置" },
      { id: "wake", label: "贾维斯唤醒词" },
      { id: "loop", label: "执行闭环七步" },
      { id: "tools", label: "MCP 工具参考（26）" },
      { id: "rest", label: "REST 等价接口" },
      { id: "template", label: "任务创建模版速查" },
      { id: "cursor", label: "Cursor 定时调度" },
    ],
  },
  {
    slug: "data",
    no: "08",
    title: "数据与安全",
    kicker: "SECURITY PERIMETER",
    summary: "网络边界、备份恢复、导入导出、审计日志、数据目录迁移与故障排查。",
    basis: "依据：系统操作使用手册 §6、§7",
    toc: [
      { id: "boundary", label: "本地优先的网络边界" },
      { id: "backup", label: "备份与恢复" },
      { id: "portable", label: "数据导入导出" },
      { id: "audit", label: "审计日志" },
      { id: "dir", label: "数据目录与迁移" },
      { id: "trouble", label: "故障排查" },
      { id: "codes", label: "错误码速查" },
    ],
  },
  {
    slug: "changelog",
    no: "09",
    title: "版本记录",
    kicker: "RELEASE LOG",
    summary: "全部发布批次一览：v0.0.1 起至今均为 prerelease 通道。",
    basis: "依据：仓库 tag 注记与发版记录",
    toc: [
      { id: "log", label: "发布历史" },
      { id: "assets", label: "产物与校验" },
    ],
  },
];

export function docPage(slug: string): DocPageMeta | undefined {
  return DOC_PAGES.find((p) => p.slug === slug);
}


export const RELEASE_BADGE = "v0.0.4-beta.6";

export const HUB_PATHS = [
  { title: "装好并打开", to: "/docs/install", what: "选对架构、解开 Gatekeeper、五分钟进工作台" },
  { title: "跑通第一块任务", to: "/docs/board", what: "从需求池到待执行，让 Agent 领走它" },
  { title: "接入你的 Agent", to: "/docs/agent", what: "签发 Token、配 MCP 端点、说「贾维斯，…」" },
];

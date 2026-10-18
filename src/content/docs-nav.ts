/* ============================================================
   文档区导航元数据（轻量模块）：只放首页与文档壳「首屏就要」的数据
   （slug / 章号 / 标题 / kicker / 一句话定位），保证首页 index chunk
   不被 manual.ts 全量内容拖大（预算纪律，见二期设计稿 §7）。
   本页小节（toc）与依据行（basis）只在文档页里用，放在 manual.ts 的
   DOC_DETAILS —— 它们随文档区 chunk 懒加载，不进首包。
   ============================================================ */

export type DocToc = { id: string; label: string };

export type DocPageMeta = {
  slug: string;
  no: string;
  title: string;
  kicker: string;
  summary: string;
};

export const DOC_PAGES: DocPageMeta[] = [
  {
    slug: "install",
    no: "01",
    title: "安装与起步",
    kicker: "BOOT SEQUENCE",
    summary: "macOS 双架构 dmg 与 Windows x64 安装包选包、首启拦截（Gatekeeper / SmartScreen）解除、升级注意与端口口径。",
  },
  {
    slug: "concepts",
    no: "02",
    title: "核心概念",
    kicker: "CORE SYSTEM",
    summary: "七状态与流转矩阵、双 Token 鉴权、租约、产出物、设置键总表。",
  },
  {
    slug: "board",
    no: "03",
    title: "看板与任务",
    kicker: "BOARD OPS",
    summary: "界面导航、三视图与拖拽规则、键盘操作、创建字段、详情七 Tab、筛选搜索。",
  },
  {
    slug: "review",
    no: "04",
    title: "审核与通知",
    kicker: "HUMAN GATE",
    summary: "审核表单解剖、审核队列、通知中心的归类与交互。",
  },
  {
    slug: "interaction",
    no: "05",
    title: "交互方式",
    kicker: "HUMAN INTERFACE",
    summary: "点、说、代劳三条通道：唤醒词与两种会话、七个常用剧本、确认与撤销、状态信号读法、八条沟通守则。",
  },
  {
    slug: "skills",
    no: "06",
    title: "技能工作台",
    kicker: "SKILL FORGE",
    summary: "三来源与 125 条内置、七类型 15 块、两级分类、四种编辑模式、Agent 发现流程、导入导出与任务绑定。",
  },
  {
    slug: "org",
    no: "07",
    title: "分组、设置与协作链路",
    kicker: "COMMAND SETUP",
    summary: "分组三层模型、设置九 Tab、需求拆解链路与 Agent 会话直建三模式。",
  },
  {
    slug: "agent",
    no: "08",
    title: "Agent 接入",
    kicker: "UPLINK PROTOCOL",
    summary: "签发 Token、MCP 端点与 29 工具参考、执行闭环、唤醒词协议、创建模版速查。",
  },
  {
    slug: "data",
    no: "09",
    title: "数据与安全",
    kicker: "SECURITY PERIMETER",
    summary: "网络边界、备份恢复、导入导出、审计日志、数据目录迁移与故障排查。",
  },
  {
    slug: "changelog",
    no: "10",
    title: "版本记录",
    kicker: "RELEASE LOG",
    summary: "全部发布批次一览：v0.0.1 起至今均为 prerelease 通道。",
  },
];

export function docPage(slug: string): DocPageMeta | undefined {
  return DOC_PAGES.find((p) => p.slug === slug);
}

export const RELEASE_BADGE = "v0.0.4-beta.12";

export const HUB_PATHS = [
  { title: "装好并打开", to: "/docs/install", what: "选对架构、解开 Gatekeeper、五分钟进工作台" },
  { title: "学会跟它说话", to: "/docs/interaction", what: "一句话建任务、拆需求、按技能办事" },
  { title: "接入你的 Agent", to: "/docs/agent", what: "签发 Token、配 MCP 端点、说「贾维斯，…」" },
];

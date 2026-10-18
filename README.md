# Jarvis Workbench 官网（jarvis-site）

Jarvis Workbench（贾维斯客户端）的产品介绍 + 操作手册官网。**独立项目**，与主仓库 `agent-task-board` 无代码依赖；内容事实以主仓库文档为准（口径清单见 `docs/网站架构设计.md` §2、`docs/二级页面架构与内容设计.md` §2）。

- 视觉：钢铁侠 JARVIS 科幻风（深空底 / 弧反应堆青 = 系统与 Agent / repulsor 金 = 人的介入）
- 形态：react-router SPA——单页九区块 Landing（`/`，左缘含常驻文档侧栏 `DocsSideRail`）+ 文档区 11 页（`/docs` Hub + 10 专题，含 Changelog）
- 事实口径：锁 `v0.0.4-beta.12`（29 个 MCP 工具 / 125 条内置技能 / 7 状态）；技能发现面（`search_skills` 打分候选、`get_skill` 按名取正文）随 beta.12 发布，见 `/docs/skills#discovery`
- 交互方式：`/docs/interaction` 是「点 / 说 / 代劳」三条通道的总入口——唤醒词与两档会话、七个可照抄的对话剧本、确认与撤销、状态信号读法、八条沟通守则
- 仓库：`https://github.com/xueshuaihui/jarvis-site`（public，main）；部署宿主待拍板，见「约定」的 SPA fallback 一条
- 设计稿：`docs/网站架构设计.md`、`docs/区块结构与动画设计.md`、`docs/二级页面架构与内容设计.md`（各含评审拍板记录）

## 命令

```bash
npm install
npm run dev        # 开发
npm run build      # 门禁（typecheck + vite build）→ dist/
npm run preview    # 本地预览构建产物（默认端口 4173）

# 走查与回归（需先起 preview 或 dev，端口不同时用 ATB_SITE_URL 覆盖）
ATB_SITE_URL=http://localhost:4390/ npm run shots       # 一期：三档视口×8 区块截图 → /tmp/jarvis-shots
ATB_SITE_URL=http://localhost:4390/ npm run probe       # 一期交互探针：播放器/模块切换/FAQ/reduced-motion
node scripts/shots-docs.mjs                             # 二期：文档区 11 页×三档抽样 + 矩阵 hover + 375 抽屉
node scripts/probe-docs.mjs                             # 二期探针：路由渲染/互链/矩阵/工具过滤/抽屉/reduced-motion
```

## 约定

- 文案与事实只改 `src/content/copy.ts`（首页）与 `src/content/manual.ts`（文档区正文数据）；导航元数据与版本徽章在 `src/content/docs-nav.ts`；颜色 token 只改 `src/styles/globals.css`；动画参数只改 `src/lib/motion.ts`（与设计稿 §A 同步）。
- 下载链接统一指向 GitHub Releases `/latest`；版本号出现面收敛为三处：首页徽章、DocsLayout 底部口径行、`/docs/changelog`（唯一豁免清单页），见二期设计稿 §6。
- 部署：`BrowserRouter` 需宿主开 SPA fallback（任意路径回退 `index.html`），否则 `/docs/*` 深链 404；`vite preview` 自带该回退。
- 布局结论须在 375 / 960 / 1280 三档截图复验（`npm run shots` + `shots-docs.mjs`）。
- 零运行时外部请求、零埋点；`prefers-reduced-motion` 全降级为探针必测项；首包预算 ≤125KB gzip（一期 §E 二期修订）。

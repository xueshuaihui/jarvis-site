# Jarvis Workbench 官网（jarvis-site）

Jarvis Workbench（贾维斯客户端）的产品介绍 + 使用引导静态官网。**独立项目**，与主仓库 `agent-task-board` 无代码依赖；内容事实以主仓库文档为准（口径清单见 `docs/网站架构设计.md` §2）。

- 视觉：钢铁侠 JARVIS 科幻风（深空底 / 弧反应堆青 = 系统与 Agent / repulsor 金 = 人的介入）
- 形态：单页九区块 Landing（Hero / 铁律 / 状态机播放器 / 模块座舱 / 四步开机 / 本地优先 / 下载 / FAQ）
- 设计稿：`docs/网站架构设计.md`（含 §9 评审拍板记录）、`docs/区块结构与动画设计.md`

## 命令

```bash
npm install
npm run dev        # 开发
npm run build      # 门禁（typecheck + vite build）→ dist/
npm run preview    # 本地预览构建产物（默认端口 4173）

# 走查与回归（需先起 preview 或 dev，端口不同时用 ATB_SITE_URL 覆盖）
ATB_SITE_URL=http://localhost:4390/ npm run shots   # 三档视口×8 区块截图 → /tmp/jarvis-shots
ATB_SITE_URL=http://localhost:4390/ npm run probe   # 交互探针：播放器/模块切换/FAQ/reduced-motion
```

## 约定

- 文案与事实只改 `src/content/copy.ts`；颜色 token 只改 `src/styles/globals.css`；动画参数只改 `src/lib/motion.ts`（三者与设计稿 §A 同步）。
- 下载链接统一指向 GitHub Releases `/latest`，版本号徽章仅一处（`LATEST_BADGE`）。
- 布局结论须在 375 / 960 / 1280 三档截图复验（`npm run shots`）。
- 零运行时外部请求、零埋点；`prefers-reduced-motion` 全降级为探针必测项。

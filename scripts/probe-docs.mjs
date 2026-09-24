#!/usr/bin/env node
/** 文档区交互回归探针（设计稿 §7）：路由渲染 / 互链 / 矩阵 hover / 工具过滤 / 抽屉 / reduced-motion / 26 工具口径 */
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.ATB_SITE_URL ?? "http://localhost:4390/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const ok = (name, pass, extra = "") => results.push(`${pass ? "PASS" : "FAIL"} ${name}${extra ? " · " + extra : ""}`);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

const SLUGS = ["", "install", "concepts", "board", "review", "skills", "org", "agent", "data", "changelog"];

// 1) 10 条路由深链渲染：h2 页题存在、文档壳（Nav + 口径行）在位
for (const s of SLUGS) {
  await page.goto(`${BASE}docs/${s}`, { waitUntil: "networkidle0" });
  await sleep(700);
  const r = await page.evaluate((slug) => {
    const h2 = document.querySelector("main h2")?.textContent?.trim() ?? "";
    const caliber = document.body.textContent.includes("文档口径对齐");
    const basis = slug ? document.body.textContent.includes("依据") : true;
    return { h2, caliber, basis };
  }, s);
  ok(`route-/docs/${s}`, Boolean(r.h2) && r.caliber && r.basis, r.h2);
}

// 2) 首页互链：Download 区「操作手册」入口卡 → /docs
await page.goto(BASE, { waitUntil: "networkidle0" });
await sleep(1200);
await page.evaluate(() => document.querySelector('#download a[href="/docs"]').scrollIntoView());
await sleep(500);
await page.evaluate(() => document.querySelector('#download a[href="/docs"]').click());
await page.waitForFunction(() => location.pathname === "/docs", { timeout: 5000 });
ok("home-entry-card-to-docs", page.url().endsWith("/docs"));

// 3) 侧栏 rail：点「Agent 接入」→ URL 与 active 状态切换
await page.evaluate(() => {
  const link = [...document.querySelectorAll("aside nav a")].find((a) => a.textContent.includes("Agent"));
  link.click();
});
await page.waitForFunction(() => location.pathname === "/docs/agent", { timeout: 5000 });
await sleep(600);
const railActive = await page.evaluate(() => {
  const links = [...document.querySelectorAll("aside nav a")];
  const act = links.filter((a) => a.getAttribute("aria-current") || a.className.includes("gold"));
  return { total: links.length, active: act.map((a) => a.getAttribute("href")) };
});
ok("rail-nav-to-agent", railActive.active.includes("/docs/agent"), `links=${railActive.total}`);

// 4) 矩阵：表头「从 \ 到」定位矩阵表本体，7 行 × 7 列、hover 十字高亮 13 格
await page.goto(`${BASE}docs/concepts`, { waitUntil: "networkidle0" });
await sleep(700);
const MATRIX_SEL = "main table";
const matrix = await page.evaluate((sel) => {
  const table = [...document.querySelectorAll(sel)].find((t) => t.querySelector("th")?.textContent.includes("从"));
  table.id = "atb-matrix";
  const rows = table.querySelectorAll("tbody tr").length;
  const cols = table.querySelector("tbody tr").querySelectorAll("td").length;
  return { rows, cols };
}, MATRIX_SEL);
const T = "#atb-matrix";
await page.evaluate((t) => document.querySelector(t).scrollIntoView({ block: "center" }), T);
await sleep(400);
const hl = await page.evaluate((t) => document.querySelectorAll(`${t} td.bg-arc-faint`).length, T);
let crossCount = hl;
if (crossCount === 0) {
  const box = await (await page.$(`${T} tbody tr:nth-child(2) td:nth-child(4)`)).boundingBox();
  await page.mouse.move(box.x - 40, box.y - 40);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await sleep(300);
  crossCount = await page.evaluate((t) => document.querySelectorAll(`${t} td.bg-arc-faint`).length, T);
}
ok("matrix-7x7", matrix.rows === 7 && matrix.cols === 7, `${matrix.rows}x${matrix.cols}`);
ok("matrix-hover-cross-13", crossCount === 13, `lit=${crossCount}`);

// 5) 工具表：全集 26 口径、过滤命中、beta.6 未含工具不出现
await page.goto(`${BASE}docs/agent`, { waitUntil: "networkidle0" });
await sleep(700);
const toolsAll = await page.evaluate(() => document.body.textContent.includes("tools/list 全集 26 工具"));
ok("toolcount-26-caliber", toolsAll);
const noBeta7 = await page.evaluate(
  () => !document.body.textContent.includes("update_task") && !document.body.textContent.includes("update_skill"),
);
ok("toolcount-no-post-beta6", noBeta7);
await page.type('input[aria-label="过滤 MCP 工具"]', "拆解");
await sleep(400);
const filtered = await page.evaluate(() => {
  const m = document.body.textContent.match(/命中 (\d+) \/ 26/);
  return m ? Number(m[1]) : -1;
});
ok("tool-filter-hit", filtered > 0 && filtered < 26, `命中 ${filtered}`);
await page.evaluate(() => {
  const input = document.querySelector('input[aria-label="过滤 MCP 工具"]');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  setter.call(input, "zzqx无匹配");
  input.dispatchEvent(new Event("input", { bubbles: true }));
});
await sleep(400);
const emptyState = await page.evaluate(() => document.body.textContent.includes("NO MATCH"));
ok("tool-filter-empty-state", emptyState);
await page.evaluate(() => document.querySelector('input[aria-label="过滤 MCP 工具"]').closest("label").querySelector("button").click());
await sleep(300);
const cleared = await page.evaluate(() => document.body.textContent.includes("tools/list 全集 26 工具"));
ok("tool-filter-clear", cleared);

// 6) reduced-motion：页切换瞬切（400ms 内内容到位、切换后无残留动画）
const rm = await browser.newPage();
await rm.setViewport({ width: 1280, height: 900 });
await rm.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
await rm.goto(`${BASE}docs/install`, { waitUntil: "networkidle0" });
await sleep(500);
await rm.evaluate(() => {
  [...document.querySelectorAll("aside nav a")].find((a) => a.getAttribute("href") === "/docs/skills").click();
});
let instant = true;
try {
  await rm.waitForFunction(() => document.querySelector("main h2")?.textContent.includes("技能"), { timeout: 450 });
} catch {
  instant = false;
}
await sleep(800);
// 规约是「正文区禁循环动画」：允许 ≤200ms 的 opacity 淡入淡出，故断言无无限动画而非瞬时计数
const looping = await rm.evaluate(() =>
  document
    .getAnimations({ subtree: true })
    .filter((a) => a.playState === "running" && a.effect?.getComputedTiming?.().iterations === Infinity).length,
);
ok("reduced-motion-swap-instant", instant);
ok("reduced-motion-no-looping-anims", looping === 0, `looping=${looping}`);
await rm.close();

// 7) 375 抽屉：打开→10 条链接→点选后关合并导航
await page.setViewport({ width: 375, height: 812 });
await page.goto(`${BASE}docs/install`, { waitUntil: "networkidle0" });
await sleep(700);
await page.evaluate(() => {
  [...document.querySelectorAll("main button[aria-expanded]")].find((b) => b.textContent.includes("文档目录")).click();
});
await sleep(600);
const drawer = await page.evaluate(() => {
  const btn = [...document.querySelectorAll("main button[aria-expanded]")][0];
  const links = [...document.querySelectorAll("main a[href^='/docs']")];
  return { open: btn.getAttribute("aria-expanded") === "true", links: links.length };
});
ok("mobile-drawer-open", drawer.open && drawer.links >= 9, `links=${drawer.links}`);
await page.evaluate(() => {
  [...document.querySelectorAll("main a[href^='/docs']")].find((a) => a.getAttribute("href") === "/docs/board").click();
});
await page.waitForFunction(() => location.pathname === "/docs/board", { timeout: 5000 });
await sleep(700);
const closed = await page.evaluate(() => [...document.querySelectorAll("main button[aria-expanded]")][0]?.getAttribute("aria-expanded"));
ok("mobile-drawer-navigate-and-close", closed === "false");

await browser.close();
console.log(results.join("\n"));
console.log(errors.length ? `PAGE ERRORS:\n${errors.join("\n")}` : "no page errors");
process.exit(results.some((r) => r.startsWith("FAIL")) || errors.length ? 1 : 0);

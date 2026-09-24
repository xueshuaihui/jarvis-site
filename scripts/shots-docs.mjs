#!/usr/bin/env node
/**
 * 文档区走查截图（设计稿 §7）：10 页 × 三档视口抽样 + 矩阵 hover + 375 抽屉展开。
 * 用法：node scripts/shots-docs.mjs [outDir]（默认 /tmp/jarvis-shots）
 */
import { mkdirSync } from "node:fs";
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.ATB_SITE_URL ?? "http://localhost:4390/";
const OUT = process.argv[2] ?? "/tmp/jarvis-shots";
const PAGES = ["", "install", "concepts", "board", "review", "skills", "org", "agent", "data", "changelog"];
const ALL_VP_PAGES = ["", "concepts", "agent", "data"]; // 全档复验页：Hub / 矩阵招牌件 / 最长工具页 / 表格页
const VIEWPORTS = [
  { name: "w1280", width: 1280, height: 900 },
  { name: "w960", width: 960, height: 1200 },
  { name: "w375", width: 375, height: 812 },
];

mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

const shoot = async (vp, slug, hash = "") => {
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
  await page.goto(`${BASE}docs/${slug}${hash}`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 900)); // L2 页入收敛（正文无 scroll reveal）
  const name = `${vp.name}-docs-${slug || "hub"}`;
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`${name}.png`);
};

for (const vp of VIEWPORTS) {
  for (const slug of PAGES) {
    if (vp.name !== "w1280" && !ALL_VP_PAGES.includes(slug)) continue;
    await shoot(vp, slug);
  }
}

// 矩阵 hover 十字（w1280）
await page.setViewport({ width: 1280, height: 900 });
await page.goto(`${BASE}docs/concepts`, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 900));
await page.evaluate(() => {
  const t = [...document.querySelectorAll("main table")].find((x) => x.querySelector("th")?.textContent.includes("从"));
  t.scrollIntoView({ block: "center" });
});
await new Promise((r) => setTimeout(r, 300));
const cell = await page.evaluateHandle(() => {
  const t = [...document.querySelectorAll("main table")].find((x) => x.querySelector("th")?.textContent.includes("从"));
  return t.querySelector("tbody tr:nth-child(4) td:nth-child(5)");
});
const cb = await cell.boundingBox();
await page.mouse.move(cb.x - 30, cb.y - 30);
await page.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2);
await new Promise((r) => setTimeout(r, 350));
await page.screenshot({ path: `${OUT}/w1280-docs-matrix-hover.png` });
console.log("w1280-docs-matrix-hover.png");

// 375 抽屉展开
await page.setViewport({ width: 375, height: 812 });
await page.goto(`${BASE}docs/board`, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 900));
await page.evaluate(() => {
  [...document.querySelectorAll("main button[aria-expanded]")].find((b) => b.textContent.includes("文档目录")).click();
});
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: `${OUT}/w375-docs-drawer-open.png` });
console.log("w375-docs-drawer-open.png");

await browser.close();
console.log(errors.length ? `CONSOLE/PAGE ERRORS:\n${errors.join("\n")}` : "no page errors");

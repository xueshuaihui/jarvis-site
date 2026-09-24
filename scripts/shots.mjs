#!/usr/bin/env node
/**
 * 走查截图脚本：puppeteer-core + 系统 Chrome。
 * 用法：node scripts/shots.mjs [outDir]（默认 /tmp/jarvis-shots）
 * 三档视口 × 全区块，滚动到位并等入场动画收敛后截图。
 */
import { mkdirSync } from "node:fs";
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.ATB_SITE_URL ?? "http://localhost:4390/";
const OUT = process.argv[2] ?? "/tmp/jarvis-shots";
const SECTIONS = ["hero", "principles", "workflow", "modules", "quickstart", "local", "download", "faq"];
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

for (const vp of VIEWPORTS) {
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
  await page.goto(BASE, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1800)); // Hero 入场序列走完
  for (const sec of SECTIONS) {
    await page.evaluate((id) => {
      document.documentElement.style.scrollBehavior = "auto";
      document.getElementById(id)?.scrollIntoView({ block: "start" });
      window.scrollBy(0, -72); // 让开固定顶栏
    }, sec);
    await new Promise((r) => setTimeout(r, 1500)); // whileInView 动画收敛
    await page.screenshot({ path: `${OUT}/${vp.name}-${sec}.png` });
    console.log(`${vp.name}-${sec}.png`);
  }
}
await browser.close();
console.log(errors.length ? `CONSOLE/PAGE ERRORS:\n${errors.join("\n")}` : "no page errors");

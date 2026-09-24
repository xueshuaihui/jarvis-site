#!/usr/bin/env node
/** 交互回归探针：播放器 / 模块切换 / FAQ / reduced-motion */
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.ATB_SITE_URL ?? "http://localhost:4390/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const ok = (name, pass, extra = "") => results.push(`${pass ? "PASS" : "FAIL"} ${name}${extra ? " · " + extra : ""}`);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });

/* ---- 常规模式 ---- */
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(BASE, { waitUntil: "networkidle0" });
await sleep(1500);

// 1) 状态机播放器：点播放 → STEP 计数前进、金卡换节点
const stepText = () => page.$eval("#workflow .tnum", (el) => el.textContent.trim());
const before = await stepText();
await page.evaluate(() => document.querySelector('#workflow [aria-label="播放"]').click());
await sleep(1600);
const after = await stepText();
ok("workflow-player-step-advance", before !== after, `${before} → ${after}`);

// 2) 模块切换：点「Agent 接入」→ 画框内出现 tools/list 终端
await page.evaluate(() => {
  const btns = [...document.querySelectorAll("#modules [role=tab]")];
  btns.find((b) => b.textContent.includes("Agent"))?.click();
});
await sleep(600);
const agentSketch = await page.evaluate(() => document.querySelector("#modules").textContent.includes("tools/list"));
ok("modules-tab-switch", agentSketch);

// 3) FAQ 手风琴：展开第一项且同屏仅 1 项
await page.evaluate(() => {
  document.querySelector("#faq button[aria-expanded]").click();
});
await sleep(500);
const faqState = await page.evaluate(() => {
  const open = [...document.querySelectorAll("#faq button")].filter((b) => b.getAttribute("aria-expanded") === "true");
  return open.length;
});
ok("faq-single-open", faqState === 1, `open=${faqState}`);

// 4) 导航锚点存在与可达
const anchors = await page.evaluate(() =>
  ["hero", "principles", "workflow", "modules", "quickstart", "local", "download", "faq"].every((id) => document.getElementById(id)),
);
ok("section-anchors", anchors);

/* ---- reduced-motion ---- */
const rm = await browser.newPage();
await rm.setViewport({ width: 1280, height: 900 });
await rm.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
await rm.goto(BASE, { waitUntil: "networkidle0" });
await sleep(1200);
const rmHero = await rm.evaluate(() => {
  const hero = document.getElementById("hero");
  const typed = hero.textContent.includes("「贾维斯，把需求拆解后交给 Agent 执行。」");
  const cardInReview = (() => {
    const cols = [...hero.querySelectorAll(".grid-cols-3 > div")];
    const review = cols[2];
    return review && review.textContent.includes("示例任务");
  })();
  return { typed, cardInReview };
});
ok("reduced-motion-typewriter-full-text", rmHero.typed);
ok("reduced-motion-hero-card-frozen-review", rmHero.cardInReview);
await rm.screenshot({ path: "/tmp/jarvis-shots/rm-hero.png" });

await browser.close();
console.log(results.join("\n"));
console.log(errors.length ? `PAGE ERRORS:\n${errors.join("\n")}` : "no page errors");
process.exit(results.some((r) => r.startsWith("FAIL")) || errors.length ? 1 : 0);

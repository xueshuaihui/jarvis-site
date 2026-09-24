import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Nav } from "../components/shell/Nav";
import { Footer } from "../components/shell/Footer";
import { Hero } from "../components/sections/Hero";
import { Principles } from "../components/sections/Principles";
import { Workflow } from "../components/sections/Workflow";
import { Modules } from "../components/sections/Modules";
import { QuickStart } from "../components/sections/QuickStart";
import { LocalFirst } from "../components/sections/LocalFirst";
import { Download } from "../components/sections/Download";
import { Faq } from "../components/sections/Faq";

/**
 * 一期首页 Landing（叙事流原样保留）：唤醒(Hero) → 铁律 → 旅程(状态机) → 座舱(模块)
 * → 开机(上手) → 本地 → 下载(含手册入口卡) → FAQ。
 * 同屏编排互斥：S3 播放器播放时，Hero 常驻循环暂停。
 * 从 /docs 带 hash 回到首页时，滚动定位到对应区块。
 */
export default function HomePage() {
  const [s3Playing, setS3Playing] = useState(false);
  const onPlayingChange = useCallback((p: boolean) => setS3Playing(p), []);
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.replace(/^#/, ""));
    if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
  }, [hash]);

  return (
    <>
      <Nav />
      <main className="relative">
        <Hero paused={s3Playing} />
        <Principles />
        <Workflow onPlayingChange={onPlayingChange} />
        <Modules />
        <QuickStart />
        <LocalFirst />
        <Download />
        <Faq />
      </main>
      <Footer />
    </>
  );
}

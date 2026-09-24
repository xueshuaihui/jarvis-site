import { useCallback, useState } from "react";
import { Backdrop } from "./components/shell/Backdrop";
import { Nav } from "./components/shell/Nav";
import { Footer } from "./components/shell/Footer";
import { Hero } from "./components/sections/Hero";
import { Principles } from "./components/sections/Principles";
import { Workflow } from "./components/sections/Workflow";
import { Modules } from "./components/sections/Modules";
import { QuickStart } from "./components/sections/QuickStart";
import { LocalFirst } from "./components/sections/LocalFirst";
import { Download } from "./components/sections/Download";
import { Faq } from "./components/sections/Faq";

/**
 * 单页叙事流：唤醒(Hero) → 铁律 → 旅程(状态机) → 座舱(模块) → 开机(上手) → 本地 → 下载 → FAQ。
 * 同屏编排互斥：S3 播放器播放时，Hero 常驻循环暂停。
 */
export default function App() {
  const [s3Playing, setS3Playing] = useState(false);
  const onPlayingChange = useCallback((p: boolean) => setS3Playing(p), []);

  return (
    <>
      <Backdrop />
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

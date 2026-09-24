import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/globals.css";

/** 截图/回归辅助：?snap=<sectionId> 时关掉平滑滚动并直接定位到该区块（仅首页） */
const snap = new URLSearchParams(window.location.search).get("snap");
if (snap) {
  document.documentElement.style.scrollBehavior = "auto";
  requestAnimationFrame(() => {
    document.getElementById(snap)?.scrollIntoView({ block: "start" });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

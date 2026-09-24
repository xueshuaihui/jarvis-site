import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Backdrop } from "./components/shell/Backdrop";
import HomePage from "./pages/HomePage";

/** 文档区整体路由级分包（含 DocsLayout 与 Hub）：首页 bundle 不回退（设计稿 F1/§5） */
const DocsLayout = lazy(() => import("./components/shell/DocsLayout"));
const DocsHubPage = lazy(() => import("./pages/docs/DocsHubPage"));
const InstallPage = lazy(() => import("./pages/docs/InstallPage"));
const ConceptsPage = lazy(() => import("./pages/docs/ConceptsPage"));
const BoardPage = lazy(() => import("./pages/docs/BoardPage"));
const ReviewPage = lazy(() => import("./pages/docs/ReviewPage"));
const SkillsPage = lazy(() => import("./pages/docs/SkillsPage"));
const OrgPage = lazy(() => import("./pages/docs/OrgPage"));
const AgentPage = lazy(() => import("./pages/docs/AgentPage"));
const DataPage = lazy(() => import("./pages/docs/DataPage"));
const ChangelogPage = lazy(() => import("./pages/docs/ChangelogPage"));

export default function App() {
  return (
    <>
      <Backdrop />
      <Suspense
        fallback={
          <div className="relative z-10 flex h-screen items-center justify-center font-mono text-xs text-arc/70">
            // LOADING▌
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/docs" element={<DocsLayout />}>
            <Route index element={<DocsHubPage />} />
            <Route path="install" element={<InstallPage />} />
            <Route path="concepts" element={<ConceptsPage />} />
            <Route path="board" element={<BoardPage />} />
            <Route path="review" element={<ReviewPage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="org" element={<OrgPage />} />
            <Route path="agent" element={<AgentPage />} />
            <Route path="data" element={<DataPage />} />
            <Route path="changelog" element={<ChangelogPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

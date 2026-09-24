import { Link } from "react-router-dom";
import { docPage } from "../../content/docs-nav";
import { FACTS } from "../../content/manual";
import { LINKS } from "../../content/copy";
import { PageHeader, Section, P, UL, Code } from "../../components/prose/primitives";
import { ProseTable } from "../../components/prose/ProseTable";
import { Callout } from "../../components/prose/Callout";
import { StepsBlock } from "../../components/prose/StepsBlock";

const meta = docPage("install")!;

/** /docs/install 安装与起步（手册 §2） */
export default function InstallPage() {
  return (
    <div>
      <PageHeader meta={meta} />

      <Section id="sys-req" title="系统与分发形态">
        <P>
          Jarvis Workbench 是 <strong className="text-hi">macOS 原生桌面应用</strong>（Tauri 2 壳 + 本地 sidecar），
          业务数据全部存于本机 <Code>{FACTS.dataDir}</Code>，不依赖任何远端服务——断网可用。
          Windows / Linux 尚未交付（Coming later）。
        </P>
        <UL
          items={[
            "发布形态：GitHub Releases 上的 .dmg，双架构各一份（arm64 原生 / x64 原生），随附 SHA256SUMS.txt。",
            "签名状态：ad-hoc 签名、未公证——首次打开被 Gatekeeper 拦截属预期，见下文解除方式。",
            "通道：v0.0.x 全部为 prerelease 验证通道（至今无正式版），核心链路已按清单真机验收。",
          ]}
        />
        <Callout tone="info" title="去哪下载">
          <p>
            统一入口：<a href={LINKS.releasesLatest} target="_blank" rel="noreferrer" className="text-arc underline decoration-arc/40">GitHub Releases（latest）</a>。按机器架构选包：Apple Silicon 用 arm64，不需要 Rosetta；2020 年前 Intel 机型用 x64。
          </p>
        </Callout>
      </Section>

      <Section id="install-steps" title="安装四步">
        <StepsBlock
          items={[
            { title: "下载对应架构的 .dmg", body: <p>双架构包同名不同后缀（_arm64 / _x64），拿不准就在「关于本机」看芯片。建议顺手校验 SHA256SUMS。</p> },
            { title: "挂载并拖入「应用程序」", body: <p>打开 .dmg，把 Jarvis Workbench.app 拖进 Applications。拦截只发生在首次运行 .app 时，下载、挂载、拷贝均不受影响。</p> },
            { title: "首次启动解除 Gatekeeper", body: <p>见下一节二选一。解除后正常启动，之后不再询问。</p> },
            { title: "打开即工作台", body: <p>没有注册、没有登录——本机单用户，左侧导航五页（看板 / 分组 / 技能 / 审核 / 设置）直接可用。</p> },
          ]}
        />
      </Section>

      <Section id="gatekeeper" title="首次启动被拦截">
        <P>当前产物经 ad-hoc 签名、未做 Apple 公证，首次双击可能提示「无法验证开发者」。两种解法任选其一：</P>
        <ProseTable
          head={["方式", "操作", "适用"]}
          rows={[
            ["右键打开", "右键 .app →「打开」→ 弹窗再点「打开」", "一次性确认，之后正常启动"],
            ["终端解除", <Code key="x">{`xattr -cr "/Applications/Jarvis Workbench.app"`}</Code>, "批量部署或脚本化场景"],
          ]}
        />
        <Callout tone="warn" title="若提示「已损坏」">
          <p>Apple Silicon 上双击判「已损坏，无法打开」多见于零签名的早期包——升级到最新 beta 包即可，新包已修复该判定。</p>
        </Callout>
      </Section>

      <Section id="upgrade" title="升级与旧数据">
        <UL
          items={[
            <>升级前先删旧版：产品更名后 bundle identifier 已变更，macOS 视新旧包为两个应用——<strong className="text-hi">先把旧 Jarvis Workbench.app 移到废纸篓</strong>再装新包，否则通知授权等系统权限不继承。</>,
            <>数据安全：业务数据在 <Code>{FACTS.dataDir}/{FACTS.dbFile}</Code>（SQLite），与 identifier 无关，升级原地可读。</>,
            <>首启自动搬迁：从 v0.0.3 及更早升级时，旧目录 <Code>{FACTS.legacyDir}</Code> 会在首次启动被一次性自动迁入新目录（先备份、校验完整性、旧库封存）。搬迁成功即不可逆；失败则自动回滚、旧版仍可启动。详见<Link to="/docs/data" className="text-arc underline decoration-arc/40">数据与安全 · 目录迁移</Link>。</>,
            "换 identifier 后只有界面偏好回默认值（分组/视图偏好随后由本地库水合回来），业务数据不受影响。",
          ]}
        />
        <Callout tone="info" title="升级前建议">
          <p>设置 → 备份 →「立即备份」导出一份一致性快照，仅需几秒（见 <Link to="/docs/data" className="text-arc underline decoration-arc/40">备份与恢复</Link>）。</p>
        </Callout>
      </Section>

      <Section id="ports" title="端口与地址">
        <P>
          本地 sidecar 仅绑定 <Code>127.0.0.1</Code>，同一端口复用 REST（<Code>/api/v1</Code>）、MCP（<Code>/mcp</Code>）与 WebSocket（<Code>/ws</Code>）三条通道。端口三级决定，优先级从高到低：
        </P>
        <ProseTable
          head={["优先级", "来源", "默认"]}
          rows={[
            ["1", <Code key="a">ATB_PORT</Code>, "—"],
            ["2", <Code key="b">config.json → port</Code>, "—"],
            ["3", "内置默认", String(FACTS.mcpPort)],
          ]}
        />
        <P>
          端口不在设置页内。改端口用环境变量或数据目录里的 <Code>config.json</Code>；前端与 MCP 端点地址随端口联动（见 <Link to="/docs/agent" className="text-arc underline decoration-arc/40">Agent 接入</Link>）。
        </P>
        <Callout tone="info" title="开发者附录">
          <p>
            仓库内开发模式（Node ≥ 20）：<Code>npm install</Code> → <Code>npm run prisma</Code> → <Code>npm run dev:api</Code> → <Code>npm run dev:web</Code>。
            sidecar 就绪会输出唯一一行 <Code>ATB_READY {"{...}"}</Code>。桌面打包与发布链路见仓库《发布手册》，本站不复述。
          </p>
        </Callout>
      </Section>
    </div>
  );
}

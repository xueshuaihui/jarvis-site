import { Link } from "react-router-dom";
import { docPage, RELEASE_BADGE } from "../../content/docs-nav";
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
          Jarvis Workbench 是 <strong className="text-hi">macOS / Windows 原生桌面应用</strong>（Tauri 2 壳 + 本地 sidecar），
          业务数据全部存于本机，不依赖任何远端服务——断网可用。
          Windows 当前仅 x64；Linux 尚未交付（Coming later）。
        </P>
        <UL
          items={[
            "发布形态：GitHub Releases 上 macOS .dmg 双架构各一份（arm64 原生 / x64 原生）+ Windows x64 NSIS 安装包（.exe），随附 SHA256SUMS.txt。",
            "签名状态：macOS 为 ad-hoc 签名、未公证——首次打开被 Gatekeeper 拦截属预期；Windows 未签名——首启出现 SmartScreen 蓝框属预期。两种拦截的放行方式见下文，无需关闭系统防护。",
            "通道：v0.0.x 全部为 prerelease 验证通道（至今无正式版），macOS 核心链路已按清单真机验收；Windows 包自 v0.0.4-beta.8 起出包，真机安装验证仍在进行中。",
          ]}
        />
        <Callout tone="info" title="去哪下载">
          <p>
            统一入口：<a href={LINKS.releasesLatest} target="_blank" rel="noreferrer" className="text-arc underline decoration-arc/40">GitHub Releases（latest）</a>，
            当前批次：<a href={LINKS.releaseTag} target="_blank" rel="noreferrer" className="text-arc underline decoration-arc/40">{RELEASE_BADGE}</a>。
            按机器选包：Apple Silicon 用 <Code>Jarvis.Workbench_0.1.0_arm64.dmg</Code>（不需要 Rosetta）；2020 年前 Intel 机型用 <Code>Jarvis.Workbench_0.1.0_x64.dmg</Code>；Windows 10 / 11 x64 用 <Code>Jarvis.Workbench_0.1.0_x64-setup.exe</Code>。
          </p>
        </Callout>
      </Section>

      <Section id="install-steps" title="安装四步">
        <P>macOS（.dmg）：</P>
        <StepsBlock
          items={[
            { title: "下载对应架构的 .dmg", body: <p>双架构包同名不同后缀（_arm64 / _x64），拿不准就在「关于本机」看芯片。建议顺手校验 SHA256SUMS。</p> },
            { title: "挂载并拖入「应用程序」", body: <p>打开 .dmg，把 Jarvis Workbench.app 拖进 Applications。拦截只发生在首次运行 .app 时，下载、挂载、拷贝均不受影响。</p> },
            { title: "首次启动解除 Gatekeeper", body: <p>见下一节二选一。解除后正常启动，之后不再询问。</p> },
            { title: "打开即工作台", body: <p>没有注册、没有登录——本机单用户，左侧导航五页（看板 / 分组 / 技能 / 审核 / 设置）直接可用。</p> },
          ]}
        />
        <P>
          Windows（.exe，仅 x64，自 {RELEASE_BADGE} 批次起提供）：双击 <Code>Jarvis.Workbench_0.1.0_x64-setup.exe</Code> 安装即可——
          per-user 安装、不弹 UAC，默认装入 <Code>%LOCALAPPDATA%\Jarvis Workbench</Code>；<strong className="text-hi">安装时需要联网</strong>，
          安装器会拉取 WebView2 Evergreen 运行库（Win11 与更新过的 Win10 通常已自带；Windows N 版 / LTSC / Server Core 上没有，需保证联网或预装）。
          Windows 上数据目录为 <Code>%APPDATA%\jarvis-workbench</Code>（<Code>ATB_DATA_DIR</Code> 可覆盖），日志独立于数据、落在 <Code>%APPDATA%\AgentTaskBoard\logs</Code>。
        </P>
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
        <P>
          Windows 首启：安装包未签名，首次运行会弹 SmartScreen 蓝框「Windows 已保护你的电脑 / 未知发布者」——
          点「<strong className="text-hi">更多信息</strong>」→「<strong className="text-hi">仍要运行</strong>」放行，仅需确认这一次。
          无需（也不建议）为此关闭 Defender 或 SmartScreen。
        </P>
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

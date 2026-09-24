import { Link } from "react-router-dom";
import { docPage, RELEASE_BADGE } from "../../content/docs-nav";
import {
  AGENT_LOOP,
  CAPABILITY_NS,
  CURSOR_ENV,
  CURSOR_NOTES,
  FACTS,
  MCP_CONFIG_JSON,
  REST_AGENT_ENDPOINTS,
  TEMPLATE_CURL,
  TEMPLATE_FIELDS,
  TEMPLATE_RULES,
  TEMPLATE_SPEECH,
  TASK_TEMPLATE_JSON,
  TRIPLE_NOTE,
  WAKE_MODES,
} from "../../content/manual";
import { PageHeader, Section, P, UL, Code } from "../../components/prose/primitives";
import { ProseTable } from "../../components/prose/ProseTable";
import { CodeBlock } from "../../components/prose/CodeBlock";
import { Callout } from "../../components/prose/Callout";
import { LoopSteps } from "../../components/prose/StepsBlock";
import { ToolRefTable } from "../../components/prose/ToolRefTable";

const meta = docPage("agent")!;

/** /docs/agent Agent 接入（手册 §5 + 任务创建模版）：26 工具参考表是本页招牌件 */
export default function AgentPage() {
  return (
    <div>
      <PageHeader meta={meta} />

      <Section id="token" title="第一步：签发 Agent Token">
        <UL
          items={[
            <>打开 <strong className="text-hi">设置 → Token</strong>，签发一个 Agent Token：格式 <Code>atb_</Code> + 40 位，<strong className="text-hi">明文只出现一次</strong>，当场妥存。</>,
            <>给 Token 标注 capabilities（命名空间 {CAPABILITY_NS.join(" / ")}，格式 <Code>namespace:value</Code>，如 <Code>repo:my-app</Code>）——任务上的「所需能力」会据此过滤可认领队列。</>,
            "吊销而非删除：置灰后调用即 401，历史执行归属仍保留；没有重新启用一说，要换新 Token 就再签一个。",
          ]}
        />
        <Callout tone="warn" title="Token 卫生">
          <p>Token 等于本机工作台的 Agent 侧钥匙。别贴在公开截图 / 对话记录里；怀疑泄露就立即吊销重签。</p>
        </Callout>
      </Section>

      <Section id="endpoint" title="MCP 端点与配置">
        <P>
          MCP 走无状态 Streamable HTTP，端点 <Code>{FACTS.mcpEndpoint}</Code>。任何支持 MCP 的客户端（Qoder / Claude Code / Cursor / Codex…）加上下面的连接配置即可：
        </P>
        <CodeBlock label="mcp config · json" code={MCP_CONFIG_JSON} />
        <UL
          items={[
            "认证：请求头 Authorization: Bearer + 你的 Agent Token（atb_ 开头）。",
            "端点与 REST、WebSocket 同端口复用；只绑 127.0.0.1——只有这台电脑上的进程连得进来。",
            "写回类调用必须带 task_id + run_id + lease_id 三元组（认领响应里给）。",
          ]}
        />
      </Section>

      <Section id="wake" title="贾维斯唤醒词">
        <P>
          接入本 MCP server 后，不用逐次写提示词驱动工具调用——在客户端对话里说一句
          <strong className="text-hi">「贾维斯，… 」</strong>（例：「贾维斯，创建一个任务：明天发布」）即进入 Jarvis Workbench 工作模式，
          Agent 直接用看板工具完成请求、不反问是否使用工具；与唤醒无关的普通对话不会触发看板工具。
        </P>
        <ProseTable head={["模式", "语义"]} rows={WAKE_MODES.map((m) => [m.name, m.what])} />
        <UL
          items={[
            <>切换入口：设置 → Token → 「贾维斯唤醒模式」（<Code>mcp_wake_mode</Code>）。</>,
            "连续对话模式下，说到「退出贾维斯」（或同义退出指令）才退出工作模式。",
            "协议全文由服务端在 MCP 连接的 initialize 响应里整段下发，客户端 Agent 自动遵循、无需手工配置；改动在下一次连接（重连或新会话）生效。",
          ]}
        />
      </Section>

      <Section id="loop" title="执行闭环七步">
        <P>从排队到验收，Agent 视角的完整一圈：</P>
        <LoopSteps items={AGENT_LOOP} />
        <Callout tone="danger" title="三元组契约">
          <p>{TRIPLE_NOTE}</p>
          <p>
            失效后再回写 complete / fail 返回 410；租约过期同理——重新认领才是正路。界面侧对应的拦截见
            <Link to="/docs/data" className="text-arc underline decoration-arc/40"> 错误码速查</Link>。
          </p>
        </Callout>
      </Section>

      <Section id="tools" title={`MCP 工具参考（${FACTS.toolCount}）`}>
        <P>
          tools/list 全集 {FACTS.toolCount} 个（{RELEASE_BADGE} 口径），分三组。输入输出 schema 以连接后 tools/list 现值为准——
          建议先调 <Code>get_vocabulary</Code> 一次拿全服务端词表，杜绝试错造数据。
        </P>
        <ToolRefTable />
      </Section>

      <Section id="rest" title="REST 等价接口">
        <P>不想走 MCP 的自研执行器，可用 REST Agent 组（前缀 <Code>/api/v1</Code>，与 MCP 工具同一套守卫）：</P>
        <ProseTable head={["端点", "作用"]} rows={REST_AGENT_ENDPOINTS.map((r) => [<Code key={r[0]}>{r[0]}</Code>, r[1]])} />
      </Section>

      <Section id="template" title="任务创建模版速查">
        <P>把下面的模版发给任意 AI 助手，说「按这个模版帮我建任务」——它填 JSON，你确认后创建（人工创建也可照抄字段）：</P>
        <CodeBlock label="task template · jsonc" code={TASK_TEMPLATE_JSON} />
        <ProseTable
          head={["字段", "必填", "约束（越界一律 400）"]}
          rows={TEMPLATE_FIELDS.map((f) => [<Code key={f.field}>{f.field}</Code>, f.req ? "✓" : "—", f.rule])}
        />
        <UL items={TEMPLATE_RULES.map((r, i) => (i === 0 ? <strong key={r} className="text-hi">{r}</strong> : r))} />
        <CodeBlock label="创建请求 · curl" code={TEMPLATE_CURL} />
        <CodeBlock label="标准话术 · 直接复制给 AI 助手" code={TEMPLATE_SPEECH} />
        <P>
          进阶：带依赖的一组任务先建前置、再让依赖方 <Code>depends_on</Code> 填前置 id；前置未完成时依赖方在看板显示「被阻塞」，也不会进可认领队列。
          批量状态流转另有 <Code>POST /api/v1/tasks/batch/transition</Code>。
        </P>
      </Section>

      <Section id="cursor" title="Cursor 定时调度（无人值守腿）">
        <P>
          Cursor 的 MCP 工具只在一次会话内由模型调用，没有「到点自动干活」的调度器。仓库提供零依赖轮询脚本
          <Code>scripts/cursor-agent-poll.mjs</Code>，由系统级调度（launchd / cron）周期拉起，走 REST 完成一次完整的认领 → 执行 → 回写：
        </P>
        <CodeBlock label="环境变量 · shell" code={CURSOR_ENV} />
        <UL items={CURSOR_NOTES} />
      </Section>
    </div>
  );
}

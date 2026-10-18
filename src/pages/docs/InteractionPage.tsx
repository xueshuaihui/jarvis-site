import { Link } from "react-router-dom";
import { docPage } from "../../content/docs-nav";
import {
  BOARD_KEYS,
  CREATION_MODES,
  FACTS,
  FEEDBACK_SIGNALS,
  INTERACTION_SCRIPTS,
  INTERACTION_SURFACES,
  SKILL_DISCOVERY_STEPS,
  STATES,
  TALK_RULES,
  WAKE_MODES,
} from "../../content/manual";
import { PageHeader, Section, P, UL, Code } from "../../components/prose/primitives";
import { ProseTable } from "../../components/prose/ProseTable";
import { Callout } from "../../components/prose/Callout";
import { KbdList } from "../../components/prose/KbdList";
import { StateChip } from "../../components/prose/StateChip";
import { StepsBlock } from "../../components/prose/StepsBlock";

const meta = docPage("interaction")!;

/**
 * /docs/interaction 交互方式（手册 §4.1–4.5、§4.11–4.12、§5.3）
 *
 * 这一页回答的是「我到底该怎么用它」——把点选、对话、程序化三条通道放到同一张图上，
 * 再给出可直接照着说的剧本。技能那一段把 Agent 侧的发现流程翻译成人话：
 * 用户不需要记技能名，也不需要回平台抄 id。
 */
export default function InteractionPage() {
  return (
    <div>
      <PageHeader meta={meta} />

      <Section id="surfaces" title="三条交互通道">
        <P>
          同一块看板有三种用法。三条通道共用同一份流转矩阵与同一套 Token 体系——入口不同，规矩相同：
          界面放行的流转，接口不会再拒；界面拦住的（拖进「执行中」、拖出「已完成」），接口同样返回 409。
        </P>
        <ProseTable
          head={["通道", "你怎么发起", "谁在控制", "适合什么"]}
          rows={INTERACTION_SURFACES.map((s) => [
            <strong key={s.name} className="text-hi">
              {s.name}
            </strong>,
            s.start,
            s.control,
            s.fit,
          ])}
        />
        <UL
          items={[
            <>
              点选是最容易验证的一条：每一次拖拽都要过服务端矩阵，所以「拖不动」通常不是 bug，是规则（见
              <Link to="/docs/concepts#matrix" className="text-arc underline decoration-arc/40"> 状态流转矩阵</Link>）。
            </>,
            "对话通道需要你的客户端接上 MCP 端点；没接上时，说「贾维斯」不会有任何反应。",
            "程序化的写回必须带 task_id + run_id + lease_id 三元组，过期或复用一律 410。",
          ]}
        />
      </Section>

      <Section id="talk" title="对话通道与唤醒词">
        <P>
          对话通道只有一个开关：<strong className="text-hi">「贾维斯」</strong>。消息以它开头（或明确呼唤它）时，
          客户端 Agent 进入工作模式——直接用看板工具办事，不反问「要不要用工具」；没有它的普通对话不会触发任何看板操作。
        </P>
        <ProseTable head={["模式", "语义"]} rows={WAKE_MODES.map((m) => [m.name, m.what])} />
        <UL
          items={[
            <>切换入口：设置 → Token →「贾维斯唤醒模式」（<Code>mcp_wake_mode</Code>）。</>,
            "它是文字唤醒，不是语音：不需要麦克风，客户端读的是服务端经 MCP 下发的唤醒协议。",
            "改动即时生效：每次工具返回的末尾都附一行「【贾维斯】当前会话模式」，以那一行为准，不必重连客户端。",
            "连续模式下，说「退出贾维斯」（或同义退出指令）才退出工作模式。",
            "客户端不读 instructions 时，唤醒会退化成普通的工具调用——把话说全（「用贾维斯工具建一个任务…」）更稳。",
          ]}
        />
        <Callout tone="warn" title="一句话里给全三件事">
          <p>
            对象、范围、验收标准。反例是「优化下首页」；正例是「贾维斯，把首页首屏的图片改成懒加载，验收标准 LCP &lt; 2s，改完给我 diff」。
          </p>
        </Callout>
      </Section>

      <Section id="scripts" title="七个常用剧本">
        <P>
          下面这些说法可以直接照抄。中间一列是它实际会调的工具——出了问题按这一列去对账，比问「你刚才做了什么」有效。
        </P>
        <ProseTable
          head={["场景", "可以这样说", "它实际会做什么", "你会看到"]}
          rows={INTERACTION_SCRIPTS.map((s) => [
            <strong key={s.scene} className="text-hi">
              {s.scene}
            </strong>,
            s.say,
            s.does,
            s.see,
          ])}
        />
      </Section>

      <Section id="skill-talk" title="剧本详解：让 Agent 用某个技能">
        <P>
          最常见的一次卡顿在这里：想让它「用代码评审那套」，却得先回平台翻技能列表、抄名称或 id。不需要——
          技能名不必记，Agent 会先搜候选、再让你选。
        </P>
        <StepsBlock
          items={SKILL_DISCOVERY_STEPS.map((s) => ({
            title: s.title,
            body: <p>{s.body}</p>,
          }))}
        />
        <UL
          items={[
            <>
              名称记准了可以直接取：<Code>get_skill(skill_name=&quot;代码审查&quot;)</Code> 是一跳，不用先搜。
            </>,
            <>同名不止一条时，它会把 <Code>candidates</Code> 列出来让你再选一次——不会自行挑一个。</>,
            <>查无此名时回 <Code>NOT_FOUND</Code> 并提示先 <Code>search_skills</Code>，所以你说错一个词也不会一路错到底。</>,
          ]}
        />
        <Callout tone="info" title="候选为什么值得你多看一眼">
          <p>
            候选只展示名称 + {FACTS.skillBriefClip} 字描述，默认最多 {FACTS.skillSearchLimit} 条。也就是说：
            <strong className="text-hi">技能的命名与描述前半句，就是它的搜索体验</strong>。完整的打分阶梯与返回体示例见
            <Link to="/docs/skills#discovery" className="text-arc underline decoration-arc/40"> 技能工作台 · Agent 怎么找到技能</Link>。
          </p>
        </Callout>
      </Section>

      <Section id="confirm" title="确认、撤销与审核闸门">
        <P>Agent 不该在你没点头的时候改库。会话直建有三种确认强度（优先级：请求参数 ＞ 设置 ＞ 默认轻确认）：</P>
        <ProseTable head={["模式", "它的行为", "兜底"]} rows={CREATION_MODES.map((m) => [m.name, m.what, m.undo])} />
        <UL
          items={[
            "轻确认卡片在右下角：取消 / 编辑 / 创建 + 倒计时条；倒计时归零按「不创建」处理。",
            "直接创建与静默创建都给 5 秒撤销：倒计时归零才真正落库，期间点「撤销」零副作用。",
            "撤销守卫：只有 origin=agent 且还没被领取的任务能撤；被 Agent 领走之后就撤不掉了。",
            <>审核是最后一道闸门：Agent 完成的产物只能进「待审核」，通过 / 驳回只有你能点，三条出口全部走审核接口（见
              <Link to="/docs/review" className="text-arc underline decoration-arc/40"> 审核与通知</Link>）。</>,
          ]}
        />
      </Section>

      <Section id="signals" title="读懂状态信号">
        <P>界面不会用弹窗打扰你，状态都挂在固定的位置上。七个状态先认颜色：</P>
        <div className="my-4 flex flex-wrap gap-2">
          {STATES.map((s) => (
            <StateChip key={s.key} state={s.key} small />
          ))}
        </div>
        <ProseTable
          head={["信号", "在哪", "怎么读", "能做什么"]}
          rows={FEEDBACK_SIGNALS.map((s) => [
            <strong key={s.signal} className="text-hi">
              {s.signal}
            </strong>,
            s.where,
            s.read,
            s.act,
          ])}
        />
        <Callout tone="warn" title="断线不等于丢数据">
          <p>
            实时连接断开时，界面看到的只是「最后一次刷新时的样子」，不会自己更新；重连成功后会自动全量刷新。
            所以断线期间不要急着重复操作——先点顶栏角标把连接拉回来。
          </p>
        </Callout>
      </Section>

      <Section id="keys" title="手势与键盘">
        <P>手上的两块：键盘负责导航，拖拽负责流转。</P>
        <KbdList items={BOARD_KEYS} />
        <UL
          items={[
            "拖拽只在「合法目标列」之间成立：拖进「执行中」一律被拒（只能由 Agent 认领产生），拖出「已完成」也不行（终态，归档后可恢复）。",
            "「人工阻塞」同样只由 Agent 上报产生；你把它拖出来的方向只有「待执行」和「需求池」。",
            "「待审核」不是拖进去的：Agent 交付后自动进入；审核结论只能通过审核表单提交。",
            "窄屏（<960）下文档区左栏收进「文档目录」抽屉，看板工具栏的分组切换器与过滤 chip 仍在。",
          ]}
        />
      </Section>

      <Section id="rules" title="跟 Agent 说话的八条">
        <P>这八条都是踩过的坑，照着说能省掉一轮返工：</P>
        <UL items={TALK_RULES} />
        <Callout tone="info" title="往下读">
          <p>
            工具细节与会话直建的参数在
            <Link to="/docs/agent" className="text-arc underline decoration-arc/40"> Agent 接入</Link>，
            确认与撤销的完整语义在
            <Link to="/docs/org#creation" className="text-arc underline decoration-arc/40"> 分组、设置与协作链路 · 会话直建</Link>。
          </p>
        </Callout>
      </Section>
    </div>
  );
}

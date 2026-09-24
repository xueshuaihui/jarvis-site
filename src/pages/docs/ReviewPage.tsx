import { Link } from "react-router-dom";
import { docPage } from "../../content/docs-nav";
import { FACTS, NOTIFY_KINDS, REVIEW_ENTRIES, REVIEW_FORM } from "../../content/manual";
import { PageHeader, Section, P, UL, Code } from "../../components/prose/primitives";
import { ProseTable } from "../../components/prose/ProseTable";
import { Callout } from "../../components/prose/Callout";
import { StepsBlock } from "../../components/prose/StepsBlock";

const meta = docPage("review")!;

/** /docs/review 审核与通知（手册 §4.5、§4.8） */
export default function ReviewPage() {
  return (
    <div>
      <PageHeader meta={meta} />

      <Callout tone="warn" title="这是产品的最后一道闸">
        <p>
          「待审核」是状态机的硬约束：REVIEW 的三条出口（通过 → 已完成、驳回 → 需求池 / 待执行）
          <strong className="text-hi">只能由人在这里</strong>走审核接口产生，拖拽与 Agent 都改不动——见
          <Link to="/docs/concepts" className="text-arc underline decoration-arc/40"> 流转矩阵 </Link>的 REVIEW 行。
        </p>
      </Callout>

      <Section id="entry" title="三种进入方式">
        <UL items={REVIEW_ENTRIES} />
      </Section>

      <Section id="form" title="审核表单解剖">
        <P>720px 宽的模态，从上到下五块：</P>
        <StepsBlock items={REVIEW_FORM.map((f) => ({ body: <p>{f}</p> }))} />
        <P>提交后的一分两叉：</P>
        <ProseTable
          head={["结论", "任务去向", "连带效果"]}
          rows={[
            ["通过 APPROVE", "→ DONE（已完成）", "解锁下游依赖任务，让被它阻塞的任务可被认领"],
            ["驳回 REJECT", "→ 退回 READY 或 BACKLOG", "任务重新可执行，Agent 能再次认领并读到你的驳回意见"],
          ]}
        />
        <Callout tone="info" title="给认真批注的人">
          <p>
            三项意见各 ≤{FACTS.reviewOpinionMax} 字；草稿按任务自动保存，中途关窗不丢；
            <Code>review_reuse_last_opinion</Code>（默认开）会用上次三项预填。
          </p>
        </Callout>
      </Section>

      <Section id="queue" title="审核队列页">
        <UL
          items={[
            "只列「待审核」且未归档的任务——审核页为空说明没有需要你现在处理的事。",
            "逐条批：提交一条自动跳到下一条未审核任务，批完即清。",
            "看板列头与分组泳道头同样显示待审核数，一眼看到积压在哪。",
          ]}
        />
      </Section>

      <Section id="notify" title="通知中心">
        <P>顶栏铃铛打开从侧边滑出的通知中心面板（数据全在本机）：</P>
        <ProseTable
          head={["归类", "含义", "当前包含"]}
          rows={[
            ["待处理", "含用户动作、等你处理的通知", <span key="a">{NOTIFY_KINDS.pending.join("；")}</span>],
            ["一般通知", "知会类", <span key="b">{NOTIFY_KINDS.general.join("；")}</span>],
          ]}
        />
        <UL
          items={[
            "未读项前置 ● 标记；点单条 = 标已读 + 跳转（有任务开详情抽屉，待审核兼跳审核页）。",
            "「全部已读」一键清零角标；未读数增量走 WebSocket 实时推送。",
          ]}
        />
        <Callout tone="info" title="和系统通知的关系">
          <p>桌面壳另接 macOS 系统通知（托盘常驻）：即使窗口收着，待审核与执行失败也会敲门。系统权限在「系统设置 → 通知」里管理。</p>
        </Callout>
      </Section>
    </div>
  );
}

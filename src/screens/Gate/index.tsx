import { GateShell } from "./GateShell";
import { SebGate } from "./SebGate";
import { Card, Skeleton } from "../../components/Card";
import { Countdown } from "../../components/Countdown";
import { Button, Icon, Ph, T } from "../../components/primitives";
import { StatusPill } from "../../components/StatusPill";
import { S } from "../../strings";
import {
  continueGate,
  gateScreen,
  openHelp,
  restartFlow,
  showToast,
  useApp,
  useServerNow,
} from "../../state/flowMachine";

async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href.split("#")[0]);
  } catch {
    /* clipboard may be blocked; still confirm so the flow is not a dead end */
  }
  showToast(S.common.linkCopied);
}

const HelpBtn = ({ secondary = true }: { secondary?: boolean }) => (
  <Button variant={secondary ? "secondary" : "primary"} onClick={() => openHelp("gate")}>
    {S.common.getHelp}
  </Button>
);

export function Gate() {
  const s = useApp((x) => x);
  const now = useServerNow();
  const screen = gateScreen(s, now);

  switch (screen) {
    case "loading":
      return (
        <div className="mx-auto w-full max-w-[640px] px-4 py-10 sm:px-6 sm:py-16">
          <Card aria-busy="true">
            <Skeleton className="mb-5 h-12 w-12 rounded-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="mt-4 h-5 w-full" />
            <Skeleton className="mt-2 h-5 w-2/3" />
            <Skeleton className="mt-8 h-11 w-40" />
            <p className="mt-6 text-sec text-muted" role="status">{S.gate.loading}</p>
            {s.slowLoad && (
              <p className="mt-2 text-sec font-medium text-review" role="status">
                {S.gate.slow}
              </p>
            )}
          </Card>
        </div>
      );

    case "error":
      return (
        <GateShell
          icon="alert"
          tone="warn"
          title={S.gate.generic.title}
          body={S.gate.generic.body}
          note={S.common.errorCode("E-5003")}
          actions={
            <>
              <Button onClick={restartFlow}>{S.common.tryAgain}</Button>
              <HelpBtn />
            </>
          }
        />
      );

    case "invalid":
      return <GateShell icon="link" tone="warn" title={S.gate.invalid.title} body={S.gate.invalid.body} actions={<HelpBtn secondary={false} />} />;
    case "expired":
      return <GateShell icon="clock" tone="warn" title={S.gate.expired.title} body={S.gate.expired.body} actions={<HelpBtn secondary={false} />} />;
    case "closed":
      return <GateShell icon="lock" tone="warn" title={S.gate.closed.title} body={S.gate.closed.body} actions={<HelpBtn secondary={false} />} />;
    case "submitted":
      return <GateShell icon="checkCircle" tone="ok" title={S.gate.submitted.title} body={S.gate.submitted.body} actions={<HelpBtn secondary={false} />} />;

    case "device":
      return (
        <GateShell
          icon="laptop"
          title={S.gate.device.title}
          body={S.gate.device.body}
          actions={
            <>
              <Button icon="copy" onClick={() => void copyLink()}>{S.common.copyLink}</Button>
              <Button variant="secondary" icon="mail" onClick={() => showToast(S.common.emailLinkSent.replace("[email]", "your email"))}>
                {S.common.emailLink}
              </Button>
              <Button variant="text" onClick={() => openHelp("gate")}>{S.common.getHelp}</Button>
            </>
          }
        />
      );

    case "browser":
      return (
        <GateShell
          icon="screen"
          title={S.gate.browser.title}
          body={S.gate.browser.body}
          actions={
            <>
              <Button icon="copy" onClick={() => void copyLink()}>{S.common.copyLink}</Button>
              <Button variant="secondary" onClick={() => openHelp("gate")}>{S.common.getHelp}</Button>
            </>
          }
        />
      );
    case "browser_old":
      return (
        <GateShell
          icon="refresh"
          title={S.gate.browser.outdatedTitle}
          body={S.gate.browser.outdatedBody}
          actions={
            <>
              <Button icon="copy" onClick={() => void copyLink()}>{S.common.copyLink}</Button>
              <Button variant="secondary" onClick={() => openHelp("gate")}>{S.common.getHelp}</Button>
            </>
          }
        />
      );

    case "seb":
      return <SebGate />;

    case "early":
      return (
        <GateShell
          icon="calendar"
          title={S.gate.early.title}
          body={S.gate.early.body}
          actions={
            <>
              <Button onClick={continueGate}>{S.gate.early.primary}</Button>
              <Button variant="secondary" icon="calendar" onClick={() => showToast(S.gate.early.calendarDone)}>
                {S.gate.early.calendar}
              </Button>
            </>
          }
        >
          <Countdown target={s.scheduledStart} />
        </GateShell>
      );

    case "early_locked":
      return (
        <GateShell
          icon="clock"
          tone="review"
          title={S.gate.early.noEarlyTitle}
          body={S.gate.early.noEarlyBody}
          actions={<HelpBtn />}
        >
          <Countdown target={s.scheduledStart} />
        </GateShell>
      );

    case "open_now":
      return (
        <GateShell
          icon="checkCircle"
          tone="ok"
          title={S.gate.early.openNowTitle}
          body={S.gate.early.openNowBody}
          actions={
            <>
              <Button onClick={continueGate}>{S.common.continue}</Button>
              <HelpBtn />
            </>
          }
        />
      );

    case "late":
      return (
        <GateShell
          icon="clock"
          tone="review"
          title={S.gate.late.title}
          body={S.gate.late.body(12)}
          actions={
            <>
              <Button onClick={continueGate}>{S.gate.late.primary}</Button>
              <HelpBtn />
            </>
          }
        />
      );

    case "resume":
      return (
        <GateShell
          icon="timer"
          tone="ok"
          title={S.gate.resume.title}
          body={S.gate.resume.body}
          note={S.gate.resume.note}
          actions={
            <>
              <Button onClick={continueGate}>{S.gate.resume.primary}</Button>
              <HelpBtn />
            </>
          }
        >
          <StatusPill kind="ready">
            <T s={S.gate.resume.agreed} />
          </StatusPill>
        </GateShell>
      );

    default:
      return null;
  }
}

void Icon;
void Ph;

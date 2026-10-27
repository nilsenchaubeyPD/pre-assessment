import { StepFrame } from "../components/StepFrame";
import { Card, CardTitle } from "../components/Card";
import { ActionBar } from "../components/ActionBar";
import { Badge, BadgeTone, InfoRow } from "../components/InfoRow";
import { FixPanel } from "../components/FixPanel";
import { Button, IconName, Spinner } from "../components/primitives";
import { S } from "../strings";
import { back, getCheckIds, isProctored, next, runCheck, useApp, CheckState } from "../state/flowMachine";
import type { CheckId } from "../devices/DeviceAdapter";

function statusBadge(id: "internet" | "extensions", c: CheckState) {
  const b = S.before.badge;
  if (c.status === "checking" || c.status === "idle")
    return <Badge tone="busy"><Spinner size={12} />{b.checking}</Badge>;
  let tone: BadgeTone = "ok";
  let text: string = id === "internet" ? b.excellent : b.none;
  let icon: IconName = id === "internet" ? "wifi" : "check";
  if (c.status === "warning") { tone = "review"; text = b.slow; }
  if (c.status === "attention") { tone = "warn"; text = id === "internet" ? b.offline : b.found; icon = "alert"; }
  return <Badge tone={tone} icon={icon}>{text}</Badge>;
}

export function Before() {
  const s = useApp((x) => x);
  const ids = getCheckIds(s);
  const proctored = isProctored(s);
  const has = (id: CheckId) => ids.includes(id);
  const R = S.before.rows;
  const net = s.checks.internet;
  const ext = s.checks.extensions;
  const blocked = net.status === "attention" || net.status === "checking" || (has("extensions") && (ext.status === "attention" || ext.status === "checking"));

  return (
    <>
      <StepFrame title={S.before.title}>
        <Card>
          <CardTitle className="mb-2">{S.before.need}</CardTitle>
          <ul className="m-0 flex flex-col p-0">
            <InfoRow icon="wifi" label={R.internet.label} body={R.internet.body} right={statusBadge("internet", net)} />
            {has("extensions") && <InfoRow icon="layers" label={R.extensions.label} body={R.extensions.body} right={statusBadge("extensions", ext)} />}
            {has("camera") && <InfoRow icon="camera" label={R.camera.label} body={R.camera.body} />}
            {has("mic") && <InfoRow icon="mic" label={R.mic.label} body={R.mic.body} />}
            {has("screen") && <InfoRow icon="screen" label={R.screen.label} body={R.screen.body} />}
            {proctored && <InfoRow icon="globe" label={R.browser.label} body={R.browser.body} />}
          </ul>
          {net.status === "warning" && <div className="mt-3"><FixPanel tone="warning" text={S.before.slowFix} /></div>}
          {net.status === "attention" && (
            <div className="mt-3">
              <FixPanel text={S.before.offlineFix} actions={<Button variant="secondary" onClick={() => runCheck("internet")}>{S.before.checkAgain}</Button>} />
            </div>
          )}
          {has("extensions") && ext.status === "attention" && (
            <div className="mt-3">
              <FixPanel text={S.before.extFix} actions={<Button variant="secondary" onClick={() => runCheck("extensions")}>{S.before.checkAgain}</Button>} />
            </div>
          )}
        </Card>
        {proctored && (
          <Card>
            <CardTitle className="mb-2">{S.before.space}</CardTitle>
            <ul className="m-0 flex flex-col p-0">
              <InfoRow icon="sun" label={R.room.label} body={R.room.body} />
              <InfoRow icon="windowApp" label={R.apps.label} body={R.apps.body} />
              <InfoRow icon="plug" label={R.power.label} body={R.power.body} />
            </ul>
          </Card>
        )}
      </StepFrame>
      <ActionBar
        onBack={back}
        primary={{ label: S.common.continue, onClick: next, disabled: blocked }}
        hint={blocked && net.status !== "checking" && ext.status !== "checking" ? S.before.hintBlocked : undefined}
        hintLive
      />
    </>
  );
}

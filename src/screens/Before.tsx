import { StepFrame } from "../components/StepFrame";
import { Card, CardTitle } from "../components/Card";
import { ActionBar } from "../components/ActionBar";
import { Badge, FiName, Row, BadgeKind } from "../components/fig";
import { S } from "../strings";
import { candidate } from "../config/testConfig";
import { back, getCheckIds, isProctored, next, runCheck, useApp, CheckState } from "../state/flowMachine";
import type { CheckId } from "../devices/DeviceAdapter";

function StatusBadge({ id, c }: { id: "internet" | "extensions"; c: CheckState }) {
  const b = S.before.badge;
  if (c.status === "checking" || c.status === "idle")
    return <span className="f-bdg idle"><span className="f-spin" />{b.checking}</span>;
  let kind: BadgeKind = "ok";
  let text: string = id === "internet" ? b.excellent : b.none;
  let icon: FiName = id === "internet" ? "badge-wifi" : "badge-shield";
  if (c.status === "warning") { kind = "warn"; text = b.slow; }
  if (c.status === "attention") { kind = "bad"; text = id === "internet" ? b.offline : b.found; }
  return <Badge kind={kind} icon={icon} pop>{text}</Badge>;
}

export function Before() {
  const s = useApp((x) => x);
  const ids = getCheckIds(s);
  const proctored = isProctored(s);
  const has = (id: CheckId) => ids.includes(id);
  const R = S.before.rows;
  const net = s.checks.internet;
  const ext = s.checks.extensions;
  const busy = net.status === "checking" || (has("extensions") && ext.status === "checking");
  const blocked = busy || net.status === "attention" || (has("extensions") && ext.status === "attention");

  // The row's own description carries the fix message, so the layout stays the same as the Figma frame.
  const netDesc =
    net.status === "warning" ? (
      <>{R.internet.body} <span className="f-msg warn">{S.before.slowFix}</span></>
    ) : net.status === "attention" ? (
      <>{R.internet.body} <span className="f-msg bad">{S.before.offlineFix}</span> <button type="button" className="f-link" onClick={() => runCheck("internet")}>{S.before.checkAgain}</button></>
    ) : R.internet.body;
  const extDesc =
    ext.status === "attention" ? (
      <><span className="f-msg bad">{S.before.extFix}</span> <button type="button" className="f-link" onClick={() => runCheck("extensions")}>{S.before.checkAgain}</button></>
    ) : R.extensions.body;

  return (
    <>
      <StepFrame title={`Hi ${candidate.firstName}, ${S.before.title}`}>
        <Card className="f-groups">
          <div className="f-grp">
            <CardTitle>{S.before.need}</CardTitle>
            <Row icon="row-wifi" label={R.internet.label} side={<StatusBadge id="internet" c={net} />}>{netDesc}</Row>
            {has("extensions") && <Row icon="shield-tick" label={R.extensions.label} side={<StatusBadge id="extensions" c={ext} />}>{extDesc}</Row>}
            {has("camera") && <Row icon="camera-01" label={R.camera.label}>{R.camera.body}</Row>}
            {has("mic") && <Row icon="microphone-01" label={R.mic.label}>{R.mic.body}</Row>}
            {has("screen") && <Row icon="tv-02" label={R.screen.label}>{R.screen.body}</Row>}
            {proctored && <Row icon="globe-02" label={R.browser.label}>{R.browser.body}</Row>}
          </div>
          {proctored && (
            <div className="f-grp">
              <CardTitle>{S.before.space}</CardTitle>
              <Row icon="sun" label={R.room.label}>{R.room.body}</Row>
              <Row icon="appwin" label={R.apps.label}>{R.apps.body}</Row>
              <Row icon="plug" label={R.power.label}>{R.power.body}</Row>
            </div>
          )}
        </Card>
      </StepFrame>
      <ActionBar
        onBack={back}
        primary={{ label: S.common.continue, onClick: next, disabled: blocked }}
        hint={blocked && !busy ? S.before.hintBlocked : undefined}
        hintLive
      />
    </>
  );
}

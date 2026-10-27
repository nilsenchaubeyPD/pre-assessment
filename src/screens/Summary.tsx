import { StepFrame } from "../components/StepFrame";
import { Card } from "../components/Card";
import { ActionBar } from "../components/ActionBar";
import { Badge, InfoRow } from "../components/InfoRow";
import { Banner } from "../components/Banner";
import { Button, IconName } from "../components/primitives";
import { S } from "../strings";
import { allRequiredOk, back, checkOk, consentGiven, fixCheck, getCheckIds, goTo, isProctored, next, summaryTotals, useApp } from "../state/flowMachine";

export function Summary() {
  const s = useApp((x) => x);
  const ids = getCheckIds(s);
  const R = S.summary.rows;
  const { passed, total } = summaryTotals(s);
  const all = allRequiredOk(s);
  const okBadge = (t: string) => <Badge tone="ok" icon="check">{t}</Badge>;
  const fix = (onClick: () => void) => <Button variant="secondary" onClick={onClick}>{S.summary.fixIt}</Button>;
  const slow = s.checks.internet.status === "warning";
  const netOk = checkOk(s, "internet");

  const rows: Array<{ key: string; icon: IconName; label: string; body: string; right: React.ReactNode }> = [];
  if (ids.includes("internet"))
    rows.push({
      key: "internet", icon: "wifi", label: R.internet.label,
      body: slow ? `${S.summary.speed.slowDown} down, ${S.summary.speed.slowUp} up` : `${S.summary.speed.down} down, ${S.summary.speed.up} up`,
      right: netOk ? <Badge tone={slow ? "review" : "ok"} icon={slow ? "wifi" : "check"}>{slow ? R.internet.slow : R.internet.ok}</Badge> : fix(() => fixCheck("internet")),
    });
  if (isProctored(s))
    rows.push({
      key: "consent", icon: "shield", label: R.consent.label,
      body: consentGiven(s) ? R.consent.ok : R.consent.no,
      right: consentGiven(s) ? okBadge("") : fix(() => goTo("consent")),
    });
  if (ids.includes("extensions"))
    rows.push({
      key: "extensions", icon: "layers", label: R.extensions.label,
      body: checkOk(s, "extensions") ? R.extensions.ok : R.extensions.no,
      right: checkOk(s, "extensions") ? okBadge("") : fix(() => fixCheck("extensions")),
    });
  if (ids.includes("camera"))
    rows.push({ key: "camera", icon: "camera", label: R.camera.label, body: checkOk(s, "camera") ? R.camera.ok : R.camera.no, right: checkOk(s, "camera") ? okBadge("") : fix(() => fixCheck("camera")) });
  if (ids.includes("mic")) {
    const skipped = s.checks.mic.status === "skipped";
    rows.push({ key: "mic", icon: "mic", label: R.mic.label, body: checkOk(s, "mic") ? (skipped ? R.mic.skipped : R.mic.ok) : R.mic.no, right: checkOk(s, "mic") ? okBadge("") : fix(() => fixCheck("mic")) });
  }
  if (ids.includes("screen"))
    rows.push({ key: "screen", icon: "screen", label: R.screen.label, body: checkOk(s, "screen") ? R.screen.ok : R.screen.no, right: checkOk(s, "screen") ? okBadge("") : fix(() => fixCheck("screen")) });

  return (
    <>
      <StepFrame title={S.summary.title}>
        <Banner tone={all ? "ok" : "warn"} icon={all ? "checkCircle" : "alert"} assertive={!all}>
          {all ? S.summary.passed(passed, total) : S.summary.needsAttention(passed, total)}
        </Banner>
        <Card>
          <ul className="m-0 flex flex-col p-0">
            {rows.map((r) => (
              <InfoRow key={r.key} icon={r.icon} label={r.label} body={r.body} right={r.right} />
            ))}
          </ul>
        </Card>
      </StepFrame>
      <ActionBar
        onBack={back}
        primary={{ label: S.summary.continue, onClick: next, disabled: !all }}
        hint={!all ? S.conduct.fixBlocked : undefined}
        hintLive
      />
    </>
  );
}

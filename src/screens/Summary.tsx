import { StepFrame } from "../components/StepFrame";
import { Card } from "../components/Card";
import { ActionBar } from "../components/ActionBar";
import { Badge, Fi, FBtn, Glyph, Row } from "../components/fig";
import { S } from "../strings";
import { allRequiredOk, back, checkOk, consentGiven, fixCheck, getCheckIds, goTo, isProctored, next, summaryTotals, useApp } from "../state/flowMachine";

export function Summary() {
  const s = useApp((x) => x);
  const ids = getCheckIds(s);
  const R = S.summary.rows;
  const { passed, total } = summaryTotals(s);
  const all = allRequiredOk(s);
  const slow = s.checks.internet.status === "warning";
  const fix = (onClick: () => void) => <FBtn variant="sec" onClick={onClick}>{S.summary.fixIt}</FBtn>;
  const bad = (t: string) => <span className="f-msg bad">{t}</span>;

  const rows: React.ReactNode[] = [];
  if (ids.includes("internet")) {
    const ok = checkOk(s, "internet");
    const sp = slow ? [S.summary.speed.slowDown, S.summary.speed.slowUp] : [S.summary.speed.down, S.summary.speed.up];
    rows.push(
      <Row key="internet" icon="row-wifi" label={R.internet.label}
        side={ok ? <span className="f-spd" style={{ display: "flex", gap: 16 }}><span><Fi n="download-01" />{sp[0]}</span><span><Fi n="upload-01" />{sp[1]}</span></span> : fix(() => fixCheck("internet"))}>
        {ok ? (slow ? R.internet.slow : R.internet.ok) : bad(R.internet.offline)}
      </Row>,
    );
  }
  if (isProctored(s))
    rows.push(
      <Row key="consent" icon="file-check-02" label={R.consent.label} side={consentGiven(s) ? undefined : fix(() => goTo("consent"))}>
        {consentGiven(s) ? R.consent.ok : bad(R.consent.no)}
      </Row>,
    );
  if (ids.includes("extensions"))
    rows.push(
      <Row key="ext" icon="shield-tick" label={R.extensions.label} side={checkOk(s, "extensions") ? undefined : fix(() => fixCheck("extensions"))}>
        {checkOk(s, "extensions") ? R.extensions.ok : bad(R.extensions.no)}
      </Row>,
    );
  if (ids.includes("camera"))
    rows.push(
      <Row key="cam" icon="camera-01" label={R.camera.label} side={checkOk(s, "camera") ? undefined : fix(() => fixCheck("camera"))}>
        {checkOk(s, "camera") ? R.camera.ok : bad(R.camera.no)}
      </Row>,
    );
  if (ids.includes("mic"))
    rows.push(
      <Row key="mic" icon="microphone-01" label={R.mic.label} side={checkOk(s, "mic") ? undefined : fix(() => fixCheck("mic"))}>
        {checkOk(s, "mic") ? (s.checks.mic.status === "skipped" ? R.mic.skipped : R.mic.ok) : bad(R.mic.no)}
      </Row>,
    );
  if (ids.includes("screen"))
    rows.push(
      <Row key="scr" icon="tv-02" label={R.screen.label} side={checkOk(s, "screen") ? undefined : fix(() => fixCheck("screen"))}>
        {checkOk(s, "screen") ? R.screen.ok : bad(R.screen.no)}
      </Row>,
    );

  return (
    <>
      <StepFrame title={S.summary.title}>
        <div className={`f-sum ${all ? "" : "bad"}`} role="status">
          <span>{all ? S.summary.passed(passed, total) : S.summary.needsAttention(passed, total)}</span>
          {all ? <Fi n="summary-check" /> : <Glyph g="warn" />}
        </div>
        <Card>{rows}</Card>
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

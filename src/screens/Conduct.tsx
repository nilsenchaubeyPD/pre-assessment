import { useState } from "react";
import { StepFrame } from "../components/StepFrame";
import { Card, CardTitle } from "../components/Card";
import { ActionBar } from "../components/ActionBar";
import { Row, Lu, FBtn, FixBox } from "../components/fig";
import { InlineCountdown } from "../components/Countdown";
import { T } from "../components/primitives";
import { S } from "../strings";
import { allRequiredOk, back, openHelp, startTest, useApp, useServerNow } from "../state/flowMachine";

export function Conduct() {
  const s = useApp((x) => x);
  const now = useServerNow();
  const [agreed, setAgreed] = useState(false);
  const R = S.conduct.rows;
  const locked = now < s.scheduledStart;
  const starting = s.startState === "starting";
  const ready = allRequiredOk(s);

  return (
    <>
      <StepFrame title={S.conduct.title}>
        <Card className="flush">
          <div style={{ padding: "24px 24px 12px", display: "flex", flexDirection: "column", gap: 16 }}>
            <CardTitle>{S.conduct.follow}</CardTitle>
            <Row icon="users" label={R.help.label}>{R.help.body}</Row>
            <Row icon="phone" label={R.devices.label}>{R.devices.body}</Row>
            <Row icon="tv-02" label={R.stay.label}>{R.stay.body}</Row>
            <Row icon="warn" label={R.malpractice.label}>{R.malpractice.body}</Row>
          </div>
          <div className="f-note"><Lu n="info" size={14} />{S.conduct.note}</div>
        </Card>

        <label className="f-chk">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          {S.conduct.agree}
        </label>

        {(s.startState === "failed" || !ready) && (
          <div style={{ marginTop: 24 }}>
            <FixBox
              extra={
                s.startState === "failed" ? (
                  <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                    <FBtn variant="sec" onClick={startTest}>{S.common.tryAgain}</FBtn>
                    <FBtn variant="sec" onClick={() => openHelp("conduct")}>{S.common.getHelp}</FBtn>
                  </div>
                ) : undefined
              }
            >
              {s.startState === "failed" ? S.conduct.failed : S.conduct.fixBlocked}
            </FixBox>
          </div>
        )}
      </StepFrame>
      <ActionBar
        onBack={back}
        backDisabled={starting}
        primary={{
          label: starting ? S.conduct.starting : locked ? <T s={S.conduct.opensAt} /> : S.conduct.continue,
          onClick: startTest,
          disabled: !agreed || locked || !ready,
          loading: starting,
        }}
        hint={locked ? <InlineCountdown target={s.scheduledStart} /> : undefined}
      />
    </>
  );
}

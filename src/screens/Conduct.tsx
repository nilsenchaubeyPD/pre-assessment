import { useState } from "react";
import { StepFrame } from "../components/StepFrame";
import { Card, CardTitle } from "../components/Card";
import { ActionBar } from "../components/ActionBar";
import { InfoRow } from "../components/InfoRow";
import { FixPanel } from "../components/FixPanel";
import { InlineCountdown } from "../components/Countdown";
import { Modal } from "../components/Modal";
import { Button, Icon, T } from "../components/primitives";
import { S } from "../strings";
import { allRequiredOk, back, openHelp, startTest, useApp, useServerNow } from "../state/flowMachine";

export function Conduct() {
  const s = useApp((x) => x);
  const now = useServerNow();
  const [agreed, setAgreed] = useState(false);
  const [full, setFull] = useState(false);
  const R = S.conduct.rows;
  const locked = now < s.scheduledStart;
  const starting = s.startState === "starting";
  const ready = allRequiredOk(s);
  const disabled = !agreed || locked || !ready;

  return (
    <>
      <StepFrame title={S.conduct.title}>
        <Card className="!p-0 overflow-hidden">
          <div className="p-4 sm:p-6">
            <CardTitle className="mb-2">{S.conduct.follow}</CardTitle>
            <ul className="m-0 flex flex-col p-0">
              <InfoRow icon="users" label={R.help.label} body={R.help.body} />
              <InfoRow icon="phone" label={R.devices.label} body={R.devices.body} />
              <InfoRow icon="windowApp" label={R.stay.label} body={R.stay.body} />
              <InfoRow icon="alertOctagon" label={R.malpractice.label} body={R.malpractice.body} />
            </ul>
            <button type="button" onClick={() => setFull(true)} className="mt-2 inline-flex min-h-[44px] items-center text-sec font-medium text-brand hover:underline">
              {S.conduct.fullText}
            </button>
          </div>
          <div className="flex items-center gap-2 bg-subtle px-4 py-3 text-sec text-body sm:px-6">
            <Icon name="info" size={16} />
            {S.conduct.note}
          </div>
        </Card>

        <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-sec text-ink">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[#2563EB]"
          />
          <span>{S.conduct.agree}</span>
        </label>

        {s.startState === "failed" && (
          <FixPanel
            text={S.conduct.failed}
            actions={
              <>
                <Button variant="secondary" onClick={startTest}>{S.common.tryAgain}</Button>
                <Button variant="text" onClick={() => openHelp("conduct")}>{S.common.getHelp}</Button>
              </>
            }
          />
        )}
        {!ready && <FixPanel text={S.conduct.fixBlocked} />}
      </StepFrame>
      <ActionBar
        onBack={back}
        backDisabled={starting}
        primary={{
          label: starting ? S.conduct.starting : locked ? <T s={S.conduct.opensAt} /> : S.conduct.continue,
          onClick: startTest,
          disabled,
          loading: starting,
        }}
        hint={locked ? <InlineCountdown target={s.scheduledStart} /> : !agreed ? S.conduct.tickHint : <T s={S.conduct.startHint} />}
        hintLive={!locked}
      />
      <Modal open={full} onClose={() => setFull(false)} title={S.conduct.fullTitle} footer={<Button onClick={() => setFull(false)}>{S.common.close}</Button>}>
        <T s={S.conduct.fullBody} />
      </Modal>
    </>
  );
}

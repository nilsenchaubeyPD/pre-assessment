import { useRef, useState } from "react";
import { StepFrame } from "../components/StepFrame";
import { Card } from "../components/Card";
import { ActionBar } from "../components/ActionBar";
import { Modal } from "../components/Modal";
import { Table } from "../components/Table";
import { Button, T } from "../components/primitives";
import { S } from "../strings";
import { agreeConsent, back, getSteps, openHelp, useApp } from "../state/flowMachine";

export function Consent() {
  const s = useApp((x) => x);
  const steps = getSteps(s);
  const [checked, setChecked] = useState(s.consent.agreed); // Back keeps entered data
  const [modal, setModal] = useState(false);
  const declineRef = useRef<HTMLButtonElement>(null);

  return (
    <StepFrame
      eyebrow={S.stepper.eyebrow(steps.indexOf("consent") + 1, steps.length)}
      title={S.consent.title}
      subtitle={S.consent.subtitle}
    >
      <Card className="flex flex-col gap-6">
        <Table
          caption="What is recorded and why"
          headers={[S.consent.thColumn, S.consent.thValue]}
          rows={Object.values(S.consent.rows).map((r) => ({ label: r.label, value: <T s={r.value} /> }))}
        />
        <label className="flex min-h-[44px] cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 h-6 w-6 shrink-0 cursor-pointer accent-[#1D5FD8]"
          />
          <span className="text-body text-ink">{S.consent.checkbox}</span>
        </label>
      </Card>

      <ActionBar
        onBack={back}
        primary={{ label: S.consent.agree, onClick: agreeConsent, disabled: !checked }}
        hint={!checked ? S.consent.disabledHint : undefined}
        hintLive
        tertiary={
          <button
            ref={declineRef}
            type="button"
            onClick={() => setModal(true)}
            className="hidden min-h-[44px] rounded px-3 text-sec font-medium text-muted hover:text-ink hover:underline sm:inline-flex sm:items-center"
          >
            {S.consent.decline}
          </button>
        }
      />
      {/* Mobile: decline sits above the sticky bar so it stays reachable */}
      <div className="-mt-2 text-center sm:hidden">
        <button type="button" onClick={() => setModal(true)} className="min-h-[44px] px-3 text-sec font-medium text-muted underline">
          {S.consent.decline}
        </button>
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={S.consent.declineModal.title}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setModal(false);
                openHelp("consent");
              }}
            >
              {S.common.getHelp}
            </Button>
            <Button onClick={() => setModal(false)}>{S.consent.declineModal.review}</Button>
          </>
        }
      >
        {S.consent.declineModal.body}
      </Modal>
    </StepFrame>
  );
}

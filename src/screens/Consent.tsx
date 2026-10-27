import { useState } from "react";
import { StepFrame } from "../components/StepFrame";
import { Card } from "../components/Card";
import { ActionBar } from "../components/ActionBar";
import { InfoRow } from "../components/InfoRow";
import { Modal } from "../components/Modal";
import { Button } from "../components/primitives";
import { S } from "../strings";
import { agreeConsent, back, track } from "../state/flowMachine";

export function Consent() {
  const [open, setOpen] = useState(false);
  const R = S.consent.rows;
  return (
    <>
      <StepFrame title={S.consent.title}>
        <Card>
          <ul className="m-0 flex flex-col p-0">
            <InfoRow icon="camera" label={R.camera.label} body={R.camera.body} />
            <InfoRow icon="mic" label={R.audio.label} body={R.audio.body} />
            <InfoRow icon="screen" label={R.screen.label} body={R.screen.body} />
            <InfoRow icon="activity" label={R.activity.label} body={R.activity.body} />
          </ul>
        </Card>
      </StepFrame>
      <ActionBar
        onBack={back}
        primary={{ label: S.consent.agree, onClick: agreeConsent }}
        tertiary={
          <Button
            variant="text"
            onClick={() => {
              track("consent_declined");
              setOpen(true);
            }}
          >
            {S.consent.decline}
          </Button>
        }
      />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={S.consent.declineModal.title}
        footer={<Button onClick={() => setOpen(false)}>{S.consent.declineModal.review}</Button>}
      >
        {S.consent.declineModal.body}
      </Modal>
    </>
  );
}

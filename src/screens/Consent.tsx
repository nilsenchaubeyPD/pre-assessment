import { useState } from "react";
import { StepFrame } from "../components/StepFrame";
import { Card } from "../components/Card";
import { ActionBar } from "../components/ActionBar";
import { Row, FBtn } from "../components/fig";
import { Modal } from "../components/Modal";
import { S } from "../strings";
import { agreeConsent, back, track } from "../state/flowMachine";

export function Consent() {
  const [open, setOpen] = useState(false);
  const R = S.consent.rows;
  return (
    <>
      <StepFrame title={S.consent.title}>
        <Card>
          <Row icon="camera-01" label={R.camera.label}>{R.camera.body}</Row>
          <Row icon="microphone-01" label={R.audio.label}>{R.audio.body}</Row>
          <Row icon="tv-02" label={R.screen.label}>{R.screen.body}</Row>
          <Row icon="activity" label={R.activity.label}>{R.activity.body}</Row>
        </Card>
      </StepFrame>
      <ActionBar
        onBack={back}
        primary={{ label: S.consent.agree, onClick: agreeConsent }}
        tertiary={
          <button type="button" className="f-textbtn" onClick={() => { track("consent_declined"); setOpen(true); }}>
            {S.consent.decline}
          </button>
        }
      />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={S.consent.declineModal.title}
        footer={<FBtn onClick={() => setOpen(false)}>{S.consent.declineModal.review}</FBtn>}
      >
        {S.consent.declineModal.body}
      </Modal>
    </>
  );
}

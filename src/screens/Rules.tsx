import { useState } from "react";
import { StepFrame } from "../components/StepFrame";
import { Card, CardTitle } from "../components/Card";
import { Accordion } from "../components/Accordion";
import { ActionBar } from "../components/ActionBar";
import { Drawer } from "../components/Drawer";
import { Modal } from "../components/Modal";
import { Table } from "../components/Table";
import { Button, Icon, IconName, T } from "../components/primitives";
import { StatusPill } from "../components/StatusPill";
import { testConfig } from "../config/testConfig";
import { S } from "../strings";
import { getSteps, next, useApp } from "../state/flowMachine";

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-th text-muted">{label}</p>
      <p className="mt-1 break-words text-body font-semibold text-ink">
        <T s={value} />
      </p>
    </div>
  );
}

function ExpectRow({ icon, label, body }: { icon: IconName; label: string; body: string }) {
  return (
    <li className="flex items-start gap-4">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-subtle text-body">
        <Icon name={icon} size={20} />
      </span>
      <div>
        <p className="text-body font-semibold text-ink">{label}</p>
        <p className="text-sec text-body">
          <T s={body} />
        </p>
      </div>
    </li>
  );
}

export function Rules() {
  const s = useApp((x) => x);
  const steps = getSteps(s);
  const type = s.controls.testType;
  const proctored = type !== "non_proctored";
  const micOn = testConfig.requires.mic && type === "proctored";
  const [drawer, setDrawer] = useState(false);
  const [review, setReview] = useState(false);
  const alreadyAgreed = proctored && s.controls.consent === "already";

  const rules = proctored ? testConfig.rules : S.rules.nonRules;

  return (
    <StepFrame
      eyebrow={S.stepper.eyebrow(steps.indexOf("rules") + 1, steps.length)}
      title={S.rules.title}
      subtitle={S.rules.subtitle}
    >
      {alreadyAgreed && (
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill kind="ready">
            <T s={S.rules.agreedChip} />
          </StatusPill>
          <Button variant="text" onClick={() => setReview(true)}>
            {S.rules.review}
          </Button>
        </div>
      )}

      <Card className="grid grid-cols-2 gap-x-6 gap-y-5 !p-5 sm:grid-cols-4 sm:!p-6">
        <Tile label={S.rules.summary.assessment} value={testConfig.assessmentName} />
        <Tile label={S.rules.summary.starts} value={testConfig.scheduledStart} />
        <Tile label={S.rules.summary.time} value={testConfig.durationMin} />
        <Tile label={S.rules.summary.sections} value={String(testConfig.sections)} />
      </Card>

      <Card>
        <CardTitle>{S.rules.expect.title}</CardTitle>
        <ul className="mt-5 flex flex-col gap-5">
          {proctored && (
            <ExpectRow
              icon="record"
              label={S.rules.expect.recording.label}
              body={micOn ? S.rules.expect.recordingMic.body : S.rules.expect.recording.body}
            />
          )}
          <ExpectRow icon="timer" label={S.rules.expect.time.label} body={S.rules.expect.time.body} />
          <ExpectRow icon="help" label={S.rules.expect.help.label} body={S.rules.expect.help.body} />
        </ul>
      </Card>

      <Card>
        <CardTitle>{proctored ? S.rules.keep.title : S.rules.keepNon.title}</CardTitle>
        <Accordion
          className="mt-5"
          items={rules.map((r, i) => ({ id: String(i), title: `${i + 1}. ${r.title}`, body: r.why }))}
        />
        <button
          id="coc-link"
          type="button"
          onClick={() => setDrawer(true)}
          className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sec font-medium text-brand hover:underline"
        >
          {S.rules.conduct}
          <Icon name="arrow" size={18} />
        </button>
      </Card>

      <ActionBar
        primary={{ label: S.common.continue, onClick: next }}
        hint={proctored ? S.rules.hint : S.rules.hintNon}
      />

      <Drawer open={drawer} onClose={() => setDrawer(false)} title={S.rules.conductTitle} returnFocusId="coc-link">
        <p className="text-body text-body">
          <T s={S.rules.conductBody} />
        </p>
      </Drawer>

      <Modal
        open={review}
        onClose={() => setReview(false)}
        title={S.consent.title}
        footer={<Button onClick={() => setReview(false)}>{S.common.close}</Button>}
      >
        <Table
          headers={[S.consent.thColumn, S.consent.thValue]}
          rows={Object.values(S.consent.rows).map((r) => ({ label: r.label, value: <T s={r.value} /> }))}
        />
      </Modal>
    </StepFrame>
  );
}

import { StepFrame } from "../components/StepFrame";
import { Card } from "../components/Card";
import { ActionBar } from "../components/ActionBar";
import { Button, Icon } from "../components/primitives";
import { StatusPill } from "../components/StatusPill";
import { testConfig } from "../config/testConfig";
import { S } from "../strings";
import { back, choosePractice, getSteps, next, runPracticeCode, useApp } from "../state/flowMachine";

export function Practice() {
  const s = useApp((x) => x);
  const steps = getSteps(s);
  const choice = s.practice.choice;
  const answered = choice !== undefined;
  const correct = choice === S.practice.correctIndex;

  return (
    <StepFrame
      eyebrow={S.stepper.eyebrow(steps.indexOf("practice") + 1, steps.length)}
      title={S.practice.title}
      subtitle={S.practice.subtitle}
    >
      <div>
        <StatusPill kind="practice">{S.practice.pill}</StatusPill>
      </div>

      <Card>
        <fieldset>
          <legend className="text-section text-ink">{S.practice.q1}</legend>
          <div className="mt-5 flex flex-col gap-3" role="radiogroup" aria-label={S.practice.q1}>
            {S.practice.options.map((o, i) => {
              const on = choice === i;
              return (
                <label
                  key={o}
                  className={`flex min-h-[52px] cursor-pointer items-center gap-3 rounded-ctrl border px-4 py-3 transition-colors ${
                    on ? "border-brand bg-brand-tint" : "border-cardline bg-white hover:bg-subtle"
                  }`}
                >
                  <input
                    type="radio"
                    name="practice-q1"
                    checked={on}
                    onChange={() => choosePractice(i)}
                    className="h-5 w-5 accent-[#1D5FD8]"
                  />
                  <span className="text-body text-ink">{o}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
        {answered && (
          <div
            role="status"
            aria-live="polite"
            className={`mt-5 flex animate-step-in items-start gap-3 rounded-ctrl border p-4 text-sec ${
              correct ? "border-[#BBF7D0] bg-ok-banner text-ok" : "border-cardline bg-subtle text-ink"
            }`}
          >
            <Icon name={correct ? "checkCircle" : "info"} size={20} className="mt-0.5" />
            <p className="font-medium">{correct ? S.practice.correct : S.practice.incorrect}</p>
          </div>
        )}
      </Card>

      {(testConfig.practiceHasCoding || s.controls.coding) && (
        <Card>
          <h2 className="text-section text-ink">{S.practice.q2}</h2>
          <label htmlFor="practice-code" className="sr-only">{S.practice.q2}</label>
          <textarea
            id="practice-code"
            defaultValue={'print(2 + 3)'}
            spellCheck={false}
            className="mt-4 h-28 w-full rounded-ctrl border border-ctrl bg-[#0F172A] p-3 font-mono text-sec text-[#E2E8F0]"
          />
          <div className="mt-3 flex items-center gap-3">
            <Button variant="secondary" onClick={runPracticeCode}>{S.practice.run}</Button>
            {s.practice.codeRun && (
              <p className="text-sec text-ink" role="status">
                {S.practice.output}: <code className="rounded bg-subtle px-2 py-0.5">{S.practice.sampleOutput}</code>
              </p>
            )}
          </div>
          <p className="mt-3 text-sec text-muted">{S.practice.codeNote}</p>
        </Card>
      )}

      <ActionBar
        onBack={back}
        primary={{ label: answered ? S.practice.continue : S.practice.skip, onClick: next }}
      />
    </StepFrame>
  );
}

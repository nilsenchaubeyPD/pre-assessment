import { Icon } from "./primitives";
import { S } from "../strings";
import { StepId } from "../state/flowMachine";

export function Stepper({ steps, current, quick }: { steps: StepId[]; current: StepId; quick?: boolean }) {
  const idx = Math.max(0, steps.indexOf(current));
  const left = steps.length - idx - 1;
  const label = (id: StepId) => (quick && id === "getReady" ? S.stepper.labels.quick : S.stepper.labels[id]);
  return (
    <nav aria-label="Progress" className="border-b border-line bg-white">
      <div className="mx-auto max-w-content px-4 py-4 sm:px-6">
        {/* Mobile */}
        <div className="sm:hidden">
          <div className="flex gap-1.5" aria-hidden="true">
            {steps.map((id, i) => (
              <span key={id} className={`h-1.5 flex-1 rounded-full ${i < idx ? "bg-ok" : i === idx ? "bg-brand" : "bg-line"}`} />
            ))}
          </div>
          <p className="mt-2 text-sec text-muted" aria-live="polite">
            {S.stepper.mobile(idx + 1, steps.length)}
          </p>
        </div>
        {/* Desktop and tablet */}
        <div className="hidden items-center justify-between gap-6 sm:flex">
          <ol className="flex flex-1 items-center">
            {steps.map((id, i) => {
              const done = i < idx;
              const cur = i === idx;
              return (
                <li key={id} className={`flex items-center ${i < steps.length - 1 ? "flex-1" : ""}`} aria-current={cur ? "step" : undefined}>
                  <span className="flex items-center gap-2">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-[13px] font-semibold ${
                        done ? "border-ok bg-ok text-white" : cur ? "border-brand bg-brand text-white" : "border-ctrl bg-white text-muted"
                      }`}
                    >
                      {done ? <Icon name="check" size={16} /> : i + 1}
                    </span>
                    <span className={`text-sec ${cur ? "font-semibold text-ink" : done ? "font-medium text-body" : "text-muted"}`}>
                      {label(id)}
                      <span className="sr-only">
                        {" "}
                        {done ? S.stepper.completed : cur ? S.stepper.current : S.stepper.upcoming}
                      </span>
                    </span>
                  </span>
                  {i < steps.length - 1 && <span className={`mx-3 h-px flex-1 ${done ? "bg-ok" : "bg-line"}`} aria-hidden="true" />}
                </li>
              );
            })}
          </ol>
          <p className="shrink-0 text-sec text-muted" aria-live="polite">
            {S.stepper.aboutTime} · {S.stepper.stepsLeft(left)}
          </p>
        </div>
      </div>
    </nav>
  );
}

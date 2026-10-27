import { useEffect, useRef, useState } from "react";
import { StepFrame } from "../components/StepFrame";
import { Card, CardTitle } from "../components/Card";
import { ActionBar } from "../components/ActionBar";
import { Banner } from "../components/Banner";
import { InlineCountdown } from "../components/Countdown";
import { Button, Icon, Ph, T } from "../components/primitives";
import { testConfig } from "../config/testConfig";
import { S } from "../strings";
import {
  allRequiredOk,
  back,
  checkOk,
  focusFix,
  firstProblem,
  getCheckIds,
  getSteps,
  goTo,
  idleRecheck,
  openHelp,
  runCheck,
  showToast,
  startTest,
  touchRecheck,
  useApp,
  useServerNow,
} from "../state/flowMachine";
import { CheckId } from "../devices/DeviceAdapter";

const chipLabel: Record<CheckId, string> = S.start.chips as Record<CheckId, string>;

export function Start() {
  const s = useApp((x) => x);
  const now = useServerNow();
  const steps = getSteps(s);
  const ids = getCheckIds(s);
  const ok = allRequiredOk(s);
  const locked = now < s.scheduledStart;
  const [ticks, setTicks] = useState<boolean[]>(S.start.beforeItems.map(() => false));

  // toast when the start time arrives while the page is open
  const wasLocked = useRef(locked);
  useEffect(() => {
    if (wasLocked.current && !locked) showToast(S.start.opened);
    wasLocked.current = locked;
  }, [locked]);

  // quiet "rechecked" refresh every 10s
  useEffect(() => {
    touchRecheck();
    const id = window.setInterval(touchRecheck, 10_000);
    return () => clearInterval(id);
  }, []);

  // idle for N minutes: quietly recheck Internet, Camera and Screen sharing
  useEffect(() => {
    let t = window.setTimeout(() => void idleRecheck(), testConfig.idleMinutes * 60_000);
    const reset = () => {
      clearTimeout(t);
      t = window.setTimeout(() => void idleRecheck(), testConfig.idleMinutes * 60_000);
    };
    window.addEventListener("pointerdown", reset);
    window.addEventListener("keydown", reset);
    return () => {
      clearTimeout(t);
      window.removeEventListener("pointerdown", reset);
      window.removeEventListener("keydown", reset);
    };
  }, []);

  const secs = Math.max(0, Math.round((Date.now() - s.recheckedAt) / 1000));
  const rechecked = secs < 5 ? S.start.rechecked : `Rechecked ${secs}s ago`;

  const fixIt = () => {
    const id = firstProblem(s) ?? ids.find((i) => !checkOk(s, i)) ?? "internet";
    if (steps.includes("getReady")) {
      goTo("getReady");
      focusFix(id);
    } else {
      void runCheck(id);
    }
  };

  const cta = s.startState === "starting" ? S.start.starting : locked ? S.start.opensAt : S.start.cta;

  return (
    <StepFrame
      eyebrow={S.stepper.eyebrow(steps.indexOf("start") + 1, steps.length)}
      title={S.start.title}
      subtitle={S.start.subtitle}
    >
      {ok ? (
        <Banner tone="ok" icon="checkCircle">
          <p className="text-body font-semibold">{S.start.allPassed}</p>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Checks">
            {ids.map((id) => (
              <li key={id} className="inline-flex items-center gap-1.5 rounded-full border border-[#BBF7D0] bg-white px-3 py-1 text-[13px] font-medium text-ok">
                <Icon name="check" size={14} />
                {chipLabel[id]}
                <span className="sr-only">. {S.start.rechecked}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sec font-normal text-ok" aria-live="polite">{rechecked}</p>
        </Banner>
      ) : (
        <Banner
          tone="warn"
          icon="alert"
          assertive
          action={
            <button type="button" onClick={fixIt} className="inline-flex min-h-[44px] shrink-0 items-center rounded px-2 text-sec font-semibold text-brand underline">
              {S.start.fixIt}
            </button>
          }
        >
          <p className="text-body font-semibold">{S.start.oneThing}</p>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Checks">
            {ids.map((id) => {
              const good = checkOk(s, id);
              return (
                <li
                  key={id}
                  className={`inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1 text-[13px] font-medium ${
                    good ? "border-[#BBF7D0] text-ok" : "border-[#F6C9A6] text-warn"
                  }`}
                >
                  <Icon name={good ? "check" : "alert"} size={14} />
                  {chipLabel[id]}
                  {!good && <span className="sr-only"> needs attention</span>}
                </li>
              );
            })}
          </ul>
        </Banner>
      )}

      {s.idleNote && (
        <p className="text-sec text-muted" role="status">{S.start.idleRecheck}</p>
      )}

      <Card>
        <CardTitle>{S.start.beforeTitle}</CardTitle>
        <ul className="mt-4 flex flex-col">
          {S.start.beforeItems.map((t, i) => (
            <li key={t}>
              <label className="flex min-h-[44px] cursor-pointer items-center gap-3 py-1">
                <input
                  type="checkbox"
                  checked={ticks[i]}
                  onChange={(e) => setTicks((a) => a.map((v, j) => (j === i ? e.target.checked : v)))}
                  className="h-5 w-5 accent-[#1D5FD8]"
                />
                <span className="text-body text-ink">{t}</span>
              </label>
            </li>
          ))}
        </ul>
      </Card>

      <Card emphasis>
        <div className="flex items-start gap-4">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
            <Icon name="timer" size={22} />
          </span>
          <div>
            <h2 className="text-section text-ink">{S.start.realTitle}</h2>
            <p className="mt-1 text-body text-body">
              <T s={S.start.realBody} />
            </p>
          </div>
        </div>
      </Card>

      {s.startState === "failed" && (
        <Banner tone="warn" icon="alert" assertive>
          <p>{S.start.failed}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => void startTest()}>{S.common.tryAgain}</Button>
            <Button variant="secondary" onClick={() => openHelp("start", true)}>{S.common.getHelp}</Button>
          </div>
        </Banner>
      )}

      <ActionBar
        onBack={back}
        primary={{
          label: locked && s.startState !== "starting" ? <T s={cta} /> : cta,
          onClick: () => void startTest(),
          disabled: locked || !ok,
          loading: s.startState === "starting",
          large: true,
        }}
        hint={
          locked ? <InlineCountdown target={s.scheduledStart} /> : !ok ? S.start.notReady : undefined
        }
        hintLive={false}
      />
    </StepFrame>
  );
}

void Ph;

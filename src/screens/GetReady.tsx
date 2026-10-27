import React, { useEffect, useState } from "react";
import { StepFrame } from "../components/StepFrame";
import { Card } from "../components/Card";
import { ActionBar } from "../components/ActionBar";
import { Button, Icon, T } from "../components/primitives";
import { CheckRow, pillText } from "../components/CheckRow";
import { FixPanel, SegmentedTabs } from "../components/FixPanel";
import { StatusPill } from "../components/StatusPill";
import { CameraPreview, MicMeter, ScreenPickerIllustration } from "../components/Media";
import { S } from "../strings";
import {
  CheckState,
  allRequiredOk,
  back,
  checkOk,
  confirmFacePhoto,
  faceBlocked,
  firstProblem,
  focusFirstProblem,
  getCheckIds,
  getSteps,
  micOptional,
  next,
  openHelp,
  requiredIds,
  retakeFace,
  runAll,
  runCheck,
  setEnrollStage,
  showToast,
  skipMic,
  useApp,
} from "../state/flowMachine";
import { CheckId } from "../devices/DeviceAdapter";

const msg = (group: object, code?: string) => (group as Record<string, string>)[code ?? ""] ?? "";

function useCheck(id: CheckId): CheckState {
  return useApp((s) => s.checks[id]);
}

/** Shows "Still stuck? Get help" after 2 failed attempts. */
function Stuck({ attempts, threshold = 2 }: { attempts: number; threshold?: number }) {
  if (attempts < threshold) return null;
  return (
    <p className="text-sec text-body">
      <span className="font-medium text-ink">{S.ready.stuck}</span>{" "}
      <button type="button" className="inline-flex min-h-[44px] items-center font-medium text-brand underline" onClick={() => openHelp("getReady", true)}>
        {S.ready.stuckCta}
      </button>
    </p>
  );
}

const staleLabel = S.ready.checkAgainQuick;

/* ---------------- rows ---------------- */

function InternetRow() {
  const c = useCheck("internet");
  const st = c.status;
  const desc =
    st === "ready" ? S.ready.internet.ready : st === "warning" ? S.ready.internet.slowShort : st === "attention" ? S.ready.internet.offlineShort : S.ready.internet.idle;
  return (
    <CheckRow
      id="internet"
      icon="wifi"
      title={S.ready.internet.title}
      description={c.stale ? staleLabel : desc}
      status={st}
      pillLabel={pillText(st)}
      action={
        st !== "ready" && st !== "checking" ? (
          <Button variant="secondary" onClick={() => void runCheck("internet")}>
            {st === "idle" && !c.stale ? S.ready.internet.action : S.ready.internet.again}
          </Button>
        ) : undefined
      }
    >
      {st === "warning" && <FixPanel tone="warning" icon="wifi" text={S.ready.internet.NET_SLOW} />}
      {st === "attention" && (
        <FixPanel
          icon="wifi"
          text={S.ready.internet.NET_OFFLINE}
          actions={
            <Button data-fix-focus variant="secondary" onClick={() => void runCheck("internet")}>
              {S.ready.internet.again}
            </Button>
          }
        >
          <Stuck attempts={c.attempts} />
        </FixPanel>
      )}
    </CheckRow>
  );
}

function CameraRow() {
  const c = useCheck("camera");
  const st = c.status;
  const [long, setLong] = useState(false);
  const [pick, setPick] = useState(false);
  const [cam, setCam] = useState<string>(S.ready.camera.cameras[0]);
  useEffect(() => {
    if (st !== "checking") {
      setLong(false);
      return;
    }
    const t = window.setTimeout(() => setLong(true), 30000);
    return () => clearTimeout(t);
  }, [st]);

  const code = c.errorCode;
  const good = st === "ready" || st === "warning";
  let desc: string = S.ready.camera.idle;
  if (c.stale) desc = staleLabel;
  else if (st === "checking") desc = S.ready.camera.checking + (long ? " " + S.ready.camera.checkingLong : "");
  else if (st === "ready") desc = S.ready.camera.ready;
  else if (st === "warning") desc = S.ready.camera.CAM_DARK;
  else if (st === "attention") desc = S.ready.camera.attentionShort;

  const retryLabel = code === "CAM_DISMISSED" ? S.ready.camera.action : S.common.tryAgain;
  return (
    <CheckRow
      id="camera"
      icon="camera"
      title={S.ready.camera.title}
      description={desc}
      status={st}
      pillLabel={pillText(st)}
      action={
        st === "idle" ? (
          <Button onClick={() => void runCheck("camera")}>{c.stale ? S.ready.checkAgainQuick : S.ready.camera.action}</Button>
        ) : undefined
      }
    >
      {good && (
        <div className="flex flex-wrap items-end gap-4">
          <CameraPreview dark={code === "CAM_DARK"} caption={S.ready.camera.caption} />
          <div className="flex flex-col gap-2">
            {!pick ? (
              <button type="button" className="inline-flex min-h-[44px] items-center text-sec font-medium text-brand underline" onClick={() => setPick(true)}>
                {S.ready.camera.different}
              </button>
            ) : (
              <div>
                <label htmlFor="camera-select" className="block text-th text-muted">{S.ready.camera.cameraLabel}</label>
                <select
                  id="camera-select"
                  value={cam}
                  onChange={(e) => {
                    setCam(e.target.value);
                    void runCheck("camera");
                  }}
                  className="mt-1 h-11 rounded-ctrl border border-ctrl bg-white px-3 text-sec text-ink"
                >
                  {S.ready.camera.cameras.map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}
      {st === "attention" && code && (
        <FixPanel
          icon="camera"
          text={msg(S.ready.camera, code)}
          actions={
            <Button data-fix-focus variant="secondary" onClick={() => void runCheck("camera")}>
              {retryLabel}
            </Button>
          }
        >
          {code === "CAM_BLOCKED" && <SegmentedTabs label={S.ready.browserTabs.label} tabs={S.ready.browserTabs.items.map((t) => ({ ...t, steps: [...t.steps] }))} />}
          <Stuck attempts={c.attempts} />
        </FixPanel>
      )}
    </CheckRow>
  );
}

function MicRow() {
  const c = useCheck("mic");
  const optional = useApp((s) => micOptional(s));
  const st = c.status;
  const code = c.errorCode;
  const [pick, setPick] = useState(false);
  const good = st === "ready" || st === "warning";
  let desc: string = S.ready.mic.idle;
  if (c.stale) desc = staleLabel;
  else if (st === "ready") desc = S.ready.mic.ready;
  else if (st === "warning") desc = S.ready.mic.MIC_NOISY;
  else if (st === "attention") desc = S.ready.mic.attentionShort;
  else if (st === "skipped") desc = S.status.skipped;
  const micTabs = S.ready.browserTabs.items.map((t) => ({
    ...t,
    steps: t.steps.map((x) => x.replace(/camera/g, "microphone")),
  }));
  return (
    <CheckRow
      id="mic"
      icon="mic"
      title={S.ready.mic.title}
      description={desc}
      status={st}
      pillLabel={pillText(st)}
      extraPill={optional ? <StatusPill kind="optional">{S.common.optional}</StatusPill> : undefined}
      action={
        st === "idle" || st === "skipped" ? (
          <>
            {optional && st === "idle" && (
              <Button variant="text" onClick={skipMic}>
                {S.ready.skip}
              </Button>
            )}
            <Button onClick={() => void runCheck("mic")}>{c.stale ? S.ready.checkAgainQuick : S.ready.mic.action}</Button>
          </>
        ) : undefined
      }
    >
      {(st === "checking" || good) && (
        <div className="flex flex-wrap items-center gap-4">
          <MicMeter active />
          {good && (
            <>
              {!pick ? (
                <button type="button" className="inline-flex min-h-[44px] items-center text-sec font-medium text-brand underline" onClick={() => setPick(true)}>
                  {S.ready.mic.different}
                </button>
              ) : (
                <select aria-label={S.ready.mic.different} className="h-11 rounded-ctrl border border-ctrl bg-white px-3 text-sec text-ink" onChange={() => void runCheck("mic")}>
                  {S.ready.mic.mics.map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              )}
            </>
          )}
        </div>
      )}
      {st === "idle" && !c.stale && <MicMeter active={false} />}
      {st === "attention" && code && (
        <FixPanel
          icon="mic"
          text={msg(S.ready.mic, code)}
          actions={
            <>
              <Button data-fix-focus variant="secondary" onClick={() => void runCheck("mic")}>
                {S.common.tryAgain}
              </Button>
              {optional && (
                <Button variant="text" onClick={skipMic}>
                  {S.ready.skip}
                </Button>
              )}
            </>
          }
        >
          {code === "MIC_BLOCKED" && <SegmentedTabs label={S.ready.browserTabs.label} tabs={micTabs} />}
          <Stuck attempts={c.attempts} />
        </FixPanel>
      )}
    </CheckRow>
  );
}

function Countdown321({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(3);
  useEffect(() => {
    if (n === 0) {
      onDone();
      return;
    }
    const t = window.setTimeout(() => setN((x) => x - 1), 800);
    return () => clearTimeout(t);
  }, [n, onDone]);
  return (
    <div className="flex items-center justify-center" aria-live="assertive">
      <span className="text-[48px] font-semibold text-white drop-shadow">{n > 0 ? n : ""}</span>
    </div>
  );
}

function FaceRow() {
  const c = useCheck("face");
  const enrolled = useApp((s) => s.faceEnrolled);
  const stage = useApp((s) => s.enrollStage);
  const blocked = useApp((s) => faceBlocked(s));
  const camDark = useApp((s) => s.checks.camera.errorCode === "CAM_DARK");
  const [justEnrolled, setJustEnrolled] = useState(false);
  const st = c.status;
  const code = c.errorCode;

  let desc: string = enrolled ? S.ready.face.returning : S.ready.face.enrollIdle;
  if (st === "waiting") desc = S.ready.face.waiting;
  else if (c.stale) desc = staleLabel;
  else if (st === "checking") desc = S.ready.face.checking;
  else if (st === "ready") desc = justEnrolled ? S.ready.face.saved : S.ready.face.ready;
  else if (st === "attention") desc = S.ready.face.attentionShort;

  const showEnroll = !enrolled && !blocked;
  const failedThree = c.attempts >= 3;

  const onTake = () => setEnrollStage("countdown");
  const onCountdownDone = React.useCallback(() => {
    setEnrollStage("idle");
    void runCheck("face");
  }, []);

  return (
    <CheckRow
      id="face"
      icon="face"
      title={S.ready.face.title}
      description={desc}
      status={st}
      pillLabel={pillText(st, S.ready.face.waitingFor)}
      action={
        enrolled && st === "idle" && !blocked ? (
          <Button onClick={() => void runCheck("face")}>{S.ready.face.returningAction}</Button>
        ) : undefined
      }
    >
      {showEnroll && st !== "ready" && (
        <div className="rounded-ctrl border border-cardline bg-subtle p-4">
          <h4 className="text-body font-semibold text-ink">{S.ready.face.enrollTitle}</h4>
          <p className="mt-1 text-sec text-body">{S.ready.face.enrollBody}</p>
          <div className="mt-4 flex flex-wrap gap-5">
            <div className="relative">
              <CameraPreview width={240} height={180} oval dark={camDark} frozen={stage === "review"} status={st === "checking" ? S.ready.face.checking : undefined} />
              {stage === "countdown" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Countdown321 onDone={onCountdownDone} />
                </div>
              )}
            </div>
            <div className="flex min-w-[220px] flex-1 flex-col justify-between gap-4">
              <ul className="flex flex-wrap gap-2">
                {S.ready.face.tips.map((t) => (
                  <li key={t} className="inline-flex items-center gap-1.5 rounded-full border border-cardline bg-white px-3 py-1.5 text-[13px] font-medium text-ink">
                    <Icon name="check" size={14} className="text-ok" />
                    {t}
                  </li>
                ))}
              </ul>
              {stage === "review" ? (
                <div>
                  <p className="text-body font-semibold text-ink" aria-live="polite">{S.ready.face.review}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <Button
                      data-fix-focus
                      onClick={() => {
                        setJustEnrolled(true);
                        confirmFacePhoto();
                      }}
                    >
                      {S.ready.face.use}
                    </Button>
                    <Button variant="secondary" onClick={retakeFace}>
                      {S.ready.face.retake}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <Button data-fix-focus onClick={onTake} disabled={stage === "countdown" || st === "checking"} loading={st === "checking"}>
                    {S.ready.face.takePhoto}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {enrolled && !blocked && st === "checking" && <CameraPreview width={160} height={120} oval status={S.ready.face.checking} />}
      {st === "attention" && code && (
        <FixPanel
          icon="face"
          text={msg(S.ready.face, code)}
          actions={
            !showEnroll ? (
              <Button data-fix-focus variant="secondary" onClick={() => void runCheck("face")}>
                {S.common.tryAgain}
              </Button>
            ) : undefined
          }
        >
          {failedThree ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sec font-medium text-ink">{S.ready.attempts}</span>
              <Button variant="secondary" onClick={() => openHelp("getReady", true)}>
                {S.ready.stuckCta}
              </Button>
            </div>
          ) : null}
        </FixPanel>
      )}
    </CheckRow>
  );
}

function ScreenRow() {
  const c = useCheck("screen");
  const st = c.status;
  const code = c.errorCode;
  let desc: string = S.ready.screen.idle;
  if (c.stale) desc = staleLabel;
  else if (st === "ready") desc = S.ready.screen.ready;
  else if (st === "attention") desc = S.ready.screen.attentionShort;

  const actionFor = (): { label: string; onClick: () => void } | null => {
    switch (code) {
      case "SCREEN_TAB":
      case "SCREEN_WINDOW":
      case "SCREEN_STOPPED":
        return { label: S.ready.screen.again, onClick: () => void runCheck("screen") };
      case "SCREEN_MULTI":
        return { label: S.ready.screen.disconnected, onClick: () => void runCheck("screen") };
      case "SCREEN_CANCELLED":
        return { label: S.ready.screen.action, onClick: () => void runCheck("screen") };
      case "SCREEN_UNSUPPORTED":
        return {
          label: S.common.copyLink,
          onClick: () => {
            void navigator.clipboard?.writeText(location.href.split("#")[0]).catch(() => undefined);
            showToast(S.common.linkCopied);
          },
        };
      default:
        return { label: S.common.tryAgain, onClick: () => void runCheck("screen") };
    }
  };
  const fa = actionFor();
  return (
    <CheckRow
      id="screen"
      icon="screen"
      title={S.ready.screen.title}
      description={desc}
      status={st}
      pillLabel={pillText(st)}
      extraPill={st === "ready" ? <StatusPill kind="sharing">{S.status.sharing}</StatusPill> : undefined}
      action={
        st === "idle" ? (
          <Button onClick={() => void runCheck("screen")}>{c.stale ? S.ready.checkAgainQuick : S.ready.screen.action}</Button>
        ) : undefined
      }
    >
      {(st === "idle" || st === "checking") && <ScreenPickerIllustration />}
      {st === "attention" && code && fa && (
        <FixPanel
          icon="screen"
          text={msg(S.ready.screen, code)}
          actions={
            <Button data-fix-focus variant="secondary" onClick={fa.onClick}>
              {fa.label}
            </Button>
          }
        >
          {(code === "SCREEN_TAB" || code === "SCREEN_WINDOW" || code === "SCREEN_CANCELLED") && <ScreenPickerIllustration />}
          <Stuck attempts={c.attempts} />
        </FixPanel>
      )}
    </CheckRow>
  );
}

function FullscreenRow() {
  const c = useCheck("fullscreen");
  const st = c.status;
  const code = c.errorCode;
  let desc: string = S.ready.fullscreen.idle;
  if (c.stale) desc = staleLabel;
  else if (st === "ready") desc = S.ready.fullscreen.ready;
  else if (st === "attention") desc = S.ready.fullscreen.attentionShort;
  return (
    <CheckRow
      id="fullscreen"
      icon="fullscreen"
      title={S.ready.fullscreen.title}
      description={desc}
      status={st}
      pillLabel={pillText(st)}
      action={
        st === "idle" ? (
          <Button onClick={() => void runCheck("fullscreen")}>{c.stale ? S.ready.checkAgainQuick : S.ready.fullscreen.action}</Button>
        ) : undefined
      }
    >
      {st === "attention" && code && (
        <FixPanel
          icon="fullscreen"
          text={msg(S.ready.fullscreen, code)}
          actions={
            <Button data-fix-focus variant="secondary" onClick={() => void runCheck("fullscreen")}>
              {S.ready.fullscreen.action}
            </Button>
          }
        >
          <Stuck attempts={c.attempts} />
        </FixPanel>
      )}
    </CheckRow>
  );
}

const ROWS: Record<CheckId, () => React.ReactElement> = {
  internet: InternetRow,
  camera: CameraRow,
  mic: MicRow,
  face: FaceRow,
  screen: ScreenRow,
  fullscreen: FullscreenRow,
} as unknown as Record<CheckId, () => React.ReactElement>;

/* ---------------- screen ---------------- */

export function GetReady() {
  const s = useApp((x) => x);
  const steps = getSteps(s);
  const quick = steps.length === 1;
  const ids = getCheckIds(s);
  const req = requiredIds(s);
  const okCount = req.filter((id) => checkOk(s, id)).length;
  const left = req.length - okCount;
  const all = allRequiredOk(s);
  const hasProblem = !!firstProblem(s) || (!all && ids.some((i) => s.checks[i].broken));

  return (
    <StepFrame
      eyebrow={quick ? undefined : S.stepper.eyebrow(steps.indexOf("getReady") + 1, steps.length)}
      title={quick ? S.ready.quickTitle : S.ready.title}
      subtitle={quick ? S.ready.quickSubtitle : S.ready.subtitle}
    >
      <Card className="!p-5 sm:!p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <p className="text-body font-semibold text-ink" aria-live="polite" aria-atomic="true">
              {S.ready.progress(okCount, req.length)}
            </p>
            <div
              className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={req.length}
              aria-valuenow={okCount}
              aria-label="Checks ready"
            >
              <div className="h-full rounded-full bg-ok transition-all duration-200" style={{ width: `${req.length ? (okCount / req.length) * 100 : 0}%` }} />
            </div>
          </div>
          <Button variant="secondary" icon="refresh" loading={s.runningAll} onClick={() => void runAll()} disabled={all}>
            {s.runningAll ? S.ready.running : S.ready.runAll}
          </Button>
        </div>
      </Card>

      <div className="flex flex-col gap-3">
        {ids.map((id) => {
          const Row = ROWS[id];
          return <Row key={id} />;
        })}
      </div>

      <ActionBar
        onBack={quick ? undefined : back}
        primary={{ label: quick ? S.ready.quickContinue : S.common.continue, onClick: next, disabled: !all }}
        hint={all ? S.ready.allPassed : S.ready.left(left)}
        hintLive
        extra={
          !all ? (
            <button type="button" onClick={focusFirstProblem} className="inline-flex min-h-[44px] items-center text-sec font-medium text-brand underline">
              {S.ready.goToFirst}
            </button>
          ) : undefined
        }
      />
      <span className="sr-only">{hasProblem ? "" : ""}</span>
    </StepFrame>
  );
}

void T;

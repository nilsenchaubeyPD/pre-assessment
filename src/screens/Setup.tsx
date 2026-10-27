import { useEffect, useState } from "react";
import { StepFrame } from "../components/StepFrame";
import { Card } from "../components/Card";
import { ActionBar } from "../components/ActionBar";
import { FixPanel, SegmentedTabs } from "../components/FixPanel";
import { CameraStage, ExampleTile, MicBars, ScreenPicker, SetupStepper } from "../components/Media";
import { Button, Icon, T } from "../components/primitives";
import { S } from "../strings";
import {
  advanceTab, allowCamera, allowMic, openHelp, photoCaptured, retakePhoto, setupBack, setupTabs, shareScreen,
  skipMic, startRecording, stopRecording, takePhoto, useApp, verifyFace, micOptional, checkOk,
} from "../state/flowMachine";

const camMsg = (code?: string) => (code ? (S.setup.camera as Record<string, unknown>)[code] : undefined) as string | undefined;
const micMsg = (code?: string) => (code ? (S.setup.mic as Record<string, unknown>)[code] : undefined) as string | undefined;
const scrMsg = (code?: string) => (code ? (S.setup.screen as Record<string, unknown>)[code] : undefined) as string | undefined;

function Instruction({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-sec text-body">{children}</p>;
}

function GetHelpLink({ attempts }: { attempts: number }) {
  if (attempts < 3) return null;
  return (
    <>
      <span className="text-sec text-body">{S.setup.camera.stillNot}</span>
      <Button variant="text" onClick={() => openHelp("setup", true)}>{S.common.stuckCta}</Button>
    </>
  );
}

/* Each tab hook returns pieces so the Setup screen can place them in one card + one action bar. */
type Pieces = {
  body: React.ReactNode;
  panel: React.ReactNode;
  primary: { label: React.ReactNode; onClick: () => void; disabled?: boolean; loading?: boolean };
  tertiary?: React.ReactNode;
  hint?: React.ReactNode;
};

/* ---------------- Camera ---------------- */
function Countdown3({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(3);
  useEffect(() => {
    if (n === 0) return void onDone();
    const t = setTimeout(() => setN(n - 1), 700);
    return () => clearTimeout(t);
  }, [n, onDone]);
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/30" aria-live="assertive">
      <span className="text-[72px] font-semibold text-white">{n || ""}</span>
    </div>
  );
}

function useCamera(): Pieces {
  const s = useApp((x) => x);
  const c = s.checks.camera;
  const { camStage: st, camDark } = s.setup;
  const err = c.status === "attention" ? c.errorCode : undefined;
  const msg = camMsg(err);
  const checking = c.status === "checking";

  const panel = msg ? (
    <FixPanel
      text={msg}
      actions={<GetHelpLink attempts={c.attempts} />}
    >
      {err === "CAM_BLOCKED" && <SegmentedTabs label={S.setup.browserTabs.label} tabs={S.setup.browserTabs.items as never} />}
    </FixPanel>
  ) : null;

  let body: React.ReactNode;
  let primary: { label: React.ReactNode; onClick: () => void; disabled?: boolean; loading?: boolean };
  let tertiary: React.ReactNode;

  if (st === "allow") {
    body = (
      <>
        <Instruction>{S.setup.camera.allowText}</Instruction>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {S.setup.camera.examples.map((e, i) => <ExampleTile key={e.label} index={i} label={e.label} ok={e.ok} />)}
        </div>
        {checking && <p className="mt-3 text-sec text-muted" role="status">{S.setup.camera.waiting}</p>}
      </>
    );
    primary = { label: err ? S.common.tryAgain : S.setup.camera.allow, onClick: allowCamera, loading: checking };
  } else {
    const live = st !== "review";
    body = (
      <>
        <Instruction>{st === "quick" ? S.setup.camera.returningText : S.setup.camera.photoText}</Instruction>
        <CameraStage oval={st !== "quick"} dark={camDark} live={live} frozen={st === "verifying"}>
          {st === "countdown" && <Countdown3 onDone={photoCaptured} />}
        </CameraStage>
        {camDark && st !== "countdown" && <div className="mt-3"><FixPanel tone="warning" text={S.setup.camera.darkNote} /></div>}
      </>
    );
    if (st === "photo") primary = { label: S.setup.camera.takePhoto, onClick: takePhoto };
    else if (st === "countdown") primary = { label: S.setup.camera.takePhoto, onClick: takePhoto, disabled: true };
    else if (st === "review") {
      primary = { label: S.setup.camera.verify, onClick: verifyFace };
      tertiary = <Button variant="secondary" onClick={retakePhoto}>{S.setup.camera.retake}</Button>;
    } else if (st === "verifying") primary = { label: S.setup.camera.verifying, onClick: () => {}, loading: true };
    else primary = { label: S.setup.camera.verify, onClick: verifyFace };
  }
  return { body, panel, primary, tertiary };
}

/* ---------------- Microphone ---------------- */
function useMic(): Pieces {
  const s = useApp((x) => x);
  const c = s.checks.mic;
  const st = s.setup.micStage;
  const [playing, setPlaying] = useState(false);
  const err = c.status === "attention" ? c.errorCode : undefined;
  const warn = c.status === "warning" && c.errorCode === "MIC_NOISY";
  const checking = c.status === "checking";
  const panel = micMsg(err) ? (
    <FixPanel text={micMsg(err)!} actions={<GetHelpLink attempts={c.attempts} />} />
  ) : warn && st === "heard" ? (
    <FixPanel tone="warning" text={S.setup.mic.MIC_NOISY} />
  ) : null;
  const skip = micOptional(s) ? <Button variant="text" onClick={skipMic}>{S.common.skip}</Button> : undefined;

  if (st === "allow")
    return {
      body: (
        <>
          <Instruction>{S.setup.mic.allowText}</Instruction>
          <p className="flex items-start gap-2 rounded-xl bg-brand-tint p-3 text-sec text-ink"><Icon name="info" size={16} className="mt-0.5" />{S.setup.mic.builtIn}</p>
        </>
      ),
      panel,
      primary: { label: err ? S.common.tryAgain : S.setup.mic.allow, onClick: allowMic, loading: checking },
      tertiary: skip,
    };
  const phrase = (
    <div className="rounded-xl bg-subtle p-4 text-center">
      <p className="text-sec text-muted">{S.setup.mic.say}</p>
      <p className="mt-1 text-body font-semibold text-ink">{S.setup.mic.phrase}</p>
    </div>
  );
  if (st === "phrase")
    return { body: phrase, panel, primary: { label: S.setup.mic.record, onClick: startRecording }, tertiary: skip };
  if (st === "recording")
    return {
      body: (<>{phrase}<div className="mt-4"><MicBars active /></div></>),
      panel,
      primary: { label: checking ? S.setup.camera.verifying : S.setup.mic.stop, onClick: stopRecording, loading: checking },
    };
  return {
    body: (
      <>
        <p className="text-sec text-muted">{S.setup.mic.heard}</p>
        <div className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-subtle p-4">
          <p className="text-body font-semibold text-ink">{S.setup.mic.phrase}</p>
          <span className="flex items-center gap-3">
            <Button variant="secondary" icon="play" onClick={() => { setPlaying(true); setTimeout(() => setPlaying(false), 1500); }}>
              {playing ? S.setup.mic.playing : S.setup.mic.play}
            </Button>
            <Icon name="checkCircle" size={22} className="text-okline" />
          </span>
        </div>
      </>
    ),
    panel,
    primary: { label: S.common.continue, onClick: () => advanceTab("mic") },
  };
}

/* ---------------- Screen ---------------- */
function useScreen(): Pieces {
  const s = useApp((x) => x);
  const c = s.checks.screen;
  const err = c.status === "attention" ? c.errorCode : undefined;
  const checking = c.status === "checking";
  const done = checkOk(s, "screen");
  return {
    body: (
      <>
        <ol className="mb-4 list-decimal space-y-1 pl-5 text-sec text-body">
          {S.setup.screen.steps.map((x) => <li key={x}>{x}</li>)}
        </ol>
        <ScreenPicker />
      </>
    ),
    panel: scrMsg(err) ? <FixPanel text={scrMsg(err)!} actions={<GetHelpLink attempts={c.attempts} />} /> : null,
    primary: {
      label: checking ? S.setup.screen.sharing : err === "SCREEN_MULTI" ? S.setup.screen.disconnected : err ? S.common.tryAgain : S.setup.screen.share,
      onClick: shareScreen,
      loading: checking || done,
    },
  };
}

export function Setup() {
  const s = useApp((x) => x);
  const tabs = setupTabs(s);
  const tab = s.setup.tab;
  const cam = useCamera();
  const mic = useMic();
  const scr = useScreen();
  const p = tab === "camera" ? cam : tab === "mic" ? mic : scr;
  const done = { camera: checkOk(s, "camera"), mic: checkOk(s, "mic"), screen: checkOk(s, "screen") };
  const busy = (tab === "camera" && (s.setup.camStage === "verifying" || s.setup.camStage === "countdown")) || s.checks[tab === "mic" ? "mic" : tab].status === "checking" && tab !== "camera";

  return (
    <>
      <StepFrame title={S.setup.tabs[tab]} hideTitle>
        <SetupStepper tabs={tabs} current={tab} done={done} />
        <Card>
          {p.body}
          {p.panel && <div className="mt-4">{p.panel}</div>}
        </Card>
      </StepFrame>
      <ActionBar
        onBack={setupBack}
        backDisabled={busy}
        primary={p.primary}
        tertiary={p.tertiary}
        hint={p.hint}
      />
    </>
  );
}
void T;

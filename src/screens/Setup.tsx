import { useEffect, useState } from "react";
import { StepFrame } from "../components/StepFrame";
import { Card } from "../components/Card";
import { FBtn, FixBox, Fi } from "../components/fig";
import { CameraStage, ExampleTiles, MicBars, ScreenPicker, SetupStepper } from "../components/Media";
import { S } from "../strings";
import { T } from "../components/primitives";
import {
  advanceTab, allowCamera, allowMic, checkOk, micOptional, openHelp, photoCaptured, retakePhoto, setupBack, setupTabs,
  shareScreen, skipMic, startRecording, stopRecording, takePhoto, useApp, verifyFace,
} from "../state/flowMachine";

const lookup = (group: Record<string, unknown>, code?: string) => (code ? (group[code] as string | undefined) : undefined);

/* Each tab returns its body, an optional inline message, and the two buttons of the Figma card. */
interface Pieces {
  body: React.ReactNode;
  message?: React.ReactNode;
  back: { label: string; onClick: () => void; disabled?: boolean };
  primary: { label: React.ReactNode; onClick: () => void; disabled?: boolean; busy?: boolean; icon?: "camera-01" | "microphone-01"; plain?: boolean };
}

function HelpLine({ attempts }: { attempts: number }) {
  if (attempts < 3) return null;
  return (
    <p style={{ marginTop: 8 }}>
      {S.setup.camera.stillNot}{" "}
      <button type="button" className="f-link" onClick={() => openHelp("setup", true)}>{S.common.stuckCta}</button>
    </p>
  );
}

function Count3({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(3);
  useEffect(() => {
    if (n === 0) return void onDone();
    const t = setTimeout(() => setN(n - 1), 700);
    return () => clearTimeout(t);
  }, [n, onDone]);
  return <div className="cd" aria-live="assertive">{n || ""}</div>;
}

/* ---------------- Camera ---------------- */
function useCamera(): Pieces {
  const s = useApp((x) => x);
  const c = s.checks.camera;
  const { camStage: st, camDark } = s.setup;
  const err = c.status === "attention" ? c.errorCode : undefined;
  const msg = lookup(S.setup.camera, err);
  const checking = c.status === "checking";
  const message = msg ? (
    <FixBox
      extra={
        <>
          {err === "CAM_BLOCKED" && <BrowserTabs />}
          <HelpLine attempts={c.attempts} />
        </>
      }
    >
      {msg}
    </FixBox>
  ) : null;

  if (st === "allow")
    return {
      body: (<><p className="f-ptxt">{S.setup.camera.allowText}</p><ExampleTiles /></>),
      message,
      back: { label: S.common.back, onClick: setupBack },
      primary: { label: err ? S.common.tryAgain : S.setup.camera.allow, onClick: allowCamera, busy: checking, icon: err ? undefined : "camera-01" },
    };

  const live = st === "photo" || st === "countdown" || st === "quick";
  const text = st === "quick" ? S.setup.camera.returningText : S.setup.camera.photoText;
  const body = (
    <>
      <CameraStage guide={st === "photo" || st === "countdown"} live={live} dark={camDark}>
        {st === "countdown" && <Count3 onDone={photoCaptured} />}
      </CameraStage>
      <p className="f-ptxt" style={{ marginTop: -8 }}>{text}</p>
      {camDark && st !== "countdown" && <FixBox kind="warn">{S.setup.camera.darkNote}</FixBox>}
    </>
  );
  if (st === "review")
    return { body, message, back: { label: S.setup.camera.retake, onClick: retakePhoto }, primary: { label: S.setup.camera.verify, onClick: verifyFace } };
  if (st === "verifying")
    return { body, message, back: { label: S.setup.camera.retake, onClick: retakePhoto, disabled: true }, primary: { label: S.setup.camera.verifying, onClick: () => {}, disabled: true, plain: true } };
  if (st === "quick")
    return { body, message, back: { label: S.common.back, onClick: setupBack }, primary: { label: S.setup.camera.verify, onClick: verifyFace } };
  return {
    body,
    message,
    back: { label: S.common.back, onClick: setupBack, disabled: st === "countdown" },
    primary: { label: S.setup.camera.takePhoto, onClick: takePhoto, disabled: st === "countdown", icon: "camera-01" },
  };
}

function BrowserTabs() {
  const [active, setActive] = useState("chrome");
  const items = S.setup.browserTabs.items;
  const cur = items.find((i) => i.id === active) ?? items[0];
  return (
    <div>
      <div className="f-tabs" role="tablist" aria-label={S.setup.browserTabs.label}>
        {items.map((i) => (
          <button key={i.id} type="button" role="tab" aria-selected={i.id === active} className={i.id === active ? "on" : ""} onClick={() => setActive(i.id)}>
            {i.label}
          </button>
        ))}
      </div>
      <ol>{cur.steps.map((x) => <li key={x}>{x}</li>)}</ol>
    </div>
  );
}

/* ---------------- Microphone ---------------- */
function useMic(): Pieces {
  const s = useApp((x) => x);
  const c = s.checks.mic;
  const st = s.setup.micStage;
  const [playing, setPlaying] = useState(false);
  const err = c.status === "attention" ? c.errorCode : undefined;
  const checking = c.status === "checking";
  const e = lookup(S.setup.mic, err);
  const noisy = c.status === "warning" && c.errorCode === "MIC_NOISY";
  const message = e ? <FixBox extra={<HelpLine attempts={c.attempts} />}>{e}</FixBox> : noisy && st === "heard" ? <FixBox kind="warn">{S.setup.mic.MIC_NOISY}</FixBox> : null;
  const back = { label: S.common.back, onClick: setupBack };

  if (st === "allow")
    return {
      body: (<div><p className="f-ptxt">{S.setup.mic.allowText}</p><p className="f-ptxt">{S.setup.mic.builtIn}</p></div>),
      message,
      back,
      primary: { label: err ? S.common.tryAgain : S.setup.mic.allow, onClick: allowMic, busy: checking, icon: err ? undefined : "microphone-01" },
    };

  const say = (
    <div className="f-qbox"><small>{S.setup.mic.say}</small><div className="qt">{S.setup.mic.phrase}</div></div>
  );
  const intro = <p className="f-ptxt">{S.setup.mic.builtIn}</p>;
  if (st === "phrase")
    return { body: (<>{intro}{say}</>), message, back, primary: { label: S.setup.mic.record, onClick: startRecording, icon: "microphone-01" } };
  if (st === "recording")
    return {
      body: (<>{intro}{say}<MicBars active /></>),
      message,
      back,
      primary: { label: S.setup.mic.stop, onClick: stopRecording, busy: checking, icon: "microphone-01" },
    };
  return {
    body: (
      <>
        {intro}
        {say}
        <div className="f-qbox f-hbox">
          <div style={{ flex: 1, minWidth: 0 }}>
            <small>{S.setup.mic.heard}</small>
            <div className="qt">{S.setup.mic.phrase}</div>
          </div>
          <FBtn variant="sec" icon="play" onClick={() => { setPlaying(true); setTimeout(() => setPlaying(false), 1500); }}>
            {playing ? S.setup.mic.playing : S.setup.mic.play}
          </FBtn>
          <span className="f-tick" role="img" aria-label="Audio is clear"><Fi n="tick-check" /></span>
        </div>
      </>
    ),
    message,
    back,
    primary: { label: S.common.continue, onClick: () => advanceTab("mic") },
  };
}

/* ---------------- Screen ---------------- */
function useScreen(): Pieces {
  const s = useApp((x) => x);
  const c = s.checks.screen;
  const err = c.status === "attention" ? c.errorCode : undefined;
  const checking = c.status === "checking";
  const msg = lookup(S.setup.screen, err);
  return {
    body: (
      <>
        <ol className="f-olist">{S.setup.screen.steps.map((x) => <li key={x}>{x}</li>)}</ol>
        <ScreenPicker />
      </>
    ),
    message: msg ? <FixBox extra={<HelpLine attempts={c.attempts} />}>{msg}</FixBox> : null,
    back: { label: S.common.back, onClick: setupBack },
    primary: {
      label: checking ? S.setup.screen.sharing : err === "SCREEN_MULTI" ? S.setup.screen.disconnected : err ? S.common.tryAgain : S.setup.screen.share,
      onClick: shareScreen,
      busy: checking || checkOk(s, "screen"),
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
  const skip = tab === "mic" && micOptional(s) && s.setup.micStage !== "recording";

  return (
    <StepFrame title={S.setup.tabs[tab]} hideTitle>
      <SetupStepper tabs={tabs} current={tab} done={done} />
      <Card className="dcard">
        {p.body}
        {p.message}
        <div className="f-acts">
          <FBtn variant="sec" big disabled={p.back.disabled} onClick={p.back.onClick}>{p.back.label}</FBtn>
          <FBtn
            big
            busy={p.primary.busy}
            icon={p.primary.icon}
            className={p.primary.plain ? "busy" : ""}
            disabled={p.primary.disabled || p.primary.busy}
            onClick={p.primary.onClick}
          >
            {p.primary.label}
          </FBtn>
        </div>
        {skip && (
          <button type="button" className="f-textbtn" style={{ alignSelf: "center", marginTop: -8 }} onClick={skipMic}>
            {S.common.skip}
          </button>
        )}
      </Card>
    </StepFrame>
  );
}
void T;

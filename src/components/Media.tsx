import { useEffect, useRef, useState } from "react";
import { S } from "../strings";
import { Fi, FiName, figUrl } from "./fig";
import { adapter } from "../state/flowMachine";

const img = (n: string) => figUrl(n + (n === "face-guide" ? ".png" : ".svg"));

/** Camera preview (Figma: 476x360 card area, #F8FAFC) built from the exported cam-head / cam-body / face-guide assets. */
export function CameraStage({
  guide = false,
  live = true,
  dark = false,
  children,
}: {
  guide?: boolean;
  live?: boolean;
  dark?: boolean;
  children?: React.ReactNode;
}) {
  const vid = useRef<HTMLVideoElement>(null);
  const stream = adapter.cameraStream;
  useEffect(() => {
    if (vid.current && stream) vid.current.srcObject = stream;
  }, [stream]);
  const P = (n: string, x: number, y: number, w: number, h: number) => (
    <img src={img(n)} alt="" style={{ left: `calc(50% + ${x}px)`, top: y, width: w, height: h }} />
  );
  return (
    <div className="f-cam" role="img" aria-label="Camera preview">
      {stream ? (
        <video ref={vid} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
      ) : (
        <>
          {P("cam-head", -49, 93, 98, 98)}
          {P("cam-body", -127, 222, 254, 260)}
          {guide && P("face-guide", -82, 40, 164, 204)}
        </>
      )}
      {dark && <span className="dim" />}
      {live && (
        <span className="tag">
          <i />
          {S.setup.camera.cameraOn}
        </span>
      )}
      {children}
    </div>
  );
}

/** The four example tiles on the "Allow Camera" step, positioned exactly as in the Figma frame. */
export function ExampleTiles() {
  const I = (n: string, x: number, y: number, w: number, h: number, abs = false) => (
    <img src={img(n)} alt="" style={{ left: abs ? x : `calc(50% + ${x}px)`, top: y, width: w, height: h }} />
  );
  const T = (cls: string, label: string, ok: boolean, imgs: React.ReactNode) => (
    <figure key={label}>
      <div className={`tile ${cls}`}>
        {imgs}
        <span className={`bd ${ok ? "ok" : ""}`}><Fi n={ok ? "check-badge" : "x-close"} /></span>
      </div>
      <figcaption>
        <span className="sr-only">{ok ? "Good example: " : "Avoid: "}</span>
        {label}
      </figcaption>
    </figure>
  );
  const L = S.setup.camera.examples;
  return (
    <div className="f-ex">
      {T("dark", L[0].label, false, <>{I("ex-dark-body", -51, 79, 100, 102)}{I("ex-dark-head", -21, 35, 40, 40)}</>)}
      {T("", L[1].label, false, <>{I("ex-body-small", -91, 89, 70, 102)}{I("ex-head-small", -70, 57, 28, 28)}{I("ex-body", -11, 79, 100, 102)}{I("ex-head", 19, 35, 40, 40)}</>)}
      {T("", L[2].label, false, <>{I("ex-body", -51, 79, 100, 102, true)}{I("ex-head", -21, 35, 40, 40, true)}</>)}
      {T("", L[3].label, true, <>{I("ex-ok-body", -51, 79, 100, 102)}{I("ex-head", -21, 35, 40, 40)}</>)}
    </div>
  );
}

/** Recording bars (Figma: light-blue rounded bars, moving while recording). */
export function MicBars({ active }: { active: boolean }) {
  const [level, setLevel] = useState<number[]>([0.3, 0.5, 0.8, 0.4, 0.7, 0.35, 0.6, 0.25, 0.45]);
  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hist = [...level];
    const off = adapter.watchMic((l) => {
      hist = [...hist.slice(1), reduce ? 0.5 : Math.max(0.15, l)];
      setLevel(hist);
    });
    return off;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
  return (
    <div className="f-meter" role="meter" aria-label={S.setup.mic.meter} aria-valuemin={0} aria-valuemax={1} aria-valuenow={level[level.length - 1]}>
      {level.map((l, i) => (
        <i key={i} style={{ height: 14 + l * 44 }} />
      ))}
    </div>
  );
}

/** Screen thumbnail used in the Chrome share dialog (from the Figma frame). */
export function ScreenThumb() {
  return (
    <svg viewBox="0 0 160 100" aria-hidden="true">
      <rect width="160" height="100" fill="#7ea0e6" />
      <rect x="14" y="12" width="70" height="52" rx="4" fill="#fff" opacity=".92" />
      <rect x="92" y="20" width="52" height="38" rx="4" fill="#fff" opacity=".7" />
      <rect y="90" width="160" height="10" fill="#1b2540" />
    </svg>
  );
}

/**
 * "Choose what to share" example dialog (Figma: Example browser dialog).
 * If an animated asset is exported to public/figma/choose-what-to-share.gif it is shown instead of the static frame.
 */
export function ScreenPicker() {
  const [animated, setAnimated] = useState(true);
  if (animated)
    return (
      <div className="f-shot">
        <img
          className="anim"
          src={figUrl("choose-what-to-share.gif")}
          alt="How to choose what to share: pick the Entire Screen tab, select Screen 1, then click Share."
          onError={() => setAnimated(false)}
        />
      </div>
    );
  return (
    <div className="f-shot" role="img" aria-label="Example of the Chrome sharing window with the Entire Screen tab and Screen 1 selected">
      <div className="h">
        <b>{S.setup.screen.pickerTitle}</b>
        <span>{S.setup.screen.pickerSub}</span>
      </div>
      <div className="tb">
        {S.setup.screen.pickerTabs.map((t, i) => (
          <span key={t} className={i === 2 ? "on" : ""}>{t}</span>
        ))}
      </div>
      <div className="bd">
        <div className="th">
          <ScreenThumb />
          {S.setup.screen.screenLabel}
        </div>
      </div>
    </div>
  );
}

/** Three-step device tracker: done = green circle, current = blue pill with label, upcoming = white circle. */
export function SetupStepper({ tabs, current, done }: { tabs: Array<"camera" | "mic" | "screen">; current: "camera" | "mic" | "screen"; done: Record<string, boolean> }) {
  const icons: Record<string, FiName> = { camera: "camera-01", mic: "microphone-01", screen: "tv-02" };
  return (
    <nav aria-label={S.setup.stepperLabel}>
      <ol className="f-trk" style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
        {tabs.map((t, i) => {
          const cur = t === current;
          const d = done[t] && !cur;
          return (
            <li key={t} style={{ display: "flex", alignItems: "center", flex: i < tabs.length - 1 ? 1 : "none" }} aria-current={cur ? "step" : undefined}>
              {cur ? (
                <span className="cur"><Fi n={icons[t]} />{S.setup.tabs[t]}</span>
              ) : (
                <span className={`dot ${d ? "done" : ""}`}>
                  <Fi n={icons[t]} />
                  <span className="sr-only">{S.setup.tabs[t]}{d ? ` ${S.setup.done}` : ""}</span>
                </span>
              )}
              {i < tabs.length - 1 && <span className="ln" style={{ margin: "0 8px" }} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

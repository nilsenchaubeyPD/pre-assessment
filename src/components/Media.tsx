import { useEffect, useRef, useState } from "react";
import { S } from "../strings";
import { Icon, IconName } from "./primitives";
import { adapter } from "../state/flowMachine";

/* ---------------- Silhouette building blocks ---------------- */
const PERSON = "#94A3B8";
const PERSON_DARK = "#64748B";

/** Large camera stage (476x256 in the design): mirrored live stream, or a neutral silhouette when simulated. */
export function CameraStage({
  oval = false,
  dark = false,
  live = true,
  frozen = false,
  children,
}: {
  oval?: boolean;
  dark?: boolean;
  live?: boolean;
  frozen?: boolean;
  children?: React.ReactNode;
}) {
  const vid = useRef<HTMLVideoElement>(null);
  const stream = adapter.cameraStream;
  useEffect(() => {
    if (vid.current && stream) vid.current.srcObject = stream;
  }, [stream]);
  return (
    <div className="relative h-[220px] w-full overflow-hidden rounded-xl bg-subtle sm:h-[256px]">
      {stream ? (
        <video ref={vid} autoPlay muted playsInline className="h-full w-full -scale-x-100 object-cover" aria-label="Your camera preview" />
      ) : (
        <svg viewBox="0 0 476 256" preserveAspectRatio="xMidYMax meet" className="h-full w-full" role="img" aria-label="Simulated camera preview">
          <circle cx="238" cy="102" r="35" fill={PERSON_DARK} />
          <path d="M148 256c0-58 36-90 90-90s90 32 90 90z" fill={PERSON_DARK} />
          {oval && <ellipse cx="238" cy="98" rx="58" ry="68" fill="none" stroke="#94A3B8" strokeWidth="1.6" strokeDasharray="5 4" />}
        </svg>
      )}
      {dark && <div className="absolute inset-0 bg-black/55" aria-hidden="true" />}
      {live && !frozen && (
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-danger-bg px-2.5 py-1 text-[13px] font-medium text-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-danger animate-pulse-dot" aria-hidden="true" />
          {S.setup.camera.cameraOn}
        </span>
      )}
      {children}
    </div>
  );
}

/** The four example tiles on the "Allow Camera" step. */
export function ExampleTile({ index, label, ok }: { index: number; label: string; ok: boolean }) {
  const bg = index === 0 ? "#475569" : "#F8FAFC";
  const fill = index === 0 ? "#334155" : PERSON;
  return (
    <figure className="m-0">
      <div className="relative h-[112px] overflow-hidden rounded-lg border border-line sm:h-[141px]" style={{ background: bg }}>
        <svg viewBox="0 0 232 141" preserveAspectRatio="xMidYMax slice" className="h-full w-full" aria-hidden="true">
          {index === 0 && (<><circle cx="116" cy="40" r="14" fill={fill} /><path d="M80 141c0-30 14-46 36-46s36 16 36 46z" fill={fill} /></>)}
          {index === 1 && (
            <>
              <circle cx="150" cy="40" r="15" fill={PERSON} /><path d="M112 141c0-32 15-48 38-48s38 16 38 48z" fill={PERSON} />
              <circle cx="82" cy="58" r="10" fill="#CBD5E1" /><path d="M56 141c0-22 10-34 26-34s26 12 26 34z" fill="#CBD5E1" />
            </>
          )}
          {index === 2 && (<><circle cx="2" cy="48" r="14" fill={PERSON} /><path d="M-22 141c0-30 14-46 36-46s26 10 30 46z" fill={PERSON} /></>)}
          {index === 3 && (<><circle cx="116" cy="40" r="15" fill={PERSON} /><path d="M78 141c0-32 15-48 38-48s38 16 38 48z" fill={PERSON} /></>)}
        </svg>
        <span
          className={`absolute bottom-2 right-2 inline-flex h-5 w-5 items-center justify-center rounded text-white ${ok ? "bg-okline" : "bg-danger"}`}
          aria-hidden="true"
        >
          <Icon name={ok ? "check" : "x"} size={14} />
        </span>
      </div>
      <figcaption className="mt-1.5 text-center text-[12px] font-medium text-ink">
        <span className="sr-only">{ok ? "Good example: " : "Avoid: "}</span>
        {label}
      </figcaption>
    </figure>
  );
}

/** Recording bars: light blue, moving while `active`. */
export function MicBars({ active }: { active: boolean }) {
  const [level, setLevel] = useState<number[]>(Array(9).fill(0.4));
  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hist = Array(9).fill(0.3);
    const off = adapter.watchMic((l) => {
      hist = [...hist.slice(1), reduce ? 0.5 : Math.max(0.15, l)];
      setLevel(hist);
    });
    return off;
  }, [active]);
  return (
    <div className="flex h-12 items-center justify-center gap-2" role="meter" aria-label={S.setup.mic.meter} aria-valuemin={0} aria-valuemax={1} aria-valuenow={level[level.length - 1]}>
      {level.map((l, i) => (
        <span key={i} className="w-3 rounded-full bg-[#BFDBFE] transition-[height] duration-100" style={{ height: `${10 + l * 34}px` }} />
      ))}
    </div>
  );
}

/** Browser share picker with "Entire Screen" selected. */
export function ScreenPicker() {
  return (
    <figure className="m-0 overflow-hidden rounded-xl border border-line bg-white" aria-label="Illustration of the browser sharing window with Entire Screen selected">
      <div className="px-4 pt-4">
        <p className="text-sec font-semibold text-ink">{S.setup.screen.pickerTitle}</p>
        <p className="text-[13px] text-body">{S.setup.screen.pickerSub}</p>
        <div className="mt-3 flex gap-5">
          {S.setup.screen.pickerTabs.map((t, i) => (
            <span key={t} className={`pb-2 text-[13px] font-medium ${i === 2 ? "border-b-2 border-brand text-brand" : "text-body"}`}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-center bg-subtle px-4 py-4">
        <div className="w-[146px] rounded-lg border-2 border-brand bg-white p-0 text-center">
          <div className="m-[3px] overflow-hidden rounded bg-[#7C9CE6]">
            <div className="flex h-[66px] items-center justify-center gap-2 px-2">
              <span className="h-10 w-[58px] rounded-sm bg-[#F1F5F9]" />
              <span className="h-8 w-[46px] rounded-sm bg-[#DBE4F7]" />
            </div>
            <div className="h-2 bg-[#1E2A4A]" />
          </div>
          <p className="pb-1 text-[12px] text-ink">{S.setup.screen.screenLabel}</p>
        </div>
      </div>
    </figure>
  );
}

/** Three-step pill stepper (Camera, Microphone, Screen Sharing). */
export function SetupStepper({
  tabs,
  current,
  done,
}: {
  tabs: Array<"camera" | "mic" | "screen">;
  current: "camera" | "mic" | "screen";
  done: Record<string, boolean>;
}) {
  const icons: Record<string, IconName> = { camera: "camera", mic: "mic", screen: "screen" };
  return (
    <nav aria-label={S.setup.stepperLabel} className="mb-4">
      <ol className="flex items-center">
        {tabs.map((t, i) => {
          const cur = t === current;
          const d = done[t] && !cur;
          return (
            <li key={t} className={`flex items-center ${i < tabs.length - 1 ? "flex-1" : ""}`} aria-current={cur ? "step" : undefined}>
              <span
                className={`inline-flex h-8 items-center gap-2 rounded-full border text-sec font-medium ${
                  cur ? "border-transparent bg-brand-tint px-3 text-brand" : d ? "w-8 justify-center border-okline bg-okline text-white" : "w-8 justify-center border-line bg-white text-ink"
                }`}
              >
                <Icon name={icons[t]} size={16} />
                {cur && S.setup.tabs[t]}
                <span className="sr-only">
                  {!cur && S.setup.tabs[t]}
                  {d && ` ${S.setup.done}`}
                </span>
              </span>
              {i < tabs.length - 1 && <span className="mx-2 h-px flex-1 bg-line" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

import React, { useState } from "react";
import { Icon } from "./primitives";
import { S } from "../strings";
import {
  Controls,
  advanceClock,
  applyPreset,
  breakNow,
  resetAll,
  setControl,
  useApp,
  isReal,
} from "../state/flowMachine";

type Opt = [string, string];
const OPTS: Array<{ key: keyof Controls; label: string; options: Opt[] }> = [
  { key: "testType", label: "Test type", options: [["proctored", "Proctored"], ["seb", "SEB"], ["non_proctored", "Non-proctored"]] },
  { key: "link", label: "Link state", options: [["valid", "Valid"], ["early", "Early"], ["late", "Late"], ["closed", "Closed"], ["submitted", "Submitted"], ["invalid", "Invalid"], ["resume", "Resume"], ["expired", "Session expired"], ["error", "Unknown error"]] },
  { key: "device", label: "Device", options: [["win_chrome", "Windows Chrome"], ["mac_safari", "Mac Safari"], ["mac_chrome", "Mac Chrome"], ["iphone", "iPhone"], ["android_tablet", "Android tablet"]] },
  { key: "candidate", label: "Candidate", options: [["first", "First time"], ["returning", "Returning"]] },
  { key: "camera", label: "Camera", options: [["ok", "OK"], ["blocked", "Blocked"], ["dismissed", "Dismissed"], ["notfound", "Not found"], ["inuse", "In use"], ["osblocked", "OS blocked"], ["dark", "Dark"]] },
  { key: "mic", label: "Microphone", options: [["ok", "OK"], ["blocked", "Blocked"], ["notfound", "Not found"], ["silent", "Silent"], ["noisy", "Noisy"]] },
  { key: "face", label: "Face", options: [["ok", "OK"], ["none", "No face"], ["multiple", "Multiple faces"], ["covered", "Covered"], ["far", "Too far"], ["close", "Too close"], ["dark", "Too dark"], ["nomatch", "Not recognised"]] },
  { key: "screen", label: "Screen", options: [["ok", "OK"], ["cancelled", "Cancelled"], ["tab", "Tab"], ["window", "Window"], ["multi", "Multiple displays"], ["osblocked", "OS blocked"], ["unsupported", "Unsupported"]] },
  { key: "extensions", label: "Extensions", options: [["none", "None found"], ["found", "Found"]] },
  { key: "network", label: "Network", options: [["good", "Good"], ["slow", "Slow"], ["offline", "Offline"]] },
  { key: "start", label: "Start", options: [["success", "Success"], ["fail", "Fail"]] },
];
const EXTRA: typeof OPTS = [
  { key: "consent", label: "Consent", options: [["new", "Not yet given"], ["already", "Already agreed"]] },
  { key: "micMode", label: "Microphone rule", options: [["required", "Required"], ["optional", "Optional"]] },
  { key: "browser", label: "Browser version", options: [["default", "Current"], ["outdated", "Outdated"]] },
  { key: "earlySetup", label: "Early setup", options: [["allowed", "Allowed"], ["locked", "Not allowed"]] },
  { key: "sebLaunch", label: "SEB launch", options: [["works", "Works"], ["blocked", "Blocked after 5s"]] },
  { key: "load", label: "Link check speed", options: [["normal", "Normal"], ["slow", "Slow (12s)"]] },
];

function Field({ def }: { def: (typeof OPTS)[number] }) {
  const { key: k, label, options } = def;
  const v = useApp((s) => s.controls[k]) as string;
  const id = `pc-${k}`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[13px] font-medium text-muted">{label}</label>
      <select
        id={id}
        value={v}
        onChange={(e) => setControl(k, e.target.value as never)}
        className="h-10 rounded-ctrl border border-ctrl bg-white px-2 text-sec text-ink"
      >
        {options.map(([val, l]) => (
          <option key={val} value={val}>{l}</option>
        ))}
      </select>
    </div>
  );
}

export function PrototypeControls() {
  const [open, setOpen] = useState(false);
  const failOnce = useApp((s) => s.controls.failOnce);
  if (typeof location !== "undefined" && new URLSearchParams(location.search).get("proto") === "0") return null;
  return (
    <div className="fixed bottom-24 left-3 z-40 sm:bottom-4">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          aria-controls="proto-panel"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-ctrl bg-white px-4 text-sec font-medium text-ink shadow-md hover:bg-subtle"
        >
          <Icon name="wrench" size={18} />
          {S.panel.title}
        </button>
      ) : (
        <div id="proto-panel" role="region" aria-label={S.panel.title} className="flex max-h-[80vh] w-[min(320px,calc(100vw-24px))] flex-col rounded-card border border-cardline bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 className="text-body font-semibold">{S.panel.title}</h2>
            <button type="button" aria-expanded onClick={() => setOpen(false)} aria-label="Collapse prototype controls" className="inline-flex h-9 w-9 items-center justify-center rounded-ctrl text-muted hover:bg-subtle">
              <Icon name="chevron" size={18} />
            </button>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-3">
            <div>
              <p className="mb-2 text-[13px] font-medium text-muted">Presets</p>
              <div className="flex flex-wrap gap-2">
                {([
                  ["happy", "Happy path"],
                  ["firstTimer", "First-timer with problems"],
                  ["failOnce", "Everything fails once"],
                  ["early", "Early link"],
                  ["phone", "Phone on proctored test"],
                  ["seb", "SEB"],
                ] as const).map(([k, l]) => (
                  <button key={k} type="button" onClick={() => applyPreset(k)} className="min-h-[36px] rounded-full border border-ctrl px-3 text-[13px] font-medium text-ink hover:bg-subtle">
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[13px] font-medium text-muted">Break it now</p>
              <div className="flex flex-wrap gap-2">
                <Btn onClick={() => breakNow("screen")}>Stop screen sharing</Btn>
                <Btn onClick={() => breakNow("camera")}>Unplug camera</Btn>
                <Btn onClick={() => breakNow("network")}>Go offline</Btn>
                <Btn onClick={advanceClock}>Advance clock to start time</Btn>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sec text-ink">
              <input type="checkbox" className="h-5 w-5 accent-[#2563EB]" checked={failOnce} onChange={(e) => setControl("failOnce", e.target.checked)} />
              Fail once, then succeed
            </label>
            <div className="grid grid-cols-2 gap-3">
              {OPTS.map((o) => (
                <Field key={o.key} def={o} />
              ))}
            </div>
            <details>
              <summary className="cursor-pointer text-sec font-medium text-brand">More controls</summary>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {EXTRA.map((o) => (
                  <Field key={o.key} def={o} />
                ))}
              </div>
            </details>
            <p className="text-[13px] text-muted">
              Device layer: {isReal ? "real (?real=1)" : "simulated"}. Outcomes apply the next time a check runs. Changing test type, link, device or candidate restarts the flow.
            </p>
          </div>
          <div className="border-t border-line p-3">
            <button type="button" onClick={resetAll} className="h-10 w-full rounded-ctrl border border-ctrl text-sec font-medium text-ink hover:bg-subtle">
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Btn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="min-h-[36px] rounded-ctrl border border-ctrl bg-white px-3 text-[13px] font-medium text-ink hover:bg-subtle">
      {children}
    </button>
  );
}

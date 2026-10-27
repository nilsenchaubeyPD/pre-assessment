import { useEffect, useRef, useState } from "react";
import { S } from "../strings";
import { adapter } from "../state/flowMachine";

/** Mirrored live preview (real stream) or a neutral silhouette (simulated). */
export function CameraPreview({
  width = 160,
  height = 120,
  oval = false,
  dark = false,
  caption,
  frozen = false,
  status,
}: {
  width?: number;
  height?: number;
  oval?: boolean;
  dark?: boolean;
  caption?: string;
  frozen?: boolean;
  status?: string;
}) {
  const vid = useRef<HTMLVideoElement>(null);
  const stream = adapter.cameraStream;
  useEffect(() => {
    if (vid.current && stream) vid.current.srcObject = stream;
  }, [stream]);
  return (
    <figure className="m-0 inline-block">
      <div
        className="relative overflow-hidden rounded-ctrl bg-[#CBD3DF]"
        style={{ width, height, maxWidth: "100%" }}
      >
        {stream ? (
          <video ref={vid} autoPlay muted playsInline className="h-full w-full -scale-x-100 object-cover" aria-label="Your camera preview" />
        ) : (
          <svg viewBox="0 0 160 120" className="h-full w-full -scale-x-100" role="img" aria-label="Simulated camera preview">
            <rect width="160" height="120" fill="#CBD3DF" />
            <circle cx="80" cy="50" r="19" fill="#8794A8" />
            <path d="M34 120c2-26 21-38 46-38s44 12 46 38z" fill="#8794A8" />
          </svg>
        )}
        {dark && <div className="absolute inset-0 bg-black/55" aria-hidden="true" />}
        {oval && (
          <svg viewBox="0 0 160 120" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <mask id="ovalMask">
                <rect width="160" height="120" fill="white" />
                <ellipse cx="80" cy="58" rx="34" ry="44" fill="black" />
              </mask>
            </defs>
            <rect width="160" height="120" fill="rgba(31,42,61,0.45)" mask="url(#ovalMask)" />
            <ellipse cx="80" cy="58" rx="34" ry="44" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray={frozen ? "0" : "5 4"} />
          </svg>
        )}
        {!frozen && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[12px] font-medium text-ink">
            <span className="h-2 w-2 rounded-full bg-ok animate-pulse-dot" aria-hidden="true" />
            {S.status.cameraOn}
          </span>
        )}
        {status && (
          <span className="absolute inset-x-0 bottom-0 bg-ink/70 px-2 py-1 text-center text-[13px] font-medium text-white">{status}</span>
        )}
      </div>
      {caption && <figcaption className="mt-1.5 text-sec text-muted">{caption}</figcaption>}
    </figure>
  );
}

export function MicMeter({ active }: { active: boolean }) {
  const [level, setLevel] = useState(0);
  useEffect(() => {
    if (!active) {
      setLevel(0);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const off = adapter.watchMic((l) => setLevel(reduce ? Math.round(l * 4) / 4 : l));
    return off;
  }, [active]);
  const bars = 8;
  const lit = Math.round(level * bars);
  return (
    <div className="flex h-8 items-end gap-1" role="meter" aria-label={S.ready.mic.meter} aria-valuemin={0} aria-valuemax={8} aria-valuenow={lit}>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={`w-2 rounded-sm transition-colors duration-100 ${i < lit ? (i > 5 ? "bg-review" : "bg-ok") : "bg-line"}`}
          style={{ height: `${10 + i * 3}px` }}
        />
      ))}
    </div>
  );
}

/** Small static illustration of the browser's share picker with "Entire Screen" highlighted. */
export function ScreenPickerIllustration() {
  return (
    <figure className="m-0 max-w-[320px]" aria-label="Illustration of the browser sharing window with the Entire Screen tab highlighted">
      <div className="overflow-hidden rounded-ctrl border border-ctrl bg-white shadow-sm">
        <div className="border-b border-line bg-subtle px-3 py-2 text-[13px] font-medium text-ink">{S.ready.screen.pickerTitle}</div>
        <div className="flex gap-1 px-3 pt-2">
          {S.ready.screen.pickerTabs.map((t, i) => (
            <span
              key={t}
              className={`px-2 pb-1.5 text-[13px] ${i === 2 ? "border-b-2 border-brand font-semibold text-brand" : "text-muted"}`}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3 px-3 py-4">
          <div className="flex h-14 w-24 items-center justify-center rounded border-2 border-brand bg-brand-tint">
            <span className="h-6 w-10 rounded-sm bg-[#9DBBF2]" />
          </div>
          <span className="text-[13px] font-medium text-brand">{S.ready.screen.pickerNote}</span>
        </div>
      </div>
    </figure>
  );
}

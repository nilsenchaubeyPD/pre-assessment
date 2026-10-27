import { S } from "../strings";
import { useServerNow } from "../state/flowMachine";

const pad = (n: number) => String(n).padStart(2, "0");

export function parts(ms: number) {
  const t = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(t / 86400), h: Math.floor((t % 86400) / 3600), m: Math.floor((t % 3600) / 60), s: t % 60, done: t <= 0 };
}

/** Live tiles: Days / Hours / Minutes / Seconds. Uses server time, never the device clock. */
export function Countdown({ target }: { target: number }) {
  const now = useServerNow();
  const p = parts(target - now);
  const tiles: Array<[string, number]> = [
    [S.gate.early.days, p.d],
    [S.gate.early.hours, p.h],
    [S.gate.early.minutes, p.m],
    [S.gate.early.seconds, p.s],
  ];
  return (
    <div role="timer" aria-label="Time until the test opens" className="grid grid-cols-4 gap-3">
      {tiles.map(([label, n]) => (
        <div key={label} className="rounded-ctrl border border-cardline bg-subtle px-2 py-4 text-center">
          <div className="text-[28px] font-semibold leading-9 tabular-nums text-ink">{pad(n)}</div>
          <div className="text-sec text-muted">{label}</div>
        </div>
      ))}
    </div>
  );
}

export function InlineCountdown({ target }: { target: number }) {
  const now = useServerNow();
  const p = parts(target - now);
  const txt = `${p.d > 0 ? `${p.d}d ` : ""}${pad(p.h)}:${pad(p.m)}:${pad(p.s)}`;
  return (
    <span aria-live="off" className="tabular-nums">
      {S.start.opensIn} {txt}
    </span>
  );
}

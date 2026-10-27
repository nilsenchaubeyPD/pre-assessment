import { Icon, Ph } from "./primitives";
import { S } from "../strings";
import { openHelp, useApp } from "../state/flowMachine";

/** Header from the Figma frames: company logo left; Report, network quality and candidate name right. */
export function Header() {
  const helpOpen = useApp((s) => s.helpOpen);
  const net = useApp((s) => s.checks.internet.status);
  const offline = useApp((s) => s.controls.network === "offline");
  const kind = offline || net === "attention" ? "offline" : net === "warning" ? "slow" : net === "ready" ? "good" : "checking";
  const tone = {
    good: "text-okline",
    slow: "text-review",
    offline: "text-warn",
    checking: "text-muted",
  }[kind];
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-7">
        <span className="text-[20px] font-semibold leading-none text-ink" aria-label="Company logo">
          <Ph>{S.header.logo}</Ph>
        </span>
        <div className="flex items-center gap-1 text-sec text-ink sm:gap-5">
          <button
            id="get-help-btn"
            type="button"
            aria-haspopup="dialog"
            aria-expanded={helpOpen}
            onClick={() => openHelp()}
            className="inline-flex h-11 items-center gap-1.5 rounded-ctrl px-2 hover:bg-subtle"
          >
            <Icon name="alertOctagon" size={16} />
            <span>{S.header.report}</span>
          </button>
          <span className={`inline-flex h-11 items-center gap-1.5 px-1 ${tone}`} role="status" aria-label={`Connection: ${S.header.net[kind]}`}>
            <Icon name="wifi" size={16} />
            <span className="hidden text-ink sm:inline">{S.header.net[kind]}</span>
          </span>
          <span className="hidden h-11 max-w-[160px] items-center gap-1 px-1 min-[420px]:inline-flex">
            <span className="truncate">
              <Ph>[First name]</Ph>
            </span>
            <Icon name="chevron" size={16} className="text-muted" />
          </span>
        </div>
      </div>
    </header>
  );
}

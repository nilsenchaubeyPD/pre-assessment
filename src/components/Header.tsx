import { Icon, Logo, Ph } from "./primitives";
import { S } from "../strings";
import { openHelp, useApp } from "../state/flowMachine";
import { testConfig } from "../config/testConfig";

export function Header() {
  const helpOpen = useApp((s) => s.helpOpen);
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />
        <div className="hidden min-w-0 flex-1 justify-center px-4 sm:flex">
          <span className="max-w-[360px] text-sec font-medium text-ink">
            <span className="block truncate" title={testConfig.assessmentName}>
              <Ph>{testConfig.assessmentName}</Ph>
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="get-help-btn"
            type="button"
            aria-haspopup="dialog"
            aria-expanded={helpOpen}
            onClick={() => openHelp()}
            className="inline-flex h-11 items-center gap-2 rounded-ctrl border border-ctrl bg-white px-3 text-[15px] font-medium text-ink hover:bg-subtle sm:px-4"
          >
            <Icon name="help" size={20} className="text-brand" />
            <span>{S.header.help}</span>
          </button>
          <span className="hidden max-w-[140px] items-center rounded-full bg-subtle px-3 py-1.5 text-th text-ink min-[420px]:inline-flex">
            <span className="truncate">
              <Ph>[First name]</Ph>
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}

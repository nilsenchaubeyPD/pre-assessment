import { Fi } from "./fig";
import { figUrl } from "./fig";
import { S } from "../strings";
import { candidate } from "../config/testConfig";
import { openHelp, useApp } from "../state/flowMachine";

/** Figma header: NVIDIA logo on the left; Report, network quality and candidate name on the right. */
export function Header() {
  const helpOpen = useApp((s) => s.helpOpen);
  const phase = useApp((s) => s.phase);
  const net = useApp((s) => s.checks.internet.status);
  const offline = useApp((s) => s.controls.network === "offline");
  const kind = offline || net === "attention" ? "offline" : net === "warning" ? "slow" : net === "ready" ? "good" : "checking";
  const cls = kind === "good" || kind === "checking" ? "" : kind === "slow" ? "slow" : "bad";
  const showUser = phase !== "details" && phase !== "gate";
  return (
    <header className="f-hdr">
      <img className="f-logo" src={figUrl("org-logo.svg")} alt={`${candidate.company} logo`} />
      <div className="f-hr">
        <button id="get-help-btn" type="button" aria-haspopup="dialog" aria-expanded={helpOpen} onClick={() => openHelp()} className="f-hlink">
          <Fi n="alert-octagon" />
          {S.header.report}
        </button>
        {showUser && (
          <>
            <span className={`f-hlink f-hnet ${cls}`} role="status" aria-label={`Connection: ${S.header.net[kind]}`}>
              <Fi n="wifi" />
              <span className="f-hide-sm">{S.header.net[kind]}</span>
            </span>
            <span className="f-hlink f-hide-sm">
              {candidate.firstName}
              <Fi n="chevron-down" />
            </span>
          </>
        )}
      </div>
    </header>
  );
}

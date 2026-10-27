import { GateShell } from "./GateShell";
import { Button, Icon } from "../../components/primitives";
import { S } from "../../strings";
import { openHelp, openSeb, sebAlreadyInstalled, showToast, useApp } from "../../state/flowMachine";

export function SebGate() {
  const launch = useApp((s) => s.sebLaunch);
  return (
    <GateShell
      icon="lock"
      title={S.gate.seb.title}
      actions={
        <>
          <Button loading={launch === "launching"} onClick={() => void openSeb()}>
            {launch === "launching" ? S.gate.seb.launching : S.gate.seb.open}
          </Button>
          <Button variant="secondary" icon="download" onClick={() => showToast(S.gate.seb.downloaded)}>
            {S.gate.seb.download}
          </Button>
          <Button variant="text" onClick={sebAlreadyInstalled}>
            {S.gate.seb.installed}
          </Button>
          <Button variant="text" onClick={() => openHelp("gate")}>
            {S.common.getHelp}
          </Button>
        </>
      }
    >
      <ol className="flex flex-col gap-3">
        {S.gate.seb.steps.map((t, i) => (
          <li key={t} className="flex items-start gap-3">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand bg-brand-tint text-[13px] font-semibold text-brand">
              {i + 1}
            </span>
            <span className="pt-0.5 text-body text-body">{t}</span>
          </li>
        ))}
      </ol>
      {launch === "blocked" && (
        <div role="alert" className="mt-5 flex items-start gap-3 rounded-ctrl border border-[#F3DC8B] bg-[#FFFAE8] p-4 text-sec text-ink">
          <Icon name="info" size={20} className="mt-0.5 text-review" />
          <div className="flex-1">
            <p>{S.gate.seb.blocked}</p>
            <Button variant="secondary" className="mt-3" onClick={() => void openSeb()}>
              {S.gate.seb.tryAgain}
            </Button>
          </div>
        </div>
      )}
    </GateShell>
  );
}

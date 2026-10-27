import { GateShell } from "./Gate/GateShell";
import { Button } from "../components/primitives";
import { StatusPill } from "../components/StatusPill";
import { S } from "../strings";
import { restartPrototype, useApp } from "../state/flowMachine";

export function Started() {
  const resume = useApp((s) => s.controls.link === "resume");
  return (
    <GateShell
      icon="checkCircle"
      tone="ok"
      title={S.started.title}
      body={resume ? S.started.resumeBody : S.started.body}
      actions={<Button onClick={restartPrototype}>{S.started.restart}</Button>}
    >
      <StatusPill kind="ready">{S.started.pill}</StatusPill>
    </GateShell>
  );
}

import { StepFrame } from "../components/StepFrame";
import { Card } from "../components/Card";
import { ActionBar } from "../components/ActionBar";
import { Icon, IconName, Ph } from "../components/primitives";
import { S } from "../strings";
import { logout, next } from "../state/flowMachine";

function Tile({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-brand-tint p-4">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand">
        <Icon name={icon} size={20} />
      </span>
      <div>
        <p className="text-sec text-body">{label}</p>
        <p className="text-body font-semibold text-ink">
          <Ph>{value}</Ph>
        </p>
      </div>
    </div>
  );
}

export function Details() {
  return (
    <>
      <StepFrame title="[Assessment name]">
        <div className="grid gap-3 sm:grid-cols-2">
          <Tile icon="layers" label={S.details.totalSections} value="[Number]" />
          <Tile icon="clock" label={S.details.duration} value="[Duration]" />
        </div>
        <Card>
          <h2 className="text-body font-semibold text-ink">{S.details.confirmTitle}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sec text-muted">Name</dt>
              <dd className="text-body text-ink"><Ph>[Full name]</Ph></dd>
            </div>
            <div>
              <dt className="text-sec text-muted">Email</dt>
              <dd className="break-all text-body text-ink"><Ph>[Email address]</Ph></dd>
            </div>
          </dl>
          <button type="button" onClick={logout} className="mt-4 inline-flex min-h-[44px] items-center text-sec font-medium text-brand hover:underline">
            {S.details.logout}
          </button>
        </Card>
      </StepFrame>
      <ActionBar primary={{ label: S.details.confirm, onClick: next }} />
    </>
  );
}

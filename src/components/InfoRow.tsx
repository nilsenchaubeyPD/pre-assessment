import React from "react";
import { Icon, IconName, T } from "./primitives";

export type BadgeTone = "ok" | "warn" | "review" | "busy";
const tones: Record<BadgeTone, string> = {
  ok: "bg-ok-bg text-ok",
  warn: "bg-warn-bg text-warn",
  review: "bg-review-bg text-review",
  busy: "bg-busy-bg text-busy",
};

export function Badge({ tone, icon, children }: { tone: BadgeTone; icon?: IconName; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-medium leading-[18px] transition-colors duration-150 ${tones[tone]}`}>
      {icon && <Icon name={icon} size={14} />}
      {children}
    </span>
  );
}

/** Row used across Before you begin, Consent, Everything is set and Code of Conduct. */
export function InfoRow({
  icon,
  label,
  body,
  right,
  below,
}: {
  icon: IconName;
  label: string;
  body: React.ReactNode;
  right?: React.ReactNode;
  below?: React.ReactNode;
}) {
  return (
    <li className="list-none">
      <div className="grid grid-cols-[32px_1fr_auto] items-center gap-x-4 gap-y-0.5 py-1.5 sm:grid-cols-[32px_160px_1fr_auto] sm:gap-y-0">
        <span className="row-span-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-brand sm:row-span-1">
          <Icon name={icon} size={16} />
        </span>
        <span className="text-sec font-semibold text-ink">{label}</span>
        <span className="col-start-2 row-start-2 text-sec text-body sm:col-start-auto sm:row-start-auto">{typeof body === "string" ? <T s={body} /> : body}</span>
        <span className="col-start-3 row-start-1 row-span-2 justify-self-end sm:col-start-auto sm:row-span-1 sm:row-start-auto">{right}</span>
      </div>
      {below}
    </li>
  );
}

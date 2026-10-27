import React from "react";
import { Icon, IconName, T } from "./primitives";
import { StatusPill, PillKind } from "./StatusPill";
import { CheckStatus } from "../state/flowMachine";
import { S } from "../strings";

export const pillFor: Record<CheckStatus, PillKind> = {
  idle: "idle",
  checking: "checking",
  ready: "ready",
  warning: "warning",
  attention: "attention",
  waiting: "waiting",
  skipped: "skipped",
};

export function CheckRow({
  id,
  icon,
  title,
  description,
  status,
  pillLabel,
  action,
  extraPill,
  children,
}: {
  id: string;
  icon: IconName;
  title: string;
  description: string;
  status: CheckStatus;
  pillLabel: string;
  action?: React.ReactNode;
  extraPill?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const tone =
    status === "attention" ? "border-[#F6C9A6]" : status === "ready" ? "border-[#BBE5C8]" : "border-cardline";
  return (
    <div
      id={`check-${id}`}
      className={`rounded-card border bg-white p-4 transition-colors duration-150 sm:p-5 ${tone} ${status === "waiting" ? "opacity-70" : ""}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex flex-1 items-start gap-3 sm:gap-4">
          <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${status === "ready" ? "bg-ok-bg text-ok" : "bg-subtle text-body"}`}>
            <Icon name={status === "ready" ? "check" : icon} size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-body font-semibold text-ink">{title}</h3>
              {extraPill}
            </div>
            <p className="mt-0.5 text-sec text-body">
              <T s={description} />
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:shrink-0 sm:justify-end">
          <span aria-live="polite" aria-atomic="true">
            <span className="sr-only">{title}: </span>
            <StatusPill kind={pillFor[status]}>{pillLabel}</StatusPill>
          </span>
          {action}
        </div>
      </div>
      {children && <div className="mt-4 flex flex-col gap-3">{children}</div>}
    </div>
  );
}

export const pillText = (status: CheckStatus, waitingFor?: string): string => {
  if (status === "waiting") return S.status.waiting(waitingFor ?? "previous check");
  return S.status[status];
};

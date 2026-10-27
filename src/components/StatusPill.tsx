import { Icon, IconName, Spinner } from "./primitives";

export type PillKind =
  | "idle" | "checking" | "ready" | "warning" | "attention" | "waiting" | "skipped" | "optional" | "sharing" | "info" | "practice";

const style: Record<PillKind, { cls: string; icon?: IconName | "spinner" | "dot" }> = {
  idle: { cls: "bg-busy-bg text-busy", icon: "clock" },
  checking: { cls: "bg-busy-bg text-busy", icon: "spinner" },
  ready: { cls: "bg-ok-bg text-ok", icon: "checkCircle" },
  warning: { cls: "bg-review-bg text-review", icon: "alert" },
  attention: { cls: "bg-warn-bg text-warn", icon: "alert" },
  waiting: { cls: "bg-busy-bg text-busy", icon: "clock" },
  skipped: { cls: "bg-busy-bg text-busy", icon: "check" },
  optional: { cls: "bg-review-bg text-review", icon: "info" },
  sharing: { cls: "bg-ok-bg text-ok", icon: "dot" },
  info: { cls: "bg-brand-tint text-brand", icon: "info" },
  practice: { cls: "bg-review-bg text-review", icon: "info" },
};

export function StatusPill({ kind, children, className = "" }: { kind: PillKind; children: React.ReactNode; className?: string }) {
  const s = style[kind];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[13px] font-medium leading-[18px] transition-colors duration-150 ${s.cls} ${className}`}
    >
      {s.icon === "spinner" ? (
        <Spinner size={14} />
      ) : s.icon === "dot" ? (
        <span className="h-2 w-2 rounded-full bg-ok animate-pulse-dot" aria-hidden="true" />
      ) : s.icon ? (
        <Icon name={s.icon} size={14} />
      ) : null}
      {children}
    </span>
  );
}

import React from "react";

/** Exported Figma icons live in /public/figma. They render as a mask so they take the current text colour. */
export type FiName =
  | "activity" | "alert-octagon" | "appwin" | "badge-shield" | "badge-wifi" | "camera-01" | "check-badge"
  | "chevron-down" | "clock" | "download-01" | "file-check-02" | "globe-02" | "layers-three-02" | "microphone-01"
  | "play" | "plug" | "row-wifi" | "shield-tick" | "summary-check" | "sun" | "tick-check" | "tv-02"
  | "upload-01" | "wifi" | "x-close";

export const figUrl = (n: string) => `/figma/${n}`;

export function Fi({ n, size, className = "", style }: { n: FiName; size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <i
      className={`fi ${className}`}
      aria-hidden="true"
      style={{ ["--m" as string]: `url(${figUrl(n + ".svg")})`, ...(size ? { width: size, height: size } : {}), ...style }}
    />
  );
}

/* Icons not exported in the Figma assets (users, phone, warning, info) use the same 1.5px outline style. */
const LU: Record<string, React.ReactNode> = {
  users: (<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>),
  phone: (<><rect width="14" height="20" x="5" y="2" rx="2" /><path d="M12 18h.01" /></>),
  warn: (<><path d="m21.7 18-8-14a2 2 0 0 0-3.5 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3" /><path d="M12 9v4M12 17h.01" /></>),
  info: (<><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>),
};
export function Lu({ n, size = 16 }: { n: keyof typeof LU; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {LU[n]}
    </svg>
  );
}

export type Glyph = FiName | keyof typeof LU;
const isFi = (g: string): g is FiName => !(g in LU);
export function Glyph({ g }: { g: Glyph }) {
  return isFi(g) ? <Fi n={g} /> : <Lu n={g} />;
}

/** One Figma row: 32px icon tile, bold label (160px), description, optional right side. */
export function Row({
  icon,
  label,
  children,
  side,
  descProps,
}: {
  icon: Glyph;
  label: string;
  children: React.ReactNode;
  side?: React.ReactNode;
  descProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  return (
    <div className="f-row">
      <span className="f-itile"><Glyph g={icon} /></span>
      <div className="f-rt">{label}</div>
      <div className="f-rd" {...descProps}>{children}</div>
      {side && <div className="f-rs">{side}</div>}
    </div>
  );
}

export type BadgeKind = "ok" | "warn" | "bad" | "idle";
export function Badge({ kind, icon, children, pop }: { kind: BadgeKind; icon?: FiName; children: React.ReactNode; pop?: boolean }) {
  return (
    <span className={`f-bdg ${kind} ${pop ? "f-pop" : ""}`}>
      {icon && <Fi n={icon} />}
      {children}
    </span>
  );
}

export function FBtn({
  variant = "primary",
  big,
  busy,
  icon,
  children,
  className = "",
  ...rest
}: {
  variant?: "primary" | "sec";
  big?: boolean;
  busy?: boolean;
  icon?: FiName;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`f-btn ${variant === "sec" ? "sec" : ""} ${big ? "big" : ""} ${busy ? "busy" : ""} ${className}`} {...rest}>
      {busy && <span className="f-spin" style={{ borderColor: "rgba(255,255,255,.35)", borderTopColor: "#fff" }} />}
      {!busy && icon && <Fi n={icon} />}
      {children}
    </button>
  );
}

/** Inline error / heads-up message (kept compact, used only when something goes wrong). */
export function FixBox({ kind = "bad", children, extra }: { kind?: "bad" | "warn"; children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div className={`f-fix ${kind}`} role="status" data-fix-panel>
      <div>{children}</div>
      {extra}
    </div>
  );
}

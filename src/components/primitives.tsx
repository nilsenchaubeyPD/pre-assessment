import React from "react";

/* ---------------- Icons: thin stroke, rounded ---------------- */
const paths: Record<string, React.ReactNode> = {
  info: (<><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 7.8h.01" /></>),
  help: (<><circle cx="12" cy="12" r="9" /><path d="M9.6 9.4a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1.1.9-1.1 1.7" /><path d="M12 16.6h.01" /></>),
  chevron: <path d="M6 9l6 6 6-6" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  checkCircle: (<><circle cx="12" cy="12" r="9" /><path d="M8 12.5l3 3 5-6" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  camera: (<><rect x="3" y="6.5" width="13" height="11" rx="2.5" /><path d="M16 11l5-3v8l-5-3" /></>),
  mic: (<><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" /><path d="M12 18v3" /></>),
  face: (<><circle cx="12" cy="12" r="9" /><path d="M9 10h.01M15 10h.01" /><path d="M8.5 14.5c1 1.2 2.1 1.8 3.5 1.8s2.5-.6 3.5-1.8" /></>),
  screen: (<><rect x="3" y="4.5" width="18" height="12" rx="2" /><path d="M8 20h8M12 16.5V20" /></>),
  fullscreen: <path d="M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9M15 4h3.5A1.5 1.5 0 0 1 20 5.5V9M20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15M9 20H5.5A1.5 1.5 0 0 1 4 18.5V15" />,
  wifi: (<><path d="M3 9.5a14 14 0 0 1 18 0" /><path d="M6 13a9.5 9.5 0 0 1 12 0" /><path d="M9 16.4a5 5 0 0 1 6 0" /><path d="M12 19.5h.01" /></>),
  alert: (<><path d="M12 4l9 15.5H3L12 4z" /><path d="M12 10v4" /><path d="M12 17h.01" /></>),
  x: <path d="M6 6l12 12M18 6L6 18" />,
  copy: (<><rect x="8.5" y="8.5" width="11" height="11" rx="2" /><path d="M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" /></>),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  record: (<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.2" /></>),
  timer: (<><circle cx="12" cy="13.5" r="7.5" /><path d="M12 9.5v4l2 1.5M9.5 3h5" /></>),
  laptop: (<><rect x="5" y="5" width="14" height="10" rx="1.5" /><path d="M2.5 19h19" /></>),
  link: (<><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 10 18.7l1-1" /></>),
  mail: (<><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="M3.5 7l8.5 6 8.5-6" /></>),
  calendar: (<><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>),
  plug: (<><path d="M9 3v5M15 3v5" /><path d="M6.5 8h11v3a5.5 5.5 0 0 1-11 0V8z" /><path d="M12 16.5V21" /></>),
  lock: (<><rect x="5" y="10.5" width="14" height="9.5" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>),
  refresh: (<><path d="M20 12a8 8 0 1 1-2.6-5.9" /><path d="M20 4v4.5h-4.5" /></>),
  download: (<><path d="M12 4v11M7.5 10.5L12 15l4.5-4.5" /><path d="M5 19.5h14" /></>),
  external: (<><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" /></>),
  wrench: <path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3l7.5-7.5-2-2z" />,
  user: (<><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c.8-3.6 3.5-5.5 7-5.5s6.2 1.9 7 5.5" /></>),
  chat: <path d="M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 16.5h-7l-4.5 3.5v-3.5H5A1.5 1.5 0 0 1 3.5 15V7A1.5 1.5 0 0 1 5 5.5z" />,
  layers: (<><path d="M12 3.5l8.5 4.5-8.5 4.5L3.5 8 12 3.5z" /><path d="M3.5 12l8.5 4.5 8.5-4.5" /><path d="M3.5 16l8.5 4.5 8.5-4.5" /></>),
  shield: (<><path d="M12 3l7.5 2.8v5.7c0 4.4-3 7.6-7.5 9.5-4.5-1.9-7.5-5.1-7.5-9.5V5.8L12 3z" /><path d="M8.8 12l2.2 2.2 4.2-4.4" /></>),
  globe: (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.6 2.6 3.8 5.6 3.8 9S14.6 18.4 12 21c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z" /></>),
  sun: (<><circle cx="12" cy="12" r="3.8" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" /></>),
  windowApp: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 9.5h18" /></>),
  activity: <path d="M3 12h4l2.5-6 4 12 2.5-6H21" />,
  users: (<><circle cx="9" cy="8.5" r="3" /><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6" /><path d="M15.5 5.8a3 3 0 0 1 0 5.4M17.5 14.7c1.8.6 3 2 3.5 4.3" /></>),
  phone: (<><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M11 18h2" /></>),
  doc: (<><path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5z" /><path d="M14 3.5V8h4M9 12.5h6M9 16h4" /></>),
  play: <path d="M8 5.5v13l10.5-6.5L8 5.5z" />,
  arrowDown: <path d="M12 4.5v13M6.5 12L12 17.5 17.5 12" />,
  arrowUp: <path d="M12 19.5v-13M6.5 12L12 6.5l5.5 5.5" />,
  alertOctagon: (<><path d="M8.2 3.5h7.6l4.7 4.7v7.6l-4.7 4.7H8.2l-4.7-4.7V8.2l4.7-4.7z" /><path d="M12 8v4.5" /><path d="M12 15.6h.01" /></>),
};

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20, className = "", title }: { name: IconName; size?: number; className?: string; title?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      aria-label={title}
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

export function Spinner({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={`animate-spin ${className}`} aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Placeholder-aware text ---------------- */
/** Renders a string and wraps any [bracketed] token in a dotted-underline placeholder. */
export function T({ s }: { s: string }) {
  const parts = s.split(/(\[[^\]]+\](?:\])?)/g);
  // Handle nested like "[Late-start policy, for example: Your time ends at [End time]]"
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("[") ? (
          <span key={i} className="ph" data-placeholder>
            {p}
          </span>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        ),
      )}
    </>
  );
}
export const Ph = ({ children }: { children: React.ReactNode }) => (
  <span className="ph" data-placeholder>
    {children}
  </span>
);

/* ---------------- Button ---------------- */
type Variant = "primary" | "secondary" | "text" | "danger-text";
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  large?: boolean;
  full?: boolean;
  icon?: IconName;
}
export const Button = React.forwardRef<HTMLButtonElement, BtnProps>(function Button(
  { variant = "primary", loading, large, full, icon, className = "", children, disabled, onClick, ...rest },
  ref,
) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-ctrl font-medium text-sec transition-colors select-none " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 " +
    "disabled:cursor-not-allowed ";
  const size = large ? "h-12 px-8 text-body" : "h-12 sm:h-10 px-4";
  const styles: Record<Variant, string> = {
    primary: "bg-brand text-white hover:bg-brand-hover disabled:bg-[#B9C7E4] disabled:text-white",
    secondary: "bg-white text-ink border border-ctrl hover:bg-subtle disabled:text-muted disabled:bg-subtle",
    text: "text-brand hover:underline px-2 h-11 disabled:text-muted",
    "danger-text": "text-muted hover:text-ink hover:underline px-2 h-11",
  };
  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      type="button"
      className={`${base} ${variant === "text" || variant === "danger-text" ? "" : size} ${styles[variant]} ${full ? "w-full" : ""} ${className}`}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading || undefined}
      onClick={(e) => {
        if (isDisabled) return; // double-click guard
        onClick?.(e);
      }}
      {...rest}
    >
      {loading ? <Spinner /> : icon ? <Icon name={icon} size={18} /> : null}
      {children}
    </button>
  );
});


/* ---------------- Truncating text with tooltip (long names) ---------------- */
export function Truncate({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span className={`block truncate ${className}`} title={children}>
      {children}
    </span>
  );
}

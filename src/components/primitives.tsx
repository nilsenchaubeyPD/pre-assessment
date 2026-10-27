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
    "inline-flex items-center justify-center gap-2 rounded-ctrl font-medium text-[15px] leading-5 transition-colors select-none " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 " +
    "disabled:cursor-not-allowed ";
  const size = large ? "h-12 px-8 text-base sm:h-[52px]" : "h-12 sm:h-11 px-5";
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

/* ---------------- Logo ---------------- */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-label="topin.tech">
      <svg width="26" height="28" viewBox="0 0 26 28" aria-hidden="true">
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FF4D8D" />
            <stop offset="1" stopColor="#D1126B" />
          </linearGradient>
        </defs>
        <path d="M13 1.5l10.5 3.7v8.4c0 6.2-4.2 10.6-10.5 13-6.3-2.4-10.5-6.8-10.5-13V5.2L13 1.5z" fill="url(#lg)" />
        <path d="M8.5 13.5l3 3 6-6.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <span className="text-[20px] font-semibold leading-none tracking-tight">
        <span className="text-navy">topin</span>
        <span className="text-magenta">.tech</span>
      </span>
    </span>
  );
}

/* ---------------- Truncating text with tooltip (long names) ---------------- */
export function Truncate({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span className={`block truncate ${className}`} title={children}>
      {children}
    </span>
  );
}

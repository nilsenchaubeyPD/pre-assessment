import React, { useId, useState } from "react";
import { Icon } from "./primitives";

/** (i) icon that opens a dark-slate tooltip on hover and keyboard focus. */
export function Tooltip({
  text,
  label = "More information",
  align = "center",
  children,
}: {
  text: string;
  label?: string;
  align?: "center" | "left" | "right";
  children?: React.ReactNode;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const pos = align === "center" ? "left-1/2 -translate-x-1/2" : align === "left" ? "left-0" : "right-0";
  const arrow = align === "center" ? "left-1/2 -translate-x-1/2" : align === "left" ? "left-3" : "right-3";
  return (
    <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        className="inline-flex h-6 min-w-6 items-center justify-center gap-1 rounded-full text-muted hover:text-brand focus-visible:text-brand"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        onClick={() => setOpen((o) => !o)}
      >
        {children ?? <Icon name="info" size={18} />}
      </button>
      {open && (
        <span
          role="tooltip"
          id={id}
          className={`absolute bottom-full z-50 mb-2 w-max max-w-[min(320px,calc(100vw-32px))] rounded-ctrl bg-tip px-3 py-2 text-left text-sec font-normal text-white ${pos}`}
        >
          {text}
          <span className={`absolute top-full h-0 w-0 border-x-[6px] border-t-[6px] border-x-transparent border-t-tip ${arrow}`} />
        </span>
      )}
    </span>
  );
}

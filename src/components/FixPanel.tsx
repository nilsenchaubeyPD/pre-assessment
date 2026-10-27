import React, { useRef, useState } from "react";
import { Icon, IconName, T } from "./primitives";

/** Inline fix panel shown under a row. Orange for needs-attention, yellow for heads-up. */
export function FixPanel({
  tone = "attention",
  icon = "alert",
  text,
  children,
  actions,
}: {
  tone?: "attention" | "warning";
  icon?: IconName;
  text: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const cls =
    tone === "attention" ? "border-[#F6C9A6] bg-[#FFF4EB]" : "border-[#F3DC8B] bg-[#FFFAE8]";
  const ic = tone === "attention" ? "text-warn" : "text-review";
  return (
    <div className={`animate-step-in rounded-ctrl border p-4 ${cls}`} data-fix-panel>
      <div className="flex items-start gap-3">
        <Icon name={icon} size={20} className={`mt-0.5 ${ic}`} />
        <p className="flex-1 text-sec text-ink">
          <T s={text} />
        </p>
      </div>
      {children && <div className="mt-3 pl-8">{children}</div>}
      {actions && <div className="mt-3 flex flex-wrap items-center gap-3 pl-8">{actions}</div>}
    </div>
  );
}

/** Segmented tabs (browser instructions). Arrow keys move between tabs. */
export function SegmentedTabs({
  label,
  tabs,
}: {
  label: string;
  tabs: Array<{ id: string; label: string; steps: string[] }>;
}) {
  const [active, setActive] = useState(tabs[0].id);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const onKey = (e: React.KeyboardEvent, i: number) => {
    let n = i;
    if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
    else return;
    e.preventDefault();
    setActive(tabs[n].id);
    refs.current[tabs[n].id]?.focus();
  };
  const cur = tabs.find((t) => t.id === active) ?? tabs[0];
  return (
    <div>
      <div role="tablist" aria-label={label} className="inline-flex max-w-full flex-wrap gap-1 rounded-ctrl bg-tabs p-1">
        {tabs.map((t, i) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              ref={(el) => (refs.current[t.id] = el)}
              role="tab"
              type="button"
              id={`tab-${t.id}`}
              aria-selected={on}
              aria-controls={`panel-${t.id}`}
              tabIndex={on ? 0 : -1}
              onKeyDown={(e) => onKey(e, i)}
              onClick={() => setActive(t.id)}
              className={`min-h-[36px] rounded-md px-3 py-1.5 text-sec font-medium transition-colors ${
                on ? "bg-white text-brand shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" id={`panel-${cur.id}`} aria-labelledby={`tab-${cur.id}`} className="mt-3">
        <ol className="list-decimal space-y-1 pl-5 text-sec text-ink">
          {cur.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

import React, { useId, useState } from "react";
import { Icon } from "./primitives";
import { S } from "../strings";

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  body: React.ReactNode;
  chip?: React.ReactNode;
  showWhy?: boolean;
}

/** Bordered accordion rows. Only one open at a time. */
export function Accordion({ items, defaultOpen = null, className = "" }: { items: AccordionItem[]; defaultOpen?: string | null; className?: string }) {
  const [open, setOpen] = useState<string | null>(defaultOpen);
  const base = useId();
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {items.map((it) => {
        const isOpen = open === it.id;
        const pid = `${base}-${it.id}-panel`;
        return (
          <div key={it.id} className="rounded-ctrl border border-cardline bg-white">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={pid}
              onClick={() => setOpen(isOpen ? null : it.id)}
              className="flex min-h-[56px] w-full items-center gap-3 rounded-ctrl px-4 py-3 text-left"
            >
              <span className="flex-1 text-body font-semibold text-ink">{it.title}</span>
              {it.chip}
              {it.showWhy !== false && <span className="text-sec font-medium text-brand">{S.common.why}</span>}
              <Icon name="chevron" size={20} className={`text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <div id={pid} role="region" hidden={!isOpen} className="border-t border-line px-4 py-3 text-sec text-body">
              {it.body}
            </div>
          </div>
        );
      })}
    </div>
  );
}

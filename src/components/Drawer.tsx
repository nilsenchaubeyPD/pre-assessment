import React, { useId, useRef } from "react";
import { useFocusTrap } from "./a11y";
import { Icon } from "./primitives";
import { S } from "../strings";

/** Right-side drawer on desktop, bottom sheet on mobile. Traps focus, Esc closes, focus returns. */
export function Drawer({
  open,
  onClose,
  title,
  children,
  returnFocusId,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  returnFocusId?: string;
}) {
  if (!open) return null;
  return (
    <DrawerInner onClose={onClose} title={title} returnFocusId={returnFocusId}>
      {children}
    </DrawerInner>
  );
}

function DrawerInner({
  onClose,
  title,
  children,
  returnFocusId,
}: {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  returnFocusId?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const tid = useId();
  useFocusTrap(ref, true, onClose, returnFocusId ? () => document.getElementById(returnFocusId) : undefined);
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 animate-fade bg-[#1F2A3D]/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tid}
        tabIndex={-1}
        className="absolute bottom-0 left-0 right-0 flex max-h-[92vh] animate-slide-up flex-col rounded-t-card bg-white shadow-xl sm:inset-y-0 sm:left-auto sm:max-h-none sm:w-[440px] sm:animate-slide-left sm:rounded-none sm:border-l sm:border-cardline"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 id={tid} className="text-section text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={S.common.close}
            className="inline-flex h-11 w-11 items-center justify-center rounded-ctrl text-muted hover:bg-subtle hover:text-ink"
          >
            <Icon name="x" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

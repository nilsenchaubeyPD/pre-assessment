import React, { useId, useRef } from "react";
import { useFocusTrap } from "./a11y";

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <ModalInner onClose={onClose} title={title} footer={footer}>
      {children}
    </ModalInner>
  );
}

function ModalInner({ onClose, title, children, footer }: { onClose: () => void; title: string; children: React.ReactNode; footer: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const tid = useId();
  useFocusTrap(ref, true, onClose);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 animate-fade bg-[#1F2A3D]/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tid}
        tabIndex={-1}
        className="relative w-full max-w-[480px] animate-step-in rounded-card bg-white p-6 shadow-xl sm:p-8"
      >
        <h2 id={tid} className="text-section text-ink">{title}</h2>
        <div className="mt-3 text-body text-body">{children}</div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">{footer}</div>
      </div>
    </div>
  );
}

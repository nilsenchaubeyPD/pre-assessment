import React, { useEffect, useRef } from "react";
import { T } from "./primitives";

/** Standard page shell: eyebrow, h1 (receives focus on mount so it is announced), subtitle. */
export function StepFrame({
  eyebrow,
  title,
  subtitle,
  children,
  narrow,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  narrow?: boolean;
}) {
  const h1 = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    h1.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [title]);
  return (
    <div className={`animate-step-in mx-auto w-full px-4 py-8 sm:px-6 sm:py-10 ${narrow ? "max-w-[640px]" : "max-w-content"}`}>
      {eyebrow && <p className="mb-2 text-sec font-medium text-brand">{eyebrow}</p>}
      <h1 ref={h1} tabIndex={-1} className="text-title text-ink outline-none">
        <T s={title} />
      </h1>
      {subtitle && (
        <p className="mt-2 text-body text-body">
          <T s={subtitle} />
        </p>
      )}
      <div className="mt-8 flex flex-col gap-6">{children}</div>
    </div>
  );
}

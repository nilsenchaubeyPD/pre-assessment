import React, { useEffect, useRef } from "react";
import { T } from "./primitives";

/** Page column from the Figma frames: 720px wide, 24px title (receives focus on mount so it is announced). */
export function StepFrame({ title, children, hideTitle }: { title: string; children: React.ReactNode; hideTitle?: boolean }) {
  const h1 = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    h1.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [title]);
  return (
    <div className="f-col animate-step-in">
      <h1 ref={h1} tabIndex={-1} className={hideTitle ? "sr-only" : "f-h1"}>
        <T s={title} />
      </h1>
      {children}
    </div>
  );
}

import React, { useEffect, useRef } from "react";
import { T } from "./primitives";

/** Page shell from the Figma frames: 720px column, 24px title (receives focus on mount so it is announced). */
export function StepFrame({
  title,
  children,
  hideTitle,
}: {
  title: string;
  children: React.ReactNode;
  hideTitle?: boolean;
}) {
  const h1 = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    h1.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [title]);
  return (
    <div className="mx-auto w-full max-w-content animate-step-in px-4 pb-6 pt-6 sm:pt-9">
      <h1 ref={h1} tabIndex={-1} className={`text-[22px] font-semibold leading-8 text-ink outline-none sm:text-[24px] ${hideTitle ? "sr-only" : "mb-6"}`}>
        <T s={title} />
      </h1>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

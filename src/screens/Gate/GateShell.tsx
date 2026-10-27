import React, { useEffect, useRef } from "react";
import { Card } from "../../components/Card";
import { Icon, IconName, T } from "../../components/primitives";

export function GateShell({
  icon,
  title,
  body,
  note,
  children,
  actions,
  tone = "brand",
}: {
  icon: IconName;
  title: string;
  body?: string;
  note?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  tone?: "brand" | "warn" | "review" | "ok";
}) {
  const h1 = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    h1.current?.focus({ preventScroll: true });
  }, [title]);
  const ic = {
    brand: "bg-brand-tint text-brand",
    warn: "bg-warn-bg text-warn",
    review: "bg-review-bg text-review",
    ok: "bg-ok-bg text-ok",
  }[tone];
  return (
    <div className="mx-auto w-full max-w-[640px] animate-step-in px-4 py-10 sm:px-6 sm:py-16">
      <Card>
        <span className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full ${ic}`}>
          <Icon name={icon} size={24} />
        </span>
        <h1 ref={h1} tabIndex={-1} className="text-title text-ink outline-none">
          <T s={title} />
        </h1>
        {body && (
          <p className="mt-3 text-body text-body">
            <T s={body} />
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
        {note && (
          <p className="mt-4 text-sec text-muted">
            <T s={note} />
          </p>
        )}
        {actions && <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">{actions}</div>}
      </Card>
    </div>
  );
}

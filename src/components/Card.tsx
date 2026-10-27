import React from "react";

export function Card({
  children,
  className = "",
  emphasis = false,
  as: Tag = "section",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  emphasis?: boolean;
  as?: "section" | "div";
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      className={`rounded-card bg-white p-4 sm:p-6 ${emphasis ? "border-2 border-brand" : "border border-cardline"} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function CardTitle({ children, id, className = "" }: { children: React.ReactNode; id?: string; className?: string }) {
  return (
    <h2 id={id} className={`text-sec font-semibold text-ink ${className}`}>
      {children}
    </h2>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton animate-shimmer ${className}`} aria-hidden="true" />;
}

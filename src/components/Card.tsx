import React from "react";

export function Card({ children, className = "", ...rest }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLElement>) {
  return <section className={`f-card ${className}`} {...rest}>{children}</section>;
}
export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="f-slab" style={{ fontSize: 14, lineHeight: "20px", fontWeight: 600, color: "#475569" }}>{children}</h2>;
}
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton animate-shimmer ${className}`} aria-hidden="true" />;
}

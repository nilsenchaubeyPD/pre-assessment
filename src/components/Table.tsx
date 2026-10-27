import React from "react";

export function Table({
  headers,
  rows,
  caption,
}: {
  headers: [string, string];
  rows: Array<{ label: string; value: React.ReactNode }>;
  caption?: string;
}) {
  return (
    <div className="overflow-hidden rounded-ctrl border border-cardline">
      <table className="w-full border-collapse text-left">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="bg-subtle">
            <th scope="col" className="w-[34%] px-4 py-3 text-th text-muted sm:w-[30%]">{headers[0]}</th>
            <th scope="col" className="px-4 py-3 text-th text-muted">{headers[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-line align-top">
              <th scope="row" className="px-4 py-3 text-sec font-semibold text-ink">{r.label}</th>
              <td className="px-4 py-3 text-sec text-body">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

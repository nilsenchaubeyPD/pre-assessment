import React from "react";
import { Button } from "./primitives";
import { S } from "../strings";

export interface ActionBarProps {
  onBack?: () => void;
  primary: {
    label: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
    large?: boolean;
  };
  hint?: React.ReactNode;
  hintLive?: boolean;
  extra?: React.ReactNode; // e.g. text link under the hint
  tertiary?: React.ReactNode; // e.g. "I don't agree"
}

/** Footer action bar. Sticky at the bottom on mobile with safe-area padding. */
export function ActionBar({ onBack, primary, hint, hintLive, extra, tertiary }: ActionBarProps) {
  return (
    <>
      <div className="h-32 sm:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white px-4 pt-3 safe-bottom sm:static sm:mt-6 sm:border-0 sm:bg-transparent sm:p-0">
        <div className="mx-auto flex max-w-content flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="hidden sm:block">
            {onBack ? (
              <Button variant="secondary" onClick={onBack}>
                {S.common.back}
              </Button>
            ) : null}
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            {(hint || extra) && (
              <div className="text-center sm:text-right">
                {hint && (
                  <p className="text-sec text-muted" aria-live={hintLive ? "polite" : undefined}>
                    {hint}
                  </p>
                )}
                {extra}
              </div>
            )}
            <div className="flex items-center gap-3">
              {onBack && (
                <Button variant="secondary" className="sm:hidden" onClick={onBack}>
                  {S.common.back}
                </Button>
              )}
              {tertiary}
              <Button
                variant="primary"
                large={primary.large}
                className="flex-1 sm:flex-none"
                disabled={primary.disabled}
                loading={primary.loading}
                onClick={primary.onClick}
              >
                {primary.label}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import React from "react";
import { Button } from "./primitives";
import { S } from "../strings";

export interface ActionBarProps {
  onBack?: () => void;
  backDisabled?: boolean;
  primary: {
    label: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
  hint?: React.ReactNode;
  hintLive?: boolean;
  tertiary?: React.ReactNode; // e.g. "I don't agree"
}

/** Footer bar from the Figma frames: Back on the left, primary on the right, inside the 720px column. */
export function ActionBar({ onBack, backDisabled, primary, hint, hintLive, tertiary }: ActionBarProps) {
  return (
    <>
      <div className="h-44 sm:h-24" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white px-4 py-3 safe-bottom sm:py-0 sm:pb-0">
        <div className="mx-auto flex max-w-content flex-col gap-2 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          {hint && (
            <p className="text-center text-sec text-muted sm:order-2 sm:ml-auto sm:mr-2 sm:text-right" aria-live={hintLive ? "polite" : undefined}>
              {hint}
            </p>
          )}
          <div className={`flex items-center gap-3 sm:order-3 ${onBack ? "" : "sm:ml-auto"}`}>
            {tertiary}
            <Button
              variant="primary"
              className="flex-1 sm:flex-none"
              disabled={primary.disabled}
              loading={primary.loading}
              onClick={primary.onClick}
            >
              {primary.label}
            </Button>
          </div>
          {onBack && (
            <div className="hidden sm:order-1 sm:block">
              <Button variant="secondary" disabled={backDisabled} onClick={onBack}>
                {S.common.back}
              </Button>
            </div>
          )}
        </div>
        {onBack && (
          <div className="mt-2 sm:hidden">
            <Button variant="secondary" full disabled={backDisabled} onClick={onBack}>
              {S.common.back}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

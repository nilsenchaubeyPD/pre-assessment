import React from "react";
import { FBtn } from "./fig";
import { S } from "../strings";

export interface ActionBarProps {
  onBack?: () => void;
  backDisabled?: boolean;
  primary: { label: React.ReactNode; onClick: () => void; disabled?: boolean; loading?: boolean };
  hint?: React.ReactNode;
  hintLive?: boolean;
  tertiary?: React.ReactNode;
}

/** Fixed footer from the Figma frames: Back on the left, primary on the right, inside the 720px column. */
export function ActionBar({ onBack, backDisabled, primary, hint, hintLive, tertiary }: ActionBarProps) {
  return (
    <>
      <div className="h-20" aria-hidden="true" />
      <div className="f-foot">
        <div className="f-footin">
          {onBack ? (
            <FBtn variant="sec" disabled={backDisabled} onClick={onBack}>{S.common.back}</FBtn>
          ) : (
            <span />
          )}
          <div className="f-hint" aria-live={hintLive ? "polite" : undefined}>{hint}</div>
          {tertiary}
          <FBtn disabled={primary.disabled} busy={primary.loading} onClick={primary.onClick}>{primary.label}</FBtn>
        </div>
      </div>
    </>
  );
}

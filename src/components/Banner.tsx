import React from "react";
import { Icon, IconName, T } from "./primitives";
import { S } from "../strings";
import { fixCheck, getCheckIds, useApp, useServerNow } from "../state/flowMachine";

type Tone = "info" | "review" | "warn" | "ok";
const toneCls: Record<Tone, string> = { info: "warn", review: "warn", warn: "bad", ok: "warn" };

export function Banner({
  tone,
  icon,
  children,
  assertive,
  action,
}: {
  tone: Tone;
  icon: IconName;
  children: React.ReactNode;
  assertive?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div role={assertive ? "alert" : "status"} aria-live={assertive ? "assertive" : "polite"} className={`f-ban ${toneCls[tone]}`}>
      <Icon name={icon} size={16} />
      <div style={{ flex: 1 }}>{children}</div>
      {action}
    </div>
  );
}

/** Persistent banner slot, shown under the header on every flow step. */
export function BannerSlot() {
  const s = useApp((x) => x);
  const now = useServerNow();
  if (s.phase === "gate" || s.phase === "started") return null;

  const items: React.ReactNode[] = [];
  const ids = getCheckIds(s);

  if (s.controls.network === "offline") {
    items.push(
      <Banner key="off" tone="warn" icon="wifi" assertive>
        {S.banners.offline}
      </Banner>,
    );
  }
  (["camera", "screen"] as const)
    .filter((id) => ids.includes(id) && s.checks[id].broken)
    .forEach((id) => {
      items.push(
        <Banner
          key={`b-${id}`}
          tone="warn"
          icon="alert"
          assertive
          action={
            <button
              type="button"
              className="f-link"
              onClick={() => fixCheck(id)}
            >
              {S.banners.fixIt}
            </button>
          }
        >
          {id === "screen" ? S.banners.screenStopped : S.banners.cameraLost}
        </Banner>,
      );
    });
  if (s.controls.link === "early" && now < s.scheduledStart) {
    items.push(
      <Banner key="early" tone="review" icon="clock">
        <T s={S.banners.notTheTest} />
      </Banner>,
    );
  }
  if (!items.length) return null;
  return <div className="mx-auto mt-4 flex w-full max-w-[752px] flex-col gap-2 px-4" style={{ marginBottom: -12 }}>{items}</div>;
}

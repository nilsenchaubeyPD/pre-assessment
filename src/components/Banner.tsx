import React from "react";
import { Icon, IconName, T } from "./primitives";
import { S } from "../strings";
import {
  checkOk,
  getCheckIds,
  goTo,
  focusFix,
  useApp,
  useServerNow,
  getSteps,
  firstProblem,
} from "../state/flowMachine";

type Tone = "info" | "review" | "warn" | "ok";
const tones: Record<Tone, string> = {
  info: "bg-brand-tint border-[#C9DAF8] text-ink",
  review: "bg-review-bg border-[#F3DC8B] text-review",
  warn: "bg-warn-bg border-[#F6C9A6] text-warn",
  ok: "bg-ok-banner border-[#BBF7D0] text-ok",
};

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
    <div
      role={assertive ? "alert" : "status"}
      aria-live={assertive ? "assertive" : "polite"}
      className={`flex items-start gap-3 rounded-ctrl border px-4 py-3 text-sec font-medium ${tones[tone]}`}
    >
      <Icon name={icon} size={20} className="mt-0.5" />
      <div className="flex-1">{children}</div>
      {action}
    </div>
  );
}

/** Persistent banner slot, shown under the stepper on every flow step. */
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
  const broken = ids.filter((id) => s.checks[id].broken && id !== "internet");
  broken.forEach((id) => {
    const text = id === "screen" ? S.banners.screenStopped : id === "camera" ? S.banners.cameraLost : S.banners.fullscreenExited;
    items.push(
      <Banner
        key={`b-${id}`}
        tone="warn"
        icon="alert"
        assertive
        action={
          s.phase !== "getReady" && getSteps(s).includes("getReady") ? (
            <button
              className="shrink-0 rounded px-2 py-1 text-sec font-semibold text-brand underline"
              onClick={() => {
                goTo("getReady");
                focusFix(id);
              }}
            >
              {S.banners.fixIt}
            </button>
          ) : undefined
        }
      >
        {text}
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
  void checkOk;
  void firstProblem;
  if (!items.length) return null;
  return <div className="mx-auto mt-4 flex w-full max-w-content flex-col gap-2 px-4 sm:px-6">{items}</div>;
}

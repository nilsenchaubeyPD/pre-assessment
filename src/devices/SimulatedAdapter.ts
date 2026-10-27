import {
  BreakKind,
  CheckResult,
  DeviceAdapter,
  ErrorCode,
  delay,
  rand,
} from "./DeviceAdapter";

/** Outcomes chosen in the Prototype Controls panel. Read fresh on every call. */
export interface SimOutcomes {
  camera: string;
  mic: string;
  face: string;
  screen: string;
  fullscreen: string;
  network: string;
}

type Consume = (key: keyof SimOutcomes) => void;

const cameraMap: Record<string, CheckResult> = {
  ok: { status: "ready" },
  blocked: { status: "attention", code: "CAM_BLOCKED" },
  dismissed: { status: "attention", code: "CAM_DISMISSED" },
  notfound: { status: "attention", code: "CAM_NOT_FOUND" },
  inuse: { status: "attention", code: "CAM_IN_USE" },
  osblocked: { status: "attention", code: "CAM_OS_BLOCKED" },
  dark: { status: "warning", code: "CAM_DARK" },
};
const micMap: Record<string, CheckResult> = {
  ok: { status: "ready" },
  blocked: { status: "attention", code: "MIC_BLOCKED" },
  notfound: { status: "attention", code: "MIC_NOT_FOUND" },
  silent: { status: "attention", code: "MIC_SILENT" },
  noisy: { status: "warning", code: "MIC_NOISY" },
};
const faceMap: Record<string, ErrorCode | undefined> = {
  ok: undefined,
  none: "FACE_NONE",
  multiple: "FACE_MULTIPLE",
  covered: "FACE_COVERED",
  far: "FACE_FAR",
  close: "FACE_CLOSE",
  dark: "FACE_DARK",
  nomatch: "FACE_NO_MATCH",
};
const screenMap: Record<string, ErrorCode | undefined> = {
  ok: undefined,
  cancelled: "SCREEN_CANCELLED",
  tab: "SCREEN_TAB",
  window: "SCREEN_WINDOW",
  multi: "SCREEN_MULTI",
  osblocked: "SCREEN_OS_BLOCKED",
  unsupported: "SCREEN_UNSUPPORTED",
};

export class SimulatedAdapter implements DeviceAdapter {
  readonly name = "simulated" as const;
  cameraStream: MediaStream | null = null;
  private listeners = new Set<(k: BreakKind) => void>();

  constructor(
    private outcomes: () => SimOutcomes,
    private consume: Consume,
  ) {}

  async checkInternet(): Promise<CheckResult> {
    await delay(rand(300, 700));
    const n = this.outcomes().network;
    if (n === "offline") return { status: "attention", code: "NET_OFFLINE" };
    if (n === "slow") return { status: "warning", code: "NET_SLOW" };
    return { status: "ready" };
  }

  async getCamera(): Promise<CheckResult> {
    await delay(rand(700, 1300));
    const key = this.outcomes().camera;
    this.consume("camera");
    return cameraMap[key] ?? cameraMap.ok;
  }

  async getMicLevel(): Promise<CheckResult> {
    await delay(rand(900, 1500));
    const key = this.outcomes().mic;
    this.consume("mic");
    return micMap[key] ?? micMap.ok;
  }

  watchMic(cb: (level: number) => void): () => void {
    let t = 0;
    const silent = this.outcomes().mic === "silent";
    const id = window.setInterval(() => {
      t += 1;
      const level = silent ? 0 : Math.max(0, Math.min(1, 0.45 + Math.sin(t / 2.3) * 0.3 + Math.random() * 0.25));
      cb(level);
    }, 120);
    return () => clearInterval(id);
  }

  async detectFace(): Promise<CheckResult> {
    await delay(rand(900, 1500));
    const key = this.outcomes().face;
    this.consume("face");
    const code = faceMap[key];
    return code ? { status: "attention", code } : { status: "ready" };
  }

  async shareScreen(): Promise<CheckResult> {
    await delay(rand(600, 1200));
    const key = this.outcomes().screen;
    this.consume("screen");
    const code = screenMap[key];
    return code ? { status: "attention", code } : { status: "ready" };
  }

  async enterFullscreen(): Promise<CheckResult> {
    await delay(rand(300, 600));
    const key = this.outcomes().fullscreen;
    this.consume("fullscreen");
    return key === "blocked" ? { status: "attention", code: "FULLSCREEN_BLOCKED" } : { status: "ready" };
  }

  async getDisplays(): Promise<number> {
    await delay(200);
    return this.outcomes().screen === "multi" ? 2 : 1;
  }

  onTrackEnded(cb: (kind: BreakKind) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  /** Used by the "Break it now" buttons. */
  trigger(kind: BreakKind) {
    this.listeners.forEach((l) => l(kind));
  }

  stopAll() {
    this.cameraStream = null;
  }
}

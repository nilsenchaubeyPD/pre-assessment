import { BreakKind, CheckResult, DeviceAdapter, ErrorCode, delay } from "./DeviceAdapter";

/**
 * Real browser adapter. Enable with ?real=1.
 * Face detection is a stub: real detection is a backend/model concern.
 */
export class RealAdapter implements DeviceAdapter {
  readonly name = "real" as const;
  cameraStream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;
  private micStream: MediaStream | null = null;
  private listeners = new Set<(k: BreakKind) => void>();

  constructor() {
    window.addEventListener("offline", () => this.emit("network"));
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) this.emit("fullscreen");
    });
  }

  private emit(kind: BreakKind) {
    this.listeners.forEach((l) => l(kind));
  }

  async checkInternet(): Promise<CheckResult> {
    if (!navigator.onLine) return { status: "attention", code: "NET_OFFLINE" };
    try {
      const t0 = performance.now();
      await fetch(`${location.origin}/?ping=${Date.now()}`, { cache: "no-store" });
      const ms = performance.now() - t0;
      return ms > 1500 ? { status: "warning", code: "NET_SLOW" } : { status: "ready" };
    } catch {
      return { status: "attention", code: "NET_OFFLINE" };
    }
  }

  async checkExtensions(): Promise<CheckResult> {
    await delay(400); // stub: browsers do not expose installed extensions
    return { status: "ready" };
  }

  async getCamera(): Promise<CheckResult> {
    if (!navigator.mediaDevices?.getUserMedia) return { status: "attention", code: "CAM_NOT_FOUND" };
    try {
      this.cameraStream?.getTracks().forEach((t) => t.stop());
      this.cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.cameraStream.getVideoTracks()[0].addEventListener("ended", () => this.emit("camera"));
      return { status: "ready" };
    } catch (e) {
      const name = (e as DOMException).name;
      const map: Record<string, ErrorCode> = {
        NotAllowedError: "CAM_BLOCKED",
        PermissionDeniedError: "CAM_BLOCKED",
        NotFoundError: "CAM_NOT_FOUND",
        DevicesNotFoundError: "CAM_NOT_FOUND",
        NotReadableError: "CAM_IN_USE",
        TrackStartError: "CAM_IN_USE",
        AbortError: "CAM_DISMISSED",
      };
      return { status: "attention", code: map[name] ?? "CAM_DISMISSED" };
    }
  }

  async getMicLevel(): Promise<CheckResult> {
    try {
      this.micStream?.getTracks().forEach((t) => t.stop());
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return { status: "ready" };
    } catch (e) {
      const name = (e as DOMException).name;
      return {
        status: "attention",
        code: name === "NotFoundError" ? "MIC_NOT_FOUND" : "MIC_BLOCKED",
      };
    }
  }

  watchMic(cb: (level: number) => void): () => void {
    if (!this.micStream) return () => {};
    const ctx = new AudioContext();
    const src = ctx.createMediaStreamSource(this.micStream);
    const an = ctx.createAnalyser();
    an.fftSize = 256;
    src.connect(an);
    const buf = new Uint8Array(an.frequencyBinCount);
    const id = window.setInterval(() => {
      an.getByteFrequencyData(buf);
      const avg = buf.reduce((a, b) => a + b, 0) / buf.length / 128;
      cb(Math.min(1, avg * 2));
    }, 100);
    return () => {
      clearInterval(id);
      void ctx.close();
    };
  }

  async detectFace(): Promise<CheckResult> {
    await delay(900); // stub: mock result
    return { status: "ready" };
  }

  async shareScreen(): Promise<CheckResult> {
    if (!navigator.mediaDevices?.getDisplayMedia) return { status: "attention", code: "SCREEN_UNSUPPORTED" };
    try {
      this.screenStream?.getTracks().forEach((t) => t.stop());
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: "monitor" } as MediaTrackConstraints });
      const track = stream.getVideoTracks()[0];
      const surface = (track.getSettings() as MediaTrackSettings & { displaySurface?: string }).displaySurface;
      if (surface && surface !== "monitor") {
        stream.getTracks().forEach((t) => t.stop());
        return { status: "attention", code: surface === "browser" ? "SCREEN_TAB" : "SCREEN_WINDOW" };
      }
      if ((await this.getDisplays()) > 1) {
        stream.getTracks().forEach((t) => t.stop());
        return { status: "attention", code: "SCREEN_MULTI" };
      }
      track.addEventListener("ended", () => this.emit("screen"));
      this.screenStream = stream;
      return { status: "ready" };
    } catch (e) {
      const name = (e as DOMException).name;
      return { status: "attention", code: name === "NotAllowedError" ? "SCREEN_CANCELLED" : "SCREEN_OS_BLOCKED" };
    }
  }

  async enterFullscreen(): Promise<CheckResult> {
    try {
      await document.documentElement.requestFullscreen();
      return { status: "ready" };
    } catch {
      return { status: "attention", code: "FULLSCREEN_BLOCKED" };
    }
  }

  async getDisplays(): Promise<number> {
    const s = window.screen as Screen & { isExtended?: boolean };
    return s.isExtended ? 2 : 1;
  }

  onTrackEnded(cb: (kind: BreakKind) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  stopAll() {
    [this.cameraStream, this.screenStream, this.micStream].forEach((s) => s?.getTracks().forEach((t) => t.stop()));
    this.cameraStream = this.screenStream = this.micStream = null;
  }
}

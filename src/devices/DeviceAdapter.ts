export type ErrorCode =
  | "CAM_BLOCKED" | "CAM_DISMISSED" | "CAM_NOT_FOUND" | "CAM_IN_USE" | "CAM_OS_BLOCKED" | "CAM_DARK" | "CAM_LOST"
  | "MIC_BLOCKED" | "MIC_NOT_FOUND" | "MIC_SILENT" | "MIC_NOISY"
  | "FACE_NONE" | "FACE_MULTIPLE" | "FACE_COVERED" | "FACE_FAR" | "FACE_CLOSE" | "FACE_DARK" | "FACE_NO_MATCH"
  | "SCREEN_CANCELLED" | "SCREEN_TAB" | "SCREEN_WINDOW" | "SCREEN_MULTI" | "SCREEN_OS_BLOCKED"
  | "SCREEN_UNSUPPORTED" | "SCREEN_STOPPED"
  | "FULLSCREEN_BLOCKED" | "FULLSCREEN_EXITED"
  | "NET_SLOW" | "NET_OFFLINE"
  | "START_FAILED";

export type CheckId = "internet" | "camera" | "mic" | "face" | "screen" | "fullscreen";

export type ResultStatus = "ready" | "warning" | "attention";

export interface CheckResult {
  status: ResultStatus;
  code?: ErrorCode;
}

export type BreakKind = "screen" | "camera" | "network" | "fullscreen";

export interface DeviceAdapter {
  readonly name: "simulated" | "real";
  /** Live camera stream when the real adapter is used. Simulated adapters leave this null. */
  cameraStream: MediaStream | null;
  checkInternet(): Promise<CheckResult>;
  getCamera(): Promise<CheckResult>;
  getMicLevel(): Promise<CheckResult>;
  /** Subscribe to a live 0..1 mic level for the meter. Returns an unsubscribe fn. */
  watchMic(cb: (level: number) => void): () => void;
  detectFace(): Promise<CheckResult>;
  shareScreen(): Promise<CheckResult>;
  enterFullscreen(): Promise<CheckResult>;
  getDisplays(): Promise<number>;
  /** Called when something that was working stops (track ended, fullscreen exit, offline). */
  onTrackEnded(cb: (kind: BreakKind) => void): () => void;
  /** Stop everything (used on reset). */
  stopAll(): void;
}

export const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
export const rand = (min: number, max: number) => min + Math.random() * (max - min);

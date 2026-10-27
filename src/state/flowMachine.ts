import { useEffect, useState, useSyncExternalStore } from "react";
import { testConfig, TestType } from "../config/testConfig";
import {
  BreakKind,
  CheckId,
  CheckResult,
  DeviceAdapter,
  ErrorCode,
  delay,
} from "../devices/DeviceAdapter";
import { SimulatedAdapter, SimOutcomes } from "../devices/SimulatedAdapter";
import { RealAdapter } from "../devices/RealAdapter";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
export type StepId = "rules" | "consent" | "getReady" | "practice" | "start";
export type Phase = "gate" | StepId | "started";
export type CheckStatus = "idle" | "checking" | "ready" | "warning" | "attention" | "waiting" | "skipped";

export interface CheckState {
  id: CheckId;
  status: CheckStatus;
  errorCode?: ErrorCode;
  attempts: number; // failed attempts since last success
  lastCheckedAt?: number;
  broken?: boolean; // was ready, then broke (regression)
  stale?: boolean; // restored after refresh, needs a quick re-check
}

export interface Controls {
  testType: TestType;
  link: "valid" | "early" | "late" | "closed" | "submitted" | "invalid" | "resume" | "expired" | "error";
  device: "win_chrome" | "mac_safari" | "mac_chrome" | "iphone" | "android_tablet";
  candidate: "first" | "returning";
  camera: string;
  mic: string;
  face: string;
  screen: string;
  fullscreen: string;
  network: "good" | "slow" | "offline";
  start: "success" | "fail";
  consent: "new" | "already";
  browser: "default" | "outdated";
  micMode: "required" | "optional";
  earlySetup: "allowed" | "locked";
  sebLaunch: "works" | "blocked";
  load: "normal" | "slow";
  coding: boolean;
  failOnce: boolean;
}

export const defaultControls: Controls = {
  testType: "proctored",
  link: "valid",
  device: "win_chrome",
  candidate: "first",
  camera: "ok",
  mic: "ok",
  face: "ok",
  screen: "ok",
  fullscreen: "ok",
  network: "good",
  start: "success",
  consent: "new",
  browser: "default",
  micMode: "required",
  earlySetup: "allowed",
  sebLaunch: "works",
  load: "normal",
  coding: false,
  failOnce: false,
};

export interface AppState {
  controls: Controls;
  phase: Phase;
  loading: boolean;
  slowLoad: boolean;
  gateAck: boolean;
  sebRunning: boolean;
  sebLaunch: "idle" | "launching" | "blocked";
  completed: StepId[];
  consent: { agreed: boolean; at?: string; version?: string };
  checks: Record<CheckId, CheckState>;
  runningAll: boolean;
  faceEnrolled: boolean;
  enrollStage: "idle" | "countdown" | "review";
  practice: { choice?: number; codeRun?: boolean };
  scheduledStart: number;
  clockOffset: number;
  startState: "idle" | "starting" | "failed";
  idleNote: boolean;
  recheckedAt: number;
  helpOpen: boolean;
  helpContext: string;
  helpDiagnostics: boolean;
  toast: { id: number; msg: string } | null;
  resumeFlow: boolean;
  openedToast: boolean;
}

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */
const SKEW_MS = 125_000; // device clock is deliberately wrong; we only trust "server" time
const KEY = "topin.preassessment.v1";

const CHECK_IDS: CheckId[] = ["internet", "camera", "mic", "face", "screen", "fullscreen"];

function freshChecks(faceWaiting = true): Record<CheckId, CheckState> {
  const o = {} as Record<CheckId, CheckState>;
  CHECK_IDS.forEach((id) => (o[id] = { id, status: id === "face" && faceWaiting ? "waiting" : "idle", attempts: 0 }));
  return o;
}

function computeStart(link: Controls["link"], offset: number): number {
  const now = Date.now() + offset;
  if (link === "early") return now + 95_000;
  if (link === "late") return now - 12 * 60_000;
  return now - 5 * 60_000;
}

function initialState(): AppState {
  const controls = { ...defaultControls };
  return {
    controls,
    phase: "gate",
    loading: true,
    slowLoad: false,
    gateAck: false,
    sebRunning: false,
    sebLaunch: "idle",
    completed: [],
    consent: { agreed: false },
    checks: freshChecks(),
    runningAll: false,
    faceEnrolled: false,
    enrollStage: "idle",
    practice: {},
    scheduledStart: computeStart(controls.link, SKEW_MS),
    clockOffset: SKEW_MS,
    startState: "idle",
    idleNote: false,
    recheckedAt: Date.now(),
    helpOpen: false,
    helpContext: "general",
    helpDiagnostics: false,
    toast: null,
    resumeFlow: false,
    openedToast: false,
  };
}

let state: AppState = initialState();
const listeners = new Set<() => void>();

function set(patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) {
  const p = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...p };
  persist();
  listeners.forEach((l) => l());
}
function setCheck(id: CheckId, patch: Partial<CheckState>) {
  set((s) => ({ checks: { ...s.checks, [id]: { ...s.checks[id], ...patch } } }));
}
export const getState = () => state;
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export function useApp<T>(sel: (s: AppState) => T): T {
  return useSyncExternalStore(subscribe, () => sel(state));
}

/* ---------- persistence (sessionStorage with memory fallback) ---------- */
let memoryStore: string | null = null;
function persist() {
  const snapshot = JSON.stringify({
    controls: state.controls,
    phase: state.phase,
    completed: state.completed,
    consent: state.consent,
    checks: state.checks,
    practice: state.practice,
    faceEnrolled: state.faceEnrolled,
    scheduledStart: state.scheduledStart,
    clockOffset: state.clockOffset,
    gateAck: state.gateAck,
    sebRunning: state.sebRunning,
    resumeFlow: state.resumeFlow,
  });
  try {
    sessionStorage.setItem(KEY, snapshot);
  } catch {
    memoryStore = snapshot;
  }
}
function readPersisted(): Partial<AppState> | null {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(KEY);
  } catch {
    raw = memoryStore;
  }
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Derived helpers                                                     */
/* ------------------------------------------------------------------ */
export const serverNow = (s: AppState = state) => Date.now() + s.clockOffset;

export function micOptional(s: AppState = state) {
  return s.controls.micMode === "optional";
}

export function getSteps(s: AppState = state): StepId[] {
  const c = s.controls;
  if (s.resumeFlow || c.link === "resume") return ["getReady"];
  const out: StepId[] = ["rules"];
  if (c.testType !== "non_proctored" && c.consent !== "already") out.push("consent");
  if (c.testType !== "non_proctored") out.push("getReady");
  if (testConfig.practiceEnabled) out.push("practice");
  out.push("start");
  return out;
}

export function getCheckIds(s: AppState = state): CheckId[] {
  const c = s.controls;
  if (c.testType === "non_proctored") return ["internet"];
  const req = testConfig.requires;
  let base: CheckId[] =
    c.testType === "seb"
      ? [...testConfig.sebChecks]
      : (["internet", "camera", ...(req.mic ? ["mic"] : []), "face", "screen", "fullscreen"] as CheckId[]);
  if (s.resumeFlow || c.link === "resume") {
    base = base.filter((i) => ["internet", "camera", "screen", "fullscreen"].includes(i));
  }
  return CHECK_IDS.filter((id) => base.includes(id));
}

export function requiredIds(s: AppState = state): CheckId[] {
  return getCheckIds(s).filter((id) => !(id === "mic" && micOptional(s)));
}

export function checkOk(s: AppState, id: CheckId): boolean {
  const c = s.checks[id];
  if (c.broken || c.stale) return false;
  if (id === "mic" && micOptional(s) && c.status === "skipped") return true;
  return c.status === "ready" || c.status === "warning";
}

export const allRequiredOk = (s: AppState = state) => requiredIds(s).every((id) => checkOk(s, id));

export function firstProblem(s: AppState = state): CheckId | undefined {
  return getCheckIds(s).find((id) => {
    if (id === "mic" && micOptional(s) && s.checks[id].status === "skipped") return false;
    return !checkOk(s, id) && s.checks[id].status === "attention";
  });
}

export type GateScreen =
  | "loading" | "error" | "invalid" | "expired" | "closed" | "submitted" | "device"
  | "browser" | "browser_old" | "seb" | "early" | "early_locked" | "open_now" | "late" | "resume" | "none";

export function gateScreen(s: AppState, now: number): GateScreen {
  const c = s.controls;
  if (s.loading) return "loading";
  if (c.link === "error") return "error";
  if (c.link === "invalid") return "invalid";
  if (c.link === "expired") return "expired";
  if (c.link === "closed") return "closed";
  if (c.link === "submitted") return "submitted";
  const phoneish = c.device === "iphone" || c.device === "android_tablet";
  if (phoneish && c.testType !== "non_proctored") return "device";
  if (c.testType !== "non_proctored" && c.device === "mac_safari") return "browser";
  if (c.browser === "outdated" && c.testType !== "non_proctored") return "browser_old";
  if (c.testType === "seb" && !s.sebRunning) return "seb";
  if (s.gateAck) return "none";
  if (c.link === "early") {
    if (now >= s.scheduledStart) return "open_now"; // the countdown ended while the page was open
    return c.earlySetup === "allowed" ? "early" : "early_locked";
  }
  if (c.link === "late") return "late";
  if (c.link === "resume") return "resume";
  return "none";
}

export function helpContextFor(phase: Phase): string {
  return phase === "started" ? "start" : phase;
}

/* ------------------------------------------------------------------ */
/* Analytics (no personal data)                                        */
/* ------------------------------------------------------------------ */
declare global {
  interface Window {
    __topinEvents?: Array<{ name: string; props: Record<string, unknown>; t: number }>;
  }
}
let stepEnteredAt = Date.now();
export function track(name: string, props: Record<string, unknown> = {}) {
  const ev = { name, props, t: Date.now() };
  (window.__topinEvents ||= []).push(ev);
  // eslint-disable-next-line no-console
  console.debug("[analytics]", name, props);
}

/* ------------------------------------------------------------------ */
/* Device adapter                                                      */
/* ------------------------------------------------------------------ */
const useReal = typeof location !== "undefined" && new URLSearchParams(location.search).get("real") === "1";

function consume(key: keyof SimOutcomes) {
  const c = state.controls;
  if (!c.failOnce) return;
  const v = c[key];
  if (key === "network" && v === "offline") return; // offline is only cleared by "reconnecting"
  if (v !== "ok" && v !== "good") set({ controls: { ...c, [key]: key === "network" ? "good" : "ok" } });
}

export const sim = new SimulatedAdapter(
  () => ({
    camera: state.controls.camera,
    mic: state.controls.mic,
    face: state.controls.face,
    screen: state.controls.screen,
    fullscreen: state.controls.fullscreen,
    network: state.controls.network,
  }),
  consume,
);
export const adapter: DeviceAdapter = useReal ? new RealAdapter() : sim;
export const isReal = useReal;

adapter.onTrackEnded((k) => handleBreak(k));

/* ------------------------------------------------------------------ */
/* Toast + help                                                        */
/* ------------------------------------------------------------------ */
let toastTimer: number | undefined;
export function showToast(msg: string) {
  clearTimeout(toastTimer);
  set({ toast: { id: Date.now(), msg } });
  toastTimer = window.setTimeout(() => set({ toast: null }), 4000);
}
export function openHelp(context?: string, diagnostics = false) {
  set({ helpOpen: true, helpContext: context ?? helpContextFor(state.phase), helpDiagnostics: diagnostics });
  track("help_opened", { context: context ?? helpContextFor(state.phase) });
}
export function closeHelp() {
  set({ helpOpen: false });
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */
export function firstIncompleteStep(s: AppState = state): StepId {
  const steps = getSteps(s);
  return steps.find((st) => !s.completed.includes(st)) ?? steps[steps.length - 1];
}

function allowed(p: Phase, s: AppState = state): boolean {
  if (p === "gate") return true;
  if (p === "started") return s.phase === "started";
  const steps = getSteps(s);
  const i = steps.indexOf(p);
  if (i < 0) return false;
  return steps.slice(0, i).every((st) => s.completed.includes(st));
}

export function goTo(p: Phase, push = true) {
  // Going "back" to a gate with nothing to show would be a blank page: stay in the flow instead.
  if (p === "gate" && gateScreen({ ...state, gateAck: false }, serverNow()) === "none") p = firstIncompleteStep();
  if (!allowed(p)) p = firstIncompleteStep();
  const prev = state.phase;
  if (prev !== p) {
    const steps = getSteps();
    if (prev !== "gate" && prev !== "started") {
      track("step_viewed_duration", { step: prev, ms: Date.now() - stepEnteredAt });
    }
    stepEnteredAt = Date.now();
    track("step_viewed", { step: p, index: steps.indexOf(p as StepId) + 1 });
  }
  set({ phase: p, gateAck: p === "gate" ? false : state.gateAck });
  try {
    if (push) history.pushState({ phase: p }, "", `#/${p}`);
  } catch {
    /* ignore */
  }
  onEnter(p);
}

function onEnter(p: Phase) {
  if (p === "getReady" || (p === "rules" && state.controls.testType === "non_proctored")) {
    if (state.checks.internet.status === "idle" || state.checks.internet.stale) void runCheck("internet");
  }
  if (p === "start" || p === "practice" || p === "rules") {
    set({ idleNote: false });
  }
}

export function next() {
  const steps = getSteps();
  const cur = state.phase as StepId;
  const i = steps.indexOf(cur);
  if (i < 0) return;
  track("step_completed", { step: cur, ms: Date.now() - stepEnteredAt });
  set((s) => ({ completed: s.completed.includes(cur) ? s.completed : [...s.completed, cur] }));
  if (i + 1 < steps.length) goTo(steps[i + 1]);
  else finishResume();
}

export function back() {
  const steps = getSteps();
  const i = steps.indexOf(state.phase as StepId);
  if (i > 0) goTo(steps[i - 1]);
}

function finishResume() {
  set({ phase: "started" });
}

export function startGateFlow() {
  // after gate acknowledgements: enter the first step
  const steps = getSteps();
  goTo(steps[0]);
}

export function continueGate() {
  set({ gateAck: true });
  afterGateChange();
}

export function afterGateChange() {
  const now = serverNow();
  if (state.phase === "gate" && gateScreen(state, now) === "none") {
    if (state.controls.link === "resume") set({ resumeFlow: true });
    startGateFlow();
  }
}

/* ---------- seb ---------- */
let sebTimer: number | undefined;
export async function openSeb() {
  if (state.sebLaunch === "launching") return;
  set({ sebLaunch: "launching" });
  clearTimeout(sebTimer);
  if (state.controls.sebLaunch === "blocked") {
    sebTimer = window.setTimeout(() => set({ sebLaunch: "blocked" }), 5000);
    return;
  }
  await delay(1200);
  set({ sebRunning: true, sebLaunch: "idle" });
  afterGateChange();
}
export function sebAlreadyInstalled() {
  set({ sebLaunch: "idle" });
  void openSeb();
}

/* ------------------------------------------------------------------ */
/* Consent                                                             */
/* ------------------------------------------------------------------ */
export function agreeConsent() {
  set({
    consent: { agreed: true, at: new Date(serverNow()).toISOString(), version: testConfig.consent.version },
  });
  track("consent_recorded", { version: testConfig.consent.version });
  next();
}

/* ------------------------------------------------------------------ */
/* Checks                                                              */
/* ------------------------------------------------------------------ */
const inflight = new Set<CheckId>();

async function execute(id: CheckId): Promise<CheckResult> {
  switch (id) {
    case "internet":
      return adapter.checkInternet();
    case "camera":
      return adapter.getCamera();
    case "mic":
      return adapter.getMicLevel();
    case "face":
      return adapter.detectFace();
    case "screen": {
      const r = await adapter.shareScreen();
      return r;
    }
    case "fullscreen":
      return adapter.enterFullscreen();
  }
}

export function faceBlocked(s: AppState = state) {
  const c = s.checks.camera;
  return !(c.status === "ready" || c.status === "warning") || !!c.broken;
}

export async function runCheck(id: CheckId): Promise<CheckStatus> {
  if (inflight.has(id)) return state.checks[id].status;
  if (id === "face" && faceBlocked()) return "waiting";
  inflight.add(id);
  const before = state.checks[id].status;
  setCheck(id, { status: "checking", stale: false });
  track("check_started", { check: id });
  let res: CheckResult;
  try {
    res = await execute(id);
  } catch {
    res = { status: "attention", code: "START_FAILED" };
  }
  inflight.delete(id);

  // first-time face enrollment: a good detection moves to photo review, not "ready"
  if (id === "face" && !state.faceEnrolled && res.status === "ready") {
    setCheck("face", { status: "idle", errorCode: undefined, attempts: 0 });
    set({ enrollStage: "review" });
    return "idle";
  }

  const failed = res.status === "attention";
  const prev = state.checks[id];
  setCheck(id, {
    status: res.status,
    errorCode: res.code,
    attempts: failed ? prev.attempts + 1 : 0,
    lastCheckedAt: Date.now(),
    broken: false,
  });
  if (failed) track("check_failed", { check: id, code: res.code });
  else if (before === "attention") track("check_fixed", { check: id });

  if (id === "face" && failed && !state.faceEnrolled) set({ enrollStage: "idle" });

  if (id === "camera") {
    if (failed) {
      setCheck("face", { status: "waiting", errorCode: undefined, attempts: 0 });
      set({ enrollStage: "idle" });
    } else if (state.checks.face.status === "waiting") {
      setCheck("face", { status: "idle" });
      if (state.faceEnrolled && state.controls.testType !== "non_proctored" && getCheckIds().includes("face")) {
        void runCheck("face"); // returning candidate: quick automatic check
      }
    }
  }
  return res.status;
}

export function skipMic() {
  setCheck("mic", { status: "skipped", errorCode: undefined });
}

export function confirmFacePhoto() {
  set({ faceEnrolled: true, enrollStage: "idle" });
  setCheck("face", { status: "ready", errorCode: undefined, attempts: 0, lastCheckedAt: Date.now(), broken: false });
  track("face_enrolled");
}
export function retakeFace() {
  set({ enrollStage: "idle" });
}
export function setEnrollStage(stage: AppState["enrollStage"]) {
  set({ enrollStage: stage });
}

export async function runAll() {
  if (state.runningAll) return;
  set({ runningAll: true });
  for (const id of getCheckIds()) {
    const c = state.checks[id];
    if (id === "mic" && micOptional() && c.status === "skipped") continue;
    if (checkOk(state, id)) continue;
    if (id === "face" && !state.faceEnrolled) {
      focusFix("face");
      break;
    }
    const st = await runCheck(id);
    if (st === "attention") {
      focusFix(id);
      break;
    }
  }
  set({ runningAll: false });
}

export function focusFix(id: CheckId) {
  window.setTimeout(() => {
    const row = document.getElementById(`check-${id}`);
    if (!row) return;
    row.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    const target =
      row.querySelector<HTMLElement>("[data-fix-focus]") ?? row.querySelector<HTMLElement>("button:not([disabled])");
    target?.focus({ preventScroll: true });
  }, 60);
}
export function focusFirstProblem() {
  const id = firstProblem() ?? getCheckIds().find((i) => !checkOk(state, i));
  if (id) focusFix(id);
}

/* ---------- regression ("Break it now" and real track-ended events) ---------- */
export function handleBreak(kind: BreakKind) {
  if (state.phase === "started") return;
  const now = Date.now();
  if (kind === "network") {
    set({ controls: { ...state.controls, network: "offline" } });
    setCheck("internet", { status: "attention", errorCode: "NET_OFFLINE", broken: true, lastCheckedAt: now });
    track("check_failed", { check: "internet", code: "NET_OFFLINE" });
    return;
  }
  const map = {
    screen: ["screen", "SCREEN_STOPPED"],
    camera: ["camera", "CAM_LOST"],
    fullscreen: ["fullscreen", "FULLSCREEN_EXITED"],
  } as const;
  const [id, code] = map[kind];
  if (!getCheckIds().includes(id)) return;
  const c = state.checks[id];
  if (c.status !== "ready" && c.status !== "warning") return;
  setCheck(id, { status: "attention", errorCode: code, broken: true, attempts: 0 });
  if (id === "camera") {
    setCheck("face", { status: "waiting", errorCode: undefined, broken: false });
  }
  track("check_failed", { check: id, code });
}

export function breakNow(kind: BreakKind) {
  if (adapter instanceof SimulatedAdapter) adapter.trigger(kind);
  else handleBreak(kind);
}

export function setOnline() {
  set({ controls: { ...state.controls, network: "good" } });
  void runCheck("internet");
}

/* ---------- idle recheck on Start ---------- */
export async function idleRecheck() {
  set({ idleNote: true });
  for (const id of ["internet", "camera", "screen"] as CheckId[]) {
    if (getCheckIds().includes(id)) await runCheck(id);
  }
  set({ recheckedAt: Date.now() });
}
export function touchRecheck() {
  set({ recheckedAt: Date.now() });
}

/* ------------------------------------------------------------------ */
/* Practice                                                            */
/* ------------------------------------------------------------------ */
export function choosePractice(i: number) {
  set((s) => ({ practice: { ...s.practice, choice: i } })); // not persisted beyond session
}
export function runPracticeCode() {
  set((s) => ({ practice: { ...s.practice, codeRun: true } }));
}

/* ------------------------------------------------------------------ */
/* Start                                                               */
/* ------------------------------------------------------------------ */
export async function startTest() {
  if (state.startState === "starting") return;
  if (serverNow() < state.scheduledStart || !allRequiredOk()) return;
  set({ startState: "starting" });
  track("start_pressed");
  await delay(1400);
  if (state.controls.start === "fail") {
    if (state.controls.failOnce) set({ controls: { ...state.controls, start: "success" } });
    set({ startState: "failed" });
    track("start_failed", { code: "START_FAILED" });
    return;
  }
  set({ startState: "idle", phase: "started" });
  try {
    history.pushState({ phase: "started" }, "", "#/started");
  } catch {
    /* ignore */
  }
  adapter.stopAll();
}

/* ------------------------------------------------------------------ */
/* Controls, presets, reset                                            */
/* ------------------------------------------------------------------ */
const RESTART_KEYS: Array<keyof Controls> = [
  "testType", "link", "device", "browser", "load", "earlySetup", "candidate", "consent", "micMode",
];

let loadTimers: number[] = [];

export function restartFlow() {
  loadTimers.forEach(clearTimeout);
  loadTimers = [];
  adapter.stopAll();
  inflight.clear();
  const c = state.controls;
  set({
    phase: "gate",
    loading: true,
    slowLoad: false,
    gateAck: false,
    sebRunning: false,
    sebLaunch: "idle",
    completed: [],
    consent: { agreed: false },
    checks: freshChecks(),
    runningAll: false,
    faceEnrolled: c.candidate === "returning",
    enrollStage: "idle",
    practice: {},
    clockOffset: SKEW_MS,
    scheduledStart: computeStart(c.link, SKEW_MS),
    startState: "idle",
    idleNote: false,
    resumeFlow: c.link === "resume",
    openedToast: false,
  });
  try {
    history.replaceState({ phase: "gate" }, "", "#/gate");
  } catch {
    /* ignore */
  }
  const ms = c.load === "slow" ? 12_000 : 900;
  if (c.load === "slow") loadTimers.push(window.setTimeout(() => set({ slowLoad: true }), 8000));
  loadTimers.push(
    window.setTimeout(() => {
      set({ loading: false, slowLoad: false });
      afterGateChange();
    }, ms),
  );
}

export function setControl<K extends keyof Controls>(key: K, value: Controls[K]) {
  const prevNet = state.controls.network;
  set({ controls: { ...state.controls, [key]: value } });
  if (RESTART_KEYS.includes(key)) {
    restartFlow();
    return;
  }
  if (key === "network") {
    if (value === "offline") {
      const was = state.checks.internet.status;
      setCheck("internet", { status: "attention", errorCode: "NET_OFFLINE", broken: was === "ready" || was === "warning" });
    } else if (prevNet === "offline") {
      void runCheck("internet");
    }
  }
}

export function applyPreset(name: "happy" | "firstTimer" | "failOnce" | "early" | "phone" | "seb") {
  const base = { ...defaultControls };
  const presets: Record<typeof name, Partial<Controls>> = {
    happy: {},
    firstTimer: { camera: "blocked", screen: "tab", failOnce: true },
    failOnce: {
      camera: "inuse", mic: "silent", face: "none", screen: "window",
      fullscreen: "blocked", network: "slow", start: "fail", failOnce: true,
    },
    early: { link: "early" },
    phone: { device: "iphone" },
    seb: { testType: "seb" },
  };
  set({ controls: { ...base, ...presets[name] } });
  restartFlow();
}

export function resetAll() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    memoryStore = null;
  }
  set({ controls: { ...defaultControls } });
  restartFlow();
}

export function advanceClock() {
  const target = state.scheduledStart;
  set({ clockOffset: state.clockOffset + Math.max(0, target - serverNow() + 500) });
}

export function restartPrototype() {
  restartFlow();
}

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */
export function boot() {
  const saved = readPersisted();
  if (saved && saved.phase && saved.phase !== "gate") {
    const checks = freshChecks();
    const savedChecks = (saved.checks ?? {}) as Record<CheckId, CheckState>;
    CHECK_IDS.forEach((id) => {
      const c = savedChecks[id];
      if (!c) return;
      if (c.status === "ready" || c.status === "warning") {
        checks[id] = { id, status: "idle", attempts: 0, stale: true };
      } else if (c.status === "skipped") {
        checks[id] = { ...checks[id], status: "skipped" };
      }
    });
    if (checks.face.status === "waiting" && (saved.faceEnrolled || false)) checks.face.status = "waiting";
    state = {
      ...state,
      controls: { ...defaultControls, ...(saved.controls as Controls) },
      phase: saved.phase as Phase,
      completed: (saved.completed as StepId[]) ?? [],
      consent: (saved.consent as AppState["consent"]) ?? { agreed: false },
      checks,
      faceEnrolled: !!saved.faceEnrolled,
      scheduledStart: (saved.scheduledStart as number) ?? state.scheduledStart,
      clockOffset: (saved.clockOffset as number) ?? SKEW_MS,
      gateAck: true,
      sebRunning: !!saved.sebRunning,
      resumeFlow: !!saved.resumeFlow,
      loading: false,
    };
    if (state.phase === "started") state = { ...state, phase: "started" };
    // stale face (ready before refresh) waits for camera
    if (state.checks.face.stale) state.checks.face = { ...state.checks.face, status: "waiting", stale: false };
    try {
      history.replaceState({ phase: state.phase }, "", `#/${state.phase}`);
    } catch {
      /* ignore */
    }
    // validate deep-link
    if (!allowed(state.phase)) goTo(firstIncompleteStep(), false);
    onEnter(state.phase); // e.g. re-run the automatic internet check after a refresh
  } else {
    restartFlow();
  }

  // Deep link to a later step: popstate/goTo() redirect to the first incomplete step via allowed().

  window.addEventListener("popstate", (e) => {
    const p = (e.state as { phase?: Phase } | null)?.phase;
    if (!p) {
      // never leave the flow
      try {
        history.pushState({ phase: state.phase }, "", `#/${state.phase}`);
      } catch {
        /* ignore */
      }
      return;
    }
    if (state.phase === "started") return;
    goTo(p, false);
    if (state.phase !== p) {
      // we redirected: keep the history stack in step so Back never leaves the flow
      try {
        history.pushState({ phase: state.phase }, "", `#/${state.phase}`);
      } catch {
        /* ignore */
      }
    }
  });

  // a ready camera/screen/fullscreen/network that breaks flips the row back
  window.addEventListener("offline", () => {
    if (!isReal) return;
    handleBreak("network");
  });
  window.addEventListener("online", () => {
    if (!isReal) return;
    setOnline();
  });
}

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */
export function useServerNow(intervalMs = 1000) {
  const offset = useApp((s) => s.clockOffset);
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return Date.now() + offset;
}

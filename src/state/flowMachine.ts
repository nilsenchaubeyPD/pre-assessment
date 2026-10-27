import { useEffect, useState, useSyncExternalStore } from "react";
import { testConfig, TestType } from "../config/testConfig";
import { BreakKind, CheckId, CheckResult, DeviceAdapter, ErrorCode, delay } from "../devices/DeviceAdapter";
import { SimulatedAdapter, SimOutcomes } from "../devices/SimulatedAdapter";
import { RealAdapter } from "../devices/RealAdapter";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
export type StepId = "details" | "before" | "consent" | "setup" | "summary" | "conduct";
export type Phase = "gate" | StepId | "started";
export type CheckStatus = "idle" | "checking" | "ready" | "warning" | "attention" | "skipped";
export type SetupTab = "camera" | "mic" | "screen";
export type CamStage = "allow" | "photo" | "countdown" | "review" | "quick" | "verifying";
export type MicStage = "allow" | "phrase" | "recording" | "heard";

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
  network: "good" | "slow" | "offline";
  extensions: "none" | "found";
  start: "success" | "fail";
  consent: "new" | "already";
  browser: "default" | "outdated";
  micMode: "required" | "optional";
  earlySetup: "allowed" | "locked";
  sebLaunch: "works" | "blocked";
  load: "normal" | "slow";
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
  network: "good",
  extensions: "none",
  start: "success",
  consent: "new",
  browser: "default",
  micMode: "required",
  earlySetup: "allowed",
  sebLaunch: "works",
  load: "normal",
  failOnce: false,
};

export interface SetupState {
  tab: SetupTab;
  camStage: CamStage;
  micStage: MicStage;
  camDark: boolean;
  micQuality?: ErrorCode;
}

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
  setup: SetupState;
  faceEnrolled: boolean;
  scheduledStart: number;
  clockOffset: number;
  startState: "idle" | "starting" | "failed";
  helpOpen: boolean;
  helpContext: string;
  helpDiagnostics: boolean;
  toast: { id: number; msg: string } | null;
  resumeFlow: boolean;
}

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */
const SKEW_MS = 125_000; // device clock is deliberately wrong; we only trust "server" time
const KEY = "topin.preassessment.v2";
const CHECK_IDS: CheckId[] = ["internet", "extensions", "camera", "mic", "screen"];

function freshChecks(): Record<CheckId, CheckState> {
  const o = {} as Record<CheckId, CheckState>;
  CHECK_IDS.forEach((id) => (o[id] = { id, status: "idle", attempts: 0 }));
  return o;
}
const freshSetup = (): SetupState => ({ tab: "camera", camStage: "allow", micStage: "allow", camDark: false });

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
    setup: freshSetup(),
    faceEnrolled: false,
    scheduledStart: computeStart(controls.link, SKEW_MS),
    clockOffset: SKEW_MS,
    startState: "idle",
    helpOpen: false,
    helpContext: "general",
    helpDiagnostics: false,
    toast: null,
    resumeFlow: false,
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
function setSetup(patch: Partial<SetupState>) {
  set((s) => ({ setup: { ...s.setup, ...patch } }));
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
    faceEnrolled: state.faceEnrolled,
    scheduledStart: state.scheduledStart,
    clockOffset: state.clockOffset,
    sebRunning: state.sebRunning,
    resumeFlow: state.resumeFlow,
  }); // never media
  try {
    sessionStorage.setItem(KEY, snapshot);
  } catch {
    memoryStore = snapshot;
  }
}
function readPersisted(): Record<string, unknown> | null {
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
export const micOptional = (s: AppState = state) => s.controls.micMode === "optional";
export const isProctored = (s: AppState = state) => s.controls.testType !== "non_proctored";
export const consentGiven = (s: AppState = state) => s.consent.agreed || s.controls.consent === "already";

export function getSteps(s: AppState = state): StepId[] {
  const c = s.controls;
  if (s.resumeFlow || c.link === "resume") return ["setup"];
  const out: StepId[] = ["details", "before"];
  if (c.testType !== "non_proctored") {
    if (c.consent !== "already") out.push("consent");
    out.push("setup", "summary");
  }
  out.push("conduct");
  return out;
}

export function getCheckIds(s: AppState = state): CheckId[] {
  const c = s.controls;
  if (c.testType === "non_proctored") return ["internet"];
  let base: CheckId[] =
    c.testType === "seb"
      ? [...testConfig.sebChecks]
      : (["internet", "extensions", "camera", ...(testConfig.requires.mic ? ["mic"] : []), "screen"] as CheckId[]);
  if (s.resumeFlow || c.link === "resume") base = base.filter((i) => ["internet", "camera", "screen"].includes(i));
  return CHECK_IDS.filter((id) => base.includes(id));
}

export function setupTabs(s: AppState = state): SetupTab[] {
  const ids = getCheckIds(s);
  return (["camera", "mic", "screen"] as SetupTab[]).filter((t) => ids.includes(t));
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

/** Rows for "Everything is set": device checks plus consent when this test records. */
export function summaryTotals(s: AppState = state) {
  const ids = requiredIds(s);
  const withConsent = isProctored(s);
  const total = ids.length + (withConsent ? 1 : 0);
  const passed = ids.filter((id) => checkOk(s, id)).length + (withConsent && consentGiven(s) ? 1 : 0);
  return { total, passed };
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
    if (now >= s.scheduledStart) return "open_now";
    return c.earlySetup === "allowed" ? "early" : "early_locked";
  }
  if (c.link === "late") return "late";
  if (c.link === "resume") return "resume";
  return "none";
}

export const helpContextFor = (phase: Phase): string => (phase === "started" ? "conduct" : phase);

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
  (window.__topinEvents ||= []).push({ name, props, t: Date.now() });
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
  const v = c[key as keyof Controls];
  if (key === "network" && v === "offline") return; // offline is only cleared by "reconnecting"
  if (v !== "ok" && v !== "good" && v !== "none") {
    set({ controls: { ...c, [key]: key === "network" ? "good" : key === "extensions" ? "none" : "ok" } });
  }
}

export const sim = new SimulatedAdapter(
  () => ({
    camera: state.controls.camera,
    mic: state.controls.mic,
    face: state.controls.face,
    screen: state.controls.screen,
    fullscreen: "ok",
    network: state.controls.network,
    extensions: state.controls.extensions,
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
  const ctx = context ?? helpContextFor(state.phase);
  set({ helpOpen: true, helpContext: ctx, helpDiagnostics: diagnostics });
  track("help_opened", { context: ctx });
}
export const closeHelp = () => set({ helpOpen: false });

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
    if (prev !== "gate" && prev !== "started") track("step_duration", { step: prev, ms: Date.now() - stepEnteredAt });
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

function firstOpenTab(): SetupTab {
  const tabs = setupTabs();
  const ids = tabs.filter((t) => !checkOk(state, t));
  return ids[0] ?? tabs[tabs.length - 1] ?? "camera";
}

function onEnter(p: Phase) {
  if (p === "gate" || p === "started") return;
  const ids = getCheckIds();
  // Internet runs on arrival (the header indicator depends on it); extensions on "Before you begin".
  const needs = (id: CheckId) => ids.includes(id) && (state.checks[id].status === "idle" || state.checks[id].stale);
  if (needs("internet")) void runCheck("internet");
  if (p === "before" && needs("extensions")) void runCheck("extensions");
  if (p === "setup") {
    const tab = firstOpenTab();
    setSetup({ tab, camStage: "allow", micStage: "allow", camDark: false, micQuality: undefined });
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
  else set({ phase: "started" }); // quick check after resume: straight back into the running test
}

export function back() {
  const steps = getSteps();
  const i = steps.indexOf(state.phase as StepId);
  if (i > 0) goTo(steps[i - 1]);
}

export function startGateFlow() {
  goTo(getSteps()[0]);
}
export function continueGate() {
  set({ gateAck: true });
  afterGateChange();
}
export function afterGateChange() {
  if (state.phase === "gate" && gateScreen(state, serverNow()) === "none") {
    if (state.controls.link === "resume") set({ resumeFlow: true });
    startGateFlow();
  }
}

/* ---------- details ---------- */
export function logout() {
  setControl("link", "expired");
  showToast("Logged out");
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

/* ---------- consent ---------- */
export function agreeConsent() {
  set({ consent: { agreed: true, at: new Date(serverNow()).toISOString(), version: testConfig.consent.version } });
  track("consent_recorded", { version: testConfig.consent.version });
  next();
}

/* ------------------------------------------------------------------ */
/* Checks                                                              */
/* ------------------------------------------------------------------ */
const inflight = new Set<string>();

async function execute(id: CheckId): Promise<CheckResult> {
  switch (id) {
    case "internet":
      return adapter.checkInternet();
    case "extensions":
      return adapter.checkExtensions();
    case "camera":
      return adapter.getCamera();
    case "mic":
      return adapter.getMicLevel();
    case "screen":
      return adapter.shareScreen();
  }
}

/** Generic check run (internet, extensions, screen). Camera and microphone have their own flows below. */
export async function runCheck(id: CheckId): Promise<CheckStatus> {
  if (inflight.has(id)) return state.checks[id].status;
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
  const failed = res.status === "attention";
  setCheck(id, {
    status: res.status,
    errorCode: res.code,
    attempts: failed ? state.checks[id].attempts + 1 : 0,
    lastCheckedAt: Date.now(),
    broken: false,
  });
  if (failed) track("check_failed", { check: id, code: res.code });
  else if (before === "attention") track("check_fixed", { check: id });
  return res.status;
}

/* ---------- camera ---------- */
export async function allowCamera() {
  if (inflight.has("camera")) return;
  inflight.add("camera");
  const prev = state.checks.camera.status;
  setCheck("camera", { status: "checking", stale: false });
  track("check_started", { check: "camera" });
  const res = await adapter.getCamera();
  inflight.delete("camera");
  if (res.status === "attention") {
    setCheck("camera", { status: "attention", errorCode: res.code, attempts: state.checks.camera.attempts + 1, broken: false });
    track("check_failed", { check: "camera", code: res.code });
    return;
  }
  if (prev === "attention") track("check_fixed", { check: "camera" });
  // permission granted. The check is only complete once the face is verified.
  setCheck("camera", { status: "idle", errorCode: undefined, broken: false });
  setSetup({ camDark: res.code === "CAM_DARK", camStage: state.faceEnrolled ? "quick" : "photo" });
}
export const takePhoto = () => setSetup({ camStage: "countdown" });
export const photoCaptured = () => setSetup({ camStage: "review" });
export const retakePhoto = () => setSetup({ camStage: "photo" });

export async function verifyFace() {
  if (inflight.has("face")) return;
  inflight.add("face");
  const wasEnrolled = state.faceEnrolled;
  setSetup({ camStage: "verifying" });
  track("check_started", { check: "face" });
  const res = await adapter.detectFace();
  inflight.delete("face");
  if (res.status === "attention") {
    setCheck("camera", { status: "attention", errorCode: res.code, attempts: state.checks.camera.attempts + 1 });
    setSetup({ camStage: wasEnrolled ? "quick" : "photo" });
    track("check_failed", { check: "face", code: res.code });
    return;
  }
  set({ faceEnrolled: true });
  setCheck("camera", { status: state.setup.camDark ? "warning" : "ready", errorCode: undefined, attempts: 0, lastCheckedAt: Date.now(), broken: false });
  track("check_fixed", { check: "face" });
  setSetup({ camStage: wasEnrolled ? "quick" : "review" });
  await delay(350);
  advanceTab("camera");
}

/* ---------- microphone ---------- */
export async function allowMic() {
  if (inflight.has("mic")) return;
  inflight.add("mic");
  setCheck("mic", { status: "checking", stale: false });
  track("check_started", { check: "mic" });
  const res = await adapter.getMicLevel();
  inflight.delete("mic");
  const quality = res.code === "MIC_SILENT" || res.code === "MIC_NOISY" ? res.code : undefined;
  if (res.status === "attention" && !quality) {
    setCheck("mic", { status: "attention", errorCode: res.code, attempts: state.checks.mic.attempts + 1 });
    track("check_failed", { check: "mic", code: res.code });
    return;
  }
  setCheck("mic", { status: "idle", errorCode: undefined, broken: false });
  setSetup({ micStage: "phrase", micQuality: quality });
}
export const startRecording = () => setSetup({ micStage: "recording" });
export async function stopRecording() {
  if (state.setup.micStage !== "recording") return;
  setCheck("mic", { status: "checking" });
  await delay(700);
  const q = state.setup.micQuality;
  if (q === "MIC_SILENT") {
    setCheck("mic", { status: "attention", errorCode: "MIC_SILENT", attempts: state.checks.mic.attempts + 1 });
    setSetup({ micStage: "phrase", micQuality: undefined });
    track("check_failed", { check: "mic", code: "MIC_SILENT" });
    return;
  }
  setCheck("mic", {
    status: q === "MIC_NOISY" ? "warning" : "ready",
    errorCode: q,
    attempts: 0,
    lastCheckedAt: Date.now(),
    broken: false,
  });
  setSetup({ micStage: "heard", micQuality: undefined });
}
export function skipMic() {
  setCheck("mic", { status: "skipped", errorCode: undefined });
  advanceTab("mic");
}

/* ---------- screen ---------- */
export async function shareScreen() {
  const st = await runCheck("screen");
  if (st === "ready") {
    await delay(500);
    advanceTab("screen");
  }
}

/* ---------- setup navigation ---------- */
export function advanceTab(from: SetupTab) {
  if (state.phase !== "setup") return;
  const tabs = setupTabs();
  const i = tabs.indexOf(from);
  if (i >= 0 && i + 1 < tabs.length) {
    setSetup({ tab: tabs[i + 1], micStage: "allow", camStage: "allow" });
  } else {
    next();
  }
}
export function setupBack() {
  const { tab, camStage, micStage } = state.setup;
  const tabs = setupTabs();
  const i = tabs.indexOf(tab);
  const toPrevTab = () => {
    if (i > 0) {
      const prev = tabs[i - 1];
      setSetup({ tab: prev, camStage: state.faceEnrolled ? "quick" : "photo", micStage: "phrase" });
    } else back();
  };
  if (tab === "camera") {
    if (camStage === "verifying" || camStage === "countdown") return;
    if (camStage === "review") return setSetup({ camStage: "photo" });
    if (camStage === "photo" || camStage === "quick") return setSetup({ camStage: "allow" });
    return toPrevTab();
  }
  if (tab === "mic") {
    if (micStage === "recording") return setSetup({ micStage: "phrase" });
    if (micStage === "heard") return setSetup({ micStage: "phrase" });
    if (micStage === "phrase") return setSetup({ micStage: "allow" });
    return toPrevTab();
  }
  return toPrevTab();
}
export function selectTab(t: SetupTab) {
  if (state.setup.tab === t) return;
  setSetup({ tab: t, camStage: state.faceEnrolled ? "quick" : "photo", micStage: "allow" });
}

/** Jump to the setup screen on the tab that needs fixing (used by "Fix it"). */
export function fixCheck(id: CheckId) {
  if (id === "internet" || id === "extensions") {
    if (getSteps().includes("before")) goTo("before");
    else void runCheck(id);
    return;
  }
  if (getSteps().includes("setup")) {
    goTo("setup");
    setSetup({ tab: id as SetupTab, camStage: "allow", micStage: "allow" });
  }
}
export function firstProblem(s: AppState = state): CheckId | undefined {
  return getCheckIds(s).find((id) => !checkOk(s, id) && (s.checks[id].status === "attention" || s.checks[id].broken || s.checks[id].stale));
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
    fullscreen: [undefined, undefined],
  } as const;
  const [id, code] = map[kind];
  if (!id || !getCheckIds().includes(id)) return;
  const c = state.checks[id];
  if (c.status !== "ready" && c.status !== "warning") return;
  setCheck(id, { status: "attention", errorCode: code, broken: true, attempts: 0 });
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

/* ------------------------------------------------------------------ */
/* Start (the last Continue on the Code of Conduct)                    */
/* ------------------------------------------------------------------ */
export async function startTest() {
  if (state.startState === "starting") return;
  if (serverNow() < state.scheduledStart || !allRequiredOk()) return;
  if (isProctored() && !consentGiven()) return;
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
    setup: freshSetup(),
    faceEnrolled: c.candidate === "returning",
    clockOffset: SKEW_MS,
    scheduledStart: computeStart(c.link, SKEW_MS),
    startState: "idle",
    resumeFlow: c.link === "resume",
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
  const presets: Record<typeof name, Partial<Controls>> = {
    happy: {},
    firstTimer: { camera: "blocked", screen: "tab", failOnce: true },
    failOnce: {
      camera: "inuse", mic: "silent", face: "none", screen: "window",
      extensions: "found", network: "slow", start: "fail", failOnce: true,
    },
    early: { link: "early" },
    phone: { device: "iphone" },
    seb: { testType: "seb" },
  };
  set({ controls: { ...defaultControls, ...presets[name] } });
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
  set({ clockOffset: state.clockOffset + Math.max(0, state.scheduledStart - serverNow() + 500) });
}
export const restartPrototype = restartFlow;

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
      // permissions need re-confirming after a refresh: mark as "check again quickly"
      if (c.status === "ready" || c.status === "warning") checks[id] = { id, status: "idle", attempts: 0, stale: true };
      else if (c.status === "skipped") checks[id] = { ...checks[id], status: "skipped" };
    });
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
    try {
      history.replaceState({ phase: state.phase }, "", `#/${state.phase}`);
    } catch {
      /* ignore */
    }
    if (!allowed(state.phase)) goTo(firstIncompleteStep(), false);
    onEnter(state.phase);
  } else {
    restartFlow();
  }

  // Deep links to a later step redirect to the first incomplete step via allowed().
  window.addEventListener("popstate", (e) => {
    const p = (e.state as { phase?: Phase } | null)?.phase;
    if (!p) {
      try {
        history.pushState({ phase: state.phase }, "", `#/${state.phase}`);
      } catch {
        /* ignore */
      }
      return; // never leave the flow
    }
    if (state.phase === "started") return;
    goTo(p, false);
    if (state.phase !== p) {
      try {
        history.pushState({ phase: state.phase }, "", `#/${state.phase}`);
      } catch {
        /* ignore */
      }
    }
  });
  window.addEventListener("offline", () => isReal && handleBreak("network"));
  window.addEventListener("online", () => isReal && setOnline());
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

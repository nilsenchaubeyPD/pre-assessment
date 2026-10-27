export type TestType = "proctored" | "seb" | "non_proctored";

export interface TestConfig {
  type: TestType; // overridden by the prototype controls
  assessmentName: string;
  sections: number;
  durationMin: string;
  scheduledStart: string;
  windowClose: string;
  allowEarlySetup: boolean;
  requires: {
    camera: boolean;
    mic: boolean;
    micOptional: boolean;
    face: boolean;
    screenShare: boolean;
    fullscreen: boolean;
    seb: boolean;
    internet: boolean;
  };
  /** Checks required inside Safe Exam Browser. [confirm with tech] */
  sebChecks: Array<"internet" | "camera" | "mic" | "face" | "screen" | "fullscreen">;
  practiceEnabled: boolean;
  practiceHasCoding: boolean;
  rules: Array<{ title: string; why: string }>;
  consent: {
    version: string;
    whoCanView: string;
    retention: string;
    withdraw: string;
  };
  support: { channel: string };
  /** Idle minutes on the Start step before a quiet recheck. [10] */
  idleMinutes: number;
}

// Bracketed values are deliberate placeholders. They render with a dotted underline.
export const testConfig: TestConfig = {
  type: "proctored",
  assessmentName: "[Assessment name]",
  sections: 6,
  durationMin: "[Duration]",
  scheduledStart: "[Date, time]",
  windowClose: "[Date, time]",
  allowEarlySetup: true,
  requires: {
    camera: true,
    mic: true,
    micOptional: false,
    face: true,
    screenShare: true,
    fullscreen: true,
    seb: false,
    internet: true,
  },
  sebChecks: ["internet", "camera", "face"],
  practiceEnabled: true,
  practiceHasCoding: false,
  rules: [
    {
      title: "Stay in fullscreen",
      why: "The test runs in fullscreen so nothing else is on your screen while you work.",
    },
    {
      title: "Keep your face in view",
      why: "Your camera confirms that the person taking the test is you.",
    },
    {
      title: "Keep screen sharing on",
      why: "Your screen is shared so the test session can be reviewed if there is a question.",
    },
  ],
  consent: {
    version: "consent-v1",
    whoCanView: "[Roles who can view recordings]",
    retention: "[Retention period]",
    withdraw: "[How to ask a question or withdraw consent]",
  },
  support: { channel: "[Support channel]" },
  idleMinutes: 10,
};

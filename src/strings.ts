// All user-facing copy lives here (one file, ready for translation).
// Text in [square brackets] is a placeholder and renders with a dotted underline.

export const S = {
  brand: { name: "topin.tech" },

  header: {
    help: "Get help",
    skipToContent: "Skip to content",
  },

  stepper: {
    labels: {
      rules: "Rules",
      consent: "Consent",
      getReady: "Get ready",
      practice: "Practice",
      start: "Start",
      quick: "Quick check",
    },
    aboutTime: "About 5 min",
    stepsLeft: (n: number) => (n === 1 ? "1 step left" : `${n} steps left`),
    mobile: (i: number, total: number) => `Step ${i} of ${total} · About 5 min`,
    eyebrow: (i: number, total: number) => `Step ${i} of ${total}`,
    completed: "Completed",
    current: "Current step",
    upcoming: "Upcoming",
  },

  common: {
    back: "Back",
    continue: "Continue",
    tryAgain: "Try again",
    getHelp: "Get help",
    close: "Close",
    copy: "Copy",
    copied: "Copied",
    optional: "Optional",
    why: "Why?",
    linkCopied: "Link copied",
    copyLink: "Copy test link",
    emailLink: "Email me the link",
    emailLinkSent: "We sent the link to [email]",
    errorCode: (c: string) => `Error ${c}`,
    placeholderNote: "Placeholder",
  },

  banners: {
    notTheTest: "Not the test yet. This is only setup. Start unlocks at [Time].",
    offline: "You're offline. We'll pick up where you left off when you're back.",
    screenStopped: "Screen sharing stopped. Share again to continue.",
    cameraLost: "Your camera disconnected. Reconnect it and check again.",
    fullscreenExited: "You left fullscreen. Turn it on again to continue.",
    fixIt: "Fix it",
  },

  status: {
    idle: "Not checked",
    checking: "Checking...",
    ready: "Ready",
    warning: "Heads up",
    attention: "Needs attention",
    waiting: (item: string) => `Waiting for ${item}`,
    skipped: "Skipped",
    optional: "Optional",
    sharing: "Sharing",
    cameraOn: "Camera on",
  },

  // ---------------- GATE ----------------
  gate: {
    loading: "Checking your test link...",
    slow: "This is taking longer than usual. Check your internet connection.",
    early: {
      title: "Your test opens on [Date] at [Time]",
      body: "You can get your device ready now. The test itself can't start until then.",
      primary: "Get my device ready",
      calendar: "Add to calendar",
      calendarDone: "Calendar file downloaded",
      noEarlyTitle: "Your test opens on [Date] at [Time]",
      noEarlyBody: "Come back at [Time]. We'll be ready.",
      openNowTitle: "Your test is open now",
      openNowBody: "Press Continue to start setup. Your timer only starts on the last step.",
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
    },
    late: {
      title: "The test is already open",
      body: (n: number) =>
        `You're ${n} minutes late. [Late-start policy, for example: Your time ends at [End time]].`,
      primary: "Continue to setup",
    },
    closed: {
      title: "This test has closed",
      body: "The window to take [Assessment name] ended on [Date, time].",
    },
    submitted: {
      title: "You've already submitted this test",
      body: "Submitted on [Date, time]. It can't be taken again.",
    },
    invalid: {
      title: "This link isn't working",
      body: "It may have expired or been copied incorrectly. Open the link from your latest invitation email, or ask for a new one.",
    },
    expired: {
      title: "Your link session ended",
      body: "Open the link from your invitation email to continue.",
    },
    resume: {
      title: "Welcome back, [First name]",
      body: "Your test is still running. [Time left] left.",
      note: "We'll run a quick check first.",
      primary: "Continue to quick check",
      agreed: "You agreed on [date]",
    },
    device: {
      title: "Please use a laptop or desktop",
      body: "This test records your camera and entire screen, which phones and tablets can't share.",
    },
    browser: {
      title: "Open this test in Chrome or Edge",
      body: "Your browser can't run the checks this test needs.",
      outdatedTitle: "Update your browser",
      outdatedBody: "Version [x] is too old. Update it, then reopen this link.",
    },
    seb: {
      title: "Open this test in Safe Exam Browser",
      steps: [
        "Install Safe Exam Browser if you don't have it.",
        "Press Open in Safe Exam Browser.",
        "Your test opens with this page ready.",
      ],
      open: "Open in Safe Exam Browser",
      launching: "Opening...",
      download: "Download Safe Exam Browser",
      installed: "I already have it installed",
      blocked: "Your browser may be asking for permission. Choose Open when it asks, then try again.",
      tryAgain: "Try again",
      downloaded: "Download started",
    },
    generic: {
      title: "Something went wrong on our side",
      body: "Your progress is safe. Press Try again.",
    },
  },

  // ---------------- RULES ----------------
  rules: {
    title: "Before you begin",
    subtitle: "Everything you need is here, once. We won't repeat it for every section.",
    summary: {
      assessment: "Assessment",
      starts: "Starts",
      time: "Time allowed",
      sections: "Sections",
    },
    expect: {
      title: "What to expect",
      recording: { label: "Recording", body: "Your camera and screen are recorded during the test." },
      recordingMic: {
        label: "Recording",
        body: "Your camera, microphone and screen are recorded during the test.",
      },
      time: { label: "Time", body: "Your [Duration] timer starts when you press Start on the last step." },
      timeShort: { label: "Time", body: "Your [Duration] timer starts when you press Start on the last step." },
      help: { label: "Help", body: "Get help is at the top of every screen." },
    },
    keep: { title: "Three things to keep during the test" },
    keepNon: { title: "Things to know during the test" },
    nonRules: [
      { title: "Use one device", why: "Switching devices mid-test can lose your answers." },
      { title: "Stay on the test page", why: "Leaving the page can interrupt your timer and your answers." },
      { title: "Keep your internet steady", why: "A steady connection keeps your answers saving as you go." },
    ],
    conduct: "Read the full Code of Conduct",
    conductTitle: "Code of Conduct",
    conductBody: "[Full Code of Conduct text]",
    hint: "Takes about 5 minutes.",
    hintNon: "Takes about 2 minutes.",
    agreedChip: "You agreed on [date].",
    review: "Review",
  },

  // ---------------- CONSENT ----------------
  consent: {
    title: "Your camera and screen are recorded",
    subtitle: "Please read this before you agree. It takes a minute.",
    rows: {
      record: {
        label: "What we record",
        value: "Your camera video and your screen during the test. Your microphone, if this test uses it.",
      },
      why: {
        label: "Why",
        value: "To confirm it is you taking the test and to keep it fair for everyone.",
      },
      who: { label: "Who can see it", value: "[Roles who can view recordings]" },
      keep: { label: "How long we keep it", value: "[Retention period]" },
      choices: { label: "Your choices", value: "[How to ask a question or withdraw consent]" },
    },
    thColumn: "Topic",
    thValue: "Details",
    checkbox: "I understand what is recorded and I agree to be recorded for this test.",
    agree: "Agree and continue",
    disabledHint: "Tick the box to continue.",
    decline: "I don't agree",
    declineModal: {
      title: "You can't take this test without recording",
      body: "This test needs your camera and screen so the result is fair for everyone. If you have a concern, contact support before the test closes.",
      review: "Go back and review",
    },
  },

  // ---------------- GET READY ----------------
  ready: {
    title: "Get ready",
    subtitle: "We'll check each item. If something needs fixing, the fix shows up right next to it.",
    progress: (n: number, total: number) => `${n} of ${total} ready`,
    runAll: "Run all checks",
    running: "Checking...",
    left: (n: number) => (n === 1 ? "1 check left" : `${n} checks left`),
    allPassed: "All checks passed",
    goToFirst: "Go to the first item that needs attention",
    stuck: "Still stuck?",
    stuckCta: "Get help",
    checkAgainQuick: "Check again quickly",
    skip: "Skip for now",
    attempts: "Still not working?",
    quickTitle: "Quick check",
    quickSubtitle: "We'll make sure your setup still works before you go back in.",
    quickContinue: "Back to my test",

    internet: {
      title: "Internet",
      idle: "We'll check your connection.",
      ready: "Your connection looks good.",
      slowShort: "Your connection is slow, but you can continue.",
      offlineShort: "You're offline.",
      NET_SLOW:
        "Your connection is slow. You can continue, but pages may load slowly. Move closer to your router or switch to a stronger network.",
      NET_OFFLINE: "You're offline. Reconnect to continue.",
      action: "Check connection",
      again: "Check again",
    },

    camera: {
      title: "Camera",
      idle: "We'll ask your browser for permission. Choose Allow.",
      checking: "Waiting for your permission...",
      checkingLong: "Don't see the prompt? Look near the address bar.",
      ready: "Your camera works.",
      attentionShort: "We couldn't turn on your camera.",
      anotherCamera: "Built-in camera",
      cameras: ["Built-in camera", "USB webcam"],
      caption: "This is what we see.",
      different: "Use a different camera",
      cameraLabel: "Camera",
      action: "Check camera",
      CAM_BLOCKED:
        "Camera is blocked. Click the camera icon in your browser's address bar, choose Allow, then press Try again.",
      CAM_DISMISSED:
        "We didn't get permission. Press Check camera and choose Allow when your browser asks.",
      CAM_NOT_FOUND:
        "We can't find a camera. Connect a webcam or check your laptop camera is on, then press Try again.",
      CAM_IN_USE:
        "Another app is using your camera. Close apps like Zoom, Teams or Meet, then press Try again.",
      CAM_OS_BLOCKED:
        "Your computer is blocking the camera for this browser. Open System Settings, then Privacy and Security, then Camera, and turn on [Browser]. Restart the browser, then reopen this link.",
      CAM_DARK: "Your camera looks dark. Face a window or turn on a light.",
      CAM_LOST: "Your camera disconnected. Reconnect it, then press Try again.",
    },

    mic: {
      title: "Microphone",
      idle: "Say a few words when the meter is moving.",
      ready: "We can hear you.",
      attentionShort: "We couldn't hear your microphone.",
      different: "Use a different microphone",
      mics: ["Built-in microphone", "Headset microphone"],
      action: "Test microphone",
      MIC_BLOCKED:
        "Microphone is blocked. Click the lock icon in your browser's address bar, choose Allow, then press Try again.",
      MIC_NOT_FOUND:
        "We can't find a microphone. Connect one or check your headset, then press Try again.",
      MIC_SILENT:
        "We can't hear anything. Check that your microphone isn't muted, then speak again.",
      MIC_NOISY: "It's noisy around you. Move somewhere quieter if you can.",
      meter: "Microphone level",
    },

    face: {
      title: "Face",
      waiting: "Starts once your camera is ready.",
      waitingFor: "camera",
      returning: "Your face is already set up. Quick check.",
      returningAction: "Check my face",
      enrollIdle: "We'll save a photo of your face. You only do this once.",
      checking: "Hold still...",
      ready: "Your face is confirmed.",
      attentionShort: "We couldn't confirm your face.",
      saved: "Face saved. You won't need to do this again.",
      enrollTitle: "One-time face setup",
      enrollBody:
        "We'll save a photo of your face so we can confirm it's you each time. You only do this once.",
      tips: ["Face the light", "Look straight at the camera", "Remove cap, mask or sunglasses"],
      takePhoto: "Take photo",
      review: "Does this look right?",
      use: "Use this photo",
      retake: "Retake",
      action: "Check my face",
      FACE_NONE: "We can't see a face. Move into the frame so your whole face is visible.",
      FACE_MULTIPLE: "We can see more than one person. Make sure you're alone in the frame.",
      FACE_COVERED: "Part of your face is covered. Remove cap, mask or sunglasses.",
      FACE_FAR: "Move a little closer.",
      FACE_CLOSE: "Move back a little.",
      FACE_DARK: "Your face is hard to see. Face the light.",
      FACE_NO_MATCH:
        "We couldn't match your face to your setup photo. Check the lighting and try again.",
    },

    screen: {
      title: "Screen sharing",
      idle: "Choose Entire Screen when your browser asks. A tab or a window won't work.",
      ready: "Your entire screen is shared.",
      attentionShort: "We couldn't share your entire screen.",
      action: "Share entire screen",
      again: "Share again",
      disconnected: "I've disconnected it",
      pickerTitle: "Choose what to share",
      pickerTabs: ["Chrome Tab", "Window", "Entire Screen"],
      pickerNote: "Pick Entire Screen",
      SCREEN_CANCELLED:
        "You closed the sharing window. Press Share entire screen and choose Entire Screen.",
      SCREEN_TAB: "You shared a browser tab. Share your Entire Screen instead.",
      SCREEN_WINDOW: "You shared a single window. Share your Entire Screen instead.",
      SCREEN_MULTI:
        "We found more than one screen. Disconnect extra monitors or turn off screen mirroring.",
      SCREEN_OS_BLOCKED:
        "Your computer isn't allowing screen recording for this browser. Open System Settings, then Privacy and Security, then Screen Recording, and turn on [Browser]. Restart the browser, then reopen this link.",
      SCREEN_UNSUPPORTED: "This browser can't share your screen. Open the link in Chrome or Edge.",
      SCREEN_STOPPED: "Screen sharing stopped. Share again to continue.",
    },

    fullscreen: {
      title: "Fullscreen",
      idle: "The test runs in fullscreen.",
      ready: "Fullscreen is on.",
      attentionShort: "Fullscreen isn't on.",
      action: "Enter fullscreen",
      FULLSCREEN_BLOCKED: "Your browser blocked fullscreen. Press the button again or press F11.",
      FULLSCREEN_EXITED: "You left fullscreen. Turn it on again to continue.",
    },

    browserTabs: {
      label: "Browser instructions",
      items: [
        {
          id: "chrome",
          label: "Chrome / Edge",
          steps: [
            "Click the camera icon in the address bar.",
            "Choose Allow, then press Done.",
            "Press Try again below.",
          ],
        },
        {
          id: "safari",
          label: "Safari",
          steps: [
            "Open Safari, then Settings for This Website.",
            "Set Camera to Allow.",
            "Press Try again below.",
          ],
        },
        {
          id: "firefox",
          label: "Firefox",
          steps: [
            "Click the camera icon in the address bar.",
            "Clear the blocked setting, then reload.",
            "Press Try again below.",
          ],
        },
      ],
    },
  },

  // ---------------- PRACTICE ----------------
  practice: {
    title: "Try a practice question",
    subtitle:
      "Optional. See how questions look and how to answer, so nothing surprises you in the real test. Nothing here is scored or timed.",
    pill: "Practice, not scored",
    q1: "What is 2 + 3?",
    options: ["4", "5", "6"],
    correctIndex: 1,
    correct: "Correct. This is how you pick an answer.",
    incorrect: "Not this one, and that is fine. This is only to show how questions look.",
    q2: "Write a line that prints the sum of 2 and 3.",
    run: "Run",
    output: "Output",
    sampleOutput: "5",
    codeNote: "In the real test you can run your code before you submit.",
    skip: "Skip practice",
    continue: "Continue",
  },

  // ---------------- START ----------------
  start: {
    title: "Ready to start?",
    subtitle: "Take a breath. You've done everything needed.",
    allPassed: "All checks passed",
    oneThing: "One thing needs attention",
    fixIt: "Fix it",
    rechecked: "Rechecked just now",
    chips: {
      camera: "Camera",
      mic: "Microphone",
      face: "Face",
      screen: "Entire screen",
      fullscreen: "Fullscreen",
      internet: "Internet",
    },
    beforeTitle: "Before you start",
    beforeItems: [
      "Charger plugged in",
      "Notifications and chat apps closed or silenced",
      "In a quiet place where you won't be interrupted",
      "Water and anything you need nearby",
    ],
    realTitle: "This is the real test.",
    realBody: "When you press Start, your [Duration] timer begins right away.",
    cta: "Start test",
    starting: "Starting...",
    opensAt: "Opens at [Time]",
    opensIn: "Opens in",
    opened: "The test is open. Press Start when you're ready.",
    failed: "We couldn't start your session. Your timer has not started.",
    idleRecheck: "It's been a while. We rechecked your setup.",
    notReady: "Fix the item that needs attention to start.",
  },

  started: {
    pill: "Session started",
    title: "Your test is running",
    body: "The prototype ends here. The test screen is outside this redesign.",
    restart: "Restart prototype",
    resumeBody: "You're back in your test. Your timer kept running.",
  },

  // ---------------- HELP ----------------
  help: {
    title: "Get help",
    fixesTitle: "Common fixes for this step",
    contactTitle: "Contact us",
    include:
      "Include my device details (browser, system, and camera, microphone and screen status) so support can help faster.",
    includeWhat: "What's included?",
    includeTip:
      "Browser name and version, operating system, and whether camera, microphone and screen checks passed. No video, audio or screen content.",
    accessTitle: "Need extra time or accessibility support?",
    accessOptions: ["Extra time", "Screen reader or other assistive tool", "Something else"],
    accessLabel: "Tell us what you need",
    accessMax: 500,
    send: "Send request",
    sending: "Sending...",
    sent: (id: string) => `Request sent. Your reference is ${id}. We'll reply to [email].`,
    sendFailed: "We couldn't send that. Try again or use the contact details above.",
    diagnostics: "Diagnostics attached",
    fixes: {
      rules: [
        { title: "I can't open the Code of Conduct", steps: ["Press Read the full Code of Conduct.", "If it stays blank, reload this page.", "Reopen the link from your invitation email."] },
        { title: "I don't know when the test starts", steps: ["Your timer starts only when you press Start on the last step.", "Setup before that is not timed."] },
      ],
      consent: [
        { title: "I have a question about recording", steps: ["Use the contact details below.", "Contact support before the test closes."] },
        { title: "I can't tick the box", steps: ["Press the box or its text.", "On a keyboard, press Space."] },
      ],
      getReady: [
        { title: "Camera not working", steps: ["Close apps like Zoom, Teams or Meet.", "Click the camera icon in the address bar and choose Allow.", "Press Try again."] },
        { title: "Microphone not working", steps: ["Check your microphone isn't muted.", "Choose Allow when your browser asks.", "Press Test microphone and speak."] },
        { title: "Face not recognised", steps: ["Face a window or turn on a light.", "Remove cap, mask or sunglasses.", "Sit about an arm's length from the screen."] },
        { title: "Screen sharing issues", steps: ["Press Share entire screen.", "Pick the Entire Screen tab, not a tab or window.", "Disconnect extra monitors."] },
        { title: "Fullscreen issues", steps: ["Press Enter fullscreen again.", "Or press F11 on Windows, Control and Command and F on Mac."] },
        { title: "Slow or no internet", steps: ["Move closer to your router.", "Switch to a stronger network or hotspot.", "Press Check again."] },
      ],
      practice: [
        { title: "Answer isn't selecting", steps: ["Click the option or press Space on it.", "Practice answers are never saved."] },
      ],
      start: [
        { title: "Start test is disabled", steps: ["If it says Opens at, wait for the time shown.", "If a check needs attention, press Fix it."] },
        { title: "Start didn't work", steps: ["Your timer has not started.", "Press Try again.", "If it keeps failing, contact us below."] },
      ],
      gate: [
        { title: "My link isn't working", steps: ["Open the link from your latest invitation email.", "Ask for a new link if it has expired."] },
        { title: "I'm on a phone", steps: ["Proctored tests need a laptop or desktop.", "Copy the link and open it there."] },
      ],
      general: [
        { title: "Something isn't working", steps: ["Reload this page. Your progress is kept.", "If it keeps happening, contact us below."] },
      ],
    } as Record<string, Array<{ title: string; steps: string[] }>>,
    contextLabel: {
      gate: "this link",
      rules: "Rules",
      consent: "Consent",
      getReady: "Get ready",
      practice: "Practice",
      start: "Start",
      started: "your test",
    } as Record<string, string>,
  },

  panel: { title: "Prototype controls" },
} as const;

export type Strings = typeof S;

// All user-facing copy lives here (one file, ready for translation).
// Text in [square brackets] is a placeholder and renders with a dotted underline.
// Flow follows the Figma file "Pre-Assessment Journey".

export const S = {
  header: {
    report: "Report",
    skipToContent: "Skip to content",
    logo: "[Company logo]",
    net: { checking: "Checking", good: "Excellent", slow: "Slow", offline: "Offline" },
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
    linkCopied: "Link copied",
    copyLink: "Copy test link",
    emailLink: "Email me the link",
    emailLinkSent: "We sent the link to your email",
    errorCode: (c: string) => `Error ${c}`,
    skip: "Skip for now",
    stuck: "Still stuck?",
    stuckCta: "Get help",
  },

  banners: {
    notTheTest: "Not the test yet. This is only setup. Start unlocks at [Time].",
    offline: "You're offline. We'll pick up where you left off when you're back.",
    screenStopped: "Screen sharing stopped. Share again to continue.",
    cameraLost: "Your camera disconnected. Reconnect it and check again.",
    fixIt: "Fix it",
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
      openNowBody: "Press Continue to start setup. Your timer only starts at the end.",
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

  // ---------------- 01 DETAILS ----------------
  details: {
    totalSections: "Total Sections",
    duration: "Assessment duration",
    confirmTitle: "Please check the details and confirm your identity",
    logout: "Not you? Log out",
    loggedOut: "Logged out. Open your invitation link to sign in again.",
    confirm: "Confirm and Continue",
  },

  // ---------------- 02 BEFORE YOU BEGIN ----------------
  before: {
    title: "Hi [First name], before you begin",
    need: "What you'll need",
    space: "Get your space ready",
    rows: {
      internet: { label: "Internet", body: "At least 5 Mbps." },
      extensions: { label: "Browser extensions", body: "Blocked extensions must be turned off." },
      camera: { label: "Camera", body: "Stays on for the whole assessment." },
      mic: { label: "Microphone", body: "Audio is monitored." },
      screen: { label: "Screen Sharing", body: "Share your entire screen. Use one screen only." },
      browser: { label: "Browser", body: "Google Chrome is recommended." },
      room: { label: "Room", body: "Quiet and well lit, so your face is clear." },
      apps: { label: "Apps", body: "Close other tabs and apps. Turn off notifications." },
      power: { label: "Power", body: "Plug in your charger, or fully charge." },
    },
    badge: {
      excellent: "Excellent",
      slow: "Slow",
      offline: "Offline",
      checking: "Checking",
      none: "None Found",
      found: "Found",
    },
    slowFix: "Your connection is slow. You can continue, but pages may load slowly. Move closer to your router or switch to a stronger network.",
    offlineFix: "You're offline. Reconnect to continue.",
    extFix: "We found extensions that can block the test. Turn them off in your browser, then press Check again.",
    checkAgain: "Check again",
    hintBlocked: "Fix the item above to continue.",
  },

  // ---------------- 03 CONSENT ----------------
  consent: {
    title: "Monitoring and Consent",
    rows: {
      camera: { label: "Camera", body: "To confirm it is you, and alone." },
      audio: { label: "Audio", body: "To detect voices." },
      screen: { label: "Screen Sharing", body: "To see what is open." },
      activity: { label: "Activity", body: "Tab switches and device details." },
    },
    agree: "I Agree and Continue",
    decline: "I don't agree",
    declineModal: {
      title: "You can't take this test without monitoring",
      body: "This test needs your camera, audio and screen so the result is fair for everyone. If you have a concern, contact support before the test closes.",
      review: "Go back and review",
    },
  },

  // ---------------- 04-12 SETUP ----------------
  setup: {
    tabs: { camera: "Camera", mic: "Microphone", screen: "Screen Sharing" },
    stepperLabel: "Device setup",
    done: "done",

    camera: {
      allowText:
        "Allow camera access. A box will appear at the top-left of your browser. Choose Allow while visiting the site.",
      examples: [
        { label: "Too dark", ok: false },
        { label: "More than one person", ok: false },
        { label: "Face cut off", ok: false },
        { label: "Clear and well lit", ok: true },
      ],
      allow: "Allow Camera",
      waiting: "Waiting for your permission...",
      waitingLong: "Don't see the prompt? Look near the address bar.",
      cameraOn: "Camera on",
      photoText: "Take your photo. We'll use it to verify you throughout the assessment.",
      returningText: "Your face is already set up. Quick check.",
      takePhoto: "Take Photo",
      retake: "Retake",
      verify: "Verify Your Photo",
      verifying: "Verifying...",
      darkNote: "Your camera looks dark. Face a window or turn on a light.",
      CAM_BLOCKED:
        "Camera is blocked. Click the camera icon in your browser's address bar, choose Allow, then press Try again.",
      CAM_DISMISSED:
        "We didn't get permission. Press Allow Camera and choose Allow when your browser asks.",
      CAM_NOT_FOUND:
        "We can't find a camera. Connect a webcam or check your laptop camera is on, then press Try again.",
      CAM_IN_USE:
        "Another app is using your camera. Close apps like Zoom, Teams or Meet, then press Try again.",
      CAM_OS_BLOCKED:
        "Your computer is blocking the camera for this browser. Open System Settings, then Privacy and Security, then Camera, and turn on [Browser]. Restart the browser, then reopen this link.",
      CAM_LOST: "Your camera disconnected. Reconnect it, then press Try again.",
      FACE_NONE: "We can't see a face. Move into the frame so your whole face is visible.",
      FACE_MULTIPLE: "We can see more than one person. Make sure you're alone in the frame.",
      FACE_COVERED: "Part of your face is covered. Remove cap, mask or sunglasses.",
      FACE_FAR: "Move a little closer.",
      FACE_CLOSE: "Move back a little.",
      FACE_DARK: "Your face is hard to see. Face the light.",
      FACE_NO_MATCH:
        "We couldn't match your face to your setup photo. Check the lighting and try again.",
      stillNot: "Still not working?",
      different: "Use a different camera",
      cameras: ["Built-in camera", "USB webcam"],
    },

    mic: {
      allowText: "Allow microphone access. Choose Allow while visiting the site.",
      builtIn: "Use your laptop's built-in microphone. Earphones and headsets aren't allowed.",
      allow: "Allow microphone",
      say: "Say:",
      phrase: "\u201CI am ready to begin the assessment.\u201D",
      record: "Record",
      stop: "Stop Recording...",
      heard: "What we heard:",
      play: "Play",
      playing: "Playing...",
      meter: "Microphone level",
      MIC_BLOCKED:
        "Microphone is blocked. Click the lock icon in your browser's address bar, choose Allow, then press Try again.",
      MIC_NOT_FOUND:
        "We can't find a microphone. Connect one or check your laptop microphone is on, then press Try again.",
      MIC_SILENT:
        "We can't hear anything. Check that your microphone isn't muted, then press Record and speak again.",
      MIC_NOISY: "It's noisy around you. Move somewhere quieter if you can.",
    },

    screen: {
      steps: [
        "Click Share screen.",
        "In the Chrome box, choose Entire screen.",
        "Select your screen and click Share.",
      ],
      pickerTitle: "Choose what to share",
      pickerSub: "topin.tech wants to share your screen",
      pickerTabs: ["Chrome Tab", "Window", "Entire Screen"],
      screenLabel: "Screen 1",
      share: "Share Screen",
      sharing: "Sharing...",
      again: "Share again",
      disconnected: "I've disconnected it",
      SCREEN_CANCELLED:
        "You closed the sharing window. Press Share Screen and choose Entire Screen.",
      SCREEN_TAB: "You shared a browser tab. Share your Entire Screen instead.",
      SCREEN_WINDOW: "You shared a single window. Share your Entire Screen instead.",
      SCREEN_MULTI:
        "We found more than one screen. Disconnect extra monitors or turn off screen mirroring.",
      SCREEN_OS_BLOCKED:
        "Your computer isn't allowing screen recording for this browser. Open System Settings, then Privacy and Security, then Screen Recording, and turn on [Browser]. Restart the browser, then reopen this link.",
      SCREEN_UNSUPPORTED: "This browser can't share your screen. Open the link in Chrome or Edge.",
      SCREEN_STOPPED: "Screen sharing stopped. Share again to continue.",
    },

    browserTabs: {
      label: "Browser instructions",
      items: [
        {
          id: "chrome",
          label: "Chrome / Edge",
          steps: ["Click the camera icon in the address bar.", "Choose Allow, then press Done.", "Press Try again below."],
        },
        {
          id: "safari",
          label: "Safari",
          steps: ["Open Safari, then Settings for This Website.", "Set Camera to Allow.", "Press Try again below."],
        },
        {
          id: "firefox",
          label: "Firefox",
          steps: ["Click the camera icon in the address bar.", "Clear the blocked setting, then reload.", "Press Try again below."],
        },
      ],
    },
  },

  // ---------------- 13 SUMMARY ----------------
  summary: {
    title: "Everything is set",
    passed: (n: number, total: number) => `${n} of ${total} checks passed`,
    needsAttention: (n: number, total: number) => `${n} of ${total} checks passed. One needs attention`,
    fixIt: "Fix it",
    rows: {
      internet: { label: "Internet", ok: "Excellent", slow: "Slow", offline: "Offline" },
      consent: { label: "Consent", ok: "Agreed to be recorded", no: "Not agreed yet" },
      extensions: { label: "Browser extensions", ok: "No blocked extensions found", no: "Blocked extensions found" },
      camera: { label: "Camera", ok: "Camera on, Identity confirmed", no: "Needs attention" },
      mic: { label: "Microphone", ok: "Microphone working", skipped: "Skipped", no: "Needs attention" },
      screen: { label: "Screen Sharing", ok: "Entire screen shared", no: "Needs attention" },
    },
    speed: { down: "48 Mbps", up: "22 Mbps", slowDown: "3 Mbps", slowUp: "1 Mbps" },
    continue: "Continue",
  },

  // ---------------- 14-15 CODE OF CONDUCT ----------------
  conduct: {
    title: "Code of Conduct",
    follow: "Please follow these",
    rows: {
      help: { label: "No Help", body: "From anyone, in the room or online." },
      devices: { label: "No Devices", body: "Phones, smartwatches, earphones or notes." },
      stay: { label: "Stay in the Assessment", body: "Do not switch tabs or leave the window." },
      malpractice: { label: "Malpractice", body: "Ends your assessment and can bar you from future ones." },
    },
    note: "Camera, screen and audio stay monitored during the assessment.",
    agree: "I agree to follow the code of conduct.",
    continue: "Continue",
    startHint: "Your [Duration] timer starts when you press Continue.",
    tickHint: "Tick the box to continue.",
    opensAt: "Opens at [Time]",
    opensIn: "Opens in",
    starting: "Starting...",
    opened: "The test is open. Press Continue when you're ready.",
    failed: "We couldn't start your session. Your timer has not started.",
    fullText: "Read the full Code of Conduct",
    fullTitle: "Code of Conduct",
    fullBody: "[Full Code of Conduct text]",
    fixBlocked: "Fix the item that needs attention to continue.",
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
      details: [
        { title: "This isn't my name", steps: ["Press Not you? Log out.", "Open the link from your own invitation email."] },
      ],
      before: [
        { title: "Slow or no internet", steps: ["Move closer to your router.", "Switch to a stronger network or hotspot.", "Press Check again."] },
        { title: "Blocked extensions found", steps: ["Open your browser's extensions page.", "Turn off ad blockers and similar tools.", "Press Check again."] },
      ],
      consent: [
        { title: "I have a question about monitoring", steps: ["Use the contact details below.", "Contact support before the test closes."] },
      ],
      setup: [
        { title: "Camera not working", steps: ["Close apps like Zoom, Teams or Meet.", "Click the camera icon in the address bar and choose Allow.", "Press Try again."] },
        { title: "Face not recognised", steps: ["Face a window or turn on a light.", "Remove cap, mask or sunglasses.", "Sit about an arm's length from the screen."] },
        { title: "Microphone not working", steps: ["Check your microphone isn't muted.", "Choose Allow when your browser asks.", "Press Record and say the sentence."] },
        { title: "Screen sharing issues", steps: ["Press Share Screen.", "Pick the Entire Screen tab, not a tab or window.", "Disconnect extra monitors."] },
      ],
      summary: [
        { title: "A check needs attention", steps: ["Press Fix it.", "Complete the step, then come back."] },
      ],
      conduct: [
        { title: "Continue is disabled", steps: ["Tick I agree to follow the code of conduct.", "If it says Opens at, wait for the time shown."] },
        { title: "Starting didn't work", steps: ["Your timer has not started.", "Press Try again.", "If it keeps failing, contact us below."] },
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
      details: "Details",
      before: "Before you begin",
      consent: "Consent",
      setup: "Device setup",
      summary: "Everything is set",
      conduct: "Code of Conduct",
      started: "your test",
    } as Record<string, string>,
  },

  panel: { title: "Prototype controls" },
} as const;

export type Strings = typeof S;

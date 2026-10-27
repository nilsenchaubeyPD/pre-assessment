// Design tokens, sampled from the Figma file "Pre-Assessment Journey". Single source of truth.
export const colors = {
  page: "#FFFFFF",
  subtle: "#F8FAFC",
  border: "#E8ECF2",
  cardBorder: "#E2E8F0",
  controlBorder: "#CBD5E1",
  ink: "#1E293B",
  body: "#475569",
  muted: "#64748B",
  blue: "#2563EB",
  blueHover: "#1D4ED8",
  blueRing: "#93C5FD",
  blueTint: "#EFF6FF",
  success: "#15803D",
  successBg: "#DCFCE7",
  successBanner: "#F0FDF4",
  successLine: "#16A34A",
  attention: "#B4400B",
  attentionBg: "#FFE8D6",
  review: "#92400E",
  reviewBg: "#FEF3C7",
  checking: "#475569",
  checkingBg: "#EEF1F6",
  danger: "#EF4444",
  dangerBg: "#FEE2E2",
  dangerText: "#B91C1C",
  tooltip: "#475569",
  tabs: "#F3F4F6",
} as const;

export const layout = {
  contentMax: 720, // card column in the Figma frames
  headerHeight: 64,
  footerHeight: 64,
  radiusCard: 16,
  radiusControl: 8,
} as const;

export const breakpoints = { tablet: 640, desktop: 1024 } as const;

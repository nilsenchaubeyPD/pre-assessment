// Design tokens (from the Topin "AI Integrity Report" reference). Single source of truth.
export const colors = {
  page: "#FFFFFF",
  subtle: "#F6F7F9",
  border: "#E3E7EE",
  cardBorder: "#D9DFE8",
  controlBorder: "#C5CDD9",
  ink: "#1F2A3D",
  body: "#374151",
  muted: "#6B7280",
  blue: "#1D5FD8",
  blueHover: "#174FB5",
  blueRing: "#9DBBF2",
  blueTint: "#EAF1FD",
  success: "#15803D",
  successBg: "#DCFCE7",
  successBanner: "#F0FDF4",
  attention: "#B4400B",
  attentionBg: "#FFE8D6",
  review: "#92400E",
  reviewBg: "#FEF3C7",
  checking: "#475569",
  checkingBg: "#EEF1F6",
  tooltip: "#475569",
  tabs: "#F3F4F6",
  navy: "#1B2340",
  magenta: "#E5195E",
} as const;

export const layout = {
  contentMax: 880,
  headerHeight: 64,
  radiusCard: 12,
  radiusControl: 8,
} as const;

export const breakpoints = { tablet: 640, desktop: 1024 } as const;

import type { Config } from "tailwindcss";
import { colors } from "./src/theme/tokens";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    screens: { sm: "640px", md: "640px", lg: "1024px" },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      colors: {
        page: colors.page,
        subtle: colors.subtle,
        line: colors.border,
        cardline: colors.cardBorder,
        ctrl: colors.controlBorder,
        ink: colors.ink,
        body: colors.body,
        muted: colors.muted,
        brand: { DEFAULT: colors.blue, hover: colors.blueHover, ring: colors.blueRing, tint: colors.blueTint },
        ok: { DEFAULT: colors.success, bg: colors.successBg, banner: colors.successBanner },
        warn: { DEFAULT: colors.attention, bg: colors.attentionBg },
        review: { DEFAULT: colors.review, bg: colors.reviewBg },
        busy: { DEFAULT: colors.checking, bg: colors.checkingBg },
        tip: colors.tooltip,
        tabs: colors.tabs,
        danger: { DEFAULT: colors.danger, bg: colors.dangerBg, text: colors.dangerText },
        okline: colors.successLine,
      },
      fontSize: {
        title: ["28px", { lineHeight: "36px", fontWeight: "600" }],
        section: ["20px", { lineHeight: "28px", fontWeight: "600" }],
        body: ["16px", { lineHeight: "24px" }],
        sec: ["14px", { lineHeight: "20px" }],
        th: ["13px", { lineHeight: "18px", fontWeight: "500" }],
      },
      borderRadius: { card: "16px", ctrl: "8px" },
      maxWidth: { content: "720px" },
      keyframes: {
        stepIn: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "none" } },
        pulseDot: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.35" } },
        spin: { to: { transform: "rotate(360deg)" } },
        shimmer: { "0%": { backgroundPosition: "-200px 0" }, "100%": { backgroundPosition: "200px 0" } },
        slideLeft: { from: { transform: "translateX(100%)" }, to: { transform: "none" } },
        slideUp: { from: { transform: "translateY(100%)" }, to: { transform: "none" } },
        fade: { from: { opacity: "0" }, to: { opacity: "1" } },
      },
      animation: {
        // "backwards" (not "both"): a forwards-filled transform would turn the page into the containing block for the fixed mobile action bar
        "step-in": "stepIn 200ms ease-out backwards",
        "pulse-dot": "pulseDot 1.4s ease-in-out infinite",
        spin: "spin 0.9s linear infinite",
        shimmer: "shimmer 1.4s linear infinite",
        "slide-left": "slideLeft 220ms ease-out both",
        "slide-up": "slideUp 220ms ease-out both",
        fade: "fade 150ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;

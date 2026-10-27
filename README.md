# Topin pre-assessment flow (prototype)

Clickable React + TypeScript + Tailwind prototype that follows the Figma file "Pre-Assessment Journey".

Flow: Details, Before you begin, Monitoring and Consent, device setup (Camera, Microphone, Screen Sharing),
Everything is set, Code of Conduct, started.

```
npm install
npm run dev      # http://127.0.0.1:5173/
npm run build
```

- `?proto=0` hides the Prototype Controls panel. `?real=1` uses the real browser device adapter.
- Devices are simulated by default. Use Prototype Controls to pick outcomes (camera, mic, face, screen,
  network, extensions), presets, and "Break it now" buttons.
- All copy is in `src/strings.ts`. `[Bracketed]` text is a placeholder (dotted underline).
- State machine: `src/state/flowMachine.ts`. Device layer: `src/devices/`. Screens: `src/screens/`.

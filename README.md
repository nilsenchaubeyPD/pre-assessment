# Pre-Assessment Flow

Clickable, working prototype of the redesigned Topin candidate pre-assessment flow: everything a
candidate sees from opening the test link to pressing "Start test".

React + TypeScript + Tailwind (Vite). A simulated device layer is the default, so every edge case
(camera, mic, face, screen share, fullscreen, network, gate states, SEB, consent) can be demonstrated
without real permissions.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build
```

URL flags:

- `?proto=0` hides the Prototype controls panel (on by default).
- `?real=1` uses the RealAdapter (`getUserMedia`, `getDisplayMedia`, Fullscreen API, `navigator.onLine`).
  Face detection stays a stub.

## Prototype controls

Bottom-left panel. Selects set the outcome of the *next* check run. "Break it now" applies immediately.
Presets: Happy path, First-timer with problems, Everything fails once, Early link, Phone on proctored
test, SEB. "Fail once, then succeed" makes any chosen failure clear itself after it has been shown.
Changing test type, link state, device, candidate or consent restarts the flow.

## Structure

```
src/config/testConfig.ts      test variants and placeholders
src/strings.ts                every user-facing string (placeholders in [brackets])
src/state/flowMachine.ts      store, step guards, checks, regressions, persistence, analytics events
src/devices/                  DeviceAdapter, SimulatedAdapter, RealAdapter
src/components/               Header, Stepper, Banner, Card, CheckRow, FixPanel, StatusPill, Tooltip,
                              Accordion, Table, Drawer, Modal, Countdown, PrototypeControls, ...
src/screens/                  Gate/*, Rules, Consent, GetReady, Practice, Start, Started
src/help/HelpDrawer.tsx       help drawer
src/theme/tokens.ts           design tokens (mapped in tailwind.config.ts)
```

## Notes

- Placeholders such as `[Assessment name]` render with a dotted underline so they are easy to find.
- Countdowns use a simulated server clock (deliberately offset from the device clock).
- Analytics events are pushed to `window.__topinEvents` and logged with `console.debug`.
- Visual tokens come from the written spec. The reference screenshot was not available when this was
  built, so compare colours and spacing against it and adjust `src/theme/tokens.ts`.

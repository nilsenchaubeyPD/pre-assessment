import { Header } from "./components/Header";
import { Stepper } from "./components/Stepper";
import { BannerSlot } from "./components/Banner";
import { Toast } from "./components/Toast";
import { PrototypeControls } from "./components/PrototypeControls";
import { HelpDrawer } from "./help/HelpDrawer";
import { Gate } from "./screens/Gate";
import { Rules } from "./screens/Rules";
import { Consent } from "./screens/Consent";
import { GetReady } from "./screens/GetReady";
import { Practice } from "./screens/Practice";
import { Start } from "./screens/Start";
import { Started } from "./screens/Started";
import { S } from "./strings";
import { getSteps, useApp } from "./state/flowMachine";

export default function App() {
  const s = useApp((x) => x);
  const phase = s.phase;
  const steps = getSteps(s);
  const inFlow = phase !== "gate" && phase !== "started";

  let screen: JSX.Element;
  switch (phase) {
    case "gate":
      screen = <Gate />;
      break;
    case "rules":
      screen = <Rules />;
      break;
    case "consent":
      screen = <Consent />;
      break;
    case "getReady":
      screen = <GetReady />;
      break;
    case "practice":
      screen = <Practice />;
      break;
    case "start":
      screen = <Start />;
      break;
    default:
      screen = <Started />;
  }

  return (
    <div className="min-h-screen bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[70] focus:rounded focus:bg-white focus:px-3 focus:py-2"
      >
        {S.header.skipToContent}
      </a>
      <Header />
      {inFlow && <Stepper steps={steps} current={phase as (typeof steps)[number]} quick={steps.length === 1} />}
      <BannerSlot />
      <main id="main">{screen}</main>
      <HelpDrawer />
      <Toast />
      <PrototypeControls />
      <div id="sr-polite" className="sr-only" aria-live="polite" role="status" />
      <div id="sr-assertive" className="sr-only" aria-live="assertive" role="alert" />
    </div>
  );
}

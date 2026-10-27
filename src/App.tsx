import { Header } from "./components/Header";
import { BannerSlot } from "./components/Banner";
import { Toast } from "./components/Toast";
import { PrototypeControls } from "./components/PrototypeControls";
import { HelpDrawer } from "./help/HelpDrawer";
import { Gate } from "./screens/Gate";
import { Details } from "./screens/Details";
import { Before } from "./screens/Before";
import { Consent } from "./screens/Consent";
import { Setup } from "./screens/Setup";
import { Summary } from "./screens/Summary";
import { Conduct } from "./screens/Conduct";
import { Started } from "./screens/Started";
import { S } from "./strings";
import { useApp } from "./state/flowMachine";

export default function App() {
  const s = useApp((x) => x);
  const phase = s.phase;

  let screen: JSX.Element;
  switch (phase) {
    case "gate":
      screen = <Gate />;
      break;
    case "details":
      screen = <Details />;
      break;
    case "before":
      screen = <Before />;
      break;
    case "consent":
      screen = <Consent />;
      break;
    case "setup":
      screen = <Setup />;
      break;
    case "summary":
      screen = <Summary />;
      break;
    case "conduct":
      screen = <Conduct />;
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

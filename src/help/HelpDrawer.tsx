import { useEffect, useState } from "react";
import { Drawer } from "../components/Drawer";
import { Accordion } from "../components/Accordion";
import { Button, Icon, T } from "../components/primitives";
import { StatusPill } from "../components/StatusPill";
import { Tooltip } from "../components/Tooltip";
import { testConfig } from "../config/testConfig";
import { S } from "../strings";
import { closeHelp, showToast, track, useApp } from "../state/flowMachine";
import { delay } from "../devices/DeviceAdapter";

export function HelpDrawer() {
  const open = useApp((s) => s.helpOpen);
  const ctx = useApp((s) => s.helpContext);
  const diag = useApp((s) => s.helpDiagnostics);
  const offline = useApp((s) => s.controls.network === "offline");

  const [include, setInclude] = useState(true);
  const [kind, setKind] = useState<string>("");
  const [text, setText] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    if (open) setState((s) => (s === "sending" ? s : "idle"));
  }, [open]);

  const fixes = S.help.fixes[ctx] ?? S.help.fixes.general;
  const label = S.help.contextLabel[ctx] ?? "";

  const send = async () => {
    if (state === "sending") return;
    setState("sending");
    await delay(900);
    if (offline) {
      setState("error");
      return;
    }
    track("help_request_sent", { kind, include });
    setState("sent");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(testConfig.support.channel);
    } catch {
      /* ignore */
    }
    showToast(S.common.copied);
  };

  return (
    <Drawer open={open} onClose={closeHelp} title={S.help.title} returnFocusId="get-help-btn">
      <div className="flex flex-col gap-8">
        <section aria-labelledby="help-fixes">
          <h3 id="help-fixes" className="text-body font-semibold text-ink">
            {S.help.fixesTitle}
            {label && <span className="font-normal text-muted"> · {label}</span>}
          </h3>
          <Accordion
            className="mt-3"
            items={fixes.map((f, i) => ({
              id: String(i),
              title: f.title,
              showWhy: false,
              body: (
                <ol className="list-decimal space-y-1 pl-5">
                  {f.steps.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ol>
              ),
            }))}
          />
        </section>

        <section aria-labelledby="help-contact">
          <h3 id="help-contact" className="text-body font-semibold text-ink">{S.help.contactTitle}</h3>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-ctrl border border-cardline p-3">
            <span className="flex items-center gap-2 text-sec text-ink">
              <Icon name="chat" size={18} className="text-muted" />
              <T s={testConfig.support.channel} />
            </span>
            <Button variant="secondary" icon="copy" onClick={() => void copy()}>
              {S.common.copy}
            </Button>
          </div>
          <div className="mt-3 flex items-start gap-3">
            <label className="flex min-h-[44px] flex-1 cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={include}
                onChange={(e) => setInclude(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[#1D5FD8]"
              />
              <span className="text-sec text-ink">{S.help.include}</span>
            </label>
            <Tooltip text={S.help.includeTip} label={S.help.includeWhat} align="right" />
          </div>
          {diag && (
            <div className="mt-2">
              <StatusPill kind="info">{S.help.diagnostics}</StatusPill>
            </div>
          )}
        </section>

        <section aria-labelledby="help-access">
          <h3 id="help-access" className="text-body font-semibold text-ink">{S.help.accessTitle}</h3>
          {state === "sent" ? (
            <div role="status" className="mt-3 flex items-start gap-3 rounded-ctrl border border-[#BBF7D0] bg-ok-banner p-4 text-sec font-medium text-ok">
              <Icon name="checkCircle" size={20} className="mt-0.5" />
              <p>
                <T s={S.help.sent("[ID]")} />
              </p>
            </div>
          ) : (
            <form
              className="mt-3 flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (kind && text.trim()) void send();
              }}
            >
              <fieldset className="flex flex-col gap-1">
                <legend className="sr-only">{S.help.accessTitle}</legend>
                {S.help.accessOptions.map((o) => (
                  <label key={o} className="flex min-h-[44px] cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="access-kind"
                      value={o}
                      checked={kind === o}
                      onChange={() => setKind(o)}
                      className="h-5 w-5 accent-[#1D5FD8]"
                    />
                    <span className="text-sec text-ink">{o}</span>
                  </label>
                ))}
              </fieldset>
              <div>
                <label htmlFor="access-text" className="block text-sec font-medium text-ink">{S.help.accessLabel}</label>
                <textarea
                  id="access-text"
                  value={text}
                  maxLength={S.help.accessMax}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-ctrl border border-ctrl p-3 text-sec text-ink"
                />
                <p className="mt-1 text-right text-th text-muted" aria-live="off">
                  {text.length}/{S.help.accessMax}
                </p>
              </div>
              {state === "error" && (
                <p role="alert" className="flex items-start gap-2 rounded-ctrl border border-[#F6C9A6] bg-[#FFF4EB] p-3 text-sec text-ink">
                  <Icon name="alert" size={18} className="mt-0.5 text-warn" />
                  {S.help.sendFailed}
                </p>
              )}
              <div>
                <Button
                  variant="primary"
                  loading={state === "sending"}
                  disabled={!kind || !text.trim()}
                  onClick={() => void send()}
                >
                  {state === "sending" ? S.help.sending : S.help.send}
                </Button>
              </div>
            </form>
          )}
        </section>
      </div>
    </Drawer>
  );
}

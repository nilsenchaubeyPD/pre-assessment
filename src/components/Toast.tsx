import { useApp } from "../state/flowMachine";
import { Icon } from "./primitives";

/** Bottom-centre toast, 4s, aria-live polite. */
export function Toast() {
  const toast = useApp((s) => s.toast);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 sm:bottom-8" aria-live="polite" role="status">
      {toast && (
        <div key={toast.id} className="pointer-events-auto flex animate-step-in items-center gap-2 rounded-ctrl bg-tip px-4 py-3 text-sec text-white shadow-lg">
          <Icon name="checkCircle" size={18} />
          {toast.msg}
        </div>
      )}
    </div>
  );
}

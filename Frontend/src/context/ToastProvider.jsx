import { useCallback, useMemo, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { ToastContext } from "./toast";

const ICONS = {
  success: <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />,
  error: <AlertCircle size={18} className="text-rose-500 shrink-0" />,
  info: <Info size={18} className="text-blue-500 shrink-0" />
};

function ToastProvider({ children }) {

  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((type, message) => {
    const id = ++nextId.current;
    setToasts((list) => [...list.slice(-3), { id, type, message }]);
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  const api = useMemo(() => ({
    success: (m) => show("success", m),
    error: (m) => show("error", m),
    info: (m) => show("info", m)
  }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}

      <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-[100] flex flex-col gap-2 items-end pointer-events-none" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto w-full sm:w-96 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3 flex items-start gap-3 animate-slide-up"
          >
            {ICONS[t.type]}
            <p className="text-sm text-gray-700 flex-1">{t.message}</p>
            <button onClick={() => dismiss(t.id)} className="text-gray-400 hover:text-gray-600" aria-label="Dismiss">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;

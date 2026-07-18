import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import {
  VARIANT_STYLES,
  VARIANT_ICON_COLOR,
  type ToastVariant,
} from "./toastStyles";
import { ToastContext } from "./toastContext";

type ToastIcon = typeof Info;

const VARIANT_ICON: Record<ToastVariant, ToastIcon> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove],
  );

  const value = useMemo(
    () => ({
      showToast,
      success: (m: string) => showToast(m, "success"),
      error: (m: string) => showToast(m, "error"),
      info: (m: string) => showToast(m, "info"),
    }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed bottom-20 sm:bottom-6 right-4 z-[100] flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm"
        role="region"
        aria-label="Notifications"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const Icon = VARIANT_ICON[toast.variant];
          return (
            <div
              key={toast.id}
              role="status"
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${VARIANT_STYLES[toast.variant]}`}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${VARIANT_ICON_COLOR[toast.variant]}`}
              />
              <p className="text-sm flex-1">{toast.message}</p>
              <button
                type="button"
                onClick={() => remove(toast.id)}
                aria-label="Dismiss notification"
                className="text-muted hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

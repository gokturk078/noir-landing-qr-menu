import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ToastVariant = 'default' | 'success' | 'error';

export type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
};

type Toast = ToastInput & {
  id: string;
};

const ToastContext = createContext<{ push: (toast: ToastInput) => void } | null>(null);

function variantClasses(variant: ToastVariant) {
  if (variant === 'success') return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100';
  if (variant === 'error') return 'border-rouge/40 bg-rouge/10 text-ivory';
  return 'border-white/10 bg-charcoal/80 text-ivory';
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { t } = useTranslation();

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (input: ToastInput) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const toast: Toast = {
        id,
        title: input.title,
        description: input.description,
        variant: input.variant ?? 'default',
        durationMs: input.durationMs ?? 2600,
      };

      setToasts((prev) => [...prev, toast]);

      window.setTimeout(() => {
        remove(id);
      }, toast.durationMs);
    },
    [remove]
  );

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-relevant="additions text"
        className="fixed z-[60] right-4 top-4 flex flex-col gap-3 w-[min(420px,calc(100vw-2rem))]"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className={`backdrop-blur-md border rounded-lg shadow-2xl shadow-black/30 p-4 ${variantClasses(
                toast.variant ?? 'default'
              )}`}
              role="status"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium tracking-wide">{toast.title}</div>
                  {toast.description ? (
                    <div className="text-sm opacity-80 mt-1 leading-relaxed">{toast.description}</div>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => remove(toast.id)}
                  className="shrink-0 p-1 rounded-md hover:bg-white/10 transition-colors"
                  aria-label={t('close')}
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}

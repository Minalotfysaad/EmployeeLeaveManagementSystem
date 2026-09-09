import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (type: ToastType, message: string, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, title?: string, duration = 4500) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((msg: string, title?: string) => addToast('success', msg, title), [addToast]);
  const error = useCallback((msg: string, title?: string) => addToast('error', msg, title), [addToast]);
  const warning = useCallback((msg: string, title?: string) => addToast('warning', msg, title), [addToast]);
  const info = useCallback((msg: string, title?: string) => addToast('info', msg, title), [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => {
          const config = {
            success: {
              bg: 'bg-white border-emerald-200 text-emerald-950',
              iconBg: 'bg-emerald-100 text-emerald-700',
              barBg: 'bg-emerald-500',
              Icon: CheckCircle2,
            },
            error: {
              bg: 'bg-white border-rose-200 text-rose-950',
              iconBg: 'bg-rose-100 text-rose-700',
              barBg: 'bg-rose-500',
              Icon: AlertCircle,
            },
            warning: {
              bg: 'bg-white border-amber-200 text-amber-950',
              iconBg: 'bg-amber-100 text-amber-700',
              barBg: 'bg-amber-500',
              Icon: AlertTriangle,
            },
            info: {
              bg: 'bg-white border-sky-200 text-sky-950',
              iconBg: 'bg-sky-100 text-sky-700',
              barBg: 'bg-sky-500',
              Icon: Info,
            },
          }[toast.type];

          const { Icon } = config;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-dropdown animate-in fade-in slide-in-from-bottom-2 duration-200 ${config.bg}`}
            >
              <div className={`p-1.5 rounded-lg flex-shrink-0 ${config.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                {toast.title && <h4 className="font-semibold text-sm mb-0.5 text-navy-900">{toast.title}</h4>}
                <p className="text-gray-700 leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

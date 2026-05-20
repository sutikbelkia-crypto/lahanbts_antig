"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "error" | "info";
interface Toast { id: number; msg: string; type: ToastType; }

interface ToastCtx { showToast: (msg: string, type?: ToastType) => void; }
const ToastContext = createContext<ToastCtx>({ showToast: () => {} });

export function useToast() { return useContext(ToastContext); }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((msg: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const bg = { success: "bg-emerald-700", error: "bg-red-700", info: "bg-gray-800" };
  const icon = { success: "✓", error: "✗", info: "ℹ" };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 no-print">
        {toasts.map(t => (
          <div key={t.id} className={`toast-enter ${bg[t.type]} text-white px-4 py-3 rounded-lg shadow-xl text-sm flex items-center gap-2 max-w-xs`}>
            <span className="font-bold">{icon[t.type]}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

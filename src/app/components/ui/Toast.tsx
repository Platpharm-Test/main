import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { Check, X } from 'lucide-react';

interface ToastItem {
  id: number;
  message: string;
}

interface ToastContextValue {
  show: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const show = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 2400);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none w-[calc(100%-2rem)] max-w-[480px]">
        {items.map((t) => (
          <ToastBubble key={t.id} message={t.message} onClose={() => setItems((p) => p.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastBubble({ message, onClose }: { message: string; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);
  return (
    <div
      className={`pointer-events-auto bg-[#212529]/95 backdrop-blur-sm text-white text-sm font-medium px-4 py-3 rounded-lg shadow-lg flex items-center gap-2.5 transition-all duration-200 w-full lg:w-auto ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <Check className="w-4 h-4 text-[#0CA678] shrink-0" strokeWidth={2.5} />
      <span className="flex-1 min-w-0 truncate">{message}</span>
      <button onClick={onClose} className="hidden lg:flex shrink-0 text-white/60 hover:text-white cursor-pointer">
        <X className="w-3.5 h-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

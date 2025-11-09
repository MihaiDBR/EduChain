'use client';

import * as React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((message: string, type: ToastType = 'info', duration: number = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-[99999999999] flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colors = {
    success: {
      bg: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/30',
      icon: 'text-green-500',
      glow: 'shadow-green-500/20',
    },
    error: {
      bg: 'from-red-500/20 to-rose-500/20',
      border: 'border-red-500/30',
      icon: 'text-red-500',
      glow: 'shadow-red-500/20',
    },
    info: {
      bg: 'from-primary/20 to-secondary/20',
      border: 'border-primary/30',
      icon: 'text-primary',
      glow: 'shadow-primary/20',
    },
    warning: {
      bg: 'from-yellow-500/20 to-orange-500/20',
      border: 'border-yellow-500/30',
      icon: 'text-yellow-500',
      glow: 'shadow-yellow-500/20',
    },
  };

  const Icon = icons[toast.type];
  const color = colors[toast.type];

  return (
    <div
      className={cn(
        'pointer-events-auto bg-white rounded-2xl p-4 border-2 animate-slide-in',
        'flex items-start gap-3 shadow-xl transition-all duration-300',
        color.bg,
        color.border,
        color.glow
      )}
    >
      <div className={cn('flex-shrink-0 mt-0.5', color.icon)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

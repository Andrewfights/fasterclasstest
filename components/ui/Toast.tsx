import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: {
    bg: 'bg-[#58CC02]',
    icon: 'text-white',
  },
  error: {
    bg: 'bg-[#FF4B4B]',
    icon: 'text-white',
  },
  warning: {
    bg: 'bg-[#FF9600]',
    icon: 'text-white',
  },
  info: {
    bg: 'bg-[#1CB0F6]',
    icon: 'text-white',
  },
};

const ToastItem: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const Icon = icons[toast.type];
  const colorClasses = colors[toast.type];

  useEffect(() => {
    const duration = toast.duration || 3000;
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      className={`
        ${colorClasses.bg} text-white px-4 py-3 rounded-xl shadow-lg
        flex items-center gap-3 animate-slide-in min-w-[300px] max-w-[400px]
      `}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${colorClasses.icon}`} />
      <span className="flex-1 font-medium">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// Toast hook for easy usage
let toastId = 0;
let listeners: ((toast: Toast) => void)[] = [];

export const toast = {
  show: (type: ToastType, message: string, duration?: number) => {
    const id = `toast-${toastId++}`;
    const newToast: Toast = { id, type, message, duration };
    listeners.forEach((listener) => listener(newToast));
    return id;
  },
  success: (message: string, duration?: number) => toast.show('success', message, duration),
  error: (message: string, duration?: number) => toast.show('error', message, duration),
  warning: (message: string, duration?: number) => toast.show('warning', message, duration),
  info: (message: string, duration?: number) => toast.show('info', message, duration),
  subscribe: (listener: (toast: Toast) => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast]);
    });
    return unsubscribe;
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, dismiss };
};

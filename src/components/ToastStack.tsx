import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";
import type { ToastItem } from "../context/ComparisonContext";

export interface ToastStackProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastStack = memo(function ToastStack({
  toasts,
  onDismiss,
}: ToastStackProps) {
  return (
    <div className="toast-stack" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>{t.message}</span>
            <button
              type="button"
              className="toast__close"
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

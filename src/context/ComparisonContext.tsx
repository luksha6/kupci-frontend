import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastKind = "comparison";

export interface ToastItem {
  id: string;
  message: string;
  kind: ToastKind;
}

interface ComparisonState {
  ids: Set<string>;
  addToComparison: (id: string, label: string) => void;
  removeFromComparison: (id: string) => void;
  isComparing: (id: string) => boolean;
  toasts: ToastItem[];
  dismissToast: (id: string) => void;
}

const ComparisonContext = createContext<ComparisonState | null>(null);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(() => new Set());
  const idsRef = useRef(ids);
  useEffect(() => {
    idsRef.current = ids;
  }, [ids]);

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const pushToast = useCallback(
    (message: string) => {
      const toastId = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((t) => [...t, { id: toastId, message, kind: "comparison" }]);
      window.setTimeout(() => dismissToast(toastId), 4200);
    },
    [dismissToast],
  );

  const addToComparison = useCallback(
    (id: string, label: string) => {
      if (idsRef.current.has(id)) {
        pushToast(`“${label}” is already in comparison`);
        return;
      }
      setIds((prev) => new Set(prev).add(id));
      pushToast(`Item added to comparison: “${label}”`);
    },
    [pushToast],
  );

  const removeFromComparison = useCallback((id: string) => {
    setIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const isComparing = useCallback((id: string) => ids.has(id), [ids]);

  const value = useMemo(
    () => ({
      ids,
      addToComparison,
      removeFromComparison,
      isComparing,
      toasts,
      dismissToast,
    }),
    [
      ids,
      addToComparison,
      removeFromComparison,
      isComparing,
      toasts,
      dismissToast,
    ],
  );

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const ctx = useContext(ComparisonContext);
  if (!ctx) {
    throw new Error("useComparison must be used within ComparisonProvider");
  }
  return ctx;
}

import { createContext, useContext } from "react";

export const ToastContext = createContext(null);

// Usage: const toast = useToast(); toast.success("Saved"); toast.error("Failed");
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};

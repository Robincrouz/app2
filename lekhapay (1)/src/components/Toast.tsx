import React, { useEffect } from "react";
import { motion } from "motion/react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={cn(
        "fixed top-6 right-6 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm border backdrop-blur-md",
        type === 'success' ? "bg-emerald-500/90 text-white border-emerald-400" : "bg-rose-500/90 text-white border-rose-400"
      )}
    >
      {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <p className="font-bold text-sm">{message}</p>
      <button onClick={onClose} className="ml-auto p-1 hover:bg-white/20 rounded-lg transition-colors">
        <X size={16} />
      </button>
    </motion.div>
  );
}

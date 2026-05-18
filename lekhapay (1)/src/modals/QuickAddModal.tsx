import React, { useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Zap, Mic, Camera, RefreshCw, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  quickInput: string;
  setQuickInput: (val: string) => void;
  startVoiceInput: () => void;
  handleAiProcess: () => void;
  handleReceiptScan: (imageBase64: string) => void;
  isListening: boolean;
  isProcessing: boolean;
}

export function QuickAddModal({
  isOpen,
  onClose,
  quickInput,
  setQuickInput,
  startVoiceInput,
  handleAiProcess,
  handleReceiptScan,
  isListening,
  isProcessing
}: QuickAddModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result?.toString().split(",")[1];
      if (base64) {
        handleReceiptScan(base64);
      }
    };
    reader.readAsDataURL(file);
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, y: 100 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 100 }} 
            className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 font-sans border-t border-slate-100"
          >
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 leading-none">
                 <Zap className="text-amber-500 fill-amber-500" size={20} />
                 কুইক অ্যাড
               </h2>
               <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-300"><X size={20}/></button>
            </div>

            <div className="space-y-6">
              <div className="flex gap-2">
                <div className="flex-1">
                  <input 
                    autoFocus
                    type="text" 
                    value={quickInput}
                    onChange={(e) => setQuickInput(e.target.value)}
                    className="w-full px-5 py-5 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-[#0d6e6e] outline-none transition-all placeholder:text-slate-300 placeholder:font-medium text-lg leading-relaxed"
                    placeholder="লিখুন: 'ডিম বাবদ ১০০ টাকা' বা বিল স্ক্যান করুন..."
                  />
                </div>
                <div className="flex flex-col gap-2 w-16">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="flex-1 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all shadow-sm"
                    title="বিলের ছবি তুলুন (Scan Receipt)"
                  >
                    <Camera size={20} className={isProcessing ? "animate-pulse" : ""} />
                  </button>
                  <button 
                    onClick={startVoiceInput}
                    disabled={isProcessing}
                    className={cn(
                      "flex-1 rounded-xl flex items-center justify-center transition-all shadow-sm",
                      isListening ? "bg-rose-500 text-white animate-pulse" : "bg-teal-50 text-teal-600 hover:bg-teal-100"
                    )}
                    title="ভয়েস ইনপুট (Voice Input)"
                  >
                    <Mic size={20} />
                  </button>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={onFileChange} 
                  accept="image/*" 
                  capture="environment" 
                  className="hidden" 
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { icon: "🍴", label: "খাবার" },
                  { icon: "🚌", label: "যাতায়াত" },
                  { icon: "📄", label: "বিল" },
                  { icon: "🛍️", label: "কেনাকাটা" },
                ].map(chip => (
                  <button 
                    key={chip.label}
                    onClick={() => setQuickInput(chip.label)}
                    className="flex items-center gap-2 px-5 py-3 bg-[#f8fafc] border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    <span>{chip.icon}</span>
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={onClose} className="flex-1 py-4 bg-white border border-[#0d6e6e] text-[#0d6e6e] rounded-xl font-bold transition-all">বাতিল</button>
              <button 
                onClick={handleAiProcess}
                disabled={isProcessing || !quickInput.trim()}
                className="flex-[2] py-4 bg-[#0d6e6e] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20 hover:bg-[#0a5a5a] disabled:opacity-50 transition-all"
              >
                {isProcessing ? <RefreshCw size={18} className="animate-spin" /> : <CheckCircle2 size={18} />} সেভ
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

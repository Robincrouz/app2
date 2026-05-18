import React, { useState } from "react";
import { MessageSquare, RefreshCw, Smartphone, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface SmsSyncScreenProps {
  parseSms: (text: string) => Promise<any>;
  onSaveTransaction: (data: any) => void;
  setToast: (toast: { message: string; type: "success" | "error" }) => void;
}

export function SmsSyncScreen({ parseSms, onSaveTransaction, setToast }: SmsSyncScreenProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [smsText, setSmsText] = useState("");
  const [showPaste, setShowPaste] = useState(false);

  const handleSync = async () => {
    if (!smsText.trim()) {
      setShowPaste(true);
      return;
    }
    
    setIsSyncing(true);
    try {
      const parsed = await parseSms(smsText);
      if (parsed && parsed.amount) {
        onSaveTransaction(parsed);
        setToast({ message: "এসএমএস থেকে লেনদেন আপডেট হয়েছে!", type: "success" });
        setSmsText("");
        setShowPaste(false);
      } else {
        setToast({ message: "এসএমএস থেকে কিছু বোঝা যায়নি", type: "error" });
      }
    } catch (e: any) {
      if (e.message.includes("Rate limit")) {
        setToast({ message: "দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন", type: "error" });
      } else {
        setToast({ message: "অটো সিঙ্ক ফেইল করেছে", type: "error" });
      }
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 pb-24 space-y-6 max-w-4xl mx-auto w-full font-sans">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
           <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center shrink-0">
             <MessageSquare size={24} />
           </div>
           <div>
             <h2 className="text-xl font-black text-slate-900">SMS অটো সিঙ্ক</h2>
             <p className="text-xs font-bold text-slate-400">ব্যাংক ও বিকাশ আপডেট</p>
           </div>
         </div>
         <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full shadow-lg shadow-orange-500/20">
            PRO
         </span>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="relative z-10 space-y-6">
            <h3 className="text-2xl font-black leading-tight">টাইপ করার<br/>ঝামেলা শেষ</h3>
            <p className="text-sm text-sky-100/70 font-medium leading-relaxed">
              আপনার ফোনে আসা যেকোনো ব্যাংক বা বিকাশের SMS থেকে AI নিজে থেকেই খরচের হিসাব আপডেট করে ফেলবে।
            </p>
            <div className="space-y-3">
               <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400"><Smartphone size={14} /></div>
                  <span className="text-sm font-bold text-slate-200">অটোমেটিক রিডিং</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><ShieldCheck size={14} /></div>
                  <span className="text-sm font-bold text-slate-200">নিরাপদ এবং প্রাইভেট</span>
               </div>
            </div>

            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className="w-full py-4 mt-4 bg-white text-slate-900 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-all transition-transform active:scale-95 disabled:opacity-80"
            >
              {isSyncing ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
              {isSyncing ? "সিঙ্ক হচ্ছে..." : "এখনই সিঙ্ক করুন"}
            </button>
         </div>
      </div>

      <AnimatePresence>
        {showPaste && (
           <motion.div 
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: "auto" }}
             exit={{ opacity: 0, height: 0 }}
             className="bg-white rounded-3xl p-6 border-2 border-slate-100 space-y-4 shadow-sm"
           >
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">ওয়েবের জন্য ম্যানুয়াল ইনপুট</h4>
              <p className="text-xs font-bold text-slate-400">যেহেতু এটি একটি ওয়েব অ্যাপ, আপনার ব্যাংক বা বিকাশের এসএমএসটি নিচে পেস্ট করুন।</p>
              <textarea 
                rows={4}
                value={smsText}
                onChange={(e) => setSmsText(e.target.value)}
                placeholder="এখনে SMS পেস্ট করুন..."
                className="w-full bg-slate-50 border-2 border-transparent focus:border-sky-500/20 rounded-xl p-4 font-medium text-slate-900 outline-none"
              />
              <div className="flex gap-2">
                 <button onClick={() => setShowPaste(false)} className="flex-1 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-bold transition-colors">
                   বাতিল
                 </button>
                 <button 
                   onClick={handleSync}
                   disabled={isSyncing || !smsText.trim()}
                   className="flex-1 py-3 bg-sky-600 text-white rounded-xl font-black disabled:opacity-50 hover:bg-sky-700 transition-colors flex items-center justify-center gap-2"
                  >
                   {isSyncing ? <RefreshCw className="animate-spin" size={16} /> : "সাবমিট"}
                 </button>
              </div>
           </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

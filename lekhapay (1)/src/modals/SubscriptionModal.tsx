import React, { useState } from "react";
import { X, Save, Trash2, Calendar, CreditCard, Tag } from "lucide-react";
import { motion } from "motion/react";
import { Subscription, CATEGORIES } from "../types";
import { cn } from "../lib/utils";
import { CategoryIcon } from "../components/CategoryIcon";

interface SubscriptionModalProps {
  onClose: () => void;
  onSave: (s: Partial<Subscription>) => void;
  onDelete?: () => void;
  editingSub: Subscription | null;
}

export function SubscriptionModal({ onClose, onSave, onDelete, editingSub }: SubscriptionModalProps) {
  const [formData, setFormData] = useState<Partial<Subscription>>(
    editingSub || {
      title: "",
      amount: 0,
      category: "bills",
      nextBillingDate: new Date().toISOString().split("T")[0]
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: "100%" }} 
        animate={{ y: 0 }} 
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 pb-32">
          <div className="flex items-center justify-between mb-8">
            <div>
               <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
                 {editingSub ? "সাবস্ক্রিপশন এডিট" : "নতুন সাবস্ক্রিপশন"}
               </h2>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-1">
                 <CreditCard size={12} /> রিকারিং খরচ সেট করুন
               </p>
            </div>
            <button onClick={onClose} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
              <X size={20} />
            </button>
          </div>

          <form id="sub-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">বিবরণ (Title)</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  autoFocus
                  type="text" 
                  required
                  placeholder="যেমন: Netflix, WiFi Bill..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-bold"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">পরিমাণ (Amount)</label>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                   <input 
                     type="number" 
                     required
                     className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-black tabular-nums"
                     value={formData.amount || ""}
                     onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                   />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">বিলিং ডেট</label>
                <div className="relative">
                   <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                     type="date" 
                     required
                     className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-bold text-sm"
                     value={formData.nextBillingDate}
                     onChange={e => setFormData({ ...formData, nextBillingDate: e.target.value })}
                   />
                </div>
              </div>
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">ক্যাটেগরি</label>
               <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {Object.values(CATEGORIES).slice(0, 8).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.id })}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 sm:p-4 rounded-[1.25rem] border transition-all duration-300",
                        formData.category === cat.id 
                          ? "bg-slate-900 border-slate-900 text-white shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] scale-[1.02]" 
                          : "bg-slate-50 border-slate-100/60 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <div className={cn("p-2 rounded-xl border", formData.category === cat.id ? "bg-white/10 border-white/20" : "bg-white border-slate-100 shadow-sm")}>
                        <CategoryIcon name={cat.icon} size={18} strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none mt-1">{cat.label}</span>
                    </button>
                  ))}
               </div>
            </div>
          </form>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-50 flex items-center gap-3">
          {editingSub && (
            <button 
              type="button"
              onClick={onDelete}
              className="p-5 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          )}
          <button 
            form="sub-form"
            type="submit"
            className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-sm shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
          >
            <Save size={18} /> {editingSub ? "আপডেট করুন" : "সাবস্ক্রিপশন যোগ করুন"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Trash2, FileText } from "lucide-react";
import { Budget, CATEGORIES } from "../types";

interface BudgetModalProps {
  onClose: () => void;
  onSave: (b: Partial<Budget>) => void;
  onDelete?: () => void;
  editingBudget: Budget | null;
}

export function BudgetModal({ onClose, onSave, onDelete, editingBudget }: BudgetModalProps) {
  const [b, setB] = useState<Partial<Budget>>(editingBudget || {
    category: "food",
    limit: 0,
    alert: 80
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 100 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 100 }} 
        className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 font-sans border-t border-slate-100"
      >
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-lg font-bold text-slate-900 leading-none">{editingBudget ? "বাজেট সম্পাদনা" : "নতুন বাজেট"}</h2>
           <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-300"><X size={20}/></button>
        </div>

        <div className="space-y-6">
          <div>
             <label className="block text-sm font-bold text-slate-600 mb-2">ক্যাটেগরি</label>
             <select 
               value={b.category}
               onChange={(e) => setB({ ...b, category: e.target.value })}
               className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 outline-none focus:border-teal-500"
             >
                {Object.entries(CATEGORIES).map(([key, data]) => (
                  <option key={key} value={key}>{data.label}</option>
                ))}
             </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">মাসিক লিমিট *</label>
            <div className="relative">
              <input 
                type="text" 
                inputMode="decimal"
                value={b.limit || ""}
                onChange={(e) => setB({ ...b, limit: e.target.value as any })}
                className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl font-bold text-lg focus:border-teal-500 focus:ring-0 outline-none transition-all"
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-10">
          {editingBudget && onDelete && (
            <button 
              onClick={onDelete}
              className="px-4 py-4 bg-rose-50 text-rose-600 rounded-xl font-bold transition-all"
            >
              <Trash2 size={20} />
            </button>
          )}
          <button onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold transition-all">বাতিল</button>
          <button 
            disabled={!b.limit}
            onClick={() => onSave(b)} 
            className="flex-[2] py-4 bg-[#0d6e6e] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20 disabled:opacity-50 transition-all"
          >
            <FileText size={18} /> সংরক্ষণ করুন
          </button>
        </div>
      </motion.div>
    </div>
  );
}

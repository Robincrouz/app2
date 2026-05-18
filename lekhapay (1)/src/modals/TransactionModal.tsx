import React, { useState } from "react";
import { motion } from "motion/react";
import { X, ArrowDownLeft, ArrowUpRight, RefreshCw, FileText } from "lucide-react";
import { Transaction, CATEGORIES } from "../types";
import { cn } from "../lib/utils";
import { CategoryIcon } from "../components/CategoryIcon";

interface TransactionModalProps {
  onClose: () => void;
  onSave: (tx: Partial<Transaction>) => void;
  onDelete: () => void;
  editingTx: Transaction | null;
}

export function TransactionModal({ onClose, onSave, onDelete, editingTx }: TransactionModalProps) {
  const [tx, setTx] = useState<Partial<Transaction>>(editingTx || {
    type: "expense",
    amount: 0,
    category: "food",
    note: "",
    date: new Date().toISOString().split('T')[0]
  });

  const handleAmountChange = (val: string) => {
    // Allow Bangla digits, they will be normalized in useOperations
    // But for the input type="number", we might need to handle it carefully.
    // Actually, keeping it as type="text" allows easier Bangla digit entry on mobile.
    setTx({ ...tx, amount: val as any });
  };

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
           <h2 className="text-lg font-bold text-slate-900 leading-none">{editingTx ? "লেনদেন এডিট" : "নতুন লেনদেন"}</h2>
           <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-300"><X size={20}/></button>
        </div>

        <div className="space-y-6">
          {/* Type Selector */}
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-3">ধরন *</label>
            <div className="grid grid-cols-3 gap-3">
               {[
                 { id: "income", label: "আয়", icon: ArrowDownLeft, color: "text-emerald-500" },
                 { id: "expense", label: "ব্যয়", icon: ArrowUpRight, color: "text-rose-500" },
                 { id: "transfer", label: "ট্রান্সফার", icon: RefreshCw, color: "text-amber-500" }
               ].map(type => {
                 const Icon = type.icon;
                 return (
                   <button 
                    key={type.id}
                    onClick={() => setTx({ ...tx, type: type.id as any })}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                      tx.type === type.id 
                        ? `border-[#0d6e6e] bg-white` 
                        : "border-slate-100 bg-white"
                    )}
                   >
                     <Icon size={24} className={type.color} />
                     <span className={cn("text-xs font-bold", tx.type === type.id ? "text-teal-700" : "text-slate-400")}>
                        {type.label}
                     </span>
                   </button>
                 );
               })}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">পরিমাণ *</label>
            <div className="relative">
              <input 
                type="text" 
                inputMode="decimal"
                value={tx.amount || ""}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl font-bold text-lg focus:border-teal-500 focus:ring-0 outline-none transition-all"
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
            </div>
          </div>

          <div className="space-y-3">
             <label className="block text-sm font-bold text-slate-600">ক্যাটেগরি</label>
             <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-48 overflow-y-auto p-1 scrollbar-hide">
                {Object.entries(CATEGORIES).map(([key, data]) => {
                  const isSelected = tx.category === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setTx({ ...tx, category: key })}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all gap-2",
                        isSelected 
                          ? "border-[var(--color-teal-500)] bg-[var(--color-teal-50)] text-[var(--color-teal-700)] shadow-sm scale-105" 
                          : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                      )}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: data.color + "20", color: data.color }}>
                         <CategoryIcon name={data.icon} size={16} strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-bold leading-tight text-center">{data.label}</span>
                    </button>
                  );
                })}
             </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">তারিখ</label>
            <input 
              type="date" 
              value={tx.date}
              onChange={(e) => setTx({ ...tx, date: e.target.value })}
              className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl font-bold focus:border-teal-500 outline-none transition-all text-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">বিবরণ</label>
            <input 
              type="text" 
              value={tx.note}
              onChange={(e) => setTx({ ...tx, note: e.target.value })}
              className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-teal-500"
              placeholder="বিবরণ লিখুন..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-10">
          {editingTx && (
            <button 
              onClick={onDelete} 
              className="flex-1 py-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl font-bold transition-all"
            >
              মুছুন
            </button>
          )}
          <button onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold transition-all">বাতিল</button>
          <button 
            disabled={!tx.amount || !tx.note}
            onClick={() => onSave(tx)} 
            className="flex-[2] py-4 bg-[#0d6e6e] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20 disabled:opacity-50 transition-all"
          >
            <FileText size={18} /> সংরক্ষণ করুন
          </button>
        </div>
      </motion.div>
    </div>
  );
}

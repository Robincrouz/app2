import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Trash2, CheckCircle2 } from "lucide-react";
import { Invoice } from "../types";
import { cn } from "../lib/utils";

interface InvoiceModalProps {
  onClose: () => void;
  onSave: (inv: Partial<Invoice>) => void;
  onDelete?: () => void;
  editingInvoice: Invoice | null;
}

export function InvoiceModal({ onClose, onSave, onDelete, editingInvoice }: InvoiceModalProps) {
  const [inv, setInv] = useState<Partial<Invoice>>(editingInvoice || {
    clientName: "",
    amount: 0,
    status: "pending",
    dueDate: new Date().toISOString().split('T')[0]
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
           <h2 className="text-lg font-bold text-slate-900 leading-none">{editingInvoice ? "ইনভয়েস সম্পাদনা" : "নতুন ইনভয়েস"}</h2>
           <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-300"><X size={20}/></button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">ক্লায়েন্টের নাম *</label>
            <input 
              type="text" 
              value={inv.clientName}
              onChange={(e) => setInv({ ...inv, clientName: e.target.value })}
              className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-teal-500"
              placeholder="নাম লিখুন..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">পরিমাণ *</label>
            <div className="relative">
              <input 
                type="text" 
                inputMode="decimal"
                value={inv.amount || ""}
                onChange={(e) => setInv({ ...inv, amount: e.target.value as any })}
                className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl font-bold text-lg focus:border-teal-500 outline-none"
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">ডেডলাইন</label>
              <input 
                type="date" 
                value={inv.dueDate}
                onChange={(e) => setInv({ ...inv, dueDate: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">স্ট্যাটাস</label>
              <select 
                value={inv.status}
                onChange={(e) => setInv({ ...inv, status: e.target.value as any })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 outline-none focus:border-teal-500"
              >
                <option value="pending">বকেয়া</option>
                <option value="paid">পরিশোধিত</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-10">
          {editingInvoice && onDelete && (
            <button 
              onClick={onDelete}
              className="px-4 py-4 bg-rose-50 text-rose-600 rounded-xl font-bold transition-all"
            >
              <Trash2 size={20} />
            </button>
          )}
          <button onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold transition-all">বাতিল</button>
          <button 
            disabled={!inv.amount || !inv.clientName}
            onClick={() => onSave(inv)} 
            className="flex-[2] py-4 bg-[#0d6e6e] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20 disabled:opacity-50 transition-all"
          >
            <CheckCircle2 size={18} /> সংরক্ষণ করুন
          </button>
        </div>
      </motion.div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { X, Calendar, User, AlignLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { LedgerEntry } from "../types";
import { cn } from "../lib/utils";

interface LedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (l: Partial<LedgerEntry>, edit: LedgerEntry | null) => Promise<boolean>;
  editingLedger: LedgerEntry | null;
}

export function LedgerModal({ isOpen, onClose, onSave, editingLedger }: LedgerModalProps) {
  const [formData, setFormData] = useState<Partial<LedgerEntry>>({
    contactName: "",
    amount: 0,
    type: "receivable",
    status: "pending",
    date: new Date().toISOString().split("T")[0],
    note: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingLedger) {
      setFormData({
        ...editingLedger,
        date: editingLedger.date.split("T")[0]
      });
    } else {
      setFormData({
        contactName: "",
        amount: 0,
        type: "receivable",
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        note: ""
      });
    }
  }, [editingLedger, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await onSave(formData, editingLedger);
    setIsSubmitting(false);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {editingLedger ? "হিসাব আপডেট করুন" : "বাকির খাতায় যোগ করুন"}
            </h2>
            <p className="text-xs font-bold text-slate-400">পাওনা-দেনার হিসাব রাখুন নির্ভুলভাবে</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'receivable' })}
              className={cn(
                "py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                formData.type === 'receivable' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              পাবো (Receivable)
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'payable' })}
              className={cn(
                "py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                formData.type === 'payable' ? "bg-white text-rose-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              দেবো (Payable)
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">নাম/কন্টাক্ট</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  placeholder="উদাঃ রহিম ভাই"
                  value={formData.contactName}
                  onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">টাকার পরিমাণ</label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={formData.amount || ""}
                  onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-2xl outline-none transition-all font-black text-slate-900"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">তারিখ</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">স্ট্যাটাস</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'pending' })}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all",
                    formData.status === 'pending' 
                      ? "bg-amber-50 border-amber-500 text-amber-700 font-bold" 
                      : "bg-slate-50 border-transparent text-slate-400"
                  )}
                >
                  <AlertCircle size={16} />
                  <span className="text-xs uppercase tracking-widest font-black">বাকি</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'settled' })}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all",
                    formData.status === 'settled' 
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-bold" 
                      : "bg-slate-50 border-transparent text-slate-400"
                  )}
                >
                  <CheckCircle2 size={16} />
                  <span className="text-xs uppercase tracking-widest font-black">পরিশোধিত</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">নোট (ঐচ্ছিক)</label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-4 text-slate-400" size={18} />
                <textarea
                  placeholder="অতিরিক্ত তথ্য..."
                  value={formData.note}
                  onChange={e => setFormData({ ...formData, note: e.target.value })}
                  rows={3}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900 resize-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] shadow-xl shadow-slate-900/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "সেভ হচ্ছে..." : (editingLedger ? "আপডেট করুন" : "হিসাবে যোগ করুন")}
          </button>
        </form>
      </div>
    </div>
  );
}

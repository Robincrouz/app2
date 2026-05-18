import React, { useState } from "react";
import { TrendingUp, Plus, DollarSign, Activity, PieChart, Briefcase, Coins, Home, Building, MoreHorizontal, ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn, formatCurrency } from "../lib/utils";
import { Investment } from "../types";

interface InvestmentsScreenProps {
  investments: Investment[];
  currencySymbol: string;
  onSave: (data: any) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export function InvestmentsScreen({ investments, currencySymbol, onSave, onDelete }: InvestmentsScreenProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "stock",
    amountInvested: "",
    currentValue: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amountInvested || !formData.currentValue) return;
    setIsSaving(true);
    const success = await onSave({
      name: formData.name,
      type: formData.type,
      amountInvested: Number(formData.amountInvested),
      currentValue: Number(formData.currentValue),
      date: formData.date
    });
    if (success) {
      setShowAddForm(false);
      setFormData({ name: "", type: "stock", amountInvested: "", currentValue: "", date: new Date().toISOString().split('T')[0] });
    }
    setIsSaving(false);
  };

  const totalInvested = investments.reduce((sum, current) => sum + current.amountInvested, 0);
  const totalValue = investments.reduce((sum, current) => sum + current.currentValue, 0);
  const overallReturn = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0;
  const isPositiveReturn = overallReturn >= 0;

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'stock': return <TrendingUp size={20} />;
      case 'crypto': return <Coins size={20} />;
      case 'bond': return <Briefcase size={20} />;
      case 'gold': return <Activity size={20} />;
      default: return <Building size={20} />;
    }
  };

  const getTypeName = (type: string) => {
    switch(type) {
      case 'stock': return 'স্টক / শেয়ার';
      case 'crypto': return 'ক্রিপ্টোকারেন্সি';
      case 'bond': return 'বন্ড / ফিক্সড';
      case 'gold': return 'স্বর্ণ';
      default: return 'অন্যান্য';
    }
  };

  return (
    <div className="p-4 sm:p-6 pb-24 space-y-6 max-w-4xl mx-auto w-full font-sans">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
           <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center shrink-0">
             <TrendingUp size={24} />
           </div>
           <div>
             <h2 className="text-xl font-black text-slate-900">পোর্টফোলিও</h2>
             <p className="text-xs font-bold text-slate-400">স্টক, বন্ড ও ক্রিপ্টো</p>
           </div>
         </div>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="relative z-10 space-y-6">
            <div>
              <p className="text-sm font-bold text-violet-200/70 uppercase tracking-widest mb-1">মোট মার্কেট ভ্যালু</p>
              <h3 className="text-4xl font-black">{formatCurrency(totalValue, currencySymbol)}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm font-bold text-slate-400">বিনিয়োগ: {formatCurrency(totalInvested, currencySymbol)}</span>
                <span className={cn(
                  "flex items-center text-xs font-black px-2 py-0.5 rounded",
                  isPositiveReturn ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                )}>
                  {isPositiveReturn ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                  {Math.abs(overallReturn).toFixed(2)}%
                </span>
              </div>
            </div>

            <button 
              onClick={() => setShowAddForm(true)}
              className="w-full py-4 mt-4 bg-violet-500 hover:bg-violet-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all transition-transform active:scale-95"
            >
              <Plus size={18} />
              নতুন বিনিয়োগ যোগ করুন
            </button>
         </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-800">বিনিয়োগ এন্ট্রি</h3>
                <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">নাম / টিকিট</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="উদাঃ GP, সঞ্চয়পত্র" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">ধরণ</label>
                  <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all">
                    <option value="stock">স্টক / শেয়ার</option>
                    <option value="crypto">ক্রিপ্টো</option>
                    <option value="bond">বন্ড / ফিক্সড ডিপোজিট</option>
                    <option value="gold">স্বর্ণ</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">তারিখ</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">মূল বিনিয়োগ</label>
                  <input required type="number" step="any" value={formData.amountInvested} onChange={e => setFormData({ ...formData, amountInvested: e.target.value })} placeholder="0.00" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-black text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">বর্তমান ভ্যালু</label>
                  <input required type="number" step="any" value={formData.currentValue} onChange={e => setFormData({ ...formData, currentValue: e.target.value })} placeholder="0.00" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-black text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all text-violet-600" />
                </div>
              </div>

              <button type="submit" disabled={isSaving} className="w-full h-12 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all">
                {isSaving ? "সেভ হচ্ছে..." : "সেভ করুন"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {investments.length === 0 && !showAddForm ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 border-dashed">
             <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-3">
               <Briefcase size={32} />
             </div>
             <p className="text-slate-500 font-medium">কোনো বিনিয়োগ বা এসেট যোগ করা নেই</p>
          </div>
        ) : (
          investments.map(inv => {
            const ret = inv.amountInvested > 0 ? ((inv.currentValue - inv.amountInvested) / inv.amountInvested) * 100 : 0;
            const pos = ret >= 0;
            return (
              <div key={inv.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex flex-col items-center justify-center shrink-0">
                  {getTypeIcon(inv.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 truncate">{inv.name}</h4>
                  <p className="text-[11px] font-bold text-slate-400">{getTypeName(inv.type)}</p>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900">{formatCurrency(inv.currentValue, currencySymbol)}</div>
                  <div className={cn("text-[11px] font-bold flex items-center justify-end gap-0.5", pos ? "text-emerald-500" : "text-rose-500")}>
                    {pos ? "+" : ""}{ret.toFixed(2)}%
                  </div>
                </div>
                <button onClick={() => onDelete(inv.id)} className="h-8 w-8 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg flex items-center justify-center transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

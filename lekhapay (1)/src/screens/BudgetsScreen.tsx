import React from "react";
import { motion } from "motion/react";
import { Plus, PieChart } from "lucide-react";
import { Budget, CATEGORIES } from "../types";
import { CategoryIcon } from "../components/CategoryIcon";
import { BudgetProgress } from "../components/BudgetProgress";

interface BudgetsScreenProps {
  budgets: Budget[];
  onAddBudget: () => void;
  onEditBudget: (b: Budget) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 16, filter: 'blur(5px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export function BudgetsScreen({ budgets, onAddBudget, onEditBudget }: BudgetsScreenProps) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 font-sans">
       <motion.div variants={item} className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">বাজেট</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">টাকা জমানোর সেরা উপায়</p>
          </div>
          <button onClick={onAddBudget} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] active:scale-95 transition-all hover:bg-slate-800">
            <Plus size={16} strokeWidth={2.5} /> নতুন বাজেট
          </button>
       </motion.div>
       
       <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map(b => {
            const cat = CATEGORIES[b.category] || CATEGORIES.other;
            return (
              <motion.div key={b.id} variants={item} onClick={() => onEditBudget(b)} className="bg-white rounded-[1.5rem] p-4 border border-slate-100/60 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex flex-col gap-3">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner" style={{ backgroundColor: cat.color + "15", color: cat.color }}>
                          <CategoryIcon name={cat.icon} size={20} strokeWidth={2.5} />
                       </div>
                       <div>
                          <h3 className="text-sm font-black text-slate-900 leading-tight">{cat.label}</h3>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">মাসিক বাজেট</p>
                       </div>
                    </div>
                    <div className="text-right flex items-baseline gap-1 justify-end">
                       <span className="text-sm font-black tabular-nums tracking-tighter text-slate-900">{b.spent.toLocaleString('bn-BD')}</span>
                       <span className="text-[10px] font-bold tabular-nums text-slate-400">/ {b.limit.toLocaleString('bn-BD')}</span>
                    </div>
                 </div>
                 
                 <BudgetProgress spent={b.spent} limit={b.limit} color={CATEGORIES[b.category]?.color || "#64748b"} />
              </motion.div>
            );
          })}
       </motion.div>

       {budgets.length === 0 && (
         <motion.div variants={item} className="py-32 text-center bg-white rounded-[2rem] border border-slate-100/60 shadow-[0_4px_40px_-5px_rgba(0,0,0,0.02)]">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner text-slate-300"><PieChart size={40} strokeWidth={1.5} /></div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">বাজেট নেই</h3>
            <p className="text-xs font-bold text-slate-400 max-w-[240px] mx-auto leading-relaxed uppercase tracking-wide">এখন পর্যন্ত কোনো বাজেট তৈরি করেননি। আজই শুরু করুন!</p>
         </motion.div>
       )}
    </motion.div>
  );
}

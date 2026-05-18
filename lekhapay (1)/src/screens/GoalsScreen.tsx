import React from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { Goal } from "../types";
import { formatCurrency, formatDate } from "../lib/utils";

interface GoalsScreenProps {
  goals: Goal[];
  onAddGoal: () => void;
  onEditGoal: (g: Goal) => void;
  currencySymbol: string;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 }
};

export function GoalsScreen({ goals, onAddGoal, onEditGoal, currencySymbol }: GoalsScreenProps) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 font-sans">
       <motion.div variants={item} className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800 leading-none">লক্ষ্য</h2>
            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">স্বপ্ন পূরণের পথে</p>
          </div>
          <button onClick={onAddGoal} className="flex items-center gap-2 px-4 py-2 bg-[#0d6e6e] text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">
            <Plus size={16} /> নতুন লক্ষ্য
          </button>
       </motion.div>
       
       <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {goals.map(goal => (
           <div key={goal.id} onClick={() => onEditGoal(goal)} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm group flex flex-col gap-6 cursor-pointer hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                 <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🎯</div>
                 <div className="text-right">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">ডেডলাইন</span>
                    <span className="text-[10px] font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-full">{formatDate(goal.deadline)}</span>
                 </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 tracking-tight">{goal.title}</h3>
                <div className="flex justify-between items-end mb-4">
                   <span className="text-2xl font-black text-emerald-600 tabular-nums">{formatCurrency(goal.currentAmount, currencySymbol)}</span>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">টার্গেট: {formatCurrency(goal.targetAmount, currencySymbol)}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-1">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0}%` }} transition={{ duration: 1.5, ease: "circOut" }} className="h-full bg-emerald-500 rounded-full relative shadow-sm"><div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" /></motion.div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                   <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{goal.targetAmount > 0 ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0}% সম্পন্ন</span>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">বাকি: {formatCurrency(goal.targetAmount - goal.currentAmount, currencySymbol)}</span>
                </div>
              </div>
           </div>
         ))}
       </motion.div>
    </motion.div>
  );
}

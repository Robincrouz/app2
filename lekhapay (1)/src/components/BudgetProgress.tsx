import React from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface BudgetProgressProps {
  spent: number;
  limit: number;
  color: string;
}

export function BudgetProgress({ spent, limit, color }: BudgetProgressProps) {
  const rawPercentage = limit > 0 ? (spent / limit) * 100 : 0;
  const percentage = isNaN(rawPercentage) ? 0 : Math.min(rawPercentage, 100);
  const isOver = spent > limit;

  return (
    <div className="space-y-1.5">
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "circOut" }}
          className={cn(
            "h-full rounded-full transition-colors",
            isOver ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" : ""
          )}
          style={{ backgroundColor: !isOver ? color : undefined }}
        />
      </div>
      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
         <span className={cn(isOver ? "text-rose-600" : "text-slate-400")}>
           {isOver ? "লিমিট অতিক্রম!" : `${Math.round(percentage)}% ব্যবহৃত`}
         </span>
         <span className="text-slate-400">বাকি: {(limit - spent).toLocaleString('bn-BD')} ৳</span>
      </div>
    </div>
  );
}

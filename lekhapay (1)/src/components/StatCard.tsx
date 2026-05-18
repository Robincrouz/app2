import React from "react";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface StatCardProps {
  label: string;
  amount: number | string;
  icon: LucideIcon;
  color: "emerald" | "rose" | "teal" | "slate" | "amber";
  isPercentage?: boolean;
  currencySymbol?: string;
}

export function StatCard({ label, amount, icon: Icon, color, isPercentage = false, currencySymbol = "৳" }: StatCardProps) {
  const configs = {
    emerald: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
    rose: "bg-rose-500/10 text-rose-600 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
    teal: "bg-teal-500/10 text-teal-700 border border-teal-500/20 shadow-[0_0_15px_rgba(13,110,110,0.1)]",
    slate: "bg-slate-500/10 text-slate-600 border border-slate-500/20 shadow-[0_0_15px_rgba(100,116,139,0.1)]",
    amber: "bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
  };

  return (
    <div className="p-5 sm:p-6 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_30px_-5px_rgba(0,0,0,0.03)] relative overflow-hidden group">
      <div className="absolute -top-6 -right-6 text-slate-50/50 group-hover:text-slate-100 transition-colors duration-500 rotate-12">
        <Icon size={120} strokeWidth={1} />
      </div>
      
      <div className="relative z-10 flex flex-col h-full justify-between gap-6">
        <div className={cn("inline-flex w-12 h-12 rounded-[1.25rem] items-center justify-center backdrop-blur-md", configs[color])}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{label}</p>
          <h3 className="text-2xl sm:text-3xl font-black tabular-nums tracking-tighter text-slate-900 leading-none font-sans drop-shadow-sm">
            {isPercentage 
              ? `${(typeof amount === 'number' && !isNaN(amount)) ? amount : (amount ?? 0)}%` 
              : ((typeof amount === 'number' && !isNaN(amount)) ? amount.toLocaleString('bn-BD', { notation: 'compact' }) : (amount ?? '০'))}
            {!isPercentage && <span className="text-sm ml-1 text-slate-400 font-bold tracking-normal">{currencySymbol}</span>}
          </h3>
        </div>
      </div>
    </div>
  );
}

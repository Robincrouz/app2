import React from "react";
import { Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Transaction, CATEGORIES } from "../types";
import { CategoryIcon } from "./CategoryIcon";
import { cn } from "../lib/utils";

interface TransactionItemProps {
  tx: Transaction;
  onEdit: () => void;
  onDelete: () => void;
  currencySymbol: string;
  key?: string | number;
}

export function TransactionItem({ tx, onEdit, onDelete, currencySymbol }: TransactionItemProps) {
  const cat = CATEGORIES[tx.category] || CATEGORIES.other;
  const isIncome = tx.type === "income";
  
  return (
    <div className="group flex items-center justify-between p-4 sm:p-5 rounded-[1.5rem] bg-white hover:bg-slate-50 transition-all border border-slate-100/60 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.02)] hover:shadow-lg hover:-translate-y-0.5">
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500" 
          style={{ backgroundColor: cat.color + "15", color: cat.color }}
        >
          <CategoryIcon name={cat.icon} size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h4 className="text-base sm:text-lg font-black text-slate-900 leading-none mb-1.5">{tx.note}</h4>
          <div className="flex items-center gap-2">
            <span className="text-[9px] sm:text-[10px] font-black text-slate-400/80 uppercase tracking-widest">{cat.label}</span>
            <span className="text-[10px] font-black text-slate-300">•</span>
            <span className="text-[9px] sm:text-[10px] font-black text-slate-400/80 uppercase tracking-widest">
              {new Date(tx.date).toLocaleDateString("bn-BD", { day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="text-right mr-1">
          <p className={cn(
            "text-base sm:text-lg font-black tabular-nums tracking-tighter drop-shadow-sm flex items-center justify-end gap-1.5",
            isIncome ? "text-emerald-500" : "text-slate-900"
          )}>
            {isIncome ? <TrendingUp size={18} strokeWidth={2.5} /> : <TrendingDown size={18} strokeWidth={2.5} className="text-rose-500" />}
            {isIncome ? "+" : "-"} {tx.amount.toLocaleString('en-US')} {currencySymbol}
          </p>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit size={16} strokeWidth={2.5} /></button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={16} strokeWidth={2.5} /></button>
        </div>
      </div>
    </div>
  );
}

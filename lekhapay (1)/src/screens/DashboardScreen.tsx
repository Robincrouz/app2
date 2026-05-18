import React from "react";
import { motion } from "motion/react";
import { 
  ArrowDownLeft, ArrowUpRight, Wallet, TrendingUp, Sparkles, Mic, Target, Activity, RefreshCw 
} from "lucide-react";
import { Transaction, Budget, CATEGORIES } from "../types";
import { StatCard } from "../components/StatCard";
import { TransactionItem } from "../components/TransactionItem";
import { BudgetProgress } from "../components/BudgetProgress";
import { DashboardSkeleton } from "../components/ui/Skeleton";
import { formatCurrency, cn } from "../lib/utils";

interface DashboardScreenProps {
  loading?: boolean;
  income: number;
  expense: number;
  balance: number;
  transactions: Transaction[];
  budgets: Budget[];
  aiInsights: any[];
  aiStatus: string;
  retrySeconds: number;
  weeklyStats: { count: number; expense: number; savings: number };
  onEditTx: (tx: Transaction) => void;
  onDeleteTx: (id: string) => void;
  onQuickAdd: () => void;
  onTabChange: (tab: string) => void;
  onSyncAi: () => void;
  currencySymbol: string;
}

const item = {
  hidden: { opacity: 0, y: 16, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export function DashboardScreen({
  loading, income, expense, balance, transactions, budgets, aiInsights, aiStatus, retrySeconds,
  weeklyStats, onEditTx, onDeleteTx, onQuickAdd, onTabChange, onSyncAi, currencySymbol
}: DashboardScreenProps) {
  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      {/* Premium Hero Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="মোট আয়" amount={income} icon={ArrowDownLeft} color="emerald" currencySymbol={currencySymbol} />
        <StatCard label="মোট ব্যয়" amount={expense} icon={ArrowUpRight} color="rose" currencySymbol={currencySymbol} />
        <StatCard label="ব্যালেন্স" amount={balance} icon={Wallet} color="teal" currencySymbol={currencySymbol} />
        <StatCard label="সঞ্চয় হার" amount={income > 0 ? Math.round((balance / income) * 100) : 0} icon={TrendingUp} color="slate" isPercentage={true} currencySymbol={currencySymbol} />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sleek Dark Widget for Quick Add / Mic */}
        <motion.div variants={item} className="bg-gradient-to-br from-[#0B0F19] to-[#111827] rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-teal-500/30 transition-all duration-1000" />
          <div className="relative z-10 flex flex-col h-full justify-between">
             <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-teal-300 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md mb-4">
                  <Sparkles size={10} /> এআই ড্রিভেন 
                </div>
                <h3 className="text-3xl font-black tracking-tight mb-2 font-sans">কুইক এন্ট্রি</h3>
                <p className="text-slate-400 text-xs font-medium max-w-[200px] leading-relaxed">কথা বলে বা লিখে দ্রুত আপনার আয়-ব্যয় ট্র্যাকিং করুন।</p>
             </div>
             
             <button onClick={onQuickAdd} className="mt-8 flex items-center justify-between w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[1.5rem] transition-all backdrop-blur-xl group-hover:border-white/20">
               <span className="text-sm font-bold pl-2 text-white/90">ট্যাপ করুন ও বলুন</span>
               <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                 <Mic size={18} />
               </div>
             </button>
          </div>
        </motion.div>

        {/* Minimalist Light Widget for Weekly Stats */}
        <motion.div variants={item} className="bg-white rounded-[2rem] p-8 border border-slate-100/60 shadow-[0_4px_40px_-5px_rgba(0,0,0,0.02)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-50 flex items-center justify-center shadow-inner">
                <Target size={22} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-slate-900">সাপ্তাহিক ওভারভিউ</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ফাইনান্সিয়াল সামারি</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">লেনদেন</p>
                <p className="text-2xl font-black tabular-nums tracking-tighter text-slate-800">{weeklyStats.count.toLocaleString('bn-BD')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">খরচ</p>
                <p className="text-xl font-black tabular-nums tracking-tighter text-rose-500">
                  {formatCurrency(weeklyStats.expense, currencySymbol).split('.00')[0]}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">সঞ্চয়</p>
                <p className="text-xl font-black tabular-nums tracking-tighter text-emerald-500">
                  {formatCurrency(weeklyStats.savings, currencySymbol).split('.00')[0]}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Insights Bento Section */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-6 bg-white border border-slate-100/60 rounded-[2rem] shadow-[0_4px_40px_-5px_rgba(0,0,0,0.02)] relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4">
              <span className="px-3 py-1 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900 border border-amber-200 text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-sm flex items-center gap-1">
                PRO <Sparkles size={10} />
              </span>
           </div>
           <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center border border-amber-100 shadow-inner">
                  <Sparkles size={20} className="text-amber-600" />
                </div>
                <div>
                   <h4 className="font-black text-lg tracking-tight text-slate-900 leading-none mb-1">AI Advisor Pro</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">অ্যাডভান্সড ইনভেস্টিং গাইডলাইন</p>
                </div>
              </div>
              <button onClick={onSyncAi} disabled={aiStatus === "loading"} className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[10px] font-bold transition-all active:scale-95 shadow-sm">
                 <RefreshCw size={14} className={cn(aiStatus === "loading" && "animate-spin")} /> সিঙ্ক
              </button>
           </div>
           
           <div className="grid grid-cols-1 gap-3 relative z-10">
              {aiInsights.length > 0 ? aiInsights.map((insight, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="flex gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 transition-all hover:bg-white hover:border-teal-100 hover:shadow-xl group/item">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover/item:scale-110", insight.severity === "danger" ? "bg-rose-100 text-rose-600" : insight.severity === "warning" ? "bg-amber-100 text-amber-600" : "bg-teal-100 text-teal-600")}><Activity size={18} /></div>
                  <p className="text-[12px] text-slate-700 leading-relaxed font-medium pt-1">{insight.message}</p>
                </motion.div>
              )) : (
                <div className="py-12 text-center flex flex-col items-center gap-4 border border-dashed border-slate-200 rounded-2xl">
                   <div className="w-10 h-10 rounded-full border-4 border-slate-100 border-t-amber-500 animate-spin" />
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">জেনারেটিং অ্যাডভাইস...</p>
                </div>
              )}
           </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-[#0B0F19] to-[#111827] rounded-[2rem] text-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col border border-white/5">
           <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 blur-[50px]" />
           <div className="flex items-center gap-3 mb-auto relative z-10">
             <div className="w-10 h-10 rounded-[1.25rem] bg-white/10 flex items-center justify-center text-teal-300 backdrop-blur-md"><Target size={18} /></div>
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-100/70">ফোরকাস্ট</h3>
           </div>
           
           <div className="mt-8 space-y-6 relative z-10">
              <div>
                 <p className="text-xs text-teal-100/60 mb-2 font-medium">সম্ভাব্য খরচ (পরবর্তী মাস)</p>
                 <div className="text-4xl font-black tabular-nums tracking-tighter text-white drop-shadow-md">{formatCurrency(expense * 1.05, currencySymbol).split('.00')[0]}</div>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                 <div className="flex items-center gap-2 text-teal-300 font-bold text-[9px] uppercase tracking-widest mb-2"><Sparkles size={10} /> টিপ্স</div>
                 <p className="text-xs leading-relaxed text-teal-50/80 font-medium">আপনার বর্তমান ট্রেন্ড অনুযায়ী অহেতুক খরচ কমানোর সুযোগ রয়েছে।</p>
              </div>
           </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100/60 shadow-[0_4px_40px_-5px_rgba(0,0,0,0.02)] p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 leading-none">সাম্প্রতিক লেনদেন</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">সবচেয়ে নতুন এন্ট্রিগুলো</p>
            </div>
            <button onClick={() => onTabChange("transactions")} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">সব দেখুন</button>
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 5).map(tx => (
              <TransactionItem key={tx.id} tx={tx} onEdit={() => onEditTx(tx)} onDelete={() => onDeleteTx(tx.id)} currencySymbol={currencySymbol} />
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-[2rem] border border-slate-100/60 shadow-[0_4px_40px_-5px_rgba(0,0,0,0.02)] p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black tracking-tight text-slate-900 leading-none">বাজেট হেলথ</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">লিমিট ট্র্যাকার</p>
            </div>
            <button onClick={() => onTabChange("budgets")} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">ডিটেইলস</button>
          </div>
          <div className="space-y-8">
            {budgets.slice(0, 3).map(b => (
              <div key={b.id} className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-slate-800 tracking-tight">{CATEGORIES[b.category]?.label || b.category}</span>
                  <span className="text-[11px] font-bold tabular-nums text-slate-400">
                     <span className="text-slate-900">{formatCurrency(b.spent, currencySymbol).split('.00')[0]}</span> / <span className="text-xs">{formatCurrency(b.limit, currencySymbol).split('.00')[0]}</span>
                  </span>
                </div>
                <BudgetProgress spent={b.spent} limit={b.limit} color={CATEGORIES[b.category]?.color || "#64748b"} />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import React from "react";
import { Shield, TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { FinancialHealth, AIForecast } from "../types";
import { formatCurrency, cn } from "../lib/utils";

interface FinancialHealthScoreProps {
  health: FinancialHealth;
  forecast: AIForecast;
  currencySymbol: string;
}

export function FinancialHealthScore({ health, forecast, currencySymbol }: FinancialHealthScoreProps) {
  const getTrendIcon = () => {
    switch (forecast.trend) {
      case "up": return <TrendingUp size={16} className="text-rose-500" />;
      case "down": return <TrendingDown size={16} className="text-emerald-500" />;
      default: return <Minus size={16} className="text-slate-400" />;
    }
  };

  const getTrendText = () => {
    switch (forecast.trend) {
      case "up": return "উর্ধ্বমুখী";
      case "down": return "নিম্নমুখী";
      default: return "স্থিতিশীল";
    }
  };

  return (
    <div className="space-y-6">
       <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div 
            className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 -mr-10 -mt-10 transition-all group-hover:scale-150"
            style={{ backgroundColor: health.color }}
          />
          
          <div className="relative z-10 flex items-center justify-between mb-8">
             <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">ফাইন্যান্সিয়াল হেলথ স্কোর</h3>
                <div className="flex items-baseline gap-2">
                   <span className="text-5xl font-black text-slate-900 leading-none">{health.score}</span>
                   <span className="text-lg font-black text-slate-300">/100</span>
                </div>
             </div>
             <div 
               className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg"
               style={{ backgroundColor: health.color }}
             >
                {health.label}
             </div>
          </div>

          <div className="space-y-3">
             {health.reasons.map((reason, idx) => (
                <div key={idx} className="flex gap-3 items-start p-3 bg-slate-50 rounded-2xl">
                   <div className="w-5 h-5 bg-white border border-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Shield size={12} className="text-slate-400" />
                   </div>
                   <p className="text-xs font-bold text-slate-600 leading-relaxed">{reason}</p>
                </div>
             ))}
          </div>
       </div>

       <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-500/10 to-transparent pointer-events-none" />
          <div className="relative z-10 space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <TrendingUp size={18} className="text-teal-400" />
                   </div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-200">AI আগামী ৩০ দিনের পূর্বাভাস</h3>
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 border border-white/5">
                   নির্ভুলতা: {forecast.confidence}%
                </div>
             </div>

             <div className="grid grid-cols-2 gap-8">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">সম্ভাব্য মোট ব্যয়</p>
                   <p className="text-2xl font-black text-white">{formatCurrency(forecast.predictedExpense, currencySymbol)}</p>
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">ট্রেন্ড</p>
                   <div className="flex items-center gap-2">
                      {getTrendIcon()}
                      <span className="text-lg font-black text-white">{getTrendText()}</span>
                   </div>
                </div>
             </div>

             <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex gap-3">
                <Info size={16} className="text-teal-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic">
                   "{forecast.suggestion}"
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}

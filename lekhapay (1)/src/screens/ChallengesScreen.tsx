import React from "react";
import { Trophy, Target, Sparkles, Zap, Flame } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

export function ChallengesScreen() {
  return (
    <div className="p-4 sm:p-6 pb-24 space-y-6 max-w-4xl mx-auto w-full font-sans">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
           <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center shrink-0">
             <Trophy size={24} />
           </div>
           <div>
             <h2 className="text-xl font-black text-slate-900">সেভিংস চ্যালেঞ্জ</h2>
             <p className="text-xs font-bold text-slate-400">টাকা জমানো এখন মজার গেম</p>
           </div>
         </div>
         <span className="bg-gradient-to-r from-emerald-400 to-green-500 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full shadow-lg shadow-green-500/20">
            NEW
         </span>
      </div>

      <div className="space-y-4">
        {/* Challenge 1 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-yellow-500/20 transition-all"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="text-orange-500" size={20} />
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">পপুলার চ্যালেঞ্জ</span>
              </div>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">৩০ দিন</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">No Spend November</h3>
            <p className="text-sm font-medium text-slate-500 mb-6">জরুরি প্রয়োজন ছাড়া কোনো বাড়তি খরচ না করার চ্যালেঞ্জ। বন্ধুদের লিডারবোর্ডে নিজেকে তুলে ধরুন!</p>
            <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-black hover:bg-slate-800 transition-all">
              চ্যালেঞ্জে জয়েন করুন
            </button>
          </div>
        </div>

        {/* Challenge 2 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="text-emerald-500" size={20} />
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">মেগা সেভিংস</span>
              </div>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">৫২ সপ্তাহ</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">52-Week Money Challenge</h3>
            <p className="text-sm font-medium text-slate-500 mb-6">প্রতি সপ্তাহে অল্প অল্প করে টাকা জমান। বছর শেষে আপনার জমানো টাকার পরিমাণ দেখে চমকে যাবেন!</p>
            <button className="w-full py-3 bg-emerald-50 text-emerald-600 rounded-xl font-black hover:bg-emerald-100 transition-all">
              চ্যালেঞ্জ শুরু করুন
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}

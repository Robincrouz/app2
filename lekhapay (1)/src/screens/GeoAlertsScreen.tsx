import React from "react";
import { MapPin, Bell, AlertCircle, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

export function GeoAlertsScreen() {
  return (
    <div className="p-4 sm:p-6 pb-24 space-y-6 max-w-4xl mx-auto w-full font-sans">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
           <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
             <MapPin size={24} />
           </div>
           <div>
             <h2 className="text-xl font-black text-slate-900">লোকেশন এলার্ট</h2>
             <p className="text-xs font-bold text-slate-400">শপিং মলে স্মার্ট ওয়ার্নিং</p>
           </div>
         </div>
         <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full shadow-lg shadow-orange-500/20">
            PRO
         </span>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="relative z-10 space-y-6">
            <h3 className="text-2xl font-black leading-tight">অতিরিক্ত খরচে<br/>এখনই লাগাম টানুন</h3>
            <p className="text-sm text-red-100/70 font-medium leading-relaxed">
              সুপারশপ বা শপিং মলে গেলেই অ্যাপ আপনাকে মনে করিয়ে দেবে আপনার বাজেটের কথা। "আপনার শপিং বাজেট আর মাত্র ২০% বাকি আছে!"
            </p>
            <div className="space-y-3">
               <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400"><ShoppingBag size={14} /></div>
                  <span className="text-sm font-bold text-slate-200">সুপারশপ ডিটেকশন</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400"><Bell size={14} /></div>
                  <span className="text-sm font-bold text-slate-200">রিয়েল-টাইম পুশ নোটিফিকেশন</span>
               </div>
            </div>

            <button className="w-full py-4 mt-4 bg-white text-slate-900 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-all transition-transform active:scale-95">
              <MapPin size={18} />
              লোকেশন পারমিশন দিন
            </button>
         </div>
      </div>
    </div>
  );
}

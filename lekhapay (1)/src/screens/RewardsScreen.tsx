import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Achievement } from "../types";
import { cn } from "../lib/utils";

interface RewardsScreenProps {
  achievements: Achievement[];
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 }
};

export function RewardsScreen({ achievements }: RewardsScreenProps) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 px-4">
       <motion.div variants={item}>
          <h2 className="text-2xl font-black text-slate-800 leading-none">পুরস্কার</h2>
          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">আর্থিক শৃঙ্খলার স্বীকৃতি</p>
       </motion.div>

       <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(a => (
            <div key={a.id} className={cn(
              "p-5 rounded-2xl border transition-all duration-300 group relative overflow-hidden flex flex-col gap-4",
              a.isUnlocked 
                ? "bg-white border-slate-100 shadow-sm" 
                : "bg-slate-50/50 border-slate-100 opacity-60 grayscale"
            )}>
               <div className="text-3xl group-hover:scale-110 transition-transform inline-block">{a.icon}</div>
               <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1 tracking-tight">{a.title}</h3>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{a.description}</p>
               </div>
               {a.isUnlocked && (
                 <div className="absolute top-6 right-6">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                       <CheckCircle2 size={18} fill="currentColor" className="text-emerald-50" />
                    </div>
                 </div>
               )}
            </div>
          ))}
       </motion.div>

       <motion.div variants={item} className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
             <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-4xl shadow-xl group-hover:scale-105 transition-transform">💎</div>
             <div className="text-center md:text-left space-y-2">
                <div className="inline-flex items-center gap-2 px-2 py-1 bg-teal-500/20 rounded-lg text-teal-400 text-[10px] font-bold uppercase tracking-widest"><Sparkles size={12} /> স্পেশাল অফার</div>
                <h3 className="text-2xl font-black tracking-tight">প্রিমিয়াম ব্যাজ আনলক করুন</h3>
                <p className="text-slate-400 text-xs font-medium max-w-xl leading-relaxed">আপনার আর্থিক স্বাস্থ্য স্কোর ৮০ এর উপরে থাকলেই আপনি পাবেন এক্সক্লুসিভ প্রোফাইল ব্যাজ। লক্ষ্য পূরনে এগিয়ে যান!</p>
             </div>
          </div>
       </motion.div>
    </motion.div>
  );
}

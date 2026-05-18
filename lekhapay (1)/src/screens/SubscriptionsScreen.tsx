import React from "react";
import { Plus, CreditCard, Calendar, ArrowRight, Trash2, Edit2, AlertCircle, Sparkles, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Subscription, CATEGORIES } from "../types";
import { formatCurrency, formatDate, cn } from "../lib/utils";

interface SubscriptionsScreenProps {
  subscriptions: Subscription[];
  onAddSub: () => void;
  onEditSub: (s: Subscription) => void;
  currencySymbol: string;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export function SubscriptionsScreen({ subscriptions, onAddSub, onEditSub, currencySymbol }: SubscriptionsScreenProps) {
  const totalMonthly = subscriptions.reduce((sum, s) => sum + s.amount, 0);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 font-sans pb-32">
       <motion.div variants={item} className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">সাবস্ক্রিপশন</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">নিয়মিত খরচের ট্র্যাকার</p>
          </div>
          <button 
            onClick={onAddSub}
            className="w-12 h-12 bg-slate-900 text-white rounded-[1.25rem] flex items-center justify-center shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] hover:bg-slate-800 transition-all active:scale-95"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
       </motion.div>

       <motion.div variants={item} className="bg-gradient-to-br from-[#0B0F19] to-[#111827] rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-indigo-500/30 transition-all duration-1000" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
             <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-indigo-300 text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
                   <RefreshCcw size={10} /> মাসিক মোট খরচ
                </div>
                <div>
                   <div className="text-5xl font-black tabular-nums tracking-tighter leading-none mb-2 drop-shadow-sm">
                      {formatCurrency(totalMonthly, currencySymbol).split('.00')[0]}<span className="text-2xl text-slate-400 font-bold ml-1">.00</span>
                   </div>
                   <p className="text-slate-400 text-xs font-medium tracking-wide">১ম তারিখে স্বয়ংক্রিয়ভাবে ব্যালেন্স থেকে কাটা হবে</p>
                </div>
             </div>
             
             <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md self-start sm:self-auto min-w-[120px]">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">অ্যাক্টিভ প্যাক</p>
                <p className="text-2xl font-black text-white">{subscriptions.length}</p>
             </div>
          </div>
       </motion.div>

       {subscriptions.length === 0 ? (
          <motion.div variants={item} className="p-16 text-center bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_40px_-5px_rgba(0,0,0,0.02)]">
             <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CreditCard size={32} strokeWidth={1.5} className="text-indigo-400" />
             </div>
             <h3 className="text-lg font-black tracking-tight text-slate-800 mb-2">কোনো সাবস্ক্রিপশন নেই</h3>
             <p className="text-sm text-slate-500 font-medium mb-8 max-w-[250px] mx-auto leading-relaxed">নেটফ্লিক্স, স্পোটিফাই বা ইন্টারনেট বিল ট্র্যাক করতে যোগ করুন</p>
             <button onClick={onAddSub} className="px-6 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-colors border border-indigo-100">নতুন যোগ করুন</button>
          </motion.div>
       ) : (
          <div className="grid grid-cols-1 gap-4">
             <AnimatePresence mode="popLayout">
                {subscriptions.map((sub, index) => (
                   <motion.div 
                     layout
                     key={sub.id} 
                     variants={item}
                     exit={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
                     onClick={() => onEditSub(sub)}
                     className="bg-white p-5 sm:p-6 rounded-[1.5rem] border border-slate-100/60 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                   >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-50 to-transparent -mr-8 -mt-8 rounded-full" />
                      <div className="flex items-center gap-5 relative z-10">
                         <div className={cn(
                           "w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-2xl shadow-inner border",
                           "bg-indigo-50 border-indigo-100/50 text-indigo-500"
                         )}>
                            {CATEGORIES[sub.category]?.icon === "FileText" ? "📄" : "💎"}
                         </div>
                         
                         <div className="flex-1 min-w-0">
                            <h3 className="font-black text-slate-900 text-lg sm:text-xl leading-none mb-2 truncate">{sub.title}</h3>
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                              <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-400 font-sans tracking-wide">
                                 <Calendar size={12} strokeWidth={2.5} /> রিনিউ: {formatDate(sub.nextBillingDate)}
                              </div>
                            </div>
                         </div>
                         
                         <div className="text-right">
                            <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums tracking-tighter drop-shadow-sm">
                               {formatCurrency(sub.amount, currencySymbol).split('.00')[0]}
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 block mt-1">/ মাস</span>
                         </div>
                      </div>
                   </motion.div>
                ))}
             </AnimatePresence>
          </div>
       )}

       {subscriptions.length > 0 && (
         <motion.div variants={item} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-[2rem] p-6 border border-amber-100 flex gap-5 items-start mt-8">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-amber-200">
               <Sparkles size={20} className="text-amber-500" />
            </div>
            <div>
               <h4 className="text-xs sm:text-sm font-black text-amber-900 uppercase tracking-widest mb-1">অ্যাডভান্সড ইনসাইট</h4>
               <p className="text-[11px] sm:text-xs text-amber-800 leading-relaxed font-medium">
                 অপ্রয়োজনীয় সার্ভিসগুলো ক্যান্সেল করে বছরে আপনি হাজার টাকা বাঁচাতে পারেন। সাবস্ক্রিপশন ট্র্যাকিং আপনার ফিন্যান্স অটোমেট করতে সাহায্য করে।
               </p>
            </div>
         </motion.div>
       )}
    </motion.div>
  );
}

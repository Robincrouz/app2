import React, { useState } from "react";
import { Users, Plus, ShieldCheck, Mail, ArrowRight, Zap, Globe2 } from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

export function SharedWalletsScreen() {
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="p-4 sm:p-6 pb-24 space-y-6 max-w-4xl mx-auto w-full font-sans">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
           <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center shrink-0">
             <Globe2 size={24} />
           </div>
           <div>
             <h2 className="text-xl font-black text-slate-900">যৌথ হিসাব (Beta)</h2>
             <p className="text-xs font-bold text-slate-400">ফ্যামিলি ও পার্টনার ওয়ালেট</p>
           </div>
         </div>
         <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full shadow-lg shadow-orange-500/20">
            PRO
         </span>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="relative z-10 space-y-6">
            <h3 className="text-2xl font-black leading-tight">সাথীর সাথে<br/>হিসাব রাখুন একসাথে</h3>
            <p className="text-sm text-cyan-100/70 font-medium leading-relaxed">
              আপনার স্ত্রী, স্বামী বা পার্টনারকে ইনভাইট করুন। দুজনেই খরচ এন্ট্রি করতে পারবেন এবং রিয়েল-টাইমে ব্যালেন্স আপডেট হবে।
            </p>
            <div className="space-y-3">
               <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400"><ShieldCheck size={14} /></div>
                  <span className="text-sm font-bold text-slate-200">এন্ড-টু-এন্ড এনক্রিপ্টেড শেয়ারিং</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Zap size={14} /></div>
                  <span className="text-sm font-bold text-slate-200">রিয়েল-টাইম সিঙ্ক</span>
               </div>
            </div>

            <button 
              onClick={() => setShowInvite(true)}
              className="w-full py-4 mt-4 bg-white text-slate-900 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-all transition-transform active:scale-95"
            >
              <Users size={18} />
              নতুন মেম্বার যুক্ত করুন
            </button>
         </div>
      </div>

      <AnimatePresence>
         {showInvite && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             className="bg-white rounded-[2rem] border-2 border-slate-100 p-6 shadow-sm space-y-4"
           >
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">অংশীদারকে ইনভাইট করুন</h4>
              
              {!sent ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      placeholder="partner@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-cyan-500/20 rounded-xl outline-none transition-all font-bold text-slate-900"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      if(email) setSent(true);
                    }}
                    disabled={!email}
                    className="w-full py-4 bg-cyan-600 text-white font-black rounded-xl flex items-center justify-center gap-2 hover:bg-cyan-700 disabled:opacity-50 transition-all"
                  >
                    ইনভাইটেশন পাঠান <ArrowRight size={18} />
                  </button>
                </div>
              ) : (
                <div className="py-6 text-center space-y-3">
                   <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <ShieldCheck size={32} />
                   </div>
                   <h5 className="text-lg font-black text-slate-900">ইনভাইটেশন পাঠানো হয়েছে!</h5>
                   <p className="text-sm font-bold text-slate-400">খুব শীঘ্রই এই ফিচারটি সবার জন্য উন্মুক্ত করা হবে। আপনি ওয়েটিং লিস্টে আছেন।</p>
                   <button onClick={() => { setShowInvite(false); setSent(false); }} className="px-6 py-2 mt-2 bg-slate-100 text-slate-600 font-bold rounded-lg text-sm">বন্ধ করুন</button>
                </div>
              )}
           </motion.div>
         )}
      </AnimatePresence>

    </div>
  );
}

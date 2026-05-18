import React, { useState } from "react";
import { 
  BookOpen, Target, CreditCard, FileText, Sparkles, 
  Settings, HelpCircle, ShieldCheck, Heart, Share2, Award,
  Pin, PinOff, Info, LayoutGrid, Edit3, Check, PieChart,
  GripVertical, Calendar, Users, MessageSquare, TrendingUp, MapPin, Trophy
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "motion/react";
import { cn } from "../lib/utils";

interface AppGridScreenProps {
  onNavigate: (tab: string) => void;
  onAction?: (action: string) => void;
  activeTab: string;
  settings: { currency: string; pinnedTabs: string[] };
  onUpdateSettings: (s: any) => void;
}

export function AppGridScreen({ onNavigate, onAction, activeTab, settings, onUpdateSettings }: AppGridScreenProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  const features = [
    { id: "dashboard", label: "হোম", icon: LayoutGrid, color: "bg-teal-50 text-teal-600", description: "ড্যাশবোর্ড ওভারভিউ", pro: false },
    { id: "sms_sync", label: "SMS সিঙ্ক", icon: MessageSquare, color: "bg-sky-50 text-sky-600", description: "অটো ব্যাংক আপডেট", pro: true },
    { id: "transactions", label: "লেনদেন", icon: Edit3, color: "bg-slate-50 text-slate-600", description: "রোজকার জমা-খরচ", pro: false },
    { id: "investments", label: "বিনিয়োগ", icon: TrendingUp, color: "bg-violet-50 text-violet-600", description: "স্টক, বন্ড ও ক্রিপ্টো", pro: true },
    { id: "ledger", label: "বাকির খাতা", icon: BookOpen, color: "bg-amber-50 text-amber-600", description: "পাওনা-দেনার হিসাব", pro: false },
    { id: "split_bills", label: "বিল স্প্লিট", icon: FileText, color: "bg-indigo-50 text-indigo-600", description: "বন্ধুদের সাথে খরচ ভাগ", action: "split_bills" },
    { id: "geo_alerts", label: "স্মার্ট এলার্ট", icon: MapPin, color: "bg-red-50 text-red-600", description: "লোকেশন ভিত্তিক বাজেট", pro: true },
    { id: "calendar", label: "ক্যালেন্ডার", icon: Calendar, color: "bg-fuchsia-50 text-fuchsia-600", description: "পেমেন্ট ও রিমাইন্ডার" },
    { id: "challenges", label: "চ্যালেঞ্জ", icon: Trophy, color: "bg-yellow-50 text-yellow-600", description: "মজার সেভিংস গেম", pro: false },
    { id: "shared_wallets", label: "যৌথ হিসাব", icon: Users, color: "bg-cyan-50 text-cyan-600", description: "ফ্যামিলি শেয়ারিং" },
    { id: "budgets", label: "বাজেট", icon: PieChart, color: "bg-orange-50 text-orange-600", description: "খরচের সীমা নির্ধারণ", pro: false },
    { id: "goals", label: "লক্ষ্য", icon: Target, color: "bg-emerald-50 text-emerald-600", description: "আর্থিক লক্ষ্য পূরণ", pro: true },
    { id: "subscriptions", label: "কিস্তি/সাব", icon: CreditCard, color: "bg-pink-50 text-pink-600", description: "মাসিক খরচ ম্যানেজ", pro: true },
    { id: "invoices", label: "রশিদ/বিল", icon: FileText, color: "bg-blue-50 text-blue-600", description: "বিলিং ও রিসিট", pro: true },
    { id: "rewards", label: "পুরস্কার", icon: Award, color: "bg-rose-50 text-rose-600", description: "আপনার অর্জনসমূহ", pro: false },
    { id: "reports", label: "রিপোর্ট", icon: Sparkles, color: "bg-purple-50 text-purple-600", description: "উন্নত এনালাইটিক্স", pro: true },
  ];

  const secondary = [
    { id: "settings", label: "সেটিংস", icon: Settings },
    { id: "security", label: "নিরাপত্তা", icon: ShieldCheck },
    { id: "help", label: "সহায়তা", icon: HelpCircle },
    { id: "donate", label: "সাপোর্ট", icon: Heart },
    { id: "share", label: "শেয়ার", icon: Share2 },
  ];

  const allItemsMap: Record<string, any> = {
    ...features.reduce((acc, f) => ({ ...acc, [f.id]: f }), {}),
    more: { id: "more", label: "আরও", icon: LayoutGrid, color: "bg-slate-50 text-slate-600" }
  };

  const togglePin = (id: string) => {
    let newPinned = [...settings.pinnedTabs];
    if (newPinned.includes(id)) {
      if (newPinned.length <= 2) return; 
      newPinned = newPinned.filter(p => p !== id);
    } else {
      if (newPinned.length >= 5) {
        const lastNotMore = [...newPinned].reverse().find(p => p !== "more");
        if (lastNotMore) {
          newPinned = newPinned.filter(p => p !== lastNotMore);
        }
      }
      const moreIndex = newPinned.indexOf("more");
      if (moreIndex !== -1) {
        newPinned.splice(moreIndex, 0, id);
      } else {
        newPinned.push(id);
      }
    }
    onUpdateSettings({ ...settings, pinnedTabs: newPinned });
  };

  const handleReorder = (newOrder: string[]) => {
    onUpdateSettings({ ...settings, pinnedTabs: newOrder });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemAnim = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-full pt-4 px-6 font-sans">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">সবগুলো ফিচার</h2>
          <p className="text-sm font-bold text-slate-400 italic">ব্যক্তিগত ফাইন্যান্স ম্যানেজার</p>
        </div>
        <button 
          onClick={() => setIsEditMode(!isEditMode)}
          className={cn(
            "px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg border-2",
            isEditMode ? "bg-rose-500 text-white border-rose-500 shadow-rose-500/20" : "bg-white text-slate-600 border-slate-100"
          )}
        >
          {isEditMode ? "সম্পন্ন করুন" : "এডিট করুন"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isEditMode ? (
          <motion.div 
            key="edit-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-10"
          >
            <div className="mb-6 p-6 bg-teal-50 rounded-[2.5rem] border border-teal-100 flex items-start gap-4">
               <div className="w-12 h-12 rounded-[1.25rem] bg-teal-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-teal-600/20">
                  <Pin size={24} />
               </div>
               <div>
                  <h4 className="text-slate-900 font-black text-sm">নেভিগেশন কাস্টমাইজ করুন</h4>
                  <p className="text-slate-500 text-[10px] leading-relaxed mt-1 font-bold italic">মেনু আইটেমগুলো পিন করে সাজান</p>
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-6 font-sans">
              {settings?.pinnedTabs && Array.isArray(settings.pinnedTabs) ? (
                <div className="space-y-3">
                  {settings.pinnedTabs.filter(id => allItemsMap[id]).map((id) => {
                    const item = allItemsMap[id];
                    return (
                      <div 
                        key={id} 
                        className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4 border border-slate-100 hover:border-teal-200 transition-colors"
                      >
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.color)}>
                          <item.icon size={20} />
                        </div>
                        <span className="flex-1 font-black text-sm text-slate-800">{item.label}</span>
                        {id !== "more" && (
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); togglePin(id); }}
                            className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition-all font-sans"
                          >
                            <PinOff size={14} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-slate-400 text-xs italic font-bold">কোনো পিন করা আইটেম নেই</div>
              )}
            </div>
            
            <div className="mt-8 mb-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic px-2 font-sans">পিন করার জন্য ফিচার সিলেক্ট করুন</h4>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="view-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-8 p-8 bg-gradient-to-br from-teal-600 to-teal-800 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-teal-900/40"
          >
             <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[60px] -mr-10 -mt-10" />
             <div className="relative z-10 flex items-start justify-between">
                <div>
                   <h3 className="text-3xl font-black tracking-tight leading-tight mb-2">স্মার্ট ট্র্যাকিং <br/> শুরু করুন</h3>
                   <p className="text-teal-100/80 text-xs font-bold uppercase tracking-widest italic">AI এনালাইটিক্স</p>
                </div>
                <div className="w-16 h-16 rounded-[1.75rem] bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                   <Sparkles size={32} />
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4"
      >
        {features.map((feature) => {
          const isPinned = settings.pinnedTabs?.includes(feature.id);
          
          return (
            <motion.div
              key={feature.id}
              variants={itemAnim}
              className="relative group"
            >
              <button
                disabled={isEditMode}
                onClick={() => feature.action ? onAction?.(feature.action) : onNavigate(feature.id)}
                className={cn(
                  "p-6 w-full rounded-[2.75rem] border-2 transition-all flex flex-col items-start text-left active:scale-95 group",
                  activeTab === feature.id ? "bg-white border-teal-600 shadow-xl shadow-teal-900/10" : "bg-white border-slate-50 hover:border-slate-100 hover:shadow-xl",
                  isEditMode ? "opacity-60" : ""
                )}
              >
                {feature.pro && (
                   <div className="absolute top-4 right-4 px-2 py-0.5 bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 text-[8px] font-black uppercase tracking-widest rounded shadow-sm flex items-center gap-1 z-10">
                      PRO
                   </div>
                )}
                <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-5 transition-all group-hover:scale-110 group-hover:rotate-3 shadow-sm", feature.color)}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-lg font-black text-slate-800 leading-tight mb-1">{feature.label}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight italic">{feature.description}</p>
              </button>

              {isEditMode && (
                <button
                  onClick={() => togglePin(feature.id)}
                  className={cn(
                    "absolute -top-1 -right-1 w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl transition-all border-4 border-white z-20",
                    isPinned ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-400"
                  )}
                >
                  {isPinned ? <Check size={20} /> : <Pin size={20} />}
                </button>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-14 bg-slate-50/50 rounded-[3.5rem] p-10 border border-slate-100">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 px-2 italic text-center">অন্যান্য সুবিধা</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {secondary.map((s) => (
            <button key={s.id} onClick={() => onNavigate(s.id)} className="flex flex-col items-center gap-3 group active:scale-95 transition-all">
              <div className="w-16 h-16 rounded-3xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-teal-600 group-hover:border-teal-200 group-hover:shadow-xl transition-all">
                <s.icon size={26} strokeWidth={2} />
              </div>
              <span className="text-[10px] sm:text-xs font-black text-slate-500 group-hover:text-slate-900 uppercase tracking-widest">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-14 p-10 bg-slate-950 rounded-[3.5rem] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/20 blur-[60px] -mr-20 -mt-20 group-hover:bg-teal-500/30 transition-all duration-700" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-[40px] -ml-16 -mb-16" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-white font-black text-2xl tracking-tight italic">প্রিমিয়াম মেম্বারশিপ</h4>
            <p className="text-teal-400/80 text-[10px] font-bold uppercase tracking-[0.2em]">আনলিমিটেড ফিচার ও এনার্জি উপভোগ করুন</p>
          </div>
          <button className="px-8 py-4 bg-teal-500 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-teal-500/40 active:scale-95 transition-all hover:bg-teal-400">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}

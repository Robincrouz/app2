const fs = require('fs');

const content = `import React from "react";
import { FileText, List, Info, LogOut, User as UserIcon, Globe, Wallet, Shield, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";
import { t } from "../lib/i18n";

interface SettingsScreenProps {
  settings: { currency: string; language?: string };
  onUpdateSettings: (s: any) => void;
  onExport: (format: "json" | "csv") => void;
  onClearData: () => void;
  user: any;
  handleLogout: () => void;
}

export function SettingsScreen({ settings, onUpdateSettings, onExport, onClearData, user, handleLogout }: SettingsScreenProps) {
  const lang = settings.language || "bn";
  const currencies = [
    { code: "BDT", symbol: "৳", label: "টাকা" },
    { code: "USD", symbol: "$", label: "Dollar" },
    { code: "EUR", symbol: "€", label: "Euro" },
    { code: "GBP", symbol: "£", label: "Pound" }
  ];

  const languages = [
    { code: "bn", name: "বাংলা" },
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "hi", name: "हिन्दी" }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-6 px-4 sm:px-6 overflow-x-hidden pb-32">
       <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-[0_4px_40px_-5px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-teal-500/10 transition-colors" />
          <div className="relative">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || "User"} className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-lg object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-teal-50 to-slate-50 flex items-center justify-center text-teal-600 border-4 border-white shadow-lg">
                <UserIcon size={40} strokeWidth={1.5} />
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center shadow-sm">
               <div className="w-2.5 h-2.5 bg-white rounded-full" />
            </div>
          </div>
          <div className="flex-1 relative z-10 pt-2">
             <h3 className="text-2xl font-black text-slate-900 tracking-tight">{user?.displayName || "ব্যবহারকারী"}</h3>
             <p className="text-sm font-medium text-slate-500 mt-1">{user?.email || "সংযুক্ত নেই"}</p>
             <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-3">
               <button 
                 onClick={handleLogout}
                 className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-rose-100 transition-colors"
               >
                  <LogOut size={16} /> {t("settings.logout", lang)}
               </button>
               <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors">
                  <Shield size={16} /> Security
               </button>
             </div>
          </div>
       </div>

       <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-2">{t("settings.title", lang)}</h2>
          <p className="text-slate-500 text-xs font-medium">{t("settings.manage_account", lang)}</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-[0_4px_40px_-5px_rgba(0,0,0,0.02)] space-y-6">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[1.25rem] bg-indigo-50 text-indigo-600 flex items-center justify-center"><Globe size={20} /></div>
                <h3 className="text-lg font-black tracking-tight">{t("settings.language", lang)}</h3>
             </div>
             <div className="grid grid-cols-2 gap-3">
                {languages.map((l) => (
                   <button 
                     key={l.code}
                     onClick={() => onUpdateSettings({ language: l.code })}
                     className={cn(
                       "flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all relative overflow-hidden",
                       lang === l.code 
                        ? "bg-indigo-50/50 border-indigo-600 text-indigo-900" 
                        : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                     )}
                   >
                      {lang === l.code && <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full" />}
                      <span className="text-xl font-black uppercase tracking-widest">{l.code}</span>
                      <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">{l.name}</span>
                   </button>
                ))}
             </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-[0_4px_40px_-5px_rgba(0,0,0,0.02)] space-y-6">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[1.25rem] bg-teal-50 text-teal-600 flex items-center justify-center"><Wallet size={20} /></div>
                <h3 className="text-lg font-black tracking-tight">{t("settings.currency", lang)}</h3>
             </div>
             <div className="grid grid-cols-2 gap-3">
                {currencies.map((c) => (
                   <button 
                     key={c.code}
                     onClick={() => onUpdateSettings({ currency: c.symbol })}
                     className={cn(
                       "flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all relative",
                       settings.currency === c.symbol 
                        ? "bg-teal-50/50 border-teal-600 text-teal-900" 
                        : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                     )}
                   >
                      {settings.currency === c.symbol && <div className="absolute top-2 right-2 w-2 h-2 bg-teal-500 rounded-full" />}
                      <span className="text-2xl font-black">{c.symbol}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest mt-1">{c.code}</span>
                   </button>
                ))}
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-[0_4px_40px_-5px_rgba(0,0,0,0.02)]">
             <h3 className="text-lg font-black tracking-tight mb-6">{t("settings.export", lang)}</h3>
             <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => onExport('json')}
                  className="flex items-center justify-between p-5 bg-[#0B0F19] text-white rounded-[1.5rem] font-bold text-sm hover:bg-slate-900 transition-all shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] group"
                >
                   <div className="flex items-center gap-3">
                     <FileText size={20} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" /> JSON Backup
                   </div>
                   <div className="px-3 py-1 bg-white/10 rounded-lg text-[10px] uppercase tracking-widest">Recommended</div>
                </button>
                <button 
                  onClick={() => onExport('csv')}
                  className="flex items-center gap-3 p-5 bg-white border border-slate-200 text-slate-700 rounded-[1.5rem] font-bold text-sm hover:bg-slate-50 transition-all"
                >
                   <List size={20} className="text-teal-600" /> Export CSV (Excel)
                </button>
             </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-[0_4px_40px_-5px_rgba(0,0,0,0.02)]">
             <h3 className="text-lg font-black tracking-tight mb-6 text-rose-500">{t("settings.danger_zone", lang)}</h3>
             <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">Delete all your data permanently. This action cannot be reversed.</p>
             <button 
               onClick={onClearData}
               className="w-full p-5 bg-rose-50 text-rose-600 border border-rose-100 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-rose-500 hover:text-white transition-all shadow-sm"
             >
                {t("settings.clear_data", lang)}
             </button>
          </div>
       </div>

       <div className="fixed bottom-24 right-6 pointer-events-none hidden lg:block opacity-40 hover:opacity-100 transition-opacity z-20">
         <div className="bg-slate-900 text-white p-5 rounded-[2rem] border border-white/10 shadow-2xl hover:shadow-teal-900/40 transition-all pointer-events-auto backdrop-blur-xl w-64">
           <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                 <Info size={18} className="text-teal-400" />
               </div>
               <div>
                 <h4 className="text-xs font-black uppercase tracking-tight text-white">Shortcuts</h4>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">Help Panel</p>
               </div>
             </div>
           </div>
           <div className="space-y-4">
             <div className="flex items-center justify-between gap-8">
               <span className="text-[11px] font-bold text-slate-300">Quick Add</span>
               <div className="flex gap-1.5 whitespace-nowrap">
                 <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black min-w-[24px] text-center text-teal-400">⌘</kbd>
                 <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black min-w-[24px] text-center text-teal-400">K</kbd>
               </div>
             </div>
             <div className="flex items-center justify-between gap-8">
               <span className="text-[11px] font-bold text-slate-300">New Entry</span>
               <div className="flex gap-1.5 whitespace-nowrap">
                 <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black min-w-[24px] text-center text-teal-400">⌘</kbd>
                 <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black min-w-[24px] text-center text-teal-400">N</kbd>
               </div>
             </div>
           </div>
         </div>
       </div>

       <div className="bg-slate-50/80 rounded-[2rem] p-8 text-center border border-slate-100">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">LekhaPay Final v2.0.0</p>
          <p className="text-[10px] font-bold text-slate-400 leading-relaxed max-w-sm mx-auto">© 2026 LekhaPay Team • Enterprise Production Build<br/>Optimized for Silicon Valley Standards</p>
       </div>
    </div>
  );
}
`;

fs.writeFileSync('src/screens/SettingsScreen.tsx', content);

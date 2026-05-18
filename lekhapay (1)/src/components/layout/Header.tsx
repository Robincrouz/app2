import React from "react";
import { Bell, Search, Settings } from "lucide-react";
import { formatCurrency, cn } from "../../lib/utils";
import { t } from "../../lib/i18n";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  balance: number;
  notificationCount: number;
  setShowNotifications: (show: boolean) => void;
  userPhoto: string | null;
  userName: string | null;
  currencySymbol: string;
  language?: string;
}

export function Header({ 
  activeTab, 
  setActiveTab,
  balance, 
  notificationCount, 
  setShowNotifications, 
  userPhoto, 
  userName,
  currencySymbol,
  language = "bn"
}: HeaderProps) {
  const getTitle = () => {
    switch (activeTab) {
      case "dashboard": return t("nav.home", language);
      case "transactions": return t("nav.transactions", language);
      case "budgets": return t("nav.budgets", language);
      case "goals": return t("nav.goals", language);
      case "reports": return t("dashboard.weekly_overview", language);
      case "invoices": return "Invoices";
      case "rewards": return "Rewards";
      case "search": return "Search";
      case "subscriptions": return "Subscriptions";
      case "ledger": return "Ledger";
      case "more": return t("nav.more", language);
      default: return t("settings.title", language);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-3xl border-b border-white/50 shadow-[0_4px_30px_rgb(0,0,0,0.02)] print:hidden">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#0B0F19] to-[#111827] rounded-2xl flex lg:hidden items-center justify-center text-white text-xl shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] border border-slate-700/50">
            <span className="font-sans font-black tracking-tighter text-teal-400">৳</span>
          </div>
          <div>
            <h1 className="text-sm border sm:text-base font-black text-slate-900 tracking-tight leading-none border-transparent capitalize">{getTitle()}</h1>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 capitalize tracking-widest mt-1">
              Hi, {userName ? userName.split(' ')[0] : 'User'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50/80 border border-slate-100 rounded-full mr-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t("dashboard.balance", language)}</span>
            <span className="text-sm font-black text-slate-800 tabular-nums">{formatCurrency(balance, currencySymbol)}</span>
          </div>

          <button 
            onClick={() => setActiveTab("search")}
            className="hidden sm:flex w-10 h-10 rounded-full bg-slate-50 border border-slate-100 items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Search size={18} strokeWidth={2.5} />
          </button>
          
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Bell size={18} strokeWidth={2.5} />
            {notificationCount > 0 && (
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-sm"></span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab("settings")}
            className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            {userPhoto ? (
              <img src={userPhoto} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <Settings size={18} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

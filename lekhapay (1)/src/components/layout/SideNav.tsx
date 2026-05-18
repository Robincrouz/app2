import React from "react";
import { 
  Home, List, PieChart, Target, TrendingUp, LayoutGrid, CreditCard, FileText, BookOpen, Settings, Award 
} from "lucide-react";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";
import { t } from "../../lib/i18n";

interface SideNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pinnedTabs?: string[];
  language?: string;
}

export function SideNav({ activeTab, setActiveTab, pinnedTabs = ["dashboard", "transactions", "goals", "reports", "more"], language = "bn" }: SideNavProps) {
  const allItems: Record<string, { label: string; icon: any }> = {
    dashboard: { label: t("nav.home", language), icon: Home },
    transactions: { label: t("nav.transactions", language), icon: List },
    budgets: { label: t("nav.budgets", language), icon: PieChart },
    goals: { label: t("nav.goals", language), icon: Target },
    reports: { label: "রিপোর্ট", icon: TrendingUp },
    more: { label: t("nav.more", language), icon: LayoutGrid },
    subscriptions: { label: "কিস্তি", icon: CreditCard },
    invoices: { label: "রশিদ", icon: FileText },
    ledger: { label: "খাতা", icon: BookOpen },
    settings: { label: "সেটিং", icon: Settings },
    rewards: { label: "অর্জন", icon: Award },
  };

  const navItems = pinnedTabs.map(id => ({ id, ...(allItems[id] || allItems.more) }));

  return (
    <div className="hidden lg:flex w-64 bg-slate-900 text-white flex-col h-full print:hidden">
      <div className="p-8 mb-4">
        <h1 className="text-2xl font-black tracking-tight text-white flex Items-center gap-2">
           <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-slate-900">৳</span>
           মানি ম্যানেজমেন্ট উইথ এ আই
        </h1>
      </div>
      <div className="flex-1 px-4 space-y-2 overflow-y-auto hidden-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
            >
              <Icon 
                size={20} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={cn("transition-all duration-300 relative z-10", isActive && "text-teal-400")} 
              />
              <span className="font-bold relative z-10 text-sm">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="sideNavIndicator"
                  className="absolute left-0 w-1.5 h-8 bg-teal-400 rounded-r-md shadow-[0_0_10px_rgba(45,212,191,0.5)]"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const fs = require('fs');

const content = `import React from "react";
import { 
  Home, List, PieChart, Target, TrendingUp, LayoutGrid, CreditCard, FileText, BookOpen, Settings, Award 
} from "lucide-react";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";
import { t } from "../../lib/i18n";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pinnedTabs?: string[];
  language?: string;
}

export function BottomNav({ activeTab, setActiveTab, pinnedTabs = ["dashboard", "transactions", "goals", "reports", "more"], language = "bn" }: BottomNavProps) {
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
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 sm:px-6 pb-6 pt-4 flex justify-center pointer-events-none">
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
      
      <div className="bg-slate-900/90 backdrop-blur-3xl shadow-[0_20px_40px_-5px_rgba(0,0,0,0.3)] border border-white/10 rounded-[2.5rem] flex items-center justify-around w-full max-w-lg px-2 py-2 relative pointer-events-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center p-3 sm:px-4 sm:py-3 rounded-[2rem] transition-all duration-500 min-w-[64px] group",
                isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 bg-white/10 rounded-[2rem]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <Icon 
                  size={isActive ? 22 : 20} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={cn("transition-all duration-300", isActive && "text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]")} 
                />
                <span className={cn(
                  "text-[9px] font-bold tracking-widest uppercase transition-all duration-300",
                  isActive ? "opacity-100 text-teal-100" : "opacity-70 group-hover:opacity-100"
                )}>
                  {item.label}
                </span>
                {isActive && (
                   <div className="absolute -bottom-3 w-1.5 h-1.5 bg-teal-400 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/layout/BottomNav.tsx', content);

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Target, FileText, Sparkles, Settings, CreditCard, BookOpen } from "lucide-react";
import { cn } from "../lib/utils";

interface MoreMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAction?: (action: string) => void;
}

export function MoreMenuModal({ isOpen, onClose, activeTab, setActiveTab, onAction }: MoreMenuModalProps) {
  const menuItems = [
    { id: "ledger", label: "বাকির খাতা", icon: BookOpen },
    { id: "split_bills", label: "বিল স্প্লিট", icon: FileText, isAction: true },
    { id: "goals", label: "লক্ষ্য", icon: Target },
    { id: "subscriptions", label: "সাবস্ক্রিপশন", icon: CreditCard },
    { id: "invoices", label: "ইনভয়েস", icon: FileText },
    { id: "rewards", label: "পুরস্কার", icon: Sparkles },
    { id: "settings", label: "সেটিংস", icon: Settings },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-end lg:hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-white rounded-t-[2.5rem] p-6 pb-12 space-y-3 font-sans border-t border-slate-100"
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
            <h3 className="text-lg font-black mb-4 px-2 uppercase tracking-tight">আরও অপশন</h3>
            <div className="grid grid-cols-1 gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.isAction) {
                      onAction?.(item.id);
                    } else {
                      setActiveTab(item.id);
                    }
                    onClose();
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold",
                    !item.isAction && activeTab === item.id 
                      ? "bg-[#0d6e6e] text-white shadow-xl shadow-teal-900/10" 
                      : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <item.icon size={20} />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

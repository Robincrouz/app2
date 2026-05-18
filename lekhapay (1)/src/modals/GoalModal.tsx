import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Trash2, Target } from "lucide-react";
import { Goal } from "../types";
import { cn } from "../lib/utils";

interface GoalModalProps {
  onClose: () => void;
  onSave: (g: Partial<Goal>) => void;
  onDelete?: () => void;
  editingGoal: Goal | null;
}

export function GoalModal({ onClose, onSave, onDelete, editingGoal }: GoalModalProps) {
  const [goal, setGoal] = useState<Partial<Goal>>(editingGoal || {
    title: "",
    targetAmount: 0,
    currentAmount: 0,
    deadline: new Date().toISOString().split('T')[0],
    color: "#10b981"
  });

  const colors = [
    { value: "#10b981", label: "সবুজ" },
    { value: "#6366f1", label: "নীল" },
    { value: "#f59e0b", label: "হলুদ" },
    { value: "#ec4899", label: "গোলাপী" },
    { value: "#8b5cf6", label: "বেগুনি" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 100 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 100 }} 
        className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 font-sans border-t border-slate-100"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold text-slate-900 leading-none">
            {editingGoal ? "লক্ষ্য সম্পাদনা" : "নতুন লক্ষ্য"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-300">
            <X size={20}/>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">লক্ষ্যের নাম *</label>
            <input 
              type="text" 
              value={goal.title}
              onChange={(e) => setGoal({ ...goal, title: e.target.value })}
              className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-teal-500"
              placeholder="যেমন: নতুন আইফোন, ইউরোপ ট্যুর..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">টার্গেট *</label>
              <div className="relative">
                <input 
                  type="text" 
                  inputMode="decimal"
                  value={goal.targetAmount || ""}
                  onChange={(e) => setGoal({ ...goal, targetAmount: e.target.value as any })}
                  className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl font-bold text-lg focus:border-teal-500 outline-none"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">বর্তমান</label>
              <div className="relative">
                <input 
                  type="text" 
                  inputMode="decimal"
                  value={goal.currentAmount || ""}
                  onChange={(e) => setGoal({ ...goal, currentAmount: e.target.value as any })}
                  className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl font-bold text-lg focus:border-teal-500 outline-none"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">ডেডলাইন</label>
            <input 
              type="date" 
              value={goal.deadline}
              onChange={(e) => setGoal({ ...goal, deadline: e.target.value })}
              className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">রং</label>
            <div className="flex gap-3">
              {colors.map(c => (
                <button
                  key={c.value}
                  onClick={() => setGoal({ ...goal, color: c.value })}
                  className={cn(
                    "w-12 h-12 rounded-xl transition-all",
                    goal.color === c.value ? "ring-4 ring-slate-200 scale-110" : "hover:scale-105"
                  )}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-10">
          {editingGoal && onDelete && (
            <button 
              onClick={onDelete}
              className="px-4 py-4 bg-rose-50 text-rose-600 rounded-xl font-bold transition-all"
            >
              <Trash2 size={20} />
            </button>
          )}
          <button onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold transition-all">
            বাতিল
          </button>
          <button 
            disabled={!goal.title || !goal.targetAmount}
            onClick={() => onSave(goal)} 
            className="flex-[2] py-4 bg-[#0d6e6e] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20 disabled:opacity-50 transition-all"
          >
            <Target size={18} /> সংরক্ষণ করুন
          </button>
        </div>
      </motion.div>
    </div>
  );
}

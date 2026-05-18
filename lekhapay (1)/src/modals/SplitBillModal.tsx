import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Users, Receipt, PlusCircle, SplitSquareVertical } from "lucide-react";
import { cn } from "../lib/utils";
import { CATEGORIES } from "../types";

interface SplitBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSplit: (totalAmount: number, category: string, note: string, friends: {name: string, amount: number}[]) => Promise<boolean>;
}

export function SplitBillModal({ isOpen, onClose, onSaveSplit }: SplitBillModalProps) {
  const [total, setTotal] = useState<number | "">("");
  const [category, setCategory] = useState("food");
  const [note, setNote] = useState("");
  const [friends, setFriends] = useState<{name: string, amount: number}[]>([]);
  const [newFriend, setNewFriend] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");

  if (!isOpen) return null;

  const handleAddFriend = () => {
    if (newFriend.trim()) {
      setFriends([...friends, { name: newFriend.trim(), amount: 0 }]);
      setNewFriend("");
      recalculateEqualSplit([...friends, { name: newFriend.trim(), amount: 0 }], total);
    }
  };

  const removeFriend = (index: number) => {
    const updated = friends.filter((_, i) => i !== index);
    setFriends(updated);
    if (splitType === "equal") {
      recalculateEqualSplit(updated, total);
    }
  };

  const recalculateEqualSplit = (currentFriends: {name: string, amount: number}[], currentTotal: number | "") => {
    if (splitType !== "equal" || typeof currentTotal !== "number" || currentTotal <= 0) return;
    const totalPeople = currentFriends.length + 1; // Including the user
    const amountPerPerson = Math.round((currentTotal / totalPeople) * 100) / 100;
    
    setFriends(currentFriends.map(f => ({ ...f, amount: amountPerPerson })));
  };

  const handleTotalChange = (val: string) => {
    const num = parseFloat(val);
    setTotal(isNaN(num) ? "" : num);
    if (splitType === "equal") {
      recalculateEqualSplit(friends, isNaN(num) ? "" : num);
    }
  };

  const handleCustomAmountChange = (index: number, val: string) => {
    const num = parseFloat(val) || 0;
    const updated = [...friends];
    updated[index].amount = num;
    setFriends(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof total !== "number" || total <= 0 || friends.length === 0) return;
    
    setIsSubmitting(true);
    const success = await onSaveSplit(total, category, note, friends);
    setIsSubmitting(false);
    if (success) {
      setTotal("");
      setNote("");
      setFriends([]);
      onClose();
    }
  };

  const remainingParams = typeof total === "number" ? total - friends.reduce((sum, f) => sum + f.amount, 0) : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <SplitSquareVertical size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">বিল স্প্লিট করুন</h2>
              <p className="text-xs font-bold text-slate-400">বন্ধুদের সাথে খরচ ভাগ করে নিন</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border-2 border-transparent hover:border-slate-200 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 scrollbar-hide">
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">মোট বিলের পরিমাণ</label>
                <div className="relative">
                  <Receipt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="number"
                    required
                    placeholder="0.00"
                    value={total}
                    onChange={e => handleTotalChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-transparent focus:border-indigo-500/20 rounded-xl outline-none transition-all font-black text-slate-900 text-lg"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">খাত</label>
                <div className="grid grid-cols-4 gap-2">
                  {['food', 'transport', 'entertainment', 'other'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={cn(
                        "p-3 rounded-xl flex flex-col items-center gap-1 border-2 transition-all",
                        category === cat ? "border-indigo-500 bg-indigo-50/50" : "border-transparent bg-white hover:bg-slate-100"
                      )}
                    >
                      <span className="text-xl">{['🍔', '🚕', '🎬', '📦'][['food', 'transport', 'entertainment', 'other'].indexOf(cat)]}</span>
                      <span className="text-[10px] font-bold text-slate-600 truncate w-full text-center">{CATEGORIES[cat]?.label || cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">ছোট নোট (ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="উদাঃ কাচ্চি ভাই ট্রিট"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-transparent focus:border-indigo-500/20 rounded-xl outline-none transition-all font-medium text-slate-700"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => { setSplitType("equal"); recalculateEqualSplit(friends, total); }}
                className={cn(
                  "flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                  splitType === "equal" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                সমান ভাগে
              </button>
              <button
                type="button"
                onClick={() => setSplitType("custom")}
                className={cn(
                  "flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                  splitType === "custom" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                কাস্টম ভাগ
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center justify-between">
                <span>বন্ধুদের যোগ করুন</span>
                {splitType === "custom" && typeof total === "number" && (
                  <span className={cn("px-2 py-0.5 rounded text-xs", remainingParams < 0 ? "bg-rose-100 text-rose-600" : remainingParams === 0 ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600")}>
                    আপনার অংশ: {remainingParams.toFixed(2)}
                  </span>
                )}
              </label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="বন্ধুর নাম..."
                  value={newFriend}
                  onChange={e => setNewFriend(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddFriend())}
                  className="flex-1 px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 rounded-xl outline-none transition-all font-bold text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddFriend}
                  disabled={!newFriend.trim()}
                  className="px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  <PlusCircle size={20} />
                </button>
              </div>

              <div className="space-y-2 mt-4">
                {friends.map((friend, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white border-2 border-slate-100 p-2 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Users size={16} />
                    </div>
                    <span className="flex-1 font-bold text-sm truncate">{friend.name}</span>
                    
                    {splitType === "equal" ? (
                      <span className="px-3 font-mono font-bold text-slate-600">{friend.amount.toFixed(2)}</span>
                    ) : (
                      <input
                        type="number"
                        value={friend.amount || ""}
                        onChange={e => handleCustomAmountChange(idx, e.target.value)}
                        className="w-24 px-2 py-1.5 bg-slate-50 rounded-lg outline-none font-mono text-sm text-right border border-transparent focus:border-indigo-300"
                        placeholder="0"
                      />
                    )}
                    
                    <button type="button" onClick={() => removeFriend(idx)} className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 border-t border-slate-100 bg-slate-50 shrink-0">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || typeof total !== "number" || total <= 0 || friends.length === 0 || (splitType === "custom" && remainingParams < 0)}
            className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all outline-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center"
          >
            {isSubmitting ? (
              <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              `স্প্লিট সেভ করুন`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

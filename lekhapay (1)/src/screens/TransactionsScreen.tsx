import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, RefreshCw, Sparkles } from "lucide-react";
import { Transaction, CATEGORIES } from "../types";
import { TransactionItem } from "../components/TransactionItem";
import { Skeleton } from "../components/ui/Skeleton";
import { cn } from "../lib/utils";

interface TransactionsScreenProps {
  transactions: Transaction[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  debouncedSearch: string;
  txFilter: string;
  setTxFilter: (f: string) => void;
  onAddTx: () => void;
  onEditTx: (tx: Transaction) => void;
  onDeleteTx: (id: string) => void;
  onQuickAdd: () => void;
  currencySymbol: string;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 16, filter: 'blur(5px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export function TransactionsScreen({
  transactions, searchQuery, setSearchQuery, debouncedSearch, txFilter, setTxFilter,
  onAddTx, onEditTx, onDeleteTx, onQuickAdd, loading, currencySymbol
}: TransactionsScreenProps & { loading?: boolean }) {
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.note.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                         CATEGORIES[t.category]?.label.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesFilter = txFilter === "সব" || 
                         (txFilter === "আয়" && t.type === "income") ||
                         (txFilter === "ব্যয়" && t.type === "expense") ||
                         (txFilter === "ট্রান্সফার" && t.type === "transfer");
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 font-sans">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">লেনদেন</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            মোট {filteredTransactions.length}টি লেনদেন 
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onQuickAdd} className="hidden sm:flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:brightness-95 transition-all border border-amber-100 shadow-sm active:scale-95">
            <Sparkles size={16} className="text-amber-500" /> AI কুইক অ্যাড
          </button>
          <button onClick={onAddTx} className="w-12 h-12 bg-slate-900 text-white rounded-[1.25rem] flex items-center justify-center shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] active:scale-95 hover:bg-slate-800 transition-all">
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>
      </motion.div>

      <motion.div variants={item} className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors z-10">
          <Search size={20} strokeWidth={2.5} />
        </div>
        <input 
          type="text" 
          placeholder="সার্চ করুন (যেমন: 'নাস্তা', 'বেতন')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-14 py-4 bg-white border border-slate-100/60 rounded-[1.5rem] shadow-[0_4px_20px_-5px_rgba(0,0,0,0.02)] text-sm font-black placeholder:text-slate-300 placeholder:font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
        />
        {searchQuery && debouncedSearch !== searchQuery && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10">
            <RefreshCw size={18} strokeWidth={2.5} className="text-indigo-500 animate-spin" />
          </div>
        )}
      </motion.div>

      <motion.div variants={item} className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        </div>
        {["সব", "আয়", "ব্যয়", "ট্রান্সফার"].map(f => (
          <button 
            key={f} 
            onClick={() => setTxFilter(f)}
            className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap outline-none", txFilter === f ? "bg-slate-900 text-white shadow-md shadow-slate-900/20" : "bg-white border border-slate-100/60 shadow-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700")}
          >
            {f}
          </button>
        ))}
      </motion.div>

      <motion.div variants={item} className="space-y-4">
         {loading ? (
            <Skeleton className="h-24 w-full rounded-[1.5rem]" count={5} />
         ) : (
            <AnimatePresence mode="popLayout">
               {filteredTransactions.map(tx => (
                 <TransactionItem key={tx.id} tx={tx} onEdit={() => onEditTx(tx)} onDelete={() => onDeleteTx(tx.id)} currencySymbol={currencySymbol} />
               ))}
            </AnimatePresence>
         )}
         {!loading && filteredTransactions.length === 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-24 text-center px-4 bg-white rounded-[2rem] border border-slate-100/60 shadow-[0_4px_40px_-5px_rgba(0,0,0,0.02)]">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 shadow-inner"><Search size={40} strokeWidth={1.5} /></div>
              <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">কোনো লেনদেন পাওয়া যায়নি</h3>
              <p className="text-[11px] font-bold text-slate-400 max-w-[250px] mx-auto leading-relaxed uppercase tracking-wide">আপনার সার্চের সাথে মিল রয়েছে এমন কোনো লেনদেন খুজে পাওয়া যাচ্ছে না।</p>
            </motion.div>
          )}
      </motion.div>
    </motion.div>
  );
}

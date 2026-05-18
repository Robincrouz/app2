import React, { useState, useMemo } from "react";
import { Search, ArrowRight, List, Target, FileText, X, CreditCard, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Transaction, Goal, Invoice, Subscription, LedgerEntry, CATEGORIES } from "../types";
import { formatCurrency, formatDate, cn } from "../lib/utils";
import { TransactionItem } from "../components/TransactionItem";

interface SearchScreenProps {
  transactions: Transaction[];
  goals: Goal[];
  invoices: Invoice[];
  subscriptions: Subscription[];
  ledgerEntries: LedgerEntry[];
  onEditTx: (tx: Transaction) => void;
  onDeleteTx: (id: string) => void;
  onEditGoal: (g: Goal) => void;
  onEditInvoice: (inv: Invoice) => void;
  onEditSub: (s: Subscription) => void;
  onEditLedger: (l: LedgerEntry) => void;
  currencySymbol: string;
  onClose?: () => void;
}

export function SearchScreen({
  transactions, goals, invoices, subscriptions, ledgerEntries, onEditTx, onDeleteTx, 
  onEditGoal, onEditInvoice, onEditSub, onEditLedger, currencySymbol, onClose
}: SearchScreenProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return { transactions: [], goals: [], invoices: [], subscriptions: [], ledger: [] };
    const q = query.toLowerCase();

    return {
      transactions: transactions.filter(t => 
        t.note.toLowerCase().includes(q) || 
        CATEGORIES[t.category]?.label.toLowerCase().includes(q)
      ),
      goals: goals.filter(g => g.title.toLowerCase().includes(q)),
      invoices: invoices.filter(inv => 
        inv.clientName.toLowerCase().includes(q) || 
        inv.note?.toLowerCase().includes(q)
      ),
      subscriptions: subscriptions.filter(s => s.title.toLowerCase().includes(q)),
      ledger: ledgerEntries.filter(entry => 
        entry.contactName.toLowerCase().includes(q) || 
        entry.note?.toLowerCase().includes(q)
      )
    };
  }, [query, transactions, goals, invoices, subscriptions, ledgerEntries]);

  const totalResults = results.transactions.length + results.goals.length + results.invoices.length + results.subscriptions.length + results.ledger.length;

  return (
    <div className="space-y-6 font-sans">
      <div className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md pt-2 pb-4 -mx-4 px-4 border-b border-slate-200/50">
        <div className="relative">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             autoFocus
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             placeholder="লেনদেন, লক্ষ্য বা ইনভয়েস খুঁজুন..."
             className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-bold"
           />
           {query && (
             <button 
               onClick={() => setQuery("")}
               className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-slate-400"
             >
               <X size={14} />
             </button>
           )}
        </div>
      </div>

      {!query.trim() ? (
        <div className="flex flex-col items-center justify-center pt-20 text-center opacity-40">
           <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6">
              <Search size={32} className="text-slate-400" />
           </div>
           <p className="text-lg font-black text-slate-500">সার্চ করতে টাইপ করুন</p>
           <p className="text-sm font-bold text-slate-400">লেনদেন, লক্ষ্য বা কাস্টমারের নাম লিখুন</p>
        </div>
      ) : totalResults === 0 ? (
        <div className="flex flex-col items-center justify-center pt-20 text-center">
           <p className="text-lg font-black text-slate-300 italic">" {query} " এর জন্য কিছু পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {results.goals.length > 0 && (
             <section className="space-y-3">
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 px-1">
                 <Target size={12} className="text-teal-500" /> লক্ষ্য ({results.goals.length})
               </div>
               <div className="grid gap-3">
                 {results.goals.map(goal => (
                   <div 
                     key={goal.id} 
                     onClick={() => onEditGoal(goal)}
                     className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
                   >
                     <div className="flex flex-col">
                       <span className="text-sm font-bold text-slate-900 leading-none mb-1">{goal.title}</span>
                       <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">টার্গেট: {formatCurrency(goal.targetAmount, currencySymbol)}</span>
                     </div>
                     <ArrowRight size={14} className="text-slate-300" />
                   </div>
                 ))}
               </div>
             </section>
           )}

           {results.subscriptions.length > 0 && (
             <section className="space-y-3">
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 px-1">
                 <CreditCard size={12} className="text-teal-500" /> সাবস্ক্রিপশন ({results.subscriptions.length})
               </div>
               <div className="grid gap-3">
                 {results.subscriptions.map(sub => (
                   <div 
                     key={sub.id} 
                     onClick={() => onEditSub(sub)}
                     className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
                   >
                     <div className="flex flex-col">
                       <span className="text-sm font-bold text-slate-900 leading-none mb-1">{sub.title}</span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formatCurrency(sub.amount, currencySymbol)} • প্রতি মাস</span>
                     </div>
                     <ArrowRight size={14} className="text-slate-300" />
                   </div>
                 ))}
               </div>
             </section>
           )}

           {results.invoices.length > 0 && (
             <section className="space-y-3">
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 px-1">
                 <FileText size={12} className="text-teal-500" /> ইনভয়েস ({results.invoices.length})
               </div>
               <div className="grid gap-3">
                 {results.invoices.map(inv => (
                   <div 
                     key={inv.id} 
                     onClick={() => onEditInvoice(inv)}
                     className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
                   >
                     <div className="flex flex-col">
                       <span className="text-sm font-bold text-slate-900 leading-none mb-1">{inv.clientName}</span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formatDate(inv.dueDate)} • {formatCurrency(inv.amount, currencySymbol)}</span>
                     </div>
                     <ArrowRight size={14} className="text-slate-300" />
                   </div>
                 ))}
               </div>
             </section>
           )}

           {results.transactions.length > 0 && (
             <section className="space-y-3">
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 px-1">
                 <List size={12} className="text-teal-500" /> লেনদেন ({results.transactions.length})
               </div>
               <div className="space-y-2">
                 {results.transactions.map(tx => (
                   <TransactionItem 
                     key={tx.id} 
                     tx={tx} 
                     onEdit={() => onEditTx(tx)} 
                     onDelete={() => onDeleteTx(tx.id)} 
                     currencySymbol={currencySymbol} 
                   />
                 ))}
               </div>
             </section>
           )}
        </div>
      )}
    </div>
  );
}

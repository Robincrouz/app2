import React, { useState } from "react";
import { 
  Plus, Search, Filter, ArrowUpRight, ArrowDownLeft, 
  MoreVertical, Edit2, Trash2, CheckCircle2, AlertCircle, Phone
} from "lucide-react";
import { LedgerEntry } from "../types";
import { formatCurrency, cn } from "../lib/utils";

interface LedgerScreenProps {
  entries: LedgerEntry[];
  onAdd: () => void;
  onEdit: (l: LedgerEntry) => void;
  onDelete: (id: string) => void;
  currencySymbol: string;
}

export function LedgerScreen({ entries, onAdd, onEdit, onDelete, currencySymbol }: LedgerScreenProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'receivable' | 'payable'>('all');

  const filtered = entries.filter(e => {
    const matchesSearch = e.contactName.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'all' || e.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalReceivable = entries
    .filter(e => e.type === 'receivable' && e.status === 'pending')
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalPayable = entries
    .filter(e => e.type === 'payable' && e.status === 'pending')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl -mr-10 -mt-10" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">মোট পাবো</p>
          <p className="text-2xl font-black text-emerald-600 font-sans">
            {formatCurrency(totalReceivable, currencySymbol)}
          </p>
          <div className="mt-4 flex items-center gap-1.5">
            <div className="w-5 h-5 bg-emerald-100 rounded-lg flex items-center justify-center">
              <ArrowDownLeft size={12} className="text-emerald-600" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Receivable</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 blur-3xl -mr-10 -mt-10" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">মোট দেবো</p>
          <p className="text-2xl font-black text-rose-600 font-sans">
            {formatCurrency(totalPayable, currencySymbol)}
          </p>
          <div className="mt-4 flex items-center gap-1.5">
            <div className="w-5 h-5 bg-rose-100 rounded-lg flex items-center justify-center">
              <ArrowUpRight size={12} className="text-rose-600" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payable</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-50 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">লেনদেনের তালিকা</h3>
            <button 
              onClick={onAdd}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95"
            >
              <Plus size={14} /> নতুন যোগ করুন
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="নাম দিয়ে খুঁজুন..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 border-2 rounded-xl text-xs font-bold outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            {(['all', 'receivable', 'payable'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab === 'all' ? 'সবগুলো' : tab === 'receivable' ? 'পাবো' : 'দেবো'}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-50">
          {filtered.length > 0 ? (
            filtered.map((entry) => (
              <div key={entry.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-transform group-hover:scale-105",
                    entry.type === 'receivable' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  )}>
                    {entry.contactName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      {entry.contactName}
                      {entry.status === 'settled' && (
                        <CheckCircle2 size={12} className="text-emerald-500" />
                      )}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <AlertCircle size={10} />
                        {new Date(entry.date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long' })}
                      </span>
                      {entry.note && (
                        <span className="text-[10px] font-bold text-slate-300 italic">"{entry.note}"</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <p className={cn(
                      "text-sm font-black font-sans leading-none",
                      entry.status === 'settled' 
                        ? "text-slate-300 line-through decoration-2" 
                        : entry.type === 'receivable' ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {formatCurrency(entry.amount, currencySymbol)}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                      {entry.status === 'settled' ? 'পরিশোধিত' : entry.type === 'receivable' ? 'পাবো' : 'দেবো'}
                    </p>
                  </div>
                  
                  {/* Context Menu or Buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(entry)}
                      className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                      title="সম্পাদনা করুন"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => onDelete(entry.id)}
                      className="p-2 hover:bg-rose-100 rounded-lg text-rose-500 transition-colors"
                      title="মুছুন"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter size={24} className="text-slate-300" />
               </div>
               <p className="text-sm font-bold text-slate-400">কোন হিসাব পাওয়া যায়নি</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

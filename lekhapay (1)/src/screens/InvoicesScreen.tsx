import React from "react";
import { Plus, FileText } from "lucide-react";
import { Invoice } from "../types";
import { formatCurrency, formatDate, cn } from "../lib/utils";

interface InvoicesScreenProps {
  invoices: Invoice[];
  invoiceFilter: string;
  setInvoiceFilter: (f: string) => void;
  onAddInvoice: () => void;
  onEditInvoice: (inv: Invoice) => void;
  currencySymbol: string;
}

export function InvoicesScreen({
  invoices, invoiceFilter, setInvoiceFilter, onAddInvoice, onEditInvoice, currencySymbol
}: InvoicesScreenProps) {
  const filteredInvoices = invoices.filter(inv => {
    if (invoiceFilter === "সব") return true;
    if (invoiceFilter === "বকেয়া") return inv.status === "pending";
    if (invoiceFilter === "পরিশোধিত") return inv.status === "paid";
    return true;
  });

  return (
    <div className="space-y-6 overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-800">ইনভয়েস</h2>
          <button onClick={onAddInvoice} className="flex items-center gap-2 px-4 py-2 bg-[#0d6e6e] text-white rounded-xl font-bold text-sm shadow-lg shadow-teal-900/10 hover:bg-[#0a5a5a] transition-all">
            <Plus size={18} /> নতুন ইনভয়েস
          </button>
       </div>

       <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
         {["সব", "বকেয়া", "পরিশোধিত"].map(f => (
           <button key={f} onClick={() => setInvoiceFilter(f)} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all", invoiceFilter === f ? "bg-[#0d6e6e] text-white" : "bg-white border border-slate-100 text-slate-500")}>
             {f}
           </button>
         ))}
       </div>

       <div className="grid grid-cols-1 gap-3">
         {filteredInvoices.map(inv => (
           <div key={inv.id} onClick={() => onEditInvoice(inv)} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md cursor-pointer group">
             <div className="flex items-start justify-between mb-3">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><FileText size={20} /></div>
                 <div>
                   <h3 className="text-sm font-bold text-slate-900">{inv.clientName}</h3>
                   <p className="text-[10px] font-medium text-slate-400">ইস্যু ডেট: {formatDate(inv.issueDate)}</p>
                 </div>
               </div>
               <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", inv.status === "paid" ? "bg-teal-50 text-teal-600" : "bg-amber-50 text-amber-600")}>
                 {inv.status === "paid" ? "পরিশোধিত" : "বকেয়া"}
               </div>
             </div>
             <div className="flex items-end justify-between pt-3 border-t border-slate-50">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">পরিমাণ</p>
                  <p className="text-base font-black text-slate-900">{formatCurrency(inv.amount, currencySymbol)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">ডেডলাইন</p>
                  <p className="text-[11px] font-bold text-slate-900">{formatDate(inv.dueDate)}</p>
                </div>
             </div>
           </div>
         ))}
         {invoices.length === 0 && (
           <div className="py-20 text-center">
             <FileText size={48} className="mx-auto text-slate-200 mb-4" />
             <p className="text-slate-400 font-bold">কোনো ইনভয়েস নেই</p>
           </div>
         )}
       </div>
    </div>
  );
}

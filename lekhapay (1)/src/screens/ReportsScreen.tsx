import React from "react";
import html2pdf from "html2pdf.js";
import { 
  Plus, ArrowDownLeft, ArrowUpRight, Wallet, BarChart2, RefreshCw, Printer, TrendingUp as TrendingUpIcon, Sparkles, Download
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar,
  PieChart as RePieChart, Pie, Cell 
} from "recharts";
import { Transaction, CATEGORIES, AIForecast, FinancialHealth } from "../types";
import { StatCard } from "../components/StatCard";
import { TransactionItem } from "../components/TransactionItem";
import { FinancialHealthScore } from "../components/FinancialHealthScore";
import { formatCurrency, cn } from "../lib/utils";

interface ReportsScreenProps {
  income: number;
  expense: number;
  balance: number;
  transactions: Transaction[];
  reportPeriod: string;
  setReportPeriod: (p: "month" | "quarter" | "year") => void;
  selectedMonth: string | null;
  setSelectedMonth: (m: string | null) => void;
  dailyChartData: any[];
  monthlyChartData: any[];
  onEditTx: (tx: Transaction) => void;
  onDeleteTx: (id: string) => void;
  categoryBreakdown: any[];
  savingsRate: number;
  currencySymbol: string;
  forecastData: { forecast: AIForecast; health: FinancialHealth } | null;
  fetchForecast: () => void;
  aiStatus: string;
}

export function ReportsScreen({
  income, expense, balance, transactions, reportPeriod, setReportPeriod,
  selectedMonth, setSelectedMonth, dailyChartData, monthlyChartData,
  onEditTx, onDeleteTx, categoryBreakdown, savingsRate, currencySymbol,
  forecastData, fetchForecast, aiStatus
}: ReportsScreenProps) {
  const handleExportPDF = () => {
    const element = document.getElementById('report-content');
    const opt = {
      margin:       0.5,
      filename:     `মানি ম্যানেজমেন্ট উইথ এ আই_Report_${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "Type,Category,Amount,Date,Note\n";
    transactions.forEach(row => {
      const typeStr = row.type === 'income' ? 'Income' : (row.type === 'expense' ? 'Expense' : 'Transfer');
      const rowString = `"${typeStr}","${row.category}","${row.amount}","${row.date}","${row.note || ''}"`;
      csvContent += rowString + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `মানি ম্যানেজমেন্ট উইথ এ আই_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="report-content" className="space-y-6 overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans bg-slate-50 p-2">
       <div className="flex items-center justify-between" data-html2canvas-ignore="true">
          <h2 className="text-[28px] font-black text-slate-900 leading-none">রিপোর্ট</h2>
           <div className="flex items-center gap-2">
             <button 
               onClick={handleExportCSV}
               className="h-10 px-4 bg-emerald-600 border border-emerald-500 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700 transition-all gap-2 print:hidden"
               title="CSV/Excel Export"
             >
               <Download size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">এক্সেল / CSV</span>
             </button>
             <button 
               onClick={handleExportPDF}
               className="h-10 px-4 bg-slate-900 border border-slate-800 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all gap-2 print:hidden"
               title="PDF Export"
             >
               <Printer size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">পিডিএফ এক্সপোর্ট</span>
             </button>
             <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-teal-50 rounded-2xl border border-teal-100">
                <span className="text-[10px] font-black text-teal-800 uppercase tracking-widest hidden sm:inline">সেভিংস রেট</span>
                <span className="text-sm font-black text-teal-600">{savingsRate.toFixed(1)}%</span>
             </div>
          </div>
       </div>

       <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
         {[
           { id: "month", label: "এই মাস" },
           { id: "quarter", label: "কোয়ার্টার" },
           { id: "year", label: "বছর" }
         ].map((p) => (
           <button key={p.id} onClick={() => setReportPeriod(p.id as any)} className={cn("px-6 py-2 rounded-xl text-xs font-bold transition-all", reportPeriod === p.id ? "bg-[#0d6e6e] text-white" : "bg-white border border-slate-100 text-slate-600")}>
             {p.label}
           </button>
         ))}
       </div>

       <div className="grid grid-cols-2 gap-3">
          <StatCard label="মোট আয়" amount={income} icon={ArrowDownLeft} color="emerald" />
          <StatCard label="মোট ব্যয়" amount={expense} icon={ArrowUpRight} color="rose" />
          <div className="col-span-2"><StatCard label="নেট" amount={balance} icon={Wallet} color="teal" /></div>
       </div>

       {forecastData ? (
         <FinancialHealthScore 
           health={forecastData.health} 
           forecast={forecastData.forecast} 
           currencySymbol={currencySymbol} 
         />
       ) : (
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
               <Sparkles size={24} className="text-teal-600" />
            </div>
            <div>
               <h3 className="text-lg font-black text-slate-900">ভবিষ্যতের পূর্বাভাস চান?</h3>
               <p className="text-sm font-bold text-slate-400">আপনার লেনদেনের ওপর ভিত্তি করে AI আপনাকে গাইড করবে।</p>
            </div>
            <button 
              onClick={fetchForecast}
              disabled={aiStatus === "loading"}
              className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all disabled:opacity-50"
            >
              {aiStatus === "loading" ? "AI বিশ্লেষণ করছে..." : "AI পূর্বাভাস দেখুন"}
            </button>
         </div>
       )}

       <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
               <BarChart2 size={18} className="text-teal-600" />
               <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{selectedMonth ? `${selectedMonth} মাসের বিস্তারিত` : 'ক্যাশফ্লো ট্রেন্ড'}</h2>
               {selectedMonth && (
                 <button onClick={() => setSelectedMonth(null)} className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg hover:bg-teal-100 transition-colors">পূর্বাবস্থায়</button>
               )}
            </div>
            <div className="flex gap-3">
               <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div><span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">আয়</span></div>
               <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]"></div><span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">ব্যয়</span></div>
            </div>
          </div>
          <div className="h-[200px] w-full" style={{ minHeight: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={((selectedMonth ? dailyChartData : monthlyChartData) || []).length > 0 ? (selectedMonth ? dailyChartData : monthlyChartData) : [{ name: 'No Data', income: 0, expense: 0 }]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} onClick={(data) => { if (data && data.activeLabel && !selectedMonth) setSelectedMonth(String(data.activeLabel)); }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} dy={10} />
                <YAxis hide={!selectedMonth} axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 600, fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: '#f8fafc', radius: 10 }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }} formatter={(value: number) => formatCurrency(value, currencySymbol)} />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={selectedMonth ? undefined : 14} />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={selectedMonth ? undefined : 14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
       </div>

       <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="h-[280px] w-full" style={{ minHeight: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie 
                  data={categoryBreakdown.length > 0 ? categoryBreakdown.map(c => ({ name: c.label, value: c.amount, color: c.color })) : [{ name: 'No Data', value: 1, color: '#e2e8f0' }]}
                  cx="50%" cy="50%" innerRadius={75} outerRadius={105} paddingAngle={6} dataKey="value"
                >
                  {categoryBreakdown.length > 0 ? categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={3} />
                  )) : (
                    <Cell fill="#e2e8f0" stroke="#fff" strokeWidth={3} />
                  )}
                </Pie>
                {categoryBreakdown.length > 0 && (
                  <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }} formatter={(value: number) => formatCurrency(value, currencySymbol)} />
                )}
                <g>
                  <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-black fill-slate-900">{formatCurrency(expense, currencySymbol)}</text>
                  <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-black fill-slate-400 uppercase tracking-widest">মোট ব্যয়</text>
                </g>
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-y-3 mt-4 px-4">
            {categoryBreakdown.slice(0, 6).map((cat) => (
              <div key={cat.id} className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-[4px]" style={{ backgroundColor: cat.color }}></div>
                 <div className="flex flex-col">
                   <span className="text-[11px] font-black text-slate-800 leading-none">{cat.label}</span>
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{cat.percentage.toFixed(0)}%</span>
                 </div>
              </div>
            ))}
          </div>
       </div>

       <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest px-1">লেনদেন বিস্তারিত</h3>
          {transactions.slice(0, 5).map(tx => (
            <TransactionItem key={tx.id} tx={tx} onEdit={() => onEditTx(tx)} onDelete={() => onDeleteTx(tx.id)} currencySymbol={currencySymbol} />
          ))}
       </div>

       <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <TrendingUpIcon size={18} className="text-teal-400" />
             </div>
             <h3 className="text-sm font-black uppercase tracking-widest">আর্থিক প্রবণতা (Trends)</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">গড় মাসিক আয়</p>
                <p className="text-xl font-black">{formatCurrency(income / 12, currencySymbol)}</p>
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">গড় মাসিক ব্যয়</p>
                <p className="text-xl font-black">{formatCurrency(expense / 12, currencySymbol)}</p>
             </div>
          </div>
          <div className="pt-4 border-t border-white/10">
             <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic">
               * এই তথ্যগুলো আপনার ১২ মাসের লেনদেনের গড়ের ওপর ভিত্তি করে তৈরি হয়েছে।
             </p>
          </div>
       </div>
    </div>
  );
}

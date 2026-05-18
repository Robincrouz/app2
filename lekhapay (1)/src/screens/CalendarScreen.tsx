import React, { useMemo, useState } from "react";
import { LedgerEntry, Subscription } from "../types";
import { formatCurrency, cn } from "../lib/utils";
import { Calendar as CalendarIcon, CheckCircle2, AlertCircle, ArrowRight, BookOpen, CreditCard } from "lucide-react";

interface CalendarScreenProps {
  ledgerEntries: LedgerEntry[];
  subscriptions: Subscription[];
  currencySymbol: string;
}

export function CalendarScreen({ ledgerEntries, subscriptions, currencySymbol }: CalendarScreenProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];

  const getEventsForDate = (date: number) => {
    const events: any[] = [];
    const targetDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

    ledgerEntries.forEach(entry => {
      if (entry.date === targetDateStr && entry.status === "pending") {
        events.push({ type: 'ledger', color: entry.type === 'receivable' ? 'bg-emerald-500' : 'bg-rose-500', item: entry });
      }
    });

    subscriptions.forEach(sub => {
      if (sub.nextBillingDate === targetDateStr) {
        events.push({ type: 'subscription', color: 'bg-indigo-500', item: sub });
      }
    });

    return events;
  };

  const getUpcomingEvents = () => {
    const upcoming: any[] = [];
    const today = new Date().toISOString().split('T')[0];

    ledgerEntries.filter(e => e.status === "pending" && e.date >= today).forEach(entry => {
      upcoming.push({ type: 'ledger', date: entry.date, item: entry });
    });
    subscriptions.filter(s => s.nextBillingDate >= today).forEach(sub => {
      upcoming.push({ type: 'subscription', date: sub.nextBillingDate, item: sub });
    });

    return upcoming.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  };

  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="p-4 sm:p-6 pb-24 space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-fuchsia-50 text-fuchsia-600 rounded-2xl flex items-center justify-center shrink-0">
          <CalendarIcon size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">ক্যালেন্ডার ও রিমাইন্ডার</h2>
          <p className="text-xs font-bold text-slate-400">আপনার বকেয়া এবং সাবস্ক্রিপশন</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="px-4 py-2 hover:bg-slate-50 rounded-xl font-bold text-slate-600">&lt;</button>
          <h3 className="text-lg font-black text-slate-800">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <button onClick={nextMonth} className="px-4 py-2 hover:bg-slate-50 rounded-xl font-bold text-slate-600">&gt;</button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
          {["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"].map(d => <div key={d}>{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="h-10" />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const date = i + 1;
            const events = getEventsForDate(date);
            const isToday = new Date().getDate() === date && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
            
            return (
              <div key={date} className={cn("h-10 rounded-xl border flex flex-col items-center justify-start py-1 relative", isToday ? "border-fuchsia-500 bg-fuchsia-50" : "border-slate-100")}>
                <span className={cn("text-xs font-bold", isToday ? "text-fuchsia-600" : "text-slate-600")}>{date}</span>
                <div className="flex gap-0.5 mt-auto pb-1">
                  {events.map((e, idx) => (
                    <div key={idx} className={cn("w-1.5 h-1.5 rounded-full", e.color)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">আসন্ন ইভেন্ট</h3>
        {upcomingEvents.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-medium bg-white rounded-3xl border border-slate-100">কোনো আসন্ন ইভেন্ট নেই</div>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((evt, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", 
                    evt.type === 'subscription' ? 'bg-indigo-50 text-indigo-600' : 
                    (evt.item.type === 'receivable' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600')
                  )}>
                    {evt.type === 'subscription' ? <CreditCard size={20} /> : <BookOpen size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{evt.type === 'subscription' ? evt.item.name : evt.item.contactName}</p>
                    <p className="text-xs font-medium text-slate-500">{new Date(evt.date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })} • {evt.type === 'subscription' ? 'সাবস্ক্রিপশন' : (evt.item.type === 'receivable' ? 'পাবো' : 'দেবো')}</p>
                  </div>
                </div>
                <div className="font-black text-slate-900">
                  {formatCurrency(evt.type === 'subscription' ? evt.item.amount : evt.item.amount, currencySymbol)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

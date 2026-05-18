import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Wallet, Sparkles, LogIn, Bell, X, CheckCircle2 } from "lucide-react";
import { exportToJson, exportToCsv } from "./lib/exporters";
import { clearAllUserData } from "./services/dataDeletion";

// Hooks
import { useAuth } from "./hooks/useAuth";
import { useFirebaseData } from "./hooks/useFirebaseData";
import { usePWA } from "./hooks/usePWA";
import { useFinancialData } from "./hooks/useFinancialData";
import { useOperations } from "./hooks/useOperations";
import { useAi } from "./hooks/useAi";
import { useDebounce } from "./hooks/useDebounce";

// Components
import { Toast } from "./components/Toast";
import { Header } from "./components/layout/Header";
import { BottomNav } from "./components/layout/BottomNav";
import { SideNav } from "./components/layout/SideNav";
import { InstallBanner } from "./components/InstallBanner";

// Modals
import { TransactionModal } from "./modals/TransactionModal";
import { BudgetModal } from "./modals/BudgetModal";
import { GoalModal } from "./modals/GoalModal";
import { InvoiceModal } from "./modals/InvoiceModal";
import { QuickAddModal } from "./modals/QuickAddModal";
import { SplitBillModal } from "./modals/SplitBillModal";
import { MoreMenuModal } from "./modals/MoreMenuModal";
import { SubscriptionModal } from "./modals/SubscriptionModal";
import { LedgerModal } from "./components/LedgerModal";

// Screens
import { DashboardScreen } from "./screens/DashboardScreen";
import { TransactionsScreen } from "./screens/TransactionsScreen";
import { BudgetsScreen } from "./screens/BudgetsScreen";
import { GoalsScreen } from "./screens/GoalsScreen";
import { InvoicesScreen } from "./screens/InvoicesScreen";
import { RewardsScreen } from "./screens/RewardsScreen";
import { ReportsScreen } from "./screens/ReportsScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { SearchScreen } from "./screens/SearchScreen";
import { SubscriptionsScreen } from "./screens/SubscriptionsScreen";
import { LedgerScreen } from "./screens/LedgerScreen";
import { AppGridScreen } from "./screens/AppGridScreen";
import { CalendarScreen } from "./screens/CalendarScreen";
import { SharedWalletsScreen } from "./screens/SharedWalletsScreen";
import { SmsSyncScreen } from "./screens/SmsSyncScreen";
import { InvestmentsScreen } from "./screens/InvestmentsScreen";
import { GeoAlertsScreen } from "./screens/GeoAlertsScreen";
import { ChallengesScreen } from "./screens/ChallengesScreen";
import { PinLockScreen } from "./screens/PinLockScreen";

import { CATEGORIES, Transaction, Budget, Goal, Invoice, Subscription, LedgerEntry } from "./types";
import { formatCurrency, formatDate } from "./lib/utils";

import { THEMES, ThemeType } from "./lib/themes";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  const { user, isAuthLoading, handleLogin, handleLogout } = useAuth();
  const { 
    transactions, budgets, goals, invoices, achievements, subscriptions, ledgerEntries, investments, settings, updateSettings,
    isLoading: isDataLoading, setBudgets, setAchievements 
  } = useFirebaseData(user);

  useEffect(() => {
    let themeColorName = settings?.theme || "teal";
    const themeConfig = THEMES[themeColorName as ThemeType] || THEMES.teal;
    const colors = themeConfig.colors;

    const styleId = "dynamic-theme";
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    
    styleTag.innerHTML = `
      :root {
        --color-teal-50: ${colors[50]};
        --color-teal-100: ${colors[100]};
        --color-teal-200: ${colors[200]};
        --color-teal-300: ${colors[300]};
        --color-teal-400: ${colors[400]};
        --color-teal-500: ${colors[500]};
        --color-teal-600: ${colors[600]};
        --color-teal-700: ${colors[700]};
        --color-teal-800: ${colors[800]};
        --color-teal-900: ${colors[900]};
        --color-teal-950: ${colors[950]};
      }
    `;
  }, [settings?.theme]);
  
  const { isOnline, showInstallBanner, setShowInstallBanner, handlePWAInstall } = usePWA();
  const { 
    income, expense, balance, healthScore, monthlyChartData, weeklyStats, getDailyChartData,
    categoryBreakdown, savingsRate, currencySymbol 
  } = useFinancialData({ transactions, budgets, goals, currencySymbol: settings.currency });
  const { 
    saveTransaction, deleteTransaction, saveBudget, deleteBudget, 
    saveGoal, deleteGoal, saveInvoice, deleteInvoice,
    saveSubscription, deleteSubscription, saveLedger, deleteLedger,
    saveInvestment, deleteInvestment
  } = useOperations(user, setToast);
  const { 
    aiInsights, forecastData, aiStatus, retrySeconds, fetchAiInsights, fetchForecast, parseVoiceInput, scanReceipt, parseSms 
  } = useAi(transactions, budgets, user, balance, settings.language || "bn");

  // UI State
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);
  const [editingLedger, setEditingLedger] = useState<LedgerEntry | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [txFilter, setTxFilter] = useState("সব");
  const [invoiceFilter, setInvoiceFilter] = useState("সব");
  const [reportPeriod, setReportPeriod] = useState<"month" | "quarter" | "year">("month");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [quickInput, setQuickInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (settings._loaded && !settings.isPinEnabled) {
      setIsUnlocked(true);
    }
  }, [settings._loaded, settings.isPinEnabled]);

  const debouncedSearch = useDebounce(searchQuery, 400);
  const isInitializing = isAuthLoading || (user && !settings._loaded);
  const isContentLoading = !!(user && isDataLoading);

  // Sync Achievements and Budgets
  useEffect(() => {
    const updatedBudgets = budgets.map(b => {
      const spent = transactions
        .filter(t => t.type === "expense" && t.category === b.category)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...b, spent };
    });
    const hasChanged = updatedBudgets.some((b, i) => b.spent !== budgets[i]?.spent);
    if (hasChanged) setBudgets(updatedBudgets);
  }, [transactions]);

  const handleAiProcess = async () => {
    if (!quickInput.trim() || !user) return;
    setIsProcessing(true);
    try {
      const items = await parseVoiceInput(quickInput);
      for (const item of items) {
        if (item.entryType === "ledger") {
          await saveLedger({
            contactName: item.contactName || "অজানা",
            amount: item.amount,
            type: item.ledgerType || "receivable",
            date: new Date().toISOString().split('T')[0],
            status: "pending",
            note: item.note
          }, null);
        } else if (item.entryType === "budget") {
          await saveBudget({
            category: item.category || "other",
            limit: item.amount,
            alert: item.amount * 0.9,
            spent: 0
          }, null);
        } else if (item.entryType === "goal") {
          await saveGoal({
            title: item.title || item.note || "নতুন লক্ষ্য",
            targetAmount: item.targetAmount || item.amount,
            currentAmount: 0,
            deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days default
            color: "#10b981",
            status: "active"
          }, null);
        } else if (item.entryType === "subscription") {
          await saveSubscription({
            name: item.title || item.note || "নতুন কিস্তি",
            amount: item.amount,
            billingCycle: "monthly",
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category: item.category || "bills"
          }, null);
        } else if (item.entryType === "investment") {
          await saveInvestment({
            name: item.title || item.note || "বিনিয়োগ",
            amountInvested: item.amount,
            currentValue: item.amount,
            type: item.type || "other",
            date: new Date().toISOString().split('T')[0]
          }, null);
        } else if (item.entryType === "invoice") {
          await saveInvoice({
            clientName: item.contactName || item.note || "গ্রাহক",
            amount: item.amount,
            date: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: "pending",
            items: [{ description: item.note || "বপণ্য/সেবা", amount: item.amount, quantity: 1 }]
          }, null);
        } else {
          await saveTransaction({ 
            amount: item.amount,
            category: item.category,
            note: item.note,
            type: item.type as any,
            date: new Date().toISOString().split('T')[0]
          }, null);
        }
      }
      setQuickInput("");
      setIsQuickAddOpen(false);
      setToast({ message: "সফলভাবে যোগ করা হয়েছে", type: 'success' });
    } catch (e) {
      setToast({ message: "ত্রুটি হয়েছে", type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReceiptScan = async (imageBase64: string) => {
    if (!user) return;
    setIsProcessing(true);
    try {
      // Assuming you have this implemented in useAi:
      const result = await scanReceipt(imageBase64);
      if (result.amount > 0 || result.note) {
        await saveTransaction({ 
          amount: result.amount || 0,
          category: result.category || "other",
          note: result.note || result.merchant || "স্ক্যান করা বিল",
          type: "expense",
          date: result.date || new Date().toISOString().split('T')[0]
        }, null);
        setQuickInput("");
        setIsQuickAddOpen(false);
        setToast({ message: "বিল সফলভাবে স্ক্যান করা হয়েছে", type: 'success' });
      } else {
         setToast({ message: "বিলের তথ্য বোঝা যায়নি। পরিষ্কার ছবি দিন।", type: 'error' });
      }
    } catch (e) {
      setToast({ message: "স্ক্যান করতে ত্রুটি হয়েছে", type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveSplitBill = async (totalAmount: number, category: string, note: string, friends: {name: string, amount: number}[]) => {
    try {
      await saveTransaction({
        amount: totalAmount,
        category,
        note: note ? `${note} (স্প্লিট বিল)` : "স্প্লিট বিল",
        type: "expense",
        date: new Date().toISOString().split('T')[0]
      }, null);

      for (const friend of friends) {
        if (friend.amount > 0) {
          await saveLedger({
            contactName: friend.name,
            amount: friend.amount,
            type: "receivable",
            date: new Date().toISOString().split('T')[0],
            status: "pending",
            note: note ? `স্প্লিট: ${note}` : `স্প্লিট বিল শেয়ার`
          }, null);
        }
      }
      setToast({ message: "সফলভাবে স্প্লিট বিল সেভ হয়েছে", type: "success" });
      return true;
    } catch (e) {
      setToast({ message: "স্প্লিট বিল সেভ করতে সমস্যা হয়েছে", type: "error" });
      return false;
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setToast({ message: "আপনার ব্রাউজার ভয়েস ইনপুট সাপোর্ট করে না", type: "error" });
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "bn-BD";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuickInput(transcript);
    };
    recognition.start();
  };

  const handleExport = (format: "json" | "csv") => {
    if (format === "json") {
      exportToJson({ 
        transactions, budgets, goals, invoices, subscriptions, 
        exportDate: new Date().toISOString(),
        app: "মানি ম্যানেজমেন্ট উইথ এ আই"
      });
    } else {
      exportToCsv(transactions);
    }
    setToast({ message: `${format.toUpperCase()} এক্সপোর্ট সম্পন্ন হয়েছে`, type: "success" });
  };

  const handleClearData = async () => {
    if (!user) return;
    const confirm1 = window.confirm("আপনি কি নিশ্চিত? আপনার সমস্ত ডেটা স্থায়ীভাবে মুছে যাবে এবং এটি আর ফিরে পাওয়া সম্ভব নয়। (Are you sure? All data will be permanently deleted.)");
    if (!confirm1) return;
    
    const confirm2 = window.confirm("সতর্কতা: এটি আপনার সব আর্থিক রেকর্ড মুছে ফেলবে। আপনি কি সত্যিই মুছে ফেলতে চান? (Warning: This will delete all financial records. Really delete?)");
    if (!confirm2) return;

    setIsProcessing(true);
    try {
      await clearAllUserData(user.uid);
      setToast({ message: "আপনার সমস্ত ডেটা সফলভাবে মুছে ফেলা হয়েছে", type: "success" });
    } catch (e) {
      console.error(e);
      setToast({ message: "ডেটা মুছতে সমস্যা হয়েছে", type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  const dailyChartData = useMemo(() => getDailyChartData(selectedMonth), [selectedMonth, getDailyChartData]);

  if (isInitializing) return (
    <div className="h-screen flex items-center justify-center bg-white font-sans relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-400/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000" />
      <div className="text-center space-y-6 relative z-10">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-24 h-24 bg-gradient-to-br from-[#0B0F19] to-[#111827] rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-teal-900/30 border border-teal-500/20">
          <Wallet size={48} className="text-white" strokeWidth={1.5} />
        </motion.div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter">মানি ম্যানেজমেন্ট উইথ এ আই</h2>
      </div>
    </div>
  );

  if (!user) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white font-sans p-6 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-[40rem] h-[40rem] bg-teal-50/50 rounded-full mix-blend-multiply filter blur-[80px]" />
      <div className="absolute -bottom-40 -right-20 w-[40rem] h-[40rem] bg-emerald-50/50 rounded-full mix-blend-multiply filter blur-[80px]" />
      
      <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="max-w-md w-full text-center space-y-12 relative z-10">
        <div className="space-y-6">
          <div className="w-28 h-28 bg-gradient-to-br from-[#0B0F19] to-[#111827] rounded-[3rem] flex items-center justify-center mx-auto shadow-[0_20px_60px_-15px_rgba(13,110,110,0.5)] border border-teal-500/20 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay rounded-[3rem]"></div>
            <Sparkles size={56} className="text-white relative z-10" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">মানি ম্যানেজমেন্ট উইথ এ আই</h1>
            <p className="text-slate-500 font-medium text-sm px-8 leading-relaxed">স্মার্ট, সুরক্ষিত ও এআই-পাওয়ার্ড ফিন্যান্সিয়াল ট্র্যাকিং আপনার হাতের মুঠোয়।</p>
          </div>
        </div>
        
        <div className="pt-8">
          <button onClick={handleLogin} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3 hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <LogIn size={18} /> গুগল দিয়ে শুরু করুন
          </button>
          <p className="mt-8 text-[10px] uppercase tracking-widest font-bold text-slate-400">Trusted by 10,000+ Users</p>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="h-[100dvh] bg-slate-50 text-slate-900 font-sans overflow-hidden print:overflow-visible print:h-auto flex flex-col lg:flex-row">
      <SideNav activeTab={activeTab} setActiveTab={setActiveTab} pinnedTabs={settings.pinnedTabs} language={settings.language} />
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative">
        <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>
        <AnimatePresence>
          {settings._loaded && settings.isPinEnabled && settings.pinCode && !isUnlocked && (
            <PinLockScreen correctPin={settings.pinCode} onUnlock={() => setIsUnlocked(true)} />
          )}
        </AnimatePresence>
        
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          balance={balance} 
          notificationCount={0} 
          setShowNotifications={setShowNotifications} 
          userPhoto={user.photoURL} 
          userName={user.displayName} 
          currencySymbol={currencySymbol}
          language={settings.language}
        />
        {settings.navStyle === "top" && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} pinnedTabs={settings.pinnedTabs} language={settings.language} navStyle={settings.navStyle} />}

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain print:overflow-visible scrollbar-hide pb-28 lg:pb-8 pt-4 sm:pt-6 print:pb-0" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="px-4 sm:px-6 md:px-8 w-full max-w-5xl mx-auto space-y-8">
            {activeTab === "dashboard" && (
            <DashboardScreen 
              loading={isContentLoading}
              income={income} expense={expense} balance={balance} transactions={transactions} budgets={budgets} 
              aiInsights={aiInsights} aiStatus={aiStatus} retrySeconds={retrySeconds}
              weeklyStats={weeklyStats}
              onEditTx={(tx) => { setEditingTx(tx); setIsTxModalOpen(true); }}
              onDeleteTx={deleteTransaction} onQuickAdd={() => setIsQuickAddOpen(true)}
              onTabChange={setActiveTab} onSyncAi={fetchAiInsights}
              currencySymbol={currencySymbol}
            />
          )}
          {activeTab === "transactions" && (
              <TransactionsScreen 
                loading={isContentLoading}
                transactions={transactions} searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
                debouncedSearch={debouncedSearch} txFilter={txFilter} setTxFilter={setTxFilter}
                onAddTx={() => { setEditingTx(null); setIsTxModalOpen(true); }}
                onEditTx={(tx) => { setEditingTx(tx); setIsTxModalOpen(true); }}
                onDeleteTx={deleteTransaction} onQuickAdd={() => setIsQuickAddOpen(true)}
                currencySymbol={currencySymbol}
              />
          )}
          {activeTab === "budgets" && <BudgetsScreen budgets={budgets} onAddBudget={() => { setEditingBudget(null); setIsBudgetModalOpen(true); }} onEditBudget={(b) => { setEditingBudget(b); setIsBudgetModalOpen(true); }} />}
          {activeTab === "goals" && <GoalsScreen goals={goals} onAddGoal={() => { setEditingGoal(null); setIsGoalModalOpen(true); }} onEditGoal={(g) => { setEditingGoal(g); setIsGoalModalOpen(true); }} currencySymbol={currencySymbol} />}
          {activeTab === "subscriptions" && <SubscriptionsScreen subscriptions={subscriptions} onAddSub={() => { setEditingSub(null); setIsSubModalOpen(true); }} onEditSub={(s) => { setEditingSub(s); setIsSubModalOpen(true); }} currencySymbol={currencySymbol} />}
          {activeTab === "rewards" && <RewardsScreen achievements={achievements} />}
          {activeTab === "invoices" && <InvoicesScreen invoices={invoices} invoiceFilter={invoiceFilter} setInvoiceFilter={setInvoiceFilter} onAddInvoice={() => { setEditingInvoice(null); setIsInvoiceModalOpen(true); }} onEditInvoice={(inv) => { setEditingInvoice(inv); setIsInvoiceModalOpen(true); }} currencySymbol={currencySymbol} />}
          {activeTab === "ledger" && (
            <LedgerScreen 
              entries={ledgerEntries} 
              currencySymbol={currencySymbol} 
              onAdd={() => { setEditingLedger(null); setIsLedgerModalOpen(true); }} 
              onEdit={(l) => { setEditingLedger(l); setIsLedgerModalOpen(true); }} 
              onDelete={deleteLedger}
            />
          )}
          {activeTab === "reports" && (
            <ReportsScreen 
              income={income} expense={expense} balance={balance} 
              transactions={transactions} reportPeriod={reportPeriod} 
              setReportPeriod={setReportPeriod} selectedMonth={selectedMonth} 
              setSelectedMonth={setSelectedMonth} dailyChartData={dailyChartData} 
              monthlyChartData={monthlyChartData} onEditTx={(tx)=> {setEditingTx(tx); setIsTxModalOpen(true);}} 
              onDeleteTx={deleteTransaction} 
              categoryBreakdown={categoryBreakdown}
              savingsRate={savingsRate}
              currencySymbol={currencySymbol}
              forecastData={forecastData}
              fetchForecast={fetchForecast}
              aiStatus={aiStatus}
            />
          )}
          {activeTab === "search" && (
            <SearchScreen 
              transactions={transactions}
              goals={goals}
              invoices={invoices}
              subscriptions={subscriptions}
              ledgerEntries={ledgerEntries}
              onEditTx={(tx) => { setEditingTx(tx); setIsTxModalOpen(true); }}
              onDeleteTx={deleteTransaction}
              onEditGoal={(g) => { setEditingGoal(g); setIsGoalModalOpen(true); }}
              onEditInvoice={(inv) => { setEditingInvoice(inv); setIsInvoiceModalOpen(true); }}
              onEditSub={(s) => { setEditingSub(s); setIsSubModalOpen(true); }}
              onEditLedger={(l) => { setEditingLedger(l); setIsLedgerModalOpen(true); }}
              currencySymbol={currencySymbol}
            />
          )}
          {activeTab === "more" && <AppGridScreen onNavigate={setActiveTab} onAction={(action) => { if (action === "split_bills") setIsSplitBillOpen(true); }} activeTab={activeTab} settings={settings} onUpdateSettings={updateSettings} />}
          {activeTab === "calendar" && <CalendarScreen ledgerEntries={ledgerEntries} subscriptions={subscriptions} currencySymbol={currencySymbol} />}
          {activeTab === "shared_wallets" && <SharedWalletsScreen />}
          {activeTab === "sms_sync" && <SmsSyncScreen parseSms={parseSms} onSaveTransaction={(data) => {
            saveTransaction({
              amount: data.amount,
              category: data.category,
              type: data.type,
              note: data.note,
              date: new Date().toISOString().split('T')[0]
            }, null)
          }} setToast={setToast} />}
          {activeTab === "investments" && <InvestmentsScreen investments={investments} currencySymbol={currencySymbol} onSave={saveInvestment} onDelete={deleteInvestment} />}
          {activeTab === "geo_alerts" && <GeoAlertsScreen />}
          {activeTab === "challenges" && <ChallengesScreen />}
          {activeTab === "settings" && <SettingsScreen settings={settings} onUpdateSettings={updateSettings} onExport={handleExport} onClearData={handleClearData} user={user} handleLogout={handleLogout} />}
        </div>
      </div>

      {settings.navStyle !== "top" && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} pinnedTabs={settings.pinnedTabs} language={settings.language} navStyle={settings.navStyle} />}
      
      <AnimatePresence>
        {showNotifications && (
          <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: -20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: -20 }}
               className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl shadow-slate-900/20 border border-slate-100 overflow-hidden"
             >
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-teal-600">
                   <h3 className="text-white font-black text-lg flex items-center gap-2 italic tracking-tight">
                     <Bell size={20} /> নোটিফিকেশন
                   </h3>
                   <button onClick={() => setShowNotifications(false)} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                     <X size={20} />
                   </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
                   <div className="p-4 bg-teal-50 rounded-3xl border border-teal-100 flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0">
                         <CheckCircle2 size={20} />
                      </div>
                      <div>
                         <h4 className="text-slate-900 font-bold text-sm">স্বাগতম মানি ম্যানেজমেন্ট-এ!</h4>
                         <p className="text-slate-500 text-[10px] leading-relaxed mt-1 font-medium italic">আপনার আর্থিক হিসেব এখন হবে আরো সহজ এবং স্মার্ট। শুরুতেই আপনার মাসিক বাজেট সেট করে নিন।</p>
                         <span className="text-[9px] text-teal-600 font-bold uppercase tracking-widest mt-2 block">এখনই</span>
                      </div>
                   </div>
                   <div className="p-10 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-200 shadow-inner">
                         <Bell size={32} />
                      </div>
                      <p className="text-slate-400 text-xs font-bold italic">আপাতত নতুন কোনো নোটিফিকেশন নেই</p>
                   </div>
                </div>
                <div className="p-4 bg-slate-50/50 border-t border-slate-100 font-bold text-[10px] text-center text-slate-400 uppercase tracking-widest italic">
                   Powered by AI
                </div>
             </motion.div>
             <div onClick={() => setShowNotifications(false)} className="fixed inset-0 -z-10 bg-slate-950/20 backdrop-blur-sm" />
          </div>
        )}
      </AnimatePresence>
      
      <InstallBanner show={showInstallBanner} onClose={() => setShowInstallBanner(false)} onInstall={handlePWAInstall} />
      
      <QuickAddModal 
        isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} 
        quickInput={quickInput} setQuickInput={setQuickInput} 
        startVoiceInput={startVoiceInput} handleAiProcess={handleAiProcess} 
        handleReceiptScan={handleReceiptScan}
        isListening={isListening} isProcessing={isProcessing} 
      />

      <SplitBillModal
        isOpen={isSplitBillOpen}
        onClose={() => setIsSplitBillOpen(false)}
        onSaveSplit={handleSaveSplitBill}
      />

      <MoreMenuModal isOpen={showMoreMenu} onClose={() => setShowMoreMenu(false)} activeTab={activeTab} setActiveTab={setActiveTab} onAction={(action) => { if (action === "split_bills") setIsSplitBillOpen(true); }} />

      <AnimatePresence>
        {isTxModalOpen && (
          <TransactionModal 
            onClose={() => { setIsTxModalOpen(false); setEditingTx(null); }} 
            onSave={(tx) => { saveTransaction(tx, editingTx); setIsTxModalOpen(false); }} 
            onDelete={() => { if(editingTx) deleteTransaction(editingTx.id); setIsTxModalOpen(false); }}
            editingTx={editingTx} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBudgetModalOpen && (
          <BudgetModal 
            onClose={() => { setIsBudgetModalOpen(false); setEditingBudget(null); }} 
            onSave={(b) => { saveBudget(b, editingBudget); setIsBudgetModalOpen(false); }} 
            onDelete={() => { if(editingBudget) deleteBudget(editingBudget.id); setIsBudgetModalOpen(false); }} 
            editingBudget={editingBudget} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isGoalModalOpen && (
          <GoalModal 
            onClose={() => { setIsGoalModalOpen(false); setEditingGoal(null); }} 
            onSave={(g) => { saveGoal(g, editingGoal); setIsGoalModalOpen(false); }} 
            onDelete={() => { if(editingGoal) deleteGoal(editingGoal.id); setIsGoalModalOpen(false); }} 
            editingGoal={editingGoal} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isInvoiceModalOpen && (
          <InvoiceModal 
            onClose={() => { setIsInvoiceModalOpen(false); setEditingInvoice(null); }} 
            onSave={(inv) => { saveInvoice(inv, editingInvoice); setIsInvoiceModalOpen(false); }} 
            onDelete={() => { if(editingInvoice) deleteInvoice(editingInvoice.id); setIsInvoiceModalOpen(false); }} 
            editingInvoice={editingInvoice} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSubModalOpen && (
          <SubscriptionModal 
            onClose={() => { setIsSubModalOpen(false); setEditingSub(null); }} 
            onSave={(s) => { saveSubscription(s, editingSub); setIsSubModalOpen(false); }} 
            onDelete={() => { if(editingSub) deleteSubscription(editingSub.id); setIsSubModalOpen(false); }} 
            editingSub={editingSub} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLedgerModalOpen && (
          <LedgerModal 
            isOpen={isLedgerModalOpen}
            onClose={() => { setIsLedgerModalOpen(false); setEditingLedger(null); }} 
            onSave={saveLedger} 
            editingLedger={editingLedger} 
          />
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
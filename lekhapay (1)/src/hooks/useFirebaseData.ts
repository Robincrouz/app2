import { useState, useEffect } from "react";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy,
  doc,
  setDoc
} from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";
import { db } from "../firebase";
import { Transaction, Budget, Goal, Invoice, Achievement, Subscription, LedgerEntry, Investment } from "../types";
import { handleFirestoreError, OperationType } from "../lib/firestoreErrorHandler";

export function useFirebaseData(user: FirebaseUser | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [settings, setSettings] = useState<{ currency: string; pinnedTabs: string[], language: string, pinCode?: string, isPinEnabled?: boolean, theme?: string, navStyle?: string, _loaded?: boolean }>({ 
    currency: "৳", 
    pinnedTabs: ["dashboard", "transactions", "budgets", "goals", "more"],
    language: "bn",
    pinCode: "",
    isPinEnabled: false,
    theme: "teal",
    navStyle: "bottom",
    _loaded: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setBudgets([]);
      setGoals([]);
      setInvoices([]);
      setAchievements([]);
      setSubscriptions([]);
      setLedgerEntries([]);
      setInvestments([]);
      setSettings({ currency: "৳", pinnedTabs: ["dashboard", "transactions", "budgets", "goals", "more"] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const userId = user.uid;

    const settingsRef = doc(db, "users", userId, "settings", "general");
    const unsubSettings = onSnapshot(settingsRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setSettings({
          currency: data.currency || "৳",
          pinnedTabs: data.pinnedTabs || ["dashboard", "transactions", "budgets", "goals", "more"],
          language: data.language || "bn",
          isPinEnabled: data.isPinEnabled || false,
          pinCode: data.pinCode || "",
          theme: data.theme || "teal",
          navStyle: data.navStyle || "bottom",
          _loaded: true
        });
      } else {
        setDoc(settingsRef, { 
          currency: "৳", 
          pinnedTabs: ["dashboard", "transactions", "budgets", "goals", "more"],
          language: "bn",
          isPinEnabled: false,
          pinCode: "",
          theme: "teal",
          navStyle: "bottom"
        });
        setSettings(prev => ({ ...prev, _loaded: true }));
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, `users/${userId}/settings/general`));

    const unsubTx = onSnapshot(
      query(collection(db, "users", userId, "transactions"), orderBy("createdAt", "desc")),
      (snap) => setTransactions(snap.docs.map(d => ({ ...d.data(), id: d.id } as Transaction))),
      (err) => handleFirestoreError(err, OperationType.LIST, `users/${userId}/transactions`)
    );

    const unsubBudgets = onSnapshot(
      collection(db, "users", userId, "budgets"),
      (snap) => setBudgets(snap.docs.map(d => ({ ...d.data(), id: d.id } as Budget))),
      (err) => handleFirestoreError(err, OperationType.LIST, `users/${userId}/budgets`)
    );

    const unsubGoals = onSnapshot(
      collection(db, "users", userId, "goals"),
      (snap) => setGoals(snap.docs.map(d => ({ ...d.data(), id: d.id } as Goal))),
      (err) => handleFirestoreError(err, OperationType.LIST, `users/${userId}/goals`)
    );

    const unsubInvoices = onSnapshot(
      collection(db, "users", userId, "invoices"),
      (snap) => setInvoices(snap.docs.map(d => ({ ...d.data(), id: d.id } as Invoice))),
      (err) => handleFirestoreError(err, OperationType.LIST, `users/${userId}/invoices`)
    );

    const unsubSubscriptions = onSnapshot(
      collection(db, "users", userId, "subscriptions"),
      (snap) => setSubscriptions(snap.docs.map(d => ({ ...d.data(), id: d.id } as Subscription))),
      (err) => handleFirestoreError(err, OperationType.LIST, `users/${userId}/subscriptions`)
    );

    const unsubLedger = onSnapshot(
      query(collection(db, "users", userId, "ledger"), orderBy("createdAt", "desc")),
      (snap) => setLedgerEntries(snap.docs.map(d => ({ ...d.data(), id: d.id } as LedgerEntry))),
      (err) => handleFirestoreError(err, OperationType.LIST, `users/${userId}/ledger`)
    );

    const unsubInvestments = onSnapshot(
      query(collection(db, "users", userId, "investments"), orderBy("createdAt", "desc")),
      (snap) => setInvestments(snap.docs.map(d => ({ ...d.data(), id: d.id } as Investment))),
      (err) => handleFirestoreError(err, OperationType.LIST, `users/${userId}/investments`)
    );

    const unsubAchievements = onSnapshot(
      collection(db, "users", userId, "achievements"),
      (snap) => {
        if (snap.empty) {
          const initial = [
            { id: "a1", title: "সঞ্চয় শুরু", description: "প্রথমবার সঞ্চয় লক্ষ্যমাত্রা শুরু করেছেন", icon: "✨", isUnlocked: true },
            { id: "a2", title: "বাজেট মাস্টার", description: "টানা ৭ দিন বাজেটের মধ্যে খরচ করেছেন", icon: "🛡️", isUnlocked: false },
            { id: "a3", title: "লক্ষ্য পূরন", description: "আপনার প্রথম আর্থিক লক্ষ্য পূরন করেছেন", icon: "🏆", isUnlocked: false },
          ];
          initial.forEach(a => setDoc(doc(db, "users", userId, "achievements", a.id), { ...a, userId }));
        } else {
          setAchievements(snap.docs.map(d => d.data() as Achievement));
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, `users/${userId}/achievements`)
    );

    // Initial load artificial delay for UX smoothness if needed, but Firebase is pretty fast
    const timer = setTimeout(() => setIsLoading(false), 1000);

    return () => {
      unsubTx();
      unsubBudgets();
      unsubGoals();
      unsubInvoices();
      unsubSubscriptions();
      unsubLedger();
      unsubInvestments();
      unsubAchievements();
      unsubSettings();
      clearTimeout(timer);
    };
  }, [user]);

  const updateSettings = async (newSettings: any) => {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid, "settings", "general"), newSettings, { merge: true });
  };

  return { transactions, budgets, goals, invoices, achievements, subscriptions, ledgerEntries, investments, settings, updateSettings, isLoading, setBudgets, setAchievements };
}

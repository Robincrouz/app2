import { useState } from "react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Transaction, Budget, Goal, Invoice, Subscription, LedgerEntry } from "../types";
import { normalizeNumber, sanitizeText, normalizeDate } from "../lib/normalizers";
import { 
  validateTransaction, validateBudget, validateGoal, validateInvoice, validateSubscription, validateLedger 
} from "../lib/validators";
import { handleFirestoreError, OperationType } from "../lib/firestoreErrorHandler";

// Helper to strip non-db keys
const strip = (obj: any, allowed: string[]) => {
  const result: any = {};
  allowed.forEach(key => {
    if (obj[key] !== undefined) result[key] = obj[key];
  });
  return result;
};

export function useOperations(user: any, setToast: (t: any) => void) {
  
  const saveTransaction = async (tx: Partial<Transaction>, editingTx: Transaction | null) => {
    if (!user) return;
    
    // Normalize and Sanitize
    const amount = normalizeNumber(tx.amount || 0);
    const note = sanitizeText(tx.note || "");
    const date = normalizeDate(tx.date || new Date().toISOString());
    
    const normalizedTx = { ...tx, amount, note, date };
    
    // Validate
    const validation = validateTransaction(normalizedTx);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setToast({ message: firstError, type: 'error' });
      return false;
    }

    try {
      const id = editingTx ? editingTx.id : Date.now().toString();
      const txData = {
        ...strip(normalizedTx, ['type', 'amount', 'category', 'date', 'note', 'receipt']),
        userId: user.uid,
        createdAt: editingTx ? editingTx.createdAt : Date.now()
      };
      const path = `users/${user.uid}/transactions/${id}`;
      await setDoc(doc(db, "users", user.uid, "transactions", id), txData);
      setToast({ message: editingTx ? "লেনদেন আপডেট হয়েছে" : "লেনদেন যোগ করা হয়েছে", type: 'success' });
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/transactions`);
      setToast({ message: "লেনদেন সেভ করতে ত্রুটি হয়েছে", type: 'error' });
      return false;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user || !id) return;
    if (!window.confirm("আপনি কি নিশ্চিত এই লেনদেনটি ডিলিট করতে চান?")) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "transactions", id));
      setToast({ message: "লেনদেন মুছে ফেলা হয়েছে", type: 'success' });
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${user.uid}/transactions/${id}`);
      setToast({ message: "লেনদেন মুছতে ত্রুটি হয়েছে", type: 'error' });
      return false;
    }
  };

  const saveBudget = async (b: Partial<Budget>, editingBudget: Budget | null) => {
    if (!user) return;
    
    const limit = normalizeNumber(b.limit || 0);
    const normalizedBudget = { ...b, limit };
    
    const validation = validateBudget(normalizedBudget);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setToast({ message: firstError, type: 'error' });
      return false;
    }

    try {
      const id = editingBudget ? editingBudget.id : Date.now().toString();
      const budgetData = {
        ...strip(normalizedBudget, ['category', 'limit', 'alert', 'spent']),
        userId: user.uid,
        spent: editingBudget ? editingBudget.spent : 0,
        alert: 80
      };
      await setDoc(doc(db, "users", user.uid, "budgets", id), budgetData);
      setToast({ message: editingBudget ? "বাজেট আপডেট হয়েছে" : "নতুন বাজেট সেট করা হয়েছে", type: 'success' });
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/budgets`);
      setToast({ message: "বাজেট সেভ করতে ত্রুটি হয়েছে", type: 'error' });
      return false;
    }
  };

  const deleteBudget = async (id: string) => {
    if (!user) return;
    if (!window.confirm("আপনি কি নিশ্চিত এইটি ডিলিট করতে চান?")) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "budgets", id));
      setToast({ message: "বাজেট মুছে ফেলা হয়েছে", type: 'success' });
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${user.uid}/budgets/${id}`);
      setToast({ message: "বাজেট মুছতে ত্রুটি হয়েছে", type: 'error' });
      return false;
    }
  };

  const saveGoal = async (g: Partial<Goal>, editingGoal: Goal | null) => {
    if (!user) return;
    
    const targetAmount = normalizeNumber(g.targetAmount || 0);
    const currentAmount = normalizeNumber(g.currentAmount || 0);
    const title = sanitizeText(g.title || "");
    const deadline = normalizeDate(g.deadline || "");
    
    const normalizedGoal = { ...g, targetAmount, currentAmount, title, deadline };
    
    const validation = validateGoal(normalizedGoal);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setToast({ message: firstError, type: 'error' });
      return false;
    }

    try {
      const id = editingGoal ? editingGoal.id : Date.now().toString();
      const goalData = {
        ...strip(normalizedGoal, ['title', 'targetAmount', 'currentAmount', 'deadline', 'color', 'status']),
        userId: user.uid,
        currentAmount: normalizedGoal.currentAmount || 0,
        color: normalizedGoal.color || "#10b981"
      };
      await setDoc(doc(db, "users", user.uid, "goals", id), goalData);
      setToast({ message: editingGoal ? "লক্ষ্য আপডেট হয়েছে" : "নতুন লক্ষ্য যোগ হয়েছে", type: 'success' });
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/goals`);
      setToast({ message: "লক্ষ্য সেভ করতে ত্রুটি হয়েছে", type: 'error' });
      return false;
    }
  };

  const deleteGoal = async (id: string) => {
    if (!user) return;
    if (!window.confirm("আপনি কি নিশ্চিত এইটি ডিলিট করতে চান?")) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "goals", id));
      setToast({ message: "লক্ষ্য মুছে ফেলা হয়েছে", type: 'success' });
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${user.uid}/goals/${id}`);
      setToast({ message: "লক্ষ্য মুছতে ত্রুটি হয়েছে", type: 'error' });
      return false;
    }
  };

  const saveInvoice = async (inv: Partial<Invoice>, editingInvoice: Invoice | null) => {
    if (!user) return;
    
    const amount = normalizeNumber(inv.amount || 0);
    const clientName = sanitizeText(inv.clientName || "");
    const note = sanitizeText(inv.note || "");
    const dueDate = normalizeDate(inv.dueDate || "");
    
    const normalizedInvoice = { ...inv, amount, clientName, note, dueDate };
    
    const validation = validateInvoice(normalizedInvoice);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setToast({ message: firstError, type: 'error' });
      return false;
    }

    try {
      const id = editingInvoice ? editingInvoice.id : Date.now().toString();
      const invoiceData = {
        ...strip(normalizedInvoice, ['clientName', 'amount', 'status', 'dueDate', 'issueDate', 'note']),
        userId: user.uid,
        issueDate: editingInvoice ? editingInvoice.issueDate : new Date().toISOString()
      };
      await setDoc(doc(db, "users", user.uid, "invoices", id), invoiceData);
      setToast({ message: editingInvoice ? "ইনভয়েস আপডেট হয়েছে" : "নতুন ইনভয়েস তৈরি হয়েছে", type: 'success' });
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/invoices`);
      setToast({ message: "ইনভয়েস সেভ করতে ত্রুটি হয়েছে", type: 'error' });
      return false;
    }
  };

  const deleteInvoice = async (id: string) => {
    if (!user) return;
    if (!window.confirm("আপনি কি নিশ্চিত এইটি ডিলিট করতে চান?")) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "invoices", id));
      setToast({ message: "ইনভয়েস মুছে ফেলা হয়েছে", type: 'success' });
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${user.uid}/invoices/${id}`);
      setToast({ message: "ইনভয়েস মুছতে ত্রুটি হয়েছে", type: 'error' });
      return false;
    }
  };

  const saveSubscription = async (s: Partial<Subscription>, editingSub: Subscription | null) => {
    if (!user) return;
    
    const amount = normalizeNumber(s.amount || 0);
    const title = sanitizeText(s.title || "");
    const nextBillingDate = normalizeDate(s.nextBillingDate || "");
    
    const normalizedSub = { ...s, amount, title, nextBillingDate };
    
    const validation = validateSubscription(normalizedSub);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setToast({ message: firstError, type: 'error' });
      return false;
    }

    try {
      const id = editingSub ? editingSub.id : Date.now().toString();
      const subData = {
        ...normalizedSub,
        userId: user.uid,
      };
      await setDoc(doc(db, "users", user.uid, "subscriptions", id), subData);
      setToast({ message: editingSub ? "সাবস্ক্রিপশন আপডেট হয়েছে" : "নতুন সাবস্ক্রিপশন যোগ হয়েছে", type: 'success' });
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/subscriptions`);
      setToast({ message: "সাবস্ক্রিপশন সেভ করতে ত্রুটি হয়েছে", type: 'error' });
      return false;
    }
  };

  const deleteSubscription = async (id: string) => {
    if (!user) return;
    if (!window.confirm("আপনি কি নিশ্চিত এইটি ডিলিট করতে চান?")) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "subscriptions", id));
      setToast({ message: "সাবস্ক্রিপশন মুছে ফেলা হয়েছে", type: 'success' });
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${user.uid}/subscriptions/${id}`);
      setToast({ message: "সাবস্ক্রিপশন মুছতে ত্রুটি হয়েছে", type: 'error' });
      return false;
    }
  };

  const saveLedger = async (l: Partial<LedgerEntry>, editingLedger: LedgerEntry | null) => {
    if (!user) return;
    
    const amount = normalizeNumber(l.amount || 0);
    const contactName = sanitizeText(l.contactName || "");
    const note = sanitizeText(l.note || "");
    const date = normalizeDate(l.date || new Date().toISOString());
    
    const normalizedLedger = { ...l, amount, contactName, note, date };
    
    const validation = validateLedger(normalizedLedger);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setToast({ message: firstError, type: 'error' });
      return false;
    }

    try {
      const id = editingLedger ? editingLedger.id : Date.now().toString();
      const ledgerData = {
        ...strip(normalizedLedger, ['contactName', 'amount', 'type', 'date', 'status', 'note']),
        userId: user.uid,
        createdAt: editingLedger ? editingLedger.createdAt : Date.now()
      };
      await setDoc(doc(db, "users", user.uid, "ledger", id), ledgerData);
      setToast({ message: editingLedger ? "বাকির খাতা আপডেট হয়েছে" : "নতুন হিসাব যোগ হয়েছে", type: 'success' });
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/ledger`);
      setToast({ message: "হিসাব সেভ করতে ত্রুটি হয়েছে", type: 'error' });
      return false;
    }
  };

  const deleteLedger = async (id: string) => {
    if (!user) return;
    if (!window.confirm("আপনি কি নিশ্চিত এইটি ডিলিট করতে চান?")) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "ledger", id));
      setToast({ message: "হিসাব মুছে ফেলা হয়েছে", type: 'success' });
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${user.uid}/ledger/${id}`);
      setToast({ message: "হিসাব মুছতে ত্রুটি হয়েছে", type: 'error' });
      return false;
    }
  };

  const saveInvestment = async (data: any, id?: string | null) => {
    if (!user) return;
    try {
      const docId = id || Date.now().toString();
      await setDoc(doc(db, "users", user.uid, "investments", docId), { ...data, userId: user.uid, createdAt: Date.now() });
      setToast({ message: "বিনিয়োগ সফলভাবে সেভ হয়েছে", type: 'success' });
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/investments`);
      setToast({ message: "বিনিয়োগ সেভ করতে ত্রুটি হয়েছে", type: 'error' });
      return false;
    }
  };

  const deleteInvestment = async (id: string) => {
    if (!user) return;
    if (!window.confirm("আপনি কি নিশ্চিত এই বিনিয়োগ ডিলিট করতে চান?")) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "investments", id));
      setToast({ message: "বিনিয়োগ মুছে ফেলা হয়েছে", type: 'success' });
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${user.uid}/investments/${id}`);
      setToast({ message: "বিনিয়োগ মুছতে ত্রুটি হয়েছে", type: 'error' });
      return false;
    }
  };

  return { 
    saveTransaction, deleteTransaction, 
    saveBudget, deleteBudget, 
    saveGoal, deleteGoal, 
    saveInvoice, deleteInvoice,
    saveSubscription, deleteSubscription,
    saveLedger, deleteLedger,
    saveInvestment, deleteInvestment
  };
}

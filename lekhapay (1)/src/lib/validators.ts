import { Transaction, Budget, Goal, Invoice, Subscription, LedgerEntry } from "../types";

export type ValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
};

export function validateLedger(l: Partial<LedgerEntry>): ValidationResult {
  const errors: Record<string, string> = {};
  
  if (!l.contactName || l.contactName.trim() === "") {
    errors.contactName = "নাম বা কন্টাক্ট দিন";
  }
  
  if (!l.amount || l.amount <= 0) {
    errors.amount = "টাকার পরিমাণ অবশ্যই ০ থেকে বেশি হতে হবে";
  }
  
  if (!l.date) {
    errors.date = "তারিখ সিলেক্ট করুন";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateTransaction(tx: Partial<Transaction>): ValidationResult {
  const errors: Record<string, string> = {};
  
  if (!tx.amount || tx.amount <= 0) {
    errors.amount = "টাকার পরিমাণ অবশ্যই ০ থেকে বেশি হতে হবে";
  }
  
  if (!tx.category) {
    errors.category = "ক্যাটেগরি সিলেক্ট করুন";
  }
  
  if (!tx.note || tx.note.trim() === "") {
    errors.note = "নোট বা বিবরণ দিন";
  }
  
  if (!tx.date) {
    errors.date = "তারিখ সিলেক্ট করুন";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateBudget(b: Partial<Budget>): ValidationResult {
  const errors: Record<string, string> = {};
  
  if (!b.limit || b.limit <= 0) {
    errors.limit = "বাজেট লিমিট অবশ্যই ০ থেকে বেশি হতে হবে";
  }
  
  if (!b.category) {
    errors.category = "ক্যাটেগরি সিলেক্ট করুন";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateGoal(g: Partial<Goal>): ValidationResult {
  const errors: Record<string, string> = {};
  
  if (!g.title || g.title.trim() === "") {
    errors.title = "লক্ষ্যের নাম দিন";
  }
  
  if (!g.targetAmount || g.targetAmount <= 0) {
    errors.targetAmount = "লক্ষ্যমাত্রা অবশ্যই ০ থেকে বেশি হতে হবে";
  }
  
  if (!g.deadline) {
    errors.deadline = "ডেডলাইন সিলেক্ট করুন";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateSubscription(s: Partial<Subscription>): ValidationResult {
  const errors: Record<string, string> = {};
  
  if (!s.title || s.title.trim() === "") {
    errors.title = "সাবস্ক্রিপশন এর নাম দিন";
  }
  
  if (!s.amount || s.amount <= 0) {
    errors.amount = "টাকার পরিমাণ অবশ্যই ০ থেকে বেশি হতে হবে";
  }
  
  if (!s.category) {
    errors.category = "ক্যাটেগরি সিলেক্ট করুন";
  }
  
  if (!s.nextBillingDate) {
    errors.nextBillingDate = "পরবর্তী বিলিং ডেট দিন";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateInvoice(inv: Partial<Invoice>): ValidationResult {
  const errors: Record<string, string> = {};
  
  if (!inv.clientName || inv.clientName.trim() === "") {
    errors.clientName = "ক্লাইন্ট এর নাম দিন";
  }
  
  if (!inv.amount || inv.amount <= 0) {
    errors.amount = "ইনভয়েস অ্যামাউন্ট অবশ্যই ০ থেকে বেশি হতে হবে";
  }
  
  if (!inv.dueDate) {
    errors.dueDate = "লাস্ট ডেট সিলেক্ট করুন";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

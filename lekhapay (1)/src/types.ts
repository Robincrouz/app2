export type Category = {
  id: string;
  label: string;
  icon: string;
  color: string;
  keywords: string[];
};

export const CATEGORIES: Record<string, Category> = {
  food: { id: "food", label: "খাবার", icon: "Utensils", color: "#f59e0b", keywords: ["লাঞ্চ", "ডিনার", "বাজার", "রেস্তোরাঁ", "খাবার"] },
  grocery: { id: "grocery", label: "মুদি", icon: "ShoppingBag", color: "#10b981", keywords: ["বাজার", "মুদি", "চাল", "ডাল"] },
  transport: { id: "transport", label: "যাতায়াত", icon: "Bus", color: "#3b82f6", keywords: ["বাস", "ট্রেন", "উবার", "রিকশা", "ভাড়া"] },
  shopping: { id: "shopping", label: "কেনাকাটা", icon: "ShoppingBag", color: "#ec4899", keywords: ["দারাজ", "শপিং", "কাপড়"] },
  bills: { id: "bills", label: "বিল", icon: "FileText", color: "#8b5cf6", keywords: ["ইলেকট্রিসিটি", "গ্যাস", "মোবাইল", "ইন্টারনেট"] },
  salary: { id: "salary", label: "বেতন", icon: "Banknote", color: "#10b981", keywords: ["স্যালারি", "বেতন"] },
  rent: { id: "rent", label: "ভাড়া", icon: "Home", color: "#6366f1", keywords: ["ভাড়া", "রেন্ট"] },
  health: { id: "health", label: "স্বাস্থ্য", icon: "Activity", color: "#ef4444", keywords: ["ডাক্তার", "মেডিসিন"] },
  education: { id: "education", label: "শিক্ষা", icon: "GraduationCap", color: "#14b8a6", keywords: ["বই", "কোর্স"] },
  entertainment: { id: "entertainment", label: "বিনোদন", icon: "Film", color: "#f97316", keywords: ["সিনেমা", "নেটফ্লিক্স"] },
  gift: { id: "gift", label: "উপহার", icon: "Heart", color: "#f43f5e", keywords: ["গিফট", "উপহার"] },
  coffee: { id: "coffee", label: "কফি/চা", icon: "Coffee", color: "#78350f", keywords: ["কফি", "চা", "আড্ডা"] },
  gadget: { id: "gadget", label: "গ্যাজেট", icon: "Smartphone", color: "#0f172a", keywords: ["ফোন", "হেডফোন", "স্মার্টফোন"] },
  travel: { id: "travel", label: "ভ্রমণ", icon: "Plane", color: "#06b6d4", keywords: ["ট্রিপ", "হোটেল"] },
  investment: { id: "investment", label: "বিনিয়োগ", icon: "TrendingUp", color: "#84cc16", keywords: ["শেয়ার", "ডিভিডেন্ড"] },
  other: { id: "other", label: "অন্যান্য", icon: "MoreHorizontal", color: "#64748b", keywords: [] },
};

export type Transaction = {
  id: string;
  type: "income" | "expense" | "transfer";
  amount: number;
  category: string;
  date: string;
  note: string;
  receipt?: string;
  createdAt: number;
};

export type Budget = {
  id: string;
  category: string;
  limit: number;
  alert: number;
  spent: number;
};

export type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
  status: 'active' | 'completed';
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: number;
};

export type Subscription = {
  id: string;
  title: string;
  amount: number;
  nextBillingDate: string;
  category: string;
};

export type Invoice = {
  id: string;
  clientName: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  issueDate: string;
  note?: string;
};

export type LedgerEntry = {
  id: string;
  contactName: string;
  amount: number;
  type: 'receivable' | 'payable'; // receivable = পাবো, payable = দেবো
  date: string;
  status: 'pending' | 'settled';
  note?: string;
  createdAt: number;
};

export type Investment = {
  id: string;
  name: string;
  type: 'stock' | 'bond' | 'crypto' | 'gold' | 'other';
  amountInvested: number;
  currentValue: number;
  date: string;
};

export type AIForecast = {
  predictedExpense: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  suggestion: string;
};

export type FinancialHealth = {
  score: number;
  label: string;
  color: string;
  reasons: string[];
};

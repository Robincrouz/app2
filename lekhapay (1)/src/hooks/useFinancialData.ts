import { useMemo } from "react";
import { Transaction, Budget, Goal, CATEGORIES } from "../types";

interface FinancialDataProps {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  currencySymbol: string;
}

export function useFinancialData({ transactions, budgets, goals, currencySymbol }: FinancialDataProps) {
  const income = useMemo(() => transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0), [transactions]);
  const expense = useMemo(() => transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0), [transactions]);
  const balance = income - expense;

  const healthScore = useMemo(() => {
    let score = 40;
    const savingsRate = income > 0 ? (balance / income) * 100 : 0;
    if (savingsRate > 0) score += Math.min((savingsRate / 50) * 30, 30);
    if (budgets.length > 0) {
      const budgetsWithinLimit = budgets.filter(b => b.spent <= b.limit).length;
      score += (budgetsWithinLimit / budgets.length) * 20;
    } else score += 10;
    if (goals.length > 0) {
      const totalProgress = goals.reduce((acc, g) => {
        const progress = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) : 0;
        return acc + progress;
      }, 0);
      score += Math.min((totalProgress / goals.length) * 10, 10);
    }
    const finalScore = Math.round(score);
    return isNaN(finalScore) ? 0 : Math.min(Math.max(finalScore, 0), 100);
  }, [income, expense, balance, budgets, goals]);

  const monthlyChartData = useMemo(() => {
    const months = ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টে", "অক্টো", "নভে", "ডিসে"];
    const now = new Date();
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      const monthTxs = transactions.filter(t => {
        const td = new Date(t.date);
        return td.getMonth() === m && td.getFullYear() === y;
      });
      const inc = monthTxs.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
      const exp = monthTxs.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
      result.push({
        name: months[m],
        fullName: d.toLocaleDateString("bn-BD", { month: 'long', year: 'numeric' }),
        monthNum: m,
        year: y,
        income: inc,
        expense: exp
      });
    }
    return result;
  }, [transactions]);

  const getDailyChartData = (selectedMonth: string | null) => {
    if (!selectedMonth) return [];
    const monthInfo = monthlyChartData.find(m => m.name === selectedMonth);
    if (!monthInfo) return [];
    const daysInMonth = new Date(monthInfo.year, monthInfo.monthNum + 1, 0).getDate();
    const daily = [];
    for (let i = 1; i <= daysInMonth; i++) {
        const dayTxs = transactions.filter(t => {
            const td = new Date(t.date);
            return td.getDate() === i && td.getMonth() === monthInfo.monthNum && td.getFullYear() === monthInfo.year;
        });
        daily.push({ 
          name: i.toLocaleString('bn-BD'), 
          income: dayTxs.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0), 
          expense: dayTxs.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0) 
        });
    }
    return daily;
  };

  const weeklyStats = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekTxs = transactions.filter(t => new Date(t.date) > weekAgo);
    const count = weekTxs.length;
    const expense = weekTxs.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const savings = weekTxs.reduce((acc, t) => t.type === "income" ? acc + t.amount : acc - t.amount, 0);
    return { count, expense, savings };
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const expenses = transactions.filter(t => t.type === "expense");
    const grouped = expenses.reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([catId, amount]) => ({
        id: catId,
        label: CATEGORIES[catId]?.label || catId,
        amount,
        color: CATEGORIES[catId]?.color || "#64748b",
        percentage: expense > 0 ? (amount / expense) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, expense]);

  const savingsRate = income > 0 ? (balance / income) * 100 : 0;

  return { income, expense, balance, healthScore, monthlyChartData, weeklyStats, getDailyChartData, categoryBreakdown, savingsRate, currencySymbol };
}

import { CATEGORIES } from "../types";

export const exportToJson = (data: any) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `মানি ম্যানেজমেন্ট উইথ এ আই_Backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToCsv = (transactions: any[]) => {
  const headers = ["Date", "Type", "Category", "Amount", "Note"];
  const rows = transactions.map(t => [
    t.date, 
    t.type, 
    CATEGORIES[t.category]?.label || t.category, 
    t.amount, 
    t.note
  ]);
  const csvContent = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `মানি ম্যানেজমেন্ট উইথ এ আই_Transactions_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
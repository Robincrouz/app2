import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, symbol: string = "৳") {
  return symbol + amount.toLocaleString("bn-BD");
}

export function formatDate(date: string | number | Date) {
  return new Date(date).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

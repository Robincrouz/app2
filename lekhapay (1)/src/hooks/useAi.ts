import { useState, useEffect } from "react";
import { Transaction, Budget, AIForecast, FinancialHealth } from "../types";
import { normalizeNumber } from "../lib/normalizers";

export function useAi(transactions: Transaction[], budgets: Budget[], user: any, balance: number = 0, language: string = "bn") {
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<{ forecast: AIForecast; health: FinancialHealth } | null>(null);
  const [aiStatus, setAiStatus] = useState<"idle" | "loading" | "error" | "quota" | "success">("idle");
  const [retrySeconds, setRetrySeconds] = useState(0);

  // Sync AI insights to local storage per user
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`umo_insights_${user.uid}`);
      if (saved) setAiInsights(JSON.parse(saved));
      
      const savedForecast = localStorage.getItem(`umo_forecast_${user.uid}`);
      if (savedForecast) setForecastData(JSON.parse(savedForecast));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      if (aiInsights.length > 0) {
        localStorage.setItem(`umo_insights_${user.uid}`, JSON.stringify(aiInsights));
      }
      if (forecastData) {
        localStorage.setItem(`umo_forecast_${user.uid}`, JSON.stringify(forecastData));
      }
    }
  }, [aiInsights, forecastData, user]);

  // Retry timer
  useEffect(() => {
    if (retrySeconds > 0) {
      const timer = setTimeout(() => setRetrySeconds(s => s - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [retrySeconds]);

  const fetchAiInsights = async () => {
    if (aiStatus === "loading" || retrySeconds > 0 || !user) return;
    setAiStatus("loading");
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ transactions, budget: budgets, balance, language })
      });
      
      if (res.status === 429) {
        const data = await res.json();
        setRetrySeconds(data.retryAfter || 60);
        setAiStatus("quota");
        return;
      }
      
      if (!res.ok) throw new Error("Failed to fetch");
      
      const data = await res.json();
      setAiInsights(data);
      setAiStatus("idle");
    } catch (e) {
      console.error(e);
      setAiStatus("error");
    }
  };

  const fetchForecast = async () => {
    if (aiStatus === "loading" || retrySeconds > 0 || !user) return;
    setAiStatus("loading");
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/ai/forecast", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ transactions, balance, language })
      });
      
      if (res.status === 429) {
        const data = await res.json();
        setRetrySeconds(data.retryAfter || 60);
        setAiStatus("quota");
        return;
      }
      
      if (!res.ok) throw new Error("Failed to fetch forecast");
      
      const data = await res.json();
      setForecastData(data);
      setAiStatus("idle");
    } catch (e) {
      console.error(e);
      setAiStatus("error");
    }
  };

  const parseVoiceInput = async (text: string) => {
    if (!user) return [];
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/ai/parse", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text, language })
      });
      
      if (res.status === 429) {
        const amountMatch = text.match(/\d+/);
        return [{
          amount: amountMatch ? parseInt(amountMatch[0]) : 0,
          category: "other",
          note: text,
          type: "expense"
        }];
      }
      
      if (!res.ok) throw new Error("Parse failed");
      const parsed = await res.json();
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      console.error(e);
      // Fallback: simple numeric extraction supporting both Latin and Bangla digits
      const amountMatch = text.match(/[0-9০-৯]+/);
      return [{
        amount: amountMatch ? parseInt(normalizeNumber(amountMatch[0]).toString()) : 0,
        category: "other",
        note: text,
        type: "expense"
      }];
    }
  };

  const scanReceipt = async (imageBase64: string) => {
    if (!user) throw new Error("No user");
    const token = await user.getIdToken();
    const res = await fetch("/api/ai/scan-receipt", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ imageBase64, language })
    });
    if (!res.ok) throw new Error("Failed to scan receipt");
    return await res.json();
  };

  const parseSms = async (text: string) => {
    if (!user) throw new Error("No user");
    const token = await user.getIdToken();
    const res = await fetch("/api/ai/parse-sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ text, language })
    });
    if (!res.ok) {
      if (res.status === 429) {
        setAiStatus("quota");
        throw new Error("Rate limit exceeded");
      }
      throw new Error("Failed to parse SMS");
    }
    return await res.json();
  };

  return { aiInsights, forecastData, aiStatus, retrySeconds, fetchAiInsights, fetchForecast, parseVoiceInput, scanReceipt, parseSms };
}

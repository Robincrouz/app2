import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    let projectId = "";
    try {
      const configPath = path.join(process.cwd(), "firebase-applet-config.json");
      const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      projectId = config.projectId;
    } catch (e) {
      // Fallback to env
      projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "gen-lang-client-0828296020";
    }

    if (projectId) {
      process.env.GCLOUD_PROJECT = projectId;
      process.env.GOOGLE_CLOUD_PROJECT = projectId;
      process.env.FIREBASE_PROJECT_ID = projectId;
    }

    admin.initializeApp({
      projectId: projectId
    });
    console.log(`Firebase Admin initialized with project: ${projectId}`);
  } catch (e) {
    console.error("Firebase Admin init error:", e);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Simple In-memory Rate Limiter
  const rateLimit = new Map<string, { count: number; lastReset: number }>();
  const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
  const MAX_REQUESTS_PER_WINDOW = 5;

  const limiterMiddleware = (req: any, res: any, next: any) => {
    const uid = req.user?.uid;
    if (!uid) return next();

    const now = Date.now();
    const userLimit = rateLimit.get(uid) || { count: 0, lastReset: now };

    if (now - userLimit.lastReset > RATE_LIMIT_WINDOW) {
      userLimit.count = 1;
      userLimit.lastReset = now;
    } else {
      userLimit.count++;
    }

    rateLimit.set(uid, userLimit);

    if (userLimit.count > MAX_REQUESTS_PER_WINDOW) {
      return res.status(429).json({ 
        error: "TOO_MANY_REQUESTS", 
        message: "You are doing that too much. Try again in a minute.",
        retryAfter: 60
      });
    }
    next();
  };

  // Auth Middleware
  const authenticate = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "UNAUTHORIZED", message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (e) {
      console.error("Auth error:", e);
      res.status(401).json({ error: "UNAUTHORIZED", message: "Invalid token" });
    }
  };

  // Gemini AI Setup
  const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  });

  // In-memory simple cache to save quota
const insightCache = new Map();
let lastQuotaErrorTime = 0;

const getFallbackInsights = (transactions: any[], language: string) => {
  const isBn = language === "bn";
  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  
  const insights = [];

  // General Tip
  insights.push({
    type: "saving",
    severity: "info",
    message: isBn ? "প্রতিদিন ছোট ছোট সঞ্চয় ভবিষ্যতে বড় মূলধন তৈরি করে।" : "Small daily savings build significant capital in the future."
  });

  if (expense > income && income > 0) {
    insights.push({
      type: "overspend",
      severity: "danger",
      message: isBn ? "সতর্কতা: আপনার ব্যালেন্স নেতিবাচক দিকে যাচ্ছে। অকারণে খরচ কমান।" : "Warning: Your balance is trending negative. Cut unnecessary costs."
    });
  } else if (income > 0) {
    insights.push({
      type: "saving",
      severity: "teal",
      message: isBn ? "আপনার বর্তমান আর্থিক অবস্থা স্থিতিশীল। সঞ্চয় অব্যাহত রাখুন।" : "Your current financial state is stable. Keep saving."
    });
  }

  // Savings Tip
  insights.push({
    type: "investment",
    severity: "info",
    message: isBn ? "জরুরী তহবিলের জন্য অন্তত ৩ মাসের খরচ আলাদা রাখুন।" : "Set aside at least 3 months of expenses for an emergency fund."
  });

  return insights;
};

// API Route: Smart Financial Insights
app.post("/api/ai/insights", authenticate, limiterMiddleware, async (req: any, res: any) => {
  try {
    const { transactions = [], budget = [], language = "bn", balance = 0 } = req.body;
    
    // Simple cache key
    const cacheKey = JSON.stringify({ uid: req.user.uid, txCount: transactions?.length, lang: language, bal: Math.floor(balance/1000) });
    const cached = insightCache.get(cacheKey);
    if (cached && (Date.now() - cached.time < 1000 * 60 * 60)) { // 1 hour cache
      return res.json(cached.data);
    }

    // Cooldown check: If we hit quota recently, don't even try for 2 minutes
    if (Date.now() - lastQuotaErrorTime < 120000) {
      return res.json(getFallbackInsights(transactions, language));
    }
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a premium AI Financial Advisor. Analyze these metrics and provide exactly 3 smart financial tips in ${language}. 
      Total Current Balance: ${balance}
      Recent Transactions: ${JSON.stringify(transactions?.slice(0, 5))}
      Budget: ${JSON.stringify(budget)}
      
      CRITICAL INSTRUCTIONS:
      1. One tip must be an 'investment' tip based on the total balance. If the balance is high, suggest specific premium investment vehicles (e.g. stocks, real estate, mutual funds, gold). If balance is low, suggest micro-savings or emergency funds.
      2. The other two tips can be about saving, overspending, or general budgeting.
      3. Set severity to 'info', 'teal', 'warning', or 'danger' depending on urgency.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              severity: { type: Type.STRING },
              message: { type: Type.STRING }
            },
            required: ["type", "severity", "message"]
          }
        }
      }
    });

    const result = JSON.parse(response.text || "[]");
    insightCache.set(cacheKey, { data: result, time: Date.now() });
    res.json(result);
  } catch (error: any) {
    console.error("Gemini Error:", error);
    const errorMsg = error.message || "";
    if (error.status === 429 || errorMsg.includes("429") || errorMsg.includes("quota")) {
      lastQuotaErrorTime = Date.now();
      const waitMatch = errorMsg.match(/retry in ([\d\.]+)s/);
      const retryAfter = waitMatch ? Math.ceil(parseFloat(waitMatch[1])) : 60;
      
      // Instead of failing, return fallback insights but signal quota via status if needed (or just 200 with fallback)
      // We return 200 with fallback so the app doesn't look broken
      return res.json(getFallbackInsights(req.body.transactions || [], req.body.language || "bn"));
    }
    res.status(500).json({ error: "Failed to generate AI insights" });
  }
});

// API Route: AI Forecast & Health Score
app.post("/api/ai/forecast", authenticate, limiterMiddleware, async (req: any, res: any) => {
  try {
    const { transactions = [], language = "bn", balance = 0 } = req.body;
    
    // Simple cooldown as before
    if (Date.now() - lastQuotaErrorTime < 120000) {
      return res.json({
        forecast: { predictedExpense: 0, confidence: 50, trend: "stable", suggestion: language === 'bn' ? "সঞ্চয় করার চেষ্টা করুন।" : "Try to save more." },
        health: { score: 70, label: "মাঝারি", color: "#f59e0b", reasons: ["পর্যাপ্ত তথ্য নেই"] }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an AI Investment & Portfolio Manager. Analyze these recent transactions and the user's total balance, then provide:
      1. A 30-day expense forecast.
      2. A financial health score out of 100.
      Transactions: ${JSON.stringify(transactions.slice(0, 15))}
      Current Balance: ${balance}
      Language: ${language === 'bn' ? 'Bengali' : 'English'}
      
      CRITICAL INSTRUCTIONS:
      1. Make the wording professional. 
      2. If balance is healthy, the 'suggestion' in 'forecast' must include a specific investment or growth tip.
      3. The 'label', 'suggestion' and 'reasons' fields MUST be generated entirely in the target Language specified above. Do NOT use English if the language is Bengali.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            forecast: {
              type: Type.OBJECT,
              properties: {
                predictedExpense: { type: Type.NUMBER },
                confidence: { type: Type.NUMBER },
                trend: { type: Type.STRING, enum: ["up", "down", "stable"] },
                suggestion: { type: Type.STRING }
              },
              required: ["predictedExpense", "confidence", "trend", "suggestion"]
            },
            health: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                label: { type: Type.STRING },
                color: { type: Type.STRING },
                reasons: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["score", "label", "color", "reasons"]
            }
          },
          required: ["forecast", "health"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Gemini Forecast Error:", error);
    res.status(500).json({ error: "Failed to generate forecast" });
  }
});

  // API Route: AI Receipt Scanner
  app.post("/api/ai/scan-receipt", authenticate, limiterMiddleware, async (req: any, res: any) => {
    try {
      const { imageBase64, language = "bn" } = req.body;
      
      if (!imageBase64) {
        return res.status(400).json({ error: "No image provided" });
      }

      // Check cache/cooldown 
      if (Date.now() - lastQuotaErrorTime < 120000) {
        return res.status(429).json({ error: "Rate limit check. Try again later." });
      }
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          `Analyze this receipt or bill image. Extract the total amount, category, merchant name, and date.
          The response should be strictly JSON.
          - 'amount' (number): The total amount extracted.
          - 'category' (string): Best matching category: housing, food, transport, bills, shopping, health, entertainment, business, education, personal, travel, investment, other.
          - 'merchant' (string): Name of the shop, person, or organization.
          - 'date' (string): YYYY-MM-DD. If not found, leave blank.
          - 'note' (string): A short summary. Mention items if possible. In ${language === 'bn' ? 'Bengali' : 'English'}.`,
          {
            inlineData: {
              data: imageBase64,
              mimeType: "image/jpeg"
            }
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              amount: { type: Type.NUMBER },
              category: { type: Type.STRING },
              merchant: { type: Type.STRING },
              date: { type: Type.STRING },
              note: { type: Type.STRING }
            },
            required: ["amount", "category", "merchant", "note"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      res.json(result);
    } catch (error: any) {
      console.error("Gemini Receipt Scan Error:", error);
      res.status(500).json({ error: "Failed to scan receipt" });
    }
  });

  // API Route: SMS Parser
  app.post("/api/ai/parse-sms", authenticate, limiterMiddleware, async (req: any, res: any) => {
    try {
      const { text, language = "bn" } = req.body;

      // Cooldown check
      if (Date.now() - lastQuotaErrorTime < 60000) {
        return res.status(429).json({ error: "Rate limit exceeded" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Parse this bank/mobile financial service (Bkash, Nagad, etc.) SMS: "${text}"
          Extract the transaction details. The output should be categorized as 'expense' or 'income'.
          Usually "credited", "received", "deposit" means income. "debited", "paid", "withdrawn", "payment" means expense.
          If there is a fee, also extract that if possible, but mainly we want the primary transaction amount.
          
          Return JSON object with:
          - amount (number)
          - type ('income' or 'expense' or 'transfer')
          - note (string, original message short context or merchant name)
          - category (string, best matching category like 'food', 'transport', 'bills', 'shopping', 'transfer', 'other')
          - sender_or_receiver (string, bank name or merchant name)`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              amount: { type: Type.NUMBER },
              type: { type: Type.STRING, enum: ["income", "expense", "transfer"] },
              note: { type: Type.STRING },
              category: { type: Type.STRING },
              sender_or_receiver: { type: Type.STRING }
            },
            required: ["amount", "type", "note", "category"]
          }
        }
      });
      const data = JSON.parse(response.text || '{}');
      res.json(data);
    } catch (error: any) {
      if (error && error.status === 429) {
        lastQuotaErrorTime = Date.now();
        res.status(429).json({ error: "Rate limit exceeded. Please try again later.", retryAfter: 60 });
      } else {
        console.error("AI SMS Parse Error:", error);
        res.status(500).json({ error: "Failed to parse SMS" });
      }
    }
  });

  // API Route: Voice/Text Parser
  app.post("/api/ai/parse", authenticate, limiterMiddleware, async (req: any, res: any) => {
    try {
      const { text, language = "bn" } = req.body;

      // Cooldown check
      if (Date.now() - lastQuotaErrorTime < 120000) {
        // Simple fallback
        const amountMatch = text.match(/\d+/);
        return res.json([{
          amount: amountMatch ? parseInt(amountMatch[0]) : 0,
          category: "other",
          note: text,
          type: "expense"
        }]);
      }
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Extract all transaction, ledger, budget, or goal details from this text: "${text}". 
        The input text is in ${language === 'bn' ? 'Bengali' : 'English'}.
        
        CRITICAL INSTRUCTIONS:
        1. Keep the 'note' field in the SAME LANGUAGE as the input text (output Bengali if input is Bengali).
        2. Set 'entryType' to 'ledger' ONLY if a specific person is mentioned (e.g., "বোরহান", "রিমু") AND the context is about debt/lending (e.g. "পাবে", "দেবে", "ধারি", "কর্জ"). 
        3. Simple expenses like "ওষুধ বাবদ ৫০ হাজার" or "বাসা ভাড়া ৫০০০" MUST be 'entryType': 'transaction'.
        4. If the user mentions setting a 'budget' or 'limit' or 'বাজেট' for a specific category, set 'entryType' to 'budget'.
        5. If the user mentions a 'goal', 'saving target', or 'buying' something big in the future (e.g. "iPhone কিনব"), set 'entryType' to 'goal'.
        6. MULTI-PERSON SPLIT BILLS: If the input describes a split bill with friends:
           - Calculate the share per person.
           - Output ONE 'transaction' entry (type: 'expense') for the USER'S personal share of the expense (e.g., if bill is 2200 for 5 people, user's share is 440).
           - Output 'ledger' entries ONLY for the money the USER needs to get back (receivable) or the money the USER owes (payable). 
             For example, if the user paid 700 but their share is 440, they need to receive 260. Output ledger receivable entries from the friends who didn't pay enough, so it totals 260. Do NOT track debts between other friends.
        7. If the user mentions recurring payments, monthly bills, or generic 'subscriptions' (e.g., "নেটফ্লিক্স", "ইন্টারনেট বিল", "মাসে মাসে"), set 'entryType' to 'subscription'.
        8. If the user mentions investing in stock, crypto, gold, or any other savings scheme/FDR (e.g., "শেয়ার কিনেছি", "সঞ্চয়পত্র", "ফিক্সড ডিপোজিট"), set 'entryType' to 'investment'.
        9. If the user mentions an invoice or formal receipt that needs to be generated or paid by someone later (e.g., "ইনভয়েস", "বিল পাঠাও"), set 'entryType' to 'invoice'.
        10. For 'ledger' entries:
           - Identify 'contactName' (the person's name).
           - Identify 'ledgerType': 'receivable' (if user will receive money/পাবে) or 'payable' (if user owes money/দেবে).
        11. For 'budget' entries:
           - Identify 'category' STRICTLY matching the provided enum.
        12. For 'goal' entries:
           - Identify 'title' (what they are saving for).
           - Identify 'targetAmount' (the total amount needed).
        13. For 'subscription' entries:
           - Identify 'title' (e.g., "Netflix").
        14. For 'investment' entries:
           - Identify 'title' (e.g., "Stock").
           - Find context for 'type' (enum: 'stock', 'bond', 'crypto', 'gold', 'other').
        15. For 'invoice' entries:
           - Identify 'contactName' (client name).
        16. For 'transaction' entries:
           - Identify 'type': 'income' (money received) or 'expense' (money paid/given).
           - Match 'category' STRICTLY to the provided enum values.
        17. Always return an array of objects.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                entryType: { type: Type.STRING, enum: ["transaction", "ledger", "budget", "goal", "subscription", "investment", "invoice"] },
                amount: { type: Type.NUMBER, description: "The amount for the transaction, ledger entry, or budget limit." },
                targetAmount: { type: Type.NUMBER, description: "Only for goal entryType. The total target amount." },
                title: { type: Type.STRING, description: "For goal, subscription, investment entryType." },
                category: { 
                  type: Type.STRING, 
                  enum: ["food", "grocery", "transport", "shopping", "bills", "salary", "rent", "health", "education", "entertainment", "gift", "coffee", "gadget", "travel", "investment", "other"]
                },
                note: { 
                  type: Type.STRING,
                  description: "Notes in the user's input language, describing the reason or person. If text is long, put extra details here."
                },
                type: { type: Type.STRING, enum: ["income", "expense", "stock", "bond", "crypto", "gold", "other"], description: "For transaction/investment entryType" },
                contactName: { type: Type.STRING, description: "For ledger/invoice entryType" },
                ledgerType: { type: Type.STRING, enum: ["receivable", "payable"], description: "Only for ledger entryType" }
              },
              required: ["entryType", "amount", "note"]
            }
          }
        }
      });

      const parsed = JSON.parse(response.text || "[]");
      res.json(Array.isArray(parsed) ? parsed : [parsed]);
    } catch (error: any) {
       console.error("Gemini Parse Error:", error);
       if (error.status === 429 || error.message?.includes("429")) {
         lastQuotaErrorTime = Date.now();
         return res.status(429).json({ error: "QUOTA_EXCEEDED", message: "AI Quota exceeded." });
       }
       res.status(500).json({ error: "Failed to parse input" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LekhaPay running on http://localhost:${PORT}`);
  });
}

startServer();

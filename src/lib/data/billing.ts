import { UsageMetric, BillingTier } from "@/types";

export const currentUsage: UsageMetric[] = [
  {
    category: "API Calls",
    used: 847,
    limit: 5000,
    unit: "calls",
    costPerUnit: 5,
  },
  {
    category: "AI Queries",
    used: 23,
    limit: 100,
    unit: "queries",
    costPerUnit: 50,
  },
  {
    category: "Posts Managed",
    used: 16,
    limit: 500,
    unit: "posts",
    costPerUnit: 0,
  },
  {
    category: "Storage Used",
    used: 128,
    limit: 5120,
    unit: "MB",
    costPerUnit: 2,
  },
];

export const billingTiers: BillingTier[] = [
  {
    name: "Free",
    monthlyPrice: 0,
    features: [
      "50 managed posts",
      "100 API calls/month",
      "10 AI queries/month",
      "500 MB storage",
      "Basic analytics",
    ],
  },
  {
    name: "Standard",
    monthlyPrice: 50000,
    features: [
      "500 managed posts",
      "5,000 API calls/month",
      "100 AI queries/month",
      "5 GB storage",
      "Full analytics",
      "Competitor tracking",
      "News consolidator",
    ],
    isPopular: true,
  },
  {
    name: "Pro",
    monthlyPrice: 150000,
    features: [
      "Unlimited managed posts",
      "Unlimited API calls",
      "Unlimited AI queries",
      "50 GB storage",
      "Full analytics suite",
      "AI Agent (OpenClaw Pro)",
      "WhatsApp Billboard",
      "Priority support",
      "Custom integrations",
    ],
  },
];

export interface BillingHistoryItem {
  id: string;
  period: string;
  plan: string;
  baseCharge: number;
  overage: number;
  total: number;
  status: "paid" | "pending" | "overdue";
  paidDate?: string;
}

export const billingHistory: BillingHistoryItem[] = [
  {
    id: "INV-006",
    period: "May 2026",
    plan: "Standard",
    baseCharge: 50000,
    overage: 0,
    total: 50000,
    status: "pending",
  },
  {
    id: "INV-005",
    period: "April 2026",
    plan: "Standard",
    baseCharge: 50000,
    overage: 2350,
    total: 52350,
    status: "paid",
    paidDate: "2026-04-30",
  },
  {
    id: "INV-004",
    period: "March 2026",
    plan: "Standard",
    baseCharge: 50000,
    overage: 0,
    total: 50000,
    status: "paid",
    paidDate: "2026-03-31",
  },
  {
    id: "INV-003",
    period: "February 2026",
    plan: "Free",
    baseCharge: 0,
    overage: 0,
    total: 0,
    status: "paid",
    paidDate: "2026-02-28",
  },
  {
    id: "INV-002",
    period: "January 2026",
    plan: "Free",
    baseCharge: 0,
    overage: 0,
    total: 0,
    status: "paid",
    paidDate: "2026-01-31",
  },
];

export const meterRate = 12.5; // UGX per tick

export function getCurrentUsage(): UsageMetric[] {
  return currentUsage;
}

export function getBillingTiers(): BillingTier[] {
  return billingTiers;
}

export function getBillingHistory(): BillingHistoryItem[] {
  return billingHistory;
}

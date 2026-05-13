// ============================================================
// Settings Mock Data — sample data for settings sections
// ============================================================

import type {
  TeamMember,
  ConnectedAccount,
  SubscriptionInfo,
  Invoice,
  LoginSession,
} from "@/types/settings";

export function getMockTeamMembers(): TeamMember[] {
  return [
    {
      id: "usr-1",
      name: "Angelo Kiin",
      email: "angellokin@gmail.com",
      role: "owner",
      status: "active",
      joinedAt: "2024-06-01T00:00:00Z",
      lastActive: "2026-05-12T10:30:00Z",
    },
    {
      id: "usr-2",
      name: "Sarah Nakamya",
      email: "sarah@halflife.ug",
      role: "editor",
      status: "active",
      joinedAt: "2025-01-15T00:00:00Z",
      lastActive: "2026-05-11T16:45:00Z",
    },
    {
      id: "usr-3",
      name: "Brian Mugisha",
      email: "brian@halflife.ug",
      role: "viewer",
      status: "invited",
      joinedAt: "2026-05-10T00:00:00Z",
    },
  ];
}

export function getMockConnectedAccounts(): ConnectedAccount[] {
  return [
    {
      id: "conn-1",
      platform: "instagram",
      handle: "@halflife_kicks",
      displayName: "Half Life Kicks",
      connected: true,
      connectedAt: "2025-03-01T00:00:00Z",
      scopes: ["basic", "media", "insights"],
    },
    {
      id: "conn-2",
      platform: "tiktok",
      handle: "@halflife",
      displayName: "Half Life",
      connected: false,
    },
    {
      id: "conn-3",
      platform: "youtube",
      handle: "@HalfLifeKicks",
      displayName: "Half Life Kicks",
      connected: false,
    },
    {
      id: "conn-4",
      platform: "twitter",
      handle: "@halflife_ug",
      displayName: "Half Life UG",
      connected: true,
      connectedAt: "2025-06-15T00:00:00Z",
      scopes: ["read", "write"],
    },
    {
      id: "conn-5",
      platform: "facebook-pages",
      handle: "halflifekampala",
      displayName: "Half Life Kampala",
      connected: false,
    },
  ];
}

export function getMockSubscription(): SubscriptionInfo {
  return {
    plan: "free",
    status: "active",
    currentPeriodStart: "2026-05-01T00:00:00Z",
    currentPeriodEnd: "2026-06-01T00:00:00Z",
    monthlyPrice: 0,
  };
}

export function getMockInvoices(): Invoice[] {
  return [
    {
      id: "inv-001",
      date: "2026-05-01T00:00:00Z",
      amount: 0,
      status: "paid",
      description: "Free Plan — May 2026",
    },
    {
      id: "inv-002",
      date: "2026-04-01T00:00:00Z",
      amount: 0,
      status: "paid",
      description: "Free Plan — April 2026",
    },
  ];
}

export function getMockLoginSessions(): LoginSession[] {
  return [
    {
      id: "sess-1",
      device: "MacBook Pro",
      browser: "Safari 18.2",
      ip: "102.134.xx.xx",
      location: "Kampala, Uganda",
      lastActive: "2026-05-12T10:30:00Z",
      current: true,
    },
    {
      id: "sess-2",
      device: "iPhone 16 Pro",
      browser: "Safari Mobile",
      ip: "102.134.xx.xx",
      location: "Kampala, Uganda",
      lastActive: "2026-05-11T22:15:00Z",
      current: false,
    },
    {
      id: "sess-3",
      device: "Windows Desktop",
      browser: "Chrome 126",
      ip: "41.210.xx.xx",
      location: "Entebbe, Uganda",
      lastActive: "2026-05-09T08:00:00Z",
      current: false,
    },
  ];
}

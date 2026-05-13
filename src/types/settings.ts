// ============================================================
// Half Life Dashboard — Settings & Auth Types
// ============================================================

// --- User Profile ---
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
  plan: SubscriptionPlan;
  timezone: string;
  currency: string;
  createdAt: string;
}

export type UserRole = "owner" | "admin" | "editor" | "viewer";

export type SubscriptionPlan = "free" | "standard" | "pro";

// --- Dashboard Preferences ---
export interface DashboardPreferences {
  defaultPage: string;
  timezone: string;
  currency: string;
  notificationsEnabled: boolean;
  emailDigest: "daily" | "weekly" | "never";
  compactMode: boolean;
}

export const DEFAULT_PREFERENCES: DashboardPreferences = {
  defaultPage: "/",
  timezone: "Africa/Kampala",
  currency: "UGX",
  notificationsEnabled: true,
  emailDigest: "weekly",
  compactMode: false,
};

// --- Team Members ---
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
  status: "active" | "invited" | "disabled";
  joinedAt: string;
  lastActive?: string;
}

// --- Connected Accounts (API Connections) ---
export interface ConnectedAccount {
  id: string;
  platform: "instagram" | "tiktok" | "youtube" | "twitter" | "facebook-pages" | "facebook-groups";
  handle: string;
  displayName: string;
  connected: boolean;
  connectedAt?: string;
  expiresAt?: string;
  scopes?: string[];
}

// --- Billing ---
export interface SubscriptionInfo {
  plan: SubscriptionPlan;
  status: "active" | "past_due" | "canceled" | "trialing";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  monthlyPrice: number;
  paymentMethod?: {
    type: "mobile_money" | "card" | "bank_transfer";
    last4?: string;
    provider?: string;
  };
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  description: string;
}

// --- Security ---
export interface LoginSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location?: string;
  lastActive: string;
  current: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  sessions: LoginSession[];
}

// --- Settings Sections ---
export type SettingsSection =
  | "profile"
  | "preferences"
  | "team"
  | "connections"
  | "billing"
  | "ai"
  | "security";

export const SETTINGS_SECTIONS: {
  value: SettingsSection;
  label: string;
  description: string;
}[] = [
  {
    value: "profile",
    label: "Profile & Account",
    description: "Name, email, avatar, and account management",
  },
  {
    value: "preferences",
    label: "Preferences",
    description: "Dashboard defaults, timezone, and notifications",
  },
  {
    value: "team",
    label: "Team & Access",
    description: "Invite members, manage roles and permissions",
  },
  {
    value: "connections",
    label: "API Connections",
    description: "Connect Instagram, TikTok, YouTube accounts",
  },
  {
    value: "billing",
    label: "Billing & Plan",
    description: "Subscription tier, payment method, invoices",
  },
  {
    value: "ai",
    label: "AI Config",
    description: "OpenClaw Gateway URL, auth token, and memory",
  },
  {
    value: "security",
    label: "Security",
    description: "Active sessions, 2FA, login history",
  },
];

// --- Timezone Options ---
export const TIMEZONE_OPTIONS = [
  { value: "Africa/Kampala", label: "East Africa Time (EAT) — Kampala" },
  { value: "Africa/Nairobi", label: "East Africa Time (EAT) — Nairobi" },
  { value: "Africa/Lagos", label: "West Africa Time (WAT) — Lagos" },
  { value: "Africa/Cairo", label: "Eastern European Time (EET) — Cairo" },
  { value: "Africa/Johannesburg", label: "South Africa Standard Time (SAST)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT) — London" },
  { value: "America/New_York", label: "Eastern Time (ET) — New York" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT) — Los Angeles" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST) — Dubai" },
] as const;

// --- Page Options (for default page preference) ---
export const PAGE_OPTIONS = [
  { value: "/", label: "Dashboard Home" },
  { value: "/instagram", label: "Instagram Manager" },
  { value: "/analytics", label: "Analytics" },
  { value: "/calendar", label: "Content Calendar" },
  { value: "/competitors", label: "Competitor Tracker" },
  { value: "/news", label: "News Feed" },
  { value: "/ai-agent", label: "AI Agent" },
] as const;

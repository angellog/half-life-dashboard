// ============================================================
// Half Life Dashboard — Type Definitions
// ============================================================

// --- Instagram Manager ---
export interface Post {
  id: string;
  caption: string;
  type: "reel" | "carousel" | "story" | "single";
  status: "scheduled" | "draft" | "published" | "backlog";
  scheduledDate?: string;
  publishedDate?: string;
  imageUrl?: string;
  // Platform specific fields
  hashtags?: string[];
  isThread?: boolean;
  videoDuration?: string;
  link?: string;
  metricoolStatus?: "synced" | "pending" | "error";
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
  };
}

export type PostType = Post["type"];
export type PostStatus = Post["status"];

// --- Analytics ---
export interface AnalyticsKPI {
  label: string;
  value: string | number;
  change: number;
  trend: "up" | "down" | "flat";
}

export interface PerformanceByType {
  type: string;
  impressions: number;
  engagement: number;
}

export interface FollowerHistory {
  date: string;
  followers: number;
}

export interface AnalyticsData {
  kpis: AnalyticsKPI[];
  performanceByType: PerformanceByType[];
  followerHistory: FollowerHistory[];
  topPosts: Post[];
}

// --- Content Calendar ---
export type Platform =
  | "instagram"
  | "youtube"
  | "tiktok"
  | "twitter"
  | "facebook-pages"
  | "facebook-groups";

export interface CalendarItem {
  id: string;
  title: string;
  platform: Platform;
  date: string; // YYYY-MM-DD
  time?: string;
  status: "scheduled" | "published" | "draft";
  type: string;
}

export const PLATFORM_COLORS: Record<Platform, string> = {
  instagram: "#E1306C",
  youtube: "#FF0000",
  tiktok: "#00F2EA",
  twitter: "#1DA1F2",
  "facebook-pages": "#1877F2",
  "facebook-groups": "#0866FF",
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  twitter: "X / Twitter",
  "facebook-pages": "FB Pages",
  "facebook-groups": "FB Groups",
};

// --- Competitor Tracker ---
export interface CompetitorTopPost {
  caption: string;
  likes: number;
  comments: number;
  date: string;
}

export interface PromotedPostAnalysis {
  estimatedReach: number;
  engagementOnAds: number;
  audienceDemographics: string;
}

export interface Competitor {
  id: string;
  handle: string;
  platform: Platform;
  displayName: string;
  followers: number;
  avgLikes: number;
  avgComments: number;
  postingFrequency: string;
  growthRate: number;
  growthHistory: { date: string; followers: number }[];
  topPosts: CompetitorTopPost[];
  promotedPostAnalysis?: PromotedPostAnalysis;
}

// --- News Consolidator ---
export type NewsTopic =
  | "sneaker-releases"
  | "fashion-trends"
  | "streetwear"
  | "industry";

export interface NewsArticle {
  id: string;
  headline: string;
  source: string;
  publishDate: string;
  summary: string;
  thumbnailUrl?: string;
  url: string;
  topic: NewsTopic;
}

export const NEWS_TOPICS: { value: NewsTopic; label: string }[] = [
  { value: "sneaker-releases", label: "Sneaker Releases" },
  { value: "fashion-trends", label: "Fashion Trends" },
  { value: "streetwear", label: "Streetwear" },
  { value: "industry", label: "Industry" },
];

export const NEWS_SOURCES = [
  "Hypebeast",
  "Highsnobiety",
  "Complex",
  "Sole Collector",
  "Sneaker News",
  "GQ",
  "Vogue",
  "Business of Fashion",
] as const;

// --- NFC Card Store (Phase 7) ---
export interface NFCProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  isUpgrade: boolean;
}

// --- Billing / Live Meter (Phase 8) ---
export interface UsageMetric {
  category: string;
  used: number;
  limit: number;
  unit: string;
  costPerUnit: number;
}

export interface BillingTier {
  name: string;
  monthlyPrice: number;
  features: string[];
  isPopular?: boolean;
}

// --- WhatsApp Billboard (Phase 9) ---
export interface WhatsAppCampaign {
  id: string;
  name: string;
  creative: string;
  schedule: string;
  status: "active" | "paused" | "completed" | "draft";
  views: number;
  reach: number;
  engagement: number;
}

// --- AI Agent (Phase 10) ---
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// --- Navigation ---
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  disabled?: boolean;
}

import { AnalyticsKPI, PerformanceByType, FollowerHistory, Post } from "@/types";

export const analyticsKPIs: AnalyticsKPI[] = [
  {
    label: "Total Impressions",
    value: 284750,
    change: 12.5,
    trend: "up",
  },
  {
    label: "Engagement Rate",
    value: "4.8%",
    change: 0.6,
    trend: "up",
  },
  {
    label: "Follower Growth",
    value: "+2,847",
    change: 18.3,
    trend: "up",
  },
  {
    label: "Total Posts",
    value: 42,
    change: -5.2,
    trend: "down",
  },
];

export const performanceByType: PerformanceByType[] = [
  { type: "Reels", impressions: 128400, engagement: 6.2 },
  { type: "Carousels", impressions: 89200, engagement: 5.1 },
  { type: "Stories", impressions: 45100, engagement: 3.8 },
  { type: "Singles", impressions: 22050, engagement: 2.4 },
];

export const followerHistory: FollowerHistory[] = [
  { date: "2026-02-01", followers: 12400 },
  { date: "2026-02-08", followers: 12680 },
  { date: "2026-02-15", followers: 12950 },
  { date: "2026-02-22", followers: 13100 },
  { date: "2026-03-01", followers: 13380 },
  { date: "2026-03-08", followers: 13720 },
  { date: "2026-03-15", followers: 13890 },
  { date: "2026-03-22", followers: 14200 },
  { date: "2026-03-29", followers: 14580 },
  { date: "2026-04-05", followers: 14810 },
  { date: "2026-04-12", followers: 15100 },
  { date: "2026-04-19", followers: 15450 },
  { date: "2026-04-26", followers: 15780 },
  { date: "2026-05-03", followers: 16200 },
  { date: "2026-05-10", followers: 16847 },
];

export const topPerformingPosts: Post[] = [
  {
    id: "top-1",
    caption:
      "Our NFC Smart Cards just hit different. Tap your phone, get the brand.",
    type: "reel",
    status: "published",
    publishedDate: "2026-04-22",
    engagement: { likes: 5673, comments: 489, shares: 1203, saves: 1876 },
  },
  {
    id: "top-2",
    caption:
      "Top 5 sneaker cleaning tips that actually work. Save this for later.",
    type: "reel",
    status: "published",
    publishedDate: "2026-04-28",
    engagement: { likes: 4521, comments: 198, shares: 876, saves: 2341 },
  },
  {
    id: "top-3",
    caption:
      "Kampala street style vol. 3 — The best fits spotted around the city.",
    type: "carousel",
    status: "published",
    publishedDate: "2026-04-25",
    engagement: { likes: 3102, comments: 267, shares: 445, saves: 891 },
  },
  {
    id: "top-4",
    caption:
      "GRAIL UNBOXING: Travis Scott x Nike Air Jordan 1 Low OG 'Reverse Mocha'.",
    type: "carousel",
    status: "published",
    publishedDate: "2026-05-01",
    engagement: { likes: 2847, comments: 312, shares: 189, saves: 567 },
  },
  {
    id: "top-5",
    caption:
      "Day in the life of a sneaker reseller in Kampala. The hustle is real.",
    type: "reel",
    status: "published",
    publishedDate: "2026-04-15",
    engagement: { likes: 2456, comments: 178, shares: 334, saves: 612 },
  },
];

export function getAnalyticsData() {
  return {
    kpis: analyticsKPIs,
    performanceByType,
    followerHistory,
    topPosts: topPerformingPosts,
  };
}

import { CalendarItem } from "@/types";

export const calendarItems: CalendarItem[] = [
  // May 2026
  { id: "cal-1", title: "Jordan 1 Chicago Drop Reel", platform: "instagram", date: "2026-05-01", time: "10:00", status: "published", type: "reel" },
  { id: "cal-2", title: "Unboxing Video: Travis Scott AJ1", platform: "youtube", date: "2026-05-01", time: "14:00", status: "published", type: "video" },
  { id: "cal-3", title: "Sneaker Poll: Best Drop May", platform: "twitter", date: "2026-05-02", time: "09:00", status: "published", type: "poll" },
  { id: "cal-4", title: "Summer Lookbook BTS", platform: "instagram", date: "2026-05-03", time: "12:00", status: "published", type: "carousel" },
  { id: "cal-5", title: "Fit Check Challenge", platform: "tiktok", date: "2026-05-03", time: "18:00", status: "published", type: "short" },
  { id: "cal-6", title: "NFC Card Product Showcase", platform: "instagram", date: "2026-05-05", time: "11:00", status: "published", type: "reel" },
  { id: "cal-7", title: "Weekly Sneaker News Roundup", platform: "youtube", date: "2026-05-06", time: "16:00", status: "published", type: "video" },
  { id: "cal-8", title: "Kampala Street Style Vol 3", platform: "instagram", date: "2026-05-07", time: "10:00", status: "published", type: "carousel" },
  { id: "cal-9", title: "Sneaker Cleaning Tutorial", platform: "tiktok", date: "2026-05-08", time: "15:00", status: "published", type: "short" },
  { id: "cal-10", title: "Brand Collab Announcement", platform: "twitter", date: "2026-05-09", time: "09:00", status: "published", type: "thread" },
  { id: "cal-11", title: "Sneaker Storage Hacks", platform: "instagram", date: "2026-05-10", time: "12:00", status: "published", type: "reel" },
  { id: "cal-12", title: "Thrift Haul Owino Market", platform: "youtube", date: "2026-05-10", time: "17:00", status: "published", type: "video" },
  { id: "cal-13", title: "NB 550 vs Adidas Samba Debate", platform: "tiktok", date: "2026-05-12", time: "14:00", status: "scheduled", type: "short" },
  { id: "cal-14", title: "Community Spotlight Post", platform: "facebook-pages", date: "2026-05-12", time: "10:00", status: "scheduled", type: "post" },
  { id: "cal-15", title: "Jordan 1 Chicago Reel", platform: "instagram", date: "2026-05-15", time: "10:00", status: "scheduled", type: "reel" },
  { id: "cal-16", title: "Summer Lookbook Launch", platform: "instagram", date: "2026-05-16", time: "12:00", status: "scheduled", type: "carousel" },
  { id: "cal-17", title: "Air Max Day Content", platform: "tiktok", date: "2026-05-17", time: "09:00", status: "scheduled", type: "short" },
  { id: "cal-18", title: "Fit Check: AM97 Silver", platform: "instagram", date: "2026-05-18", time: "11:00", status: "scheduled", type: "single" },
  { id: "cal-19", title: "Top 10 Sneakers 2026", platform: "youtube", date: "2026-05-19", time: "15:00", status: "scheduled", type: "video" },
  { id: "cal-20", title: "Giveaway Announcement", platform: "instagram", date: "2026-05-20", time: "10:00", status: "draft", type: "reel" },
  { id: "cal-21", title: "Sneaker History Thread", platform: "twitter", date: "2026-05-20", time: "14:00", status: "scheduled", type: "thread" },
  { id: "cal-22", title: "Capsule Collection Teaser", platform: "instagram", date: "2026-05-22", time: "18:00", status: "draft", type: "story" },
  { id: "cal-23", title: "East African Sneaker Culture", platform: "youtube", date: "2026-05-23", time: "12:00", status: "draft", type: "video" },
  { id: "cal-24", title: "Weekend Rotation", platform: "instagram", date: "2026-05-24", time: "09:00", status: "draft", type: "carousel" },
  { id: "cal-25", title: "Reseller Tips", platform: "tiktok", date: "2026-05-25", time: "16:00", status: "draft", type: "short" },
  { id: "cal-26", title: "Community Q&A", platform: "facebook-pages", date: "2026-05-26", time: "11:00", status: "draft", type: "live" },
  { id: "cal-27", title: "New Drop Alert", platform: "twitter", date: "2026-05-27", time: "08:00", status: "draft", type: "post" },
  { id: "cal-28", title: "Monthly Wrap-up Reel", platform: "instagram", date: "2026-05-28", time: "10:00", status: "draft", type: "reel" },
  { id: "cal-29", title: "June Preview", platform: "instagram", date: "2026-05-30", time: "12:00", status: "draft", type: "carousel" },
  { id: "cal-30", title: "Behind the Brand Ep. 4", platform: "youtube", date: "2026-05-30", time: "15:00", status: "draft", type: "video" },
  { id: "cal-31", title: "Flash Sale Promo", platform: "facebook-pages", date: "2026-05-31", time: "09:00", status: "draft", type: "post" },
  { id: "cal-32", title: "Sneaker of the Month", platform: "tiktok", date: "2026-05-31", time: "14:00", status: "draft", type: "short" },
];

export function getCalendarItems(): CalendarItem[] {
  return calendarItems;
}

export function getCalendarItemsByDate(date: string): CalendarItem[] {
  return calendarItems.filter((item) => item.date === date);
}

export function getCalendarItemsByPlatform(platform: string): CalendarItem[] {
  return calendarItems.filter((item) => item.platform === platform);
}

import { WhatsAppCampaign } from "@/types";

export interface BillboardSlot {
  id: string;
  name: string;
  timeSlot: string;
  audience: string;
  pricePerDay: number;
  available: boolean;
  reach: number;
}

export const campaigns: WhatsAppCampaign[] = [
  {
    id: "camp-1",
    name: "Jordan 1 Chicago Drop Promo",
    creative: "jordan-chicago-status.jpg",
    schedule: "May 14-16, 2026 — 3x daily",
    status: "active",
    views: 12480,
    reach: 8740,
    engagement: 1456,
  },
  {
    id: "camp-2",
    name: "Summer Lookbook Launch",
    creative: "summer-lookbook-video.mp4",
    schedule: "May 16-20, 2026 — 2x daily",
    status: "active",
    views: 8920,
    reach: 6230,
    engagement: 987,
  },
  {
    id: "camp-3",
    name: "NFC Card Awareness",
    creative: "nfc-card-promo.jpg",
    schedule: "May 1-7, 2026 — 4x daily",
    status: "completed",
    views: 34560,
    reach: 21300,
    engagement: 4210,
  },
  {
    id: "camp-4",
    name: "Sneaker Cleaning Tips Series",
    creative: "cleaning-tips-carousel.jpg",
    schedule: "Apr 20-30, 2026 — 2x daily",
    status: "completed",
    views: 28740,
    reach: 18900,
    engagement: 3560,
  },
  {
    id: "camp-5",
    name: "Weekend Flash Sale",
    creative: "flash-sale-banner.jpg",
    schedule: "May 10-11, 2026 — 6x daily",
    status: "completed",
    views: 15230,
    reach: 11200,
    engagement: 2890,
  },
  {
    id: "camp-6",
    name: "Brand Collab Teaser",
    creative: "collab-teaser.mp4",
    schedule: "May 20-25, 2026 — 3x daily",
    status: "draft",
    views: 0,
    reach: 0,
    engagement: 0,
  },
  {
    id: "camp-7",
    name: "June Collection Preview",
    creative: "june-preview.jpg",
    schedule: "May 28-31, 2026 — 2x daily",
    status: "draft",
    views: 0,
    reach: 0,
    engagement: 0,
  },
];

export const billboardSlots: BillboardSlot[] = [
  {
    id: "slot-1",
    name: "Morning Rush",
    timeSlot: "6:00 AM - 9:00 AM",
    audience: "Commuters & early risers",
    pricePerDay: 15000,
    available: true,
    reach: 4200,
  },
  {
    id: "slot-2",
    name: "Midday Peak",
    timeSlot: "11:00 AM - 2:00 PM",
    audience: "Lunch break scrollers",
    pricePerDay: 20000,
    available: false,
    reach: 5800,
  },
  {
    id: "slot-3",
    name: "Afternoon Drive",
    timeSlot: "3:00 PM - 6:00 PM",
    audience: "After-work audience",
    pricePerDay: 18000,
    available: true,
    reach: 5100,
  },
  {
    id: "slot-4",
    name: "Evening Prime",
    timeSlot: "7:00 PM - 10:00 PM",
    audience: "Peak social media hours",
    pricePerDay: 25000,
    available: true,
    reach: 7400,
  },
  {
    id: "slot-5",
    name: "Late Night",
    timeSlot: "10:00 PM - 1:00 AM",
    audience: "Night owls & Gen Z",
    pricePerDay: 12000,
    available: true,
    reach: 3100,
  },
  {
    id: "slot-6",
    name: "Full Day Bundle",
    timeSlot: "6:00 AM - 10:00 PM",
    audience: "Maximum reach all day",
    pricePerDay: 75000,
    available: true,
    reach: 22000,
  },
];

export const whatsappStats = {
  totalCampaigns: 7,
  activeCampaigns: 2,
  totalViews: 99930,
  totalReach: 66370,
  totalEngagement: 13103,
  avgEngagementRate: 19.7,
};

export function getCampaigns(): WhatsAppCampaign[] {
  return campaigns;
}

export function getBillboardSlots(): BillboardSlot[] {
  return billboardSlots;
}

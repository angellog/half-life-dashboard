import { Post, Platform } from "@/types";

export const initialSocialPosts: Record<Platform, Post[]> = {
  instagram: [
    {
      id: "ig-1",
      caption: "New Jordan 1 High OG 'Chicago' dropping this Friday. Who's copping? Link in bio.",
      type: "reel",
      status: "scheduled",
      scheduledDate: "2026-05-15",
      imageUrl: "/placeholder-sneaker-1.jpg",
      hashtags: ["Jordan1", "Chicago", "SneakerDrop"],
      metricoolStatus: "synced",
    },
    {
      id: "ig-2",
      caption: "Behind the scenes of our Summer '26 shoot. 📸",
      type: "carousel",
      status: "draft",
      hashtags: ["BTS", "Streetwear", "FashionShoot"],
    },
    {
      id: "ig-3",
      caption: "GRAIL UNBOXING: Travis Scott AJ1 Low. Pure heat. 🔥",
      type: "reel",
      status: "published",
      publishedDate: "2026-05-01",
      engagement: { likes: 2847, comments: 312, shares: 189, saves: 567 },
      hashtags: ["TravisScott", "Unboxing", "Grails"],
      metricoolStatus: "synced",
    }
  ],
  tiktok: [
    {
      id: "tt-1",
      caption: "Unboxing the rarest sneakers in Kampala! 🇺🇬 #SneakerHead #Kampala #Unboxing",
      type: "reel",
      status: "published",
      publishedDate: "2026-05-10",
      engagement: { likes: 12500, comments: 450, shares: 890, saves: 1200 },
      videoDuration: "0:58",
      metricoolStatus: "synced",
    },
    {
      id: "tt-2",
      caption: "How to spot fake Dunks in 60 seconds. 🕵️‍♂️ #Tutorial #Sneakers",
      type: "reel",
      status: "draft",
      videoDuration: "1:00",
    },
    {
      id: "tt-3",
      caption: "POV: You finally got your hands on the Tiffany AF1s. ✨",
      type: "reel",
      status: "scheduled",
      scheduledDate: "2026-05-18",
      videoDuration: "0:15",
    }
  ],
  twitter: [
    {
      id: "tw-1",
      caption: "Thread: Why the secondary sneaker market in East Africa is about to explode in 2026. 🧵👇",
      type: "single",
      status: "scheduled",
      scheduledDate: "2026-05-14",
      isThread: true,
      metricoolStatus: "synced",
    },
    {
      id: "tw-2",
      caption: "Unpopular opinion: The Jordan 4 is more iconic than the Jordan 1. Fight me. 👟💨",
      type: "single",
      status: "published",
      publishedDate: "2026-05-12",
      engagement: { likes: 450, comments: 89, shares: 12, saves: 34 },
    }
  ],
  "facebook-pages": [
    {
      id: "fbp-1",
      caption: "Join us this weekend for the Half Life Community Meetup at the mall. Sneaker swaps and vibes.",
      type: "carousel",
      status: "scheduled",
      scheduledDate: "2026-05-20",
      link: "halflife.ug/events/meetup-kampala",
    },
    {
      id: "fbp-2",
      caption: "New arrivals in store now! Open 9am - 8pm in Kampala. 🇺🇬",
      type: "single",
      status: "published",
      publishedDate: "2026-05-08",
      engagement: { likes: 890, comments: 45, shares: 67, saves: 12 },
    }
  ],
  "facebook-groups": [
    {
      id: "fbg-1",
      caption: "POLL: What's the best cleaning kit for suede kicks? Vote below! 👇",
      type: "single",
      status: "published",
      publishedDate: "2026-05-11",
      engagement: { likes: 45, comments: 120, shares: 5, saves: 10 },
    },
    {
      id: "fbg-2",
      caption: "REMINDER: Don't buy from @unverified_scammer. Stay safe, community! 🛡️",
      type: "single",
      status: "backlog",
    }
  ],
  youtube: [
    {
      id: "yt-1",
      caption: "Half Life Documentary: The Rise of Streetwear in Uganda. (Preview)",
      type: "single",
      status: "draft",
      videoDuration: "12:45",
    },
    {
      id: "yt-2",
      caption: "JORDAN 1 RE-CLEAN: Restoring a pair from 1985. Part 1.",
      type: "single",
      status: "scheduled",
      scheduledDate: "2026-05-22",
      videoDuration: "08:20",
    }
  ]
};

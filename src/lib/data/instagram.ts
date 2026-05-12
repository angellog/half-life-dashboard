import { Post } from "@/types";

export const instagramPosts: Post[] = [
  {
    id: "post-1",
    caption:
      "New Jordan 1 Retro High OG 'Chicago' dropping this Friday. Who's copping? Link in bio for raffle entry.",
    type: "reel",
    status: "scheduled",
    scheduledDate: "2026-05-15",
    imageUrl: "/placeholder-sneaker-1.jpg",
  },
  {
    id: "post-2",
    caption:
      "Behind the scenes of our Summer '26 lookbook shoot. Styling vintage Nike Dunks with modern streetwear. Full collection drops next week.",
    type: "carousel",
    status: "scheduled",
    scheduledDate: "2026-05-16",
    imageUrl: "/placeholder-lookbook.jpg",
  },
  {
    id: "post-3",
    caption:
      "Fit check: Air Max 97 Silver Bullet x oversized vintage denim x Half Life essential tee. Rate this fit 1-10.",
    type: "single",
    status: "scheduled",
    scheduledDate: "2026-05-18",
    imageUrl: "/placeholder-fitcheck.jpg",
  },
  {
    id: "post-4",
    caption:
      "Quick tutorial: How to style your New Balance 550s for any occasion — casual, smart casual, and streetwear.",
    type: "reel",
    status: "draft",
    imageUrl: "/placeholder-tutorial.jpg",
  },
  {
    id: "post-5",
    caption:
      "Sneaker rotation of the week. Which pair are you reaching for? Swipe to see all 5.",
    type: "carousel",
    status: "draft",
    imageUrl: "/placeholder-rotation.jpg",
  },
  {
    id: "post-6",
    caption:
      "Upcoming collab alert! We're working with local Kampala designers on a limited capsule collection. Stay tuned.",
    type: "story",
    status: "draft",
  },
  {
    id: "post-7",
    caption:
      "Throwback to the Nike Dunk Low 'Panda' era. These changed the sneaker game forever.",
    type: "single",
    status: "draft",
    imageUrl: "/placeholder-throwback.jpg",
  },
  {
    id: "post-8",
    caption:
      "GRAIL UNBOXING: Just got the Travis Scott x Nike Air Jordan 1 Low OG 'Reverse Mocha'. Swipe for the details.",
    type: "carousel",
    status: "published",
    publishedDate: "2026-05-01",
    imageUrl: "/placeholder-unbox.jpg",
    engagement: { likes: 2847, comments: 312, shares: 189, saves: 567 },
  },
  {
    id: "post-9",
    caption:
      "Top 5 sneaker cleaning tips that actually work. Save this for later. Your kicks will thank you.",
    type: "reel",
    status: "published",
    publishedDate: "2026-04-28",
    imageUrl: "/placeholder-cleaning.jpg",
    engagement: { likes: 4521, comments: 198, shares: 876, saves: 2341 },
  },
  {
    id: "post-10",
    caption:
      "Kampala street style vol. 3 — The best fits spotted around the city this week.",
    type: "carousel",
    status: "published",
    publishedDate: "2026-04-25",
    imageUrl: "/placeholder-streetstyle.jpg",
    engagement: { likes: 3102, comments: 267, shares: 445, saves: 891 },
  },
  {
    id: "post-11",
    caption:
      "Our NFC Smart Cards just hit different. Tap your phone, get the brand. Digital business cards for the modern hustler.",
    type: "reel",
    status: "published",
    publishedDate: "2026-04-22",
    imageUrl: "/placeholder-nfc.jpg",
    engagement: { likes: 5673, comments: 489, shares: 1203, saves: 1876 },
  },
  {
    id: "post-12",
    caption:
      "Adidas Samba vs. New Balance 550 — The ultimate lifestyle sneaker debate. Which side are you on?",
    type: "single",
    status: "backlog",
  },
  {
    id: "post-13",
    caption:
      "The history of Air Jordan: From the court to the streets. A thread on how MJ changed fashion forever.",
    type: "carousel",
    status: "backlog",
  },
  {
    id: "post-14",
    caption:
      "Sneaker storage hacks for small spaces. Because your collection deserves better than a pile in the corner.",
    type: "reel",
    status: "backlog",
  },
  {
    id: "post-15",
    caption:
      "East African sneaker culture is on the rise. A spotlight on the creators and collectors making moves in Kampala.",
    type: "reel",
    status: "backlog",
  },
  {
    id: "post-16",
    caption:
      "Vintage thrift haul: Found some heat at the Owino Market. Y2K pieces going for next to nothing.",
    type: "carousel",
    status: "backlog",
  },
];

export function getPostsByStatus(status: Post["status"]): Post[] {
  return instagramPosts.filter((p) => p.status === status);
}

export function getPostById(id: string): Post | undefined {
  return instagramPosts.find((p) => p.id === id);
}

export function getAllPosts(): Post[] {
  return instagramPosts;
}

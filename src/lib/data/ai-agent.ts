import { ChatMessage } from "@/types";

export const sampleConversation: ChatMessage[] = [
  {
    id: "msg-1",
    role: "assistant",
    content:
      "Welcome to OpenClaw Pro! I'm your AI-powered content strategist. I can help you create content ideas, analyze competitors, optimize your posting schedule, and provide agency-level marketing advice. What would you like to work on today?",
    timestamp: "2026-05-12T09:00:00",
  },
  {
    id: "msg-2",
    role: "user",
    content:
      "What type of content should I post this week for maximum engagement?",
    timestamp: "2026-05-12T09:01:00",
  },
  {
    id: "msg-3",
    role: "assistant",
    content:
      "Based on your analytics from the last 30 days, here's my recommendation for this week:\n\n**Top Performing Format:** Reels are driving 2.5x more engagement than other formats for your account.\n\n**This Week's Content Plan:**\n1. **Monday** — Sneaker unboxing Reel (your unboxings avg 4.5K likes)\n2. **Wednesday** — Fit check carousel (3-5 slides with outfit breakdowns)\n3. **Friday** — Behind-the-scenes Story series from your weekend shoot\n4. **Saturday** — User-generated content Reel (repost community fits)\n\n**Optimal Posting Times:**\n- Weekdays: 12:00 PM and 6:00 PM EAT\n- Weekend: 10:00 AM and 8:00 PM EAT\n\n**Trending Hashtags for Sneaker Niche:**\n#SneakerCulture #KampalaStreetStyle #FitCheck #SneakerHead #OOTD\n\nWant me to draft captions for any of these?",
    timestamp: "2026-05-12T09:01:30",
  },
  {
    id: "msg-4",
    role: "user",
    content: "Yes, draft a caption for the Monday sneaker unboxing Reel.",
    timestamp: "2026-05-12T09:02:00",
  },
  {
    id: "msg-5",
    role: "assistant",
    content:
      "Here are 3 caption options for your Monday unboxing Reel:\n\n**Option 1 (Hype):**\n\"GRAIL ALERT! Just copped the Air Jordan 1 Retro High OG 'Chicago' and the quality is INSANE. Swipe to see the details up close. Would you rock or stock these? Drop your answer below.\n\n#AirJordan1 #Chicago #SneakerUnboxing #Grails #KampalaKicks\"\n\n**Option 2 (Storytelling):**\n\"6 months of saving. 3 missed raffles. 1 lucky W.\n\nFinally got my hands on the most iconic Jordan colorway ever made. The leather quality on this pair is next level. Full unboxing review — watch till the end for the on-feet.\n\n#JordanRetro #SneakerStory #HalfLifeKicks\"\n\n**Option 3 (Engagement-focused):**\n\"Unboxing the shoe that started it all. Rate the presentation 1-10.\n\nFun fact: The original 1985 Chicago 1s were banned by the NBA, and Nike paid $5,000 per game in fines just to keep MJ wearing them.\n\nSave this for your sneaker knowledge.\n\n#SneakerFacts #AJ1 #UnboxingTime\"\n\nI recommend **Option 3** — it combines education + engagement hooks (\"rate 1-10\" + \"save this\") which historically perform best for your audience. Want me to schedule this?",
    timestamp: "2026-05-12T09:02:30",
  },
  {
    id: "msg-6",
    role: "user",
    content: "Analyze my top 3 competitors and tell me what they're doing better than me.",
    timestamp: "2026-05-12T09:05:00",
  },
  {
    id: "msg-7",
    role: "assistant",
    content:
      "Here's a competitive analysis of your top 3 tracked competitors:\n\n**1. @kicksonfire (3.2M followers)**\n- Posting 3x daily vs your 1x daily\n- Heavy use of breaking news format — they're first to post about drops\n- Gap: You can compete by being first in the East African market\n\n**2. @hypebeast (12.4M followers)**\n- Mixing fashion + lifestyle + culture (not just sneakers)\n- High production quality on video content\n- Gap: Your street-level authenticity is actually an advantage — lean into Kampala culture\n\n**3. @nicekicks (2.8M followers)**\n- Strong community engagement — they reply to every comment\n- Tutorial content (customs, cleaning) drives their highest saves\n- Gap: You already do cleaning content well, double down on tutorials\n\n**Key Takeaways:**\n- Increase posting frequency from 1x to 2x daily minimum\n- Add a \"breaking news\" content pillar for East African sneaker drops\n- Reply to more comments — your response rate is 12% vs their 85%\n- Your local Kampala content is unique — none of them cover East Africa\n\nWant me to create a detailed action plan?",
    timestamp: "2026-05-12T09:05:30",
  },
];

export const suggestedPrompts = [
  {
    category: "Content",
    prompts: [
      "Generate 10 post ideas for this week",
      "Write a caption for my latest sneaker unboxing",
      "What content format should I focus on?",
      "Create a content calendar for the next month",
    ],
  },
  {
    category: "Analytics",
    prompts: [
      "Analyze my engagement trends",
      "Which posts performed best last month?",
      "What's my optimal posting time?",
      "Compare my metrics to competitors",
    ],
  },
  {
    category: "Strategy",
    prompts: [
      "Analyze my top 3 competitors",
      "How can I grow to 50K followers?",
      "What niches should I expand into?",
      "Create a brand partnership pitch",
    ],
  },
  {
    category: "Business",
    prompts: [
      "How should I price sponsored posts?",
      "Create an NFC card sales pitch",
      "Draft a WhatsApp billboard proposal",
      "What's my estimated account value?",
    ],
  },
];

export function getSampleConversation(): ChatMessage[] {
  return sampleConversation;
}

export function getSuggestedPrompts() {
  return suggestedPrompts;
}

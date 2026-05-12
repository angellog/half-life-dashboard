# Half Life Dashboard — Product Requirements Document (PRD)

## 1. Executive Summary

Half Life Dashboard is an AI-powered content management and business platform targeting brands in the **Sneakers & Fashion** industry. The platform serves as:

1. **Content Dashboard** — Manage Instagram content, track analytics, schedule posts, monitor competitors, and aggregate industry news
2. **Smart NFC Card Store** — Sell branded NFC business cards with a "2 profiles" moat strategy
3. **AI Consultancy Platform** — AI-powered agency tools with OpenClaw autonomous agent integration
4. **Advertising Network** — WhatsApp Status Billboard program for ad placement
5. **Subscription Business** — Live Meter billing model inspired by taxi meters for usage-based pricing

### Business Model
- **One-time Sales:** NFC Smart Cards (UGX 100,000 standard / UGX 35,000 metallic upgrade)
- **Subscription Revenue:** Live Meter usage-based billing for dashboard features
- **Advertising Revenue:** WhatsApp Status Billboard ad placements
- **AI Consultancy:** Pro-tier AI agent features (OpenClaw integration)

### Moat Strategy
Create 2 branded profiles with top-notch design. Sell standard card at UGX 100,000. Offer metallic upgrade at UGX 35,000. Card buyers become leads for subscription conversion.

---

## 2. Target Users

| Persona | Description |
|---|---|
| Brand Owners | Sneaker/fashion brands managing their social presence |
| Content Creators | Influencers and creators in the streetwear space |
| Small Businesses | Local businesses wanting smart NFC cards and digital presence |
| Marketing Agencies | Agencies managing multiple brand accounts |

---

## 3. Platform Sections

### 3.1 Dashboard Home
- Overview of all platform metrics at a glance
- Summary cards for each section
- Quick-action navigation
- Activity feed

### 3.2 Instagram Manager
- Kanban board: Scheduled, Drafts, Published, Backlog
- Post cards with caption preview, type badge, date, status
- Add Post dialog: caption, type (Reel/Carousel/Story/Single), status, date

### 3.3 Analytics Dashboard
- KPI cards: Total Impressions, Engagement Rate, Follower Growth, Total Posts
- Bar chart: Performance by content type
- Line chart: Follower growth over time
- Top Performing Posts table with date range picker
- Data source: Metricool API (mock data initially)

### 3.4 Content Calendar
- Monthly grid calendar with prev/next navigation
- Color-coded chips: Instagram(pink), YouTube(red), TikTok(cyan), Twitter(blue), Facebook(navy)
- Platform filter toggles, click-to-view day details

### 3.5 Competitor Tracker
- Add competitor form (handle, platform, name)
- Sortable table: Handle, Followers, Avg Likes, Comments, Frequency, Growth
- Promoted post audience analysis
- Growth trend sparklines
- Tracks: followers, most liked posts, comments, audience on promoted posts

### 3.6 News Consolidator
- RSS feed aggregation for Sneakers & Fashion
- Card feed: headline, source, date, summary, thumbnail
- Topic filters: Sneaker Releases, Fashion Trends, Streetwear, Industry
- Sources: Hypebeast, Highsnobiety, Complex, Sole Collector, Sneaker News, GQ, Vogue, BoF

### 3.7 NFC Card Store (Phase 7)
- Standard Smart Card — UGX 100,000
- Metallic Smart Card Upgrade — UGX 35,000
- 2-profile branding configurator
- Lead capture form → subscription pipeline

### 3.8 Live Meter Billing (Phase 8)
- Taxi-meter UI with real-time animated counter
- Usage: API calls, AI queries, posts, storage
- Subscription tiers: Free / Standard / Pro (UGX)

### 3.9 WhatsApp Status Billboard (Phase 9)
- Campaign manager, creative upload, scheduling
- Billboard slot marketplace, performance reporting

### 3.10 AI Agent — OpenClaw Pro (Phase 10)
- Chat interface, agent capabilities, Pro-tier gating
- Content suggestions, competitor analysis, scheduling

---

## 4. Technical Architecture

### Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Recharts
### Data: Mock data with API-ready service layer
### Theme: Dark-only, Zinc-based palette, Geist fonts
### Currency: Uganda Shillings (UGX)
### Responsive: Mobile-first, collapsible sidebar

---

## 5. Niche Context: Sneakers & Fashion
- **Sources:** Hypebeast, Highsnobiety, Complex, Sole Collector, Sneaker News, GQ, Vogue, BoF
- **Content:** Sneaker drops, lookbooks, fit checks, unboxings, brand collabs
- **Audience:** Gen Z and Millennials in streetwear and sneaker culture

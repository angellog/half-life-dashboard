# Half Life Dashboard — Project Documentation

## Project Overview
**Half Life Dashboard** is an AI-powered content management platform built for brands in the Sneakers & Fashion niche. It combines content management, analytics, competitor tracking, and business tools (NFC Smart Cards, WhatsApp Billboard advertising, AI consultancy) into a single dark-themed dashboard.

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Charts | Recharts |
| Icons | Lucide React |
| Date Utils | date-fns |
| Utilities | clsx, tailwind-merge, class-variance-authority |

## Folder Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (sidebar + dark theme)
│   ├── page.tsx            # Dashboard home/overview
│   ├── instagram/          # Instagram content manager
│   ├── analytics/          # Analytics dashboard
│   ├── calendar/           # Content calendar
│   ├── competitors/        # Competitor tracker
│   ├── news/               # News consolidator
│   ├── nfc-store/          # NFC Smart Card store
│   ├── billing/            # Live Meter billing system
│   ├── whatsapp-billboard/ # WhatsApp Status Billboard
│   └── ai-agent/           # AI Agent (OpenClaw Pro)
├── components/
│   ├── ui/                 # shadcn/ui components (auto-generated)
│   ├── layout/             # Sidebar, Header, navigation
│   ├── charts/             # Recharts wrapper components
│   └── shared/             # Reusable cards, forms, badges
├── lib/
│   ├── utils.ts            # cn() and utility functions
│   └── data/               # Mock data and API-ready service functions
├── hooks/                  # Custom React hooks
└── types/                  # TypeScript type definitions
```

## Component Conventions
- All components use TypeScript with explicit prop types
- shadcn/ui components live in `src/components/ui/` — do not edit directly
- Custom components use PascalCase filenames (e.g., `Sidebar.tsx`)
- Page components are default exports in `page.tsx` files
- Client components use `"use client"` directive at top of file
- All components use the `cn()` utility for conditional classnames

## Theme
- **Dark theme is the global default** — `dark` class applied to `<html>`
- Color palette uses shadcn/ui CSS variables (zinc-based dark scheme)
- Chart colors use `--chart-1` through `--chart-5` CSS variables
- Custom accent colors added for platform badges (Instagram pink, YouTube red, etc.)

## Currency
- All monetary values displayed in **Uganda Shillings (UGX)**
- Format: `UGX 100,000` — use `formatCurrency()` from `lib/utils.ts`
- NFC Card pricing: Standard = UGX 100,000 | Metallic Upgrade = UGX 35,000

## Data Layer
- Currently using **mock data** in `lib/data/` files
- All data access goes through service functions that return typed data
- Designed to be swapped with real API calls (Metricool, RSS feeds, etc.)
- Mock data is themed around **Sneakers & Fashion** niche

## Key Decisions
1. App Router (not Pages Router) for modern Next.js patterns
2. Dark-only theme — no light mode toggle needed
3. Mock data first, API-ready architecture for future integration
4. All 10 dashboard sections share a persistent sidebar navigation
5. Mobile-responsive with collapsible sidebar

## Phase Roadmap
- [x] Phase 1: Project scaffolding & core layout
- [x] Phase 2: Instagram Manager
- [x] Phase 3: Analytics Dashboard
- [x] Phase 4: Content Calendar
- [x] Phase 5: Competitor Tracker
- [x] Phase 6: News Consolidator
- [x] Phase 7: NFC Card Store
- [x] Phase 8: Live Meter Billing
- [x] Phase 9: WhatsApp Status Billboard
- [x] Phase 10: AI Agent (OpenClaw Pro)

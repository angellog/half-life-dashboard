"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSocialMediaStore } from "@/hooks/useSocialMediaStore";
import { useDashboardMode } from "@/hooks/useDashboardMode";
import { cn } from "@/lib/utils";
import { 
  Zap, 
  Plus, 
  ChevronRight, 
  Activity,
  Send,
  MoreVertical,
  MessageCircle,
  Bot,
  Camera,
  BarChart3,
  CalendarDays,
  Users,
  Newspaper,
  CreditCard,
  Gauge,
  TrendingUp,
  Eye,
  FileText,
  ArrowUpRight
} from "lucide-react";

const quickStats = [
  {
    label: "Total Impressions",
    value: "284.7K",
    change: "+12.5%",
    icon: Eye,
    trend: "up" as const,
  },
  {
    label: "Engagement Rate",
    value: "4.8%",
    change: "+0.6%",
    icon: TrendingUp,
    trend: "up" as const,
  },
  {
    label: "Posts This Month",
    value: "42",
    change: "-5.2%",
    icon: FileText,
    trend: "down" as const,
  },
  {
    label: "Follower Growth",
    value: "+2,847",
    change: "+18.3%",
    icon: Users,
    trend: "up" as const,
  },
];

function DispatchView({ mode }: { mode: "business" | "personal" }) {
  return (
    <div className="md:hidden space-y-4 pb-24">
      {/* Active Status / Live Meter Mini */}
      <Card className="bg-primary/5 border-primary/20 shadow-none">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">System Live</p>
              <p className="text-base font-bold tabular-nums">UGX 52,350</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="h-11 px-4 text-xs gap-2 font-bold ring-offset-background">
            <Zap className="h-4 w-4 text-primary" />
            BOOST
          </Button>
        </CardContent>
      </Card>

      {/* Grid for Crucial Parts */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-card shadow-none border-border/50">
          <CardContent className="p-4">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
               <Activity className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase">Reach</p>
            <p className="text-xl font-black tabular-nums">284.7K</p>
            <p className="text-[10px] text-green-400 font-bold mt-0.5">+12.5%</p>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-none border-border/50">
          <CardContent className="p-4">
            <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center mb-3">
               <MessageCircle className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase">Campaigns</p>
            <p className="text-xl font-black tabular-nums">3 Active</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Next: 7 PM</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Dispatch */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Dispatch Queue</h3>
          <Badge variant="outline" className="text-[10px] h-5 py-0 border-primary/30 text-primary">Live Sync</Badge>
        </div>
        <Card className="shadow-none border-border/50">
          <CardContent className="p-0">
            {[
              { title: "Nike AF1 Drop", platform: "Instagram", time: "12:30 PM", color: "bg-pink-500" },
              { title: "Weekly News", platform: "WhatsApp", time: "2:00 PM", color: "bg-green-500" },
              { title: "Competitor Audit", platform: "AI Agent", time: "4:15 PM", color: "bg-violet-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b last:border-0 border-border/50 active:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`h-2 w-2 rounded-full ${item.color} shadow-[0_0_8px] ${item.color.replace('bg-', 'shadow-')}/50`} />
                  <div>
                    <p className="text-sm font-bold leading-none mb-1">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{item.platform} • {item.time}</p>
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Strategist Mini */}
      <Card className="bg-violet-600/5 border-violet-500/20 shadow-none">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-violet-600 shadow-lg shadow-violet-600/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-tight">OpenClaw Pro</p>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                <p className="text-[10px] text-muted-foreground font-medium">Strategist Online</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Input placeholder="Message AI Strategist..." className="h-12 text-sm bg-background/50 border-border/50 px-4 rounded-xl" />
            <Button size="icon" className="h-12 w-12 bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-600/20 shrink-0 rounded-xl">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardHome() {
  const { posts } = useSocialMediaStore();
  const { mode } = useDashboardMode();
  
  // Calculate total posts across all platforms
  const totalSocialPosts = Object.values(posts).reduce((acc, platformPosts) => acc + platformPosts.length, 0);

  const sections = [
    {
      title: mode === "business" ? "Social Manager" : "Personal Socials",
      description: mode === "business" ? "Manage content across all your social platforms" : "Track your personal social presence",
      href: "/social",
      icon: Camera,
      stat: `${totalSocialPosts} items`,
      statLabel: "in pipeline",
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
    },
    {
      title: "Analytics",
      description: "Track performance metrics and growth trends",
      href: "/analytics",
      icon: BarChart3,
      stat: "284.7K",
      statLabel: "impressions",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Content Calendar",
      description: "Plan and schedule content across platforms",
      href: "/calendar",
      icon: CalendarDays,
      stat: "32 items",
      statLabel: "this month",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Competitor Tracker",
      description: "Monitor competitor accounts and performance",
      href: "/competitors",
      icon: Users,
      stat: "8 accounts",
      statLabel: "tracked",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      hidden: mode === "personal",
    },
    {
      title: mode === "business" ? "News Feed" : "Personal Feed",
      description: mode === "business" ? "Latest sneaker & fashion industry news" : "Your daily curated information",
      href: "/news",
      icon: Newspaper,
      stat: "22 articles",
      statLabel: "today",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "NFC Card Store",
      description: "Smart NFC business cards for your brand",
      href: "/nfc-store",
      icon: CreditCard,
      stat: "UGX 100K",
      statLabel: "from",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Live Meter Billing",
      description: "Usage-based subscription billing",
      href: "/billing",
      icon: Gauge,
      stat: "Free",
      statLabel: "current plan",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      hidden: mode === "personal",
    },
    {
      title: "WhatsApp Billboard",
      description: "Status ad placement and campaigns",
      href: "/whatsapp-billboard",
      icon: MessageCircle,
      stat: "0",
      statLabel: "active campaigns",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      hidden: mode === "personal",
    },
    {
      title: "AI Agent",
      description: "OpenClaw Pro — AI-powered consultancy",
      href: "/ai-agent",
      icon: Bot,
      stat: "Pro",
      statLabel: "feature",
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
      badge: "Pro",
    },
  ].filter(s => !s.hidden);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {mode === "business" ? "Business Dashboard" : "Personal OS"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {mode === "business" 
              ? "Welcome back. Here's your brand's performance overview."
              : "Welcome. Here's your personal activity overview."}
          </p>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border animate-pulse",
          mode === "business" ? "border-primary/50 text-primary bg-primary/5" : "border-violet-500/50 text-violet-400 bg-violet-500/5"
        )}>
          {mode === "business" ? "Enterprise Mode" : "Personal Mode"}
        </div>
      </div>

      {/* Dispatch View (Mobile Only) */}
      <DispatchView mode={mode} />

      {/* Quick Stats (Desktop Only) */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                  <span
                    className={
                      stat.trend === "up"
                        ? "text-xs text-green-400"
                        : "text-xs text-red-400"
                    }
                  >
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Section Cards (Desktop Only) */}
      <div className="hidden md:block">
        <h2 className="text-lg font-semibold mb-4">Your Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.href} href={section.href}>
                <Card className="group cursor-pointer transition-colors hover:border-primary/30 h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${section.bgColor}`}
                      >
                        <Icon className={`h-5 w-5 ${section.color}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        {section.badge && (
                          <Badge
                            variant="secondary"
                            className={
                              section.badge === "Pro"
                                ? "bg-violet-500/20 text-violet-400 border-0"
                                : ""
                            }
                          >
                            {section.badge}
                          </Badge>
                        )}
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <CardTitle className="text-base mt-3">
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                    </p>
                    <div className="mt-3 flex items-baseline gap-1.5">
                      <span className="text-lg font-semibold">
                        {section.stat}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {section.statLabel}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity (Desktop/Optimized) */}
      <div className="hidden md:block">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {[
                {
                  action: "Drafted",
                  actionColor: "bg-yellow-400",
                  item: "How to style Dunks tutorial",
                  time: "6 hours ago",
                  platform: "TikTok",
                },
                {
                  action: "Scheduled",
                  actionColor: "bg-blue-400",
                  item: "Jordan 1 vs 4 debate thread",
                  time: "8 hours ago",
                  platform: "Twitter",
                },
                {
                  action: "Published",
                  actionColor: "bg-green-400",
                  item: "Community Meetup announcement",
                  time: "1 day ago",
                  platform: "Facebook",
                },
                {
                  action: "Tracked",
                  actionColor: "bg-zinc-400",
                  item: "@hypebeast added to competitors",
                  time: "1 day ago",
                  platform: "System",
                },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${activity.actionColor}`}
                    />
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{activity.action}:</span>{" "}
                        {activity.item}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{activity.platform}</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Camera,
  BarChart3,
  CalendarDays,
  Users,
  Newspaper,
  CreditCard,
  Gauge,
  MessageCircle,
  Bot,
  TrendingUp,
  Eye,
  FileText,
  ArrowUpRight,
} from "lucide-react";

const sections = [
  {
    title: "Instagram Manager",
    description: "Manage scheduled, draft, and published content",
    href: "/instagram",
    icon: Camera,
    stat: "16 posts",
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
  },
  {
    title: "News Feed",
    description: "Latest sneaker & fashion industry news",
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
    badge: "Coming Soon",
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
    badge: "Coming Soon",
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
    badge: "Coming Soon",
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
];

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

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back. Here&apos;s your content performance overview.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Section Cards */}
      <div>
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

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {[
                {
                  action: "Published",
                  item: "NFC Smart Cards promo reel",
                  time: "2 hours ago",
                  platform: "Instagram",
                },
                {
                  action: "Scheduled",
                  item: "Jordan 1 Chicago Drop Reel",
                  time: "4 hours ago",
                  platform: "Instagram",
                },
                {
                  action: "Drafted",
                  item: "Summer Lookbook Launch carousel",
                  time: "6 hours ago",
                  platform: "Instagram",
                },
                {
                  action: "Tracked",
                  item: "@hypebeast added to competitors",
                  time: "1 day ago",
                  platform: "System",
                },
                {
                  action: "Published",
                  item: "Sneaker Cleaning Tips tutorial",
                  time: "2 days ago",
                  platform: "YouTube",
                },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        activity.action === "Published"
                          ? "bg-green-400"
                          : activity.action === "Scheduled"
                          ? "bg-blue-400"
                          : activity.action === "Drafted"
                          ? "bg-yellow-400"
                          : "bg-muted-foreground"
                      }`}
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

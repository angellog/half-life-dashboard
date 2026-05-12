"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, TrendingDown, Minus, CalendarDays, Download, Camera, Video, Music2 } from "lucide-react";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { LineChartCard } from "@/components/charts/LineChartCard";
import { getAnalyticsData } from "@/lib/data/analytics";
import { formatNumber, formatDate } from "@/lib/utils";
import { useState } from "react";

export default function AnalyticsPage() {
  const [platform, setPlatform] = useState("all");
  const data = getAnalyticsData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your content performance and audience growth metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={platform} onValueChange={(val) => setPlatform(val || "all")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">
                <div className="flex items-center gap-2">
                  <Camera className="h-3.5 w-3.5 text-pink-400" />
                  Instagram
                </div>
              </SelectItem>
              <SelectItem value="tiktok">
                <div className="flex items-center gap-2">
                  <Music2 className="h-3.5 w-3.5 text-cyan-400" />
                  TikTok
                </div>
              </SelectItem>
              <SelectItem value="youtube">
                <div className="flex items-center gap-2">
                  <Video className="h-3.5 w-3.5 text-red-500" />
                  YouTube
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="30">
            <SelectTrigger className="w-[140px]">
              <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="60">Last 60 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            size="icon" 
            title="Export Report"
            onClick={() => alert("Generating PDF report...")}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.kpis.map((kpi) => {
          const TrendIcon =
            kpi.trend === "up"
              ? TrendingUp
              : kpi.trend === "down"
              ? TrendingDown
              : Minus;
          const trendColor =
            kpi.trend === "up"
              ? "text-green-400"
              : kpi.trend === "down"
              ? "text-red-400"
              : "text-muted-foreground";

          return (
            <Card key={kpi.label}>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {kpi.label}
                </p>
                <div className="flex items-end justify-between mt-2">
                  <p className="text-2xl font-bold">
                    {typeof kpi.value === "number"
                      ? formatNumber(kpi.value)
                      : kpi.value}
                  </p>
                  <div className={`flex items-center gap-1 ${trendColor}`}>
                    <TrendIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {kpi.change > 0 ? "+" : ""}
                      {kpi.change}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartCard
          title="Performance by Content Type"
          description="Impressions and engagement across post formats"
          data={data.performanceByType}
        />
        <LineChartCard
          title="Follower Growth"
          description="Total followers over the last 90 days"
          data={data.followerHistory}
        />
      </div>

      {/* Top Performing Posts */}
      <Card>
        <div className="p-6 pb-3">
          <h3 className="text-base font-semibold">Top Performing Posts</h3>
          <p className="text-sm text-muted-foreground">
            Ranked by total engagement (likes + comments + shares + saves)
          </p>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Caption</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Likes</TableHead>
                <TableHead className="text-right">Comments</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Saves</TableHead>
                <TableHead className="text-right">Published</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topPosts.map((post, index) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <p className="text-sm truncate">{post.caption}</p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        post.type === "reel"
                          ? "bg-pink-500/20 text-pink-400 border-0"
                          : post.type === "carousel"
                          ? "bg-blue-500/20 text-blue-400 border-0"
                          : "bg-zinc-500/20 text-zinc-400 border-0"
                      }
                    >
                      {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {post.engagement
                      ? formatNumber(post.engagement.likes)
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {post.engagement
                      ? formatNumber(post.engagement.comments)
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {post.engagement
                      ? formatNumber(post.engagement.shares)
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {post.engagement
                      ? formatNumber(post.engagement.saves)
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {post.publishedDate ? formatDate(post.publishedDate) : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

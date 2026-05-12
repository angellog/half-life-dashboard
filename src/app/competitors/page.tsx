"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  ArrowUpDown,
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Eye,
  BarChart3,
} from "lucide-react";
import { Competitor, PLATFORM_COLORS, PLATFORM_LABELS } from "@/types";
import { getCompetitors } from "@/lib/data/competitors";
import { formatNumber } from "@/lib/utils";
import { SparklineChart } from "@/components/charts/SparklineChart";

function AddCompetitorDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Competitor
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add Competitor</DialogTitle>
          <DialogDescription>
            Track a competitor&apos;s social media performance.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="handle">Handle</Label>
            <Input id="handle" placeholder="@username" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Display Name</Label>
            <Input id="name" placeholder="Brand Name" />
          </div>
          <div className="grid gap-2">
            <Label>Platform</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="twitter">X / Twitter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CompetitorDetailCard({ competitor }: { competitor: Competitor }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
              style={{
                backgroundColor: PLATFORM_COLORS[competitor.platform] + "25",
                color: PLATFORM_COLORS[competitor.platform],
              }}
            >
              {competitor.displayName.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-sm">{competitor.displayName}</CardTitle>
              <p className="text-xs text-muted-foreground">{competitor.handle}</p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="border-0 text-[10px]"
            style={{
              backgroundColor: PLATFORM_COLORS[competitor.platform] + "25",
              color: PLATFORM_COLORS[competitor.platform],
            }}
          >
            {PLATFORM_LABELS[competitor.platform]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-accent rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Followers</p>
            <p className="text-lg font-bold">{formatNumber(competitor.followers)}</p>
          </div>
          <div className="bg-accent rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Growth Rate</p>
            <p className="text-lg font-bold text-green-400">+{competitor.growthRate}%</p>
          </div>
          <div className="bg-accent rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Avg Likes</p>
            <p className="text-lg font-bold">{formatNumber(competitor.avgLikes)}</p>
          </div>
          <div className="bg-accent rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Avg Comments</p>
            <p className="text-lg font-bold">{formatNumber(competitor.avgComments)}</p>
          </div>
        </div>

        {/* Top Posts */}
        <div>
          <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">
            Top Posts
          </h4>
          <div className="space-y-2">
            {competitor.topPosts.slice(0, 3).map((post, i) => (
              <div key={i} className="bg-accent rounded-lg p-2.5">
                <p className="text-xs line-clamp-2">{post.caption}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" /> {formatNumber(post.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" /> {formatNumber(post.comments)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Promoted Post Analysis */}
        {competitor.promotedPostAnalysis && (
          <div>
            <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">
              Promoted Post Analysis
            </h4>
            <div className="bg-accent rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Est. Reach</span>
                <span className="font-medium">
                  {formatNumber(competitor.promotedPostAnalysis.estimatedReach)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Ad Engagement</span>
                <span className="font-medium">
                  {competitor.promotedPostAnalysis.engagementOnAds}%
                </span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Audience: </span>
                <span>{competitor.promotedPostAnalysis.audienceDemographics}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function CompetitorsPage() {
  const competitors = getCompetitors();
  const [sortBy, setSortBy] = useState<"followers" | "avgLikes" | "growthRate">(
    "followers"
  );
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);

  const sortedCompetitors = [...competitors].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competitor Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Monitor competitor accounts, engagement, and growth trends.
          </p>
        </div>
        <AddCompetitorDialog />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tracked</p>
                <p className="text-xl font-bold">{competitors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Eye className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Largest</p>
                <p className="text-xl font-bold">
                  {formatNumber(Math.max(...competitors.map((c) => c.followers)))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fastest Growing</p>
                <p className="text-xl font-bold">
                  +{Math.max(...competitors.map((c) => c.growthRate))}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Engagement</p>
                <p className="text-xl font-bold">
                  {formatNumber(
                    Math.round(
                      competitors.reduce((sum, c) => sum + c.avgLikes, 0) /
                        competitors.length
                    )
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
        </TabsList>

        {/* Table View */}
        <TabsContent value="table">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead
                      className="text-right cursor-pointer select-none"
                      onClick={() => setSortBy("followers")}
                    >
                      <span className="inline-flex items-center gap-1">
                        Followers
                        {sortBy === "followers" && (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </span>
                    </TableHead>
                    <TableHead
                      className="text-right cursor-pointer select-none"
                      onClick={() => setSortBy("avgLikes")}
                    >
                      <span className="inline-flex items-center gap-1">
                        Avg Likes
                        {sortBy === "avgLikes" && (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </span>
                    </TableHead>
                    <TableHead className="text-right">Avg Comments</TableHead>
                    <TableHead className="text-center">Frequency</TableHead>
                    <TableHead
                      className="text-right cursor-pointer select-none"
                      onClick={() => setSortBy("growthRate")}
                    >
                      <span className="inline-flex items-center gap-1">
                        Growth
                        {sortBy === "growthRate" && (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </span>
                    </TableHead>
                    <TableHead className="text-center">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCompetitors.map((comp) => (
                    <TableRow
                      key={comp.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedCompetitor(comp)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0"
                            style={{
                              backgroundColor:
                                PLATFORM_COLORS[comp.platform] + "25",
                              color: PLATFORM_COLORS[comp.platform],
                            }}
                          >
                            {comp.displayName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {comp.displayName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {comp.handle}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="border-0 text-[10px]"
                          style={{
                            backgroundColor:
                              PLATFORM_COLORS[comp.platform] + "25",
                            color: PLATFORM_COLORS[comp.platform],
                          }}
                        >
                          {PLATFORM_LABELS[comp.platform]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatNumber(comp.followers)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(comp.avgLikes)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(comp.avgComments)}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {comp.postingFrequency}
                      </TableCell>
                      <TableCell className="text-right text-green-400 font-medium">
                        +{comp.growthRate}%
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <SparklineChart data={comp.growthHistory} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Card View */}
        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedCompetitors.map((comp) => (
              <CompetitorDetailCard key={comp.id} competitor={comp} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Competitor Detail Dialog */}
      <Dialog
        open={!!selectedCompetitor}
        onOpenChange={() => setSelectedCompetitor(null)}
      >
        <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
          <ScrollArea className="max-h-[80vh]">
            {selectedCompetitor && (
              <CompetitorDetailCard competitor={selectedCompetitor} />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

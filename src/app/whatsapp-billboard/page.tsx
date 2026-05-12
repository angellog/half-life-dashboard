"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageCircle,
  Plus,
  Eye,
  Users,
  TrendingUp,
  Megaphone,
  Upload,
  Clock,
  Image,
  Video,
  Play,
  Pause,
  CheckCircle2,
  FileEdit,
  BarChart3,
} from "lucide-react";
import {
  getCampaigns,
  getBillboardSlots,
  whatsappStats,
} from "@/lib/data/whatsapp";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, { color: string; icon: React.ElementType }> = {
  active: { color: "bg-green-500/20 text-green-400", icon: Play },
  paused: { color: "bg-yellow-500/20 text-yellow-400", icon: Pause },
  completed: { color: "bg-blue-500/20 text-blue-400", icon: CheckCircle2 },
  draft: { color: "bg-zinc-500/20 text-zinc-400", icon: FileEdit },
};

function CreateCampaignDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Campaign</DialogTitle>
          <DialogDescription>
            Set up a new WhatsApp Status billboard campaign.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="campaign-name">Campaign Name</Label>
            <Input id="campaign-name" placeholder="e.g. Summer Sale Promo" />
          </div>
          <div className="grid gap-2">
            <Label>Creative Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video (up to 30s)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Upload Creative</Label>
            <div className="flex h-28 items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary/30 cursor-pointer transition-colors">
              <div className="text-center">
                <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                  Drop your image or video here
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  JPG, PNG, MP4 — Max 10MB
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Time Slot</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning Rush (6-9 AM)</SelectItem>
                <SelectItem value="midday">Midday Peak (11 AM-2 PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon Drive (3-6 PM)</SelectItem>
                <SelectItem value="evening">Evening Prime (7-10 PM)</SelectItem>
                <SelectItem value="night">Late Night (10 PM-1 AM)</SelectItem>
                <SelectItem value="fullday">Full Day Bundle</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Posting Frequency</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Posts per day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1x daily</SelectItem>
                <SelectItem value="2">2x daily</SelectItem>
                <SelectItem value="3">3x daily</SelectItem>
                <SelectItem value="4">4x daily</SelectItem>
                <SelectItem value="6">6x daily</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Create Campaign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function WhatsAppBillboardPage() {
  const campaigns = getCampaigns();
  const slots = getBillboardSlots();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            WhatsApp Status Billboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Advertise through WhatsApp Status — reach thousands daily.
          </p>
        </div>
        <CreateCampaignDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Active Campaigns",
            value: whatsappStats.activeCampaigns,
            icon: Megaphone,
            color: "text-green-400",
          },
          {
            label: "Total Views",
            value: formatNumber(whatsappStats.totalViews),
            icon: Eye,
            color: "text-blue-400",
          },
          {
            label: "Total Reach",
            value: formatNumber(whatsappStats.totalReach),
            icon: Users,
            color: "text-purple-400",
          },
          {
            label: "Avg Engagement",
            value: `${whatsappStats.avgEngagementRate}%`,
            icon: TrendingUp,
            color: "text-emerald-400",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <Icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="slots">Billboard Slots</TabsTrigger>
          <TabsTrigger value="how">How It Works</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">All Campaigns</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Creative</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">Reach</TableHead>
                    <TableHead className="text-right">Engagement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => {
                    const statusStyle = STATUS_STYLES[campaign.status];
                    const StatusIcon = statusStyle.icon;
                    const isMedia = campaign.creative.endsWith(".mp4");

                    return (
                      <TableRow key={campaign.id}>
                        <TableCell>
                          <p className="text-sm font-medium">{campaign.name}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {isMedia ? (
                              <Video className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Image className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                              {campaign.creative}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[180px]">
                          {campaign.schedule}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={cn(
                              "border-0 text-[10px] capitalize gap-1",
                              statusStyle.color
                            )}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium">
                          {campaign.views > 0
                            ? formatNumber(campaign.views)
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {campaign.reach > 0
                            ? formatNumber(campaign.reach)
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {campaign.engagement > 0 ? (
                            <span className="text-green-400">
                              {formatNumber(campaign.engagement)}
                            </span>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billboard Slots Tab */}
        <TabsContent value="slots" className="space-y-6">
          <div>
            <h3 className="font-semibold mb-1">Billboard Slots Marketplace</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Book time slots for your Status ads. Premium hours = higher
              reach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((slot) => (
              <Card
                key={slot.id}
                className={cn(
                  "transition-colors",
                  slot.available
                    ? "hover:border-green-500/30"
                    : "opacity-60"
                )}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">{slot.name}</h4>
                    {slot.available ? (
                      <Badge className="bg-green-500/20 text-green-400 border-0 text-[10px]">
                        Available
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/20 text-red-400 border-0 text-[10px]">
                        Booked
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 shrink-0" />
                      {slot.timeSlot}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 shrink-0" />
                      {slot.audience}
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-3 w-3 shrink-0" />
                      ~{formatNumber(slot.reach)} daily reach
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="font-bold text-sm">
                      {formatCurrency(slot.pricePerDay)}
                      <span className="text-xs text-muted-foreground font-normal">
                        /day
                      </span>
                    </span>
                    <Button
                      size="sm"
                      variant={slot.available ? "default" : "outline"}
                      disabled={!slot.available}
                      className="text-xs h-7"
                    >
                      {slot.available ? "Book Slot" : "Unavailable"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* How It Works Tab */}
        <TabsContent value="how" className="space-y-6">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle className="text-base">
                How WhatsApp Billboard Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    step: "1",
                    title: "Create Your Campaign",
                    description:
                      "Name your campaign, set your target dates, and choose your posting frequency.",
                    icon: Megaphone,
                  },
                  {
                    step: "2",
                    title: "Upload Your Creative",
                    description:
                      "Upload a high-quality image or short video (up to 30 seconds) for your Status ad.",
                    icon: Upload,
                  },
                  {
                    step: "3",
                    title: "Book a Time Slot",
                    description:
                      "Choose when your ad goes live. Evening Prime slots get the highest engagement.",
                    icon: Clock,
                  },
                  {
                    step: "4",
                    title: "Track Performance",
                    description:
                      "Monitor views, reach, and engagement in real-time from your dashboard.",
                    icon: BarChart3,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-400 font-bold text-sm">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="max-w-3xl">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Why WhatsApp Status?</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    WhatsApp has over 2 billion users globally and Status is viewed
                    by millions daily in East Africa. Unlike Instagram or Facebook
                    ads, Status ads feel personal and native — they appear between
                    friends&apos; updates, driving higher trust and engagement rates.
                    Average engagement on Status ads is 3-5x higher than traditional
                    social media ads.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

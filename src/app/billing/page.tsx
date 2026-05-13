"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Gauge,
  Zap,
  Brain,
  FileText,
  HardDrive,
  TrendingUp,
  Check,
  ArrowRight,
  Receipt,
} from "lucide-react";
import {
  getCurrentUsage,
  getBillingTiers,
  getBillingHistory,
  meterRate,
} from "@/lib/data/billing";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

function LiveMeter() {
  const [meterValue, setMeterValue] = useState(52350);
  const [ticking, setTicking] = useState(true);

  useEffect(() => {
    if (!ticking) return;
    const interval = setInterval(() => {
      setMeterValue((prev) => prev + meterRate);
    }, 800);
    return () => clearInterval(interval);
  }, [ticking]);

  // Format meter value with leading segments like a taxi meter
  const formatted = Math.floor(meterValue).toLocaleString();
  const digits = formatted.split("");

  return (
    <Card className="border-emerald-500/20">
      <CardContent className="p-8 text-center space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 mx-auto">
          <Gauge className="h-8 w-8 text-emerald-400" />
        </div>

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
            Current Billing Period
          </p>

          {/* Taxi meter display */}
          <div className="inline-flex items-center gap-0.5 bg-card border border-border rounded-xl p-3 px-5">
            <span className="text-sm text-muted-foreground font-mono mr-1">
              UGX
            </span>
            {digits.map((digit, i) => (
              <div
                key={i}
                className={cn(
                  "flex h-12 w-8 items-center justify-center rounded-md text-2xl font-bold font-mono transition-all duration-150",
                  digit === ","
                    ? "w-3 bg-transparent text-muted-foreground"
                    : "bg-accent"
                )}
              >
                {digit}
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-center gap-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                ticking ? "bg-emerald-400 animate-pulse" : "bg-muted-foreground"
              )}
            />
            <p className="text-sm text-muted-foreground">
              {ticking ? "Meter running" : "Meter paused"} — Standard Plan
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Rate: {formatCurrency(meterRate)}/tick — resets monthly
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setTicking(!ticking)}
          className="text-xs"
        >
          {ticking ? "Pause Demo" : "Resume Demo"}
        </Button>
      </CardContent>
    </Card>
  );
}

function UsageBreakdown() {
  const usage = getCurrentUsage();
  const USAGE_ICONS: Record<string, React.ElementType> = {
    "API Calls": Zap,
    "AI Queries": Brain,
    "Posts Managed": FileText,
    "Storage Used": HardDrive,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {usage.map((metric) => {
        const Icon = USAGE_ICONS[metric.category] || Gauge;
        const percentage = Math.round((metric.used / metric.limit) * 100);
        const isHigh = percentage > 80;

        return (
          <Card key={metric.category}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{metric.category}</span>
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    isHigh ? "text-red-400" : "text-muted-foreground"
                  )}
                >
                  {percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full bg-accent overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    isHigh ? "bg-red-500" : percentage > 50 ? "bg-amber-500" : "bg-emerald-500"
                  )}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold">
                  {metric.used.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">
                  / {metric.limit.toLocaleString()} {metric.unit}
                </span>
              </div>

              {metric.costPerUnit > 0 && (
                <p className="text-[10px] text-muted-foreground">
                  Overage: {formatCurrency(metric.costPerUnit)}/{metric.unit}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function BillingPage() {
  const tiers = getBillingTiers();
  const history = getBillingHistory();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live Meter Billing</h1>
        <p className="text-muted-foreground mt-1">
          Usage-based billing — pay for what you use, like a taxi meter.
        </p>
      </div>

      <Tabs defaultValue="meter">
        <TabsList>
          <TabsTrigger value="meter">Live Meter</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
        </TabsList>

        {/* Live Meter Tab */}
        <TabsContent value="meter" className="space-y-6">
          <div className="max-w-2xl">
            <LiveMeter />
          </div>

          <div>
            <h3 className="font-semibold mb-3">Usage Breakdown</h3>
            <UsageBreakdown />
          </div>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={cn(
                  "relative",
                  tier.isPopular && "border-primary/50"
                )}
              >
                {tier.isPopular && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-6 space-y-5">
                  <div>
                    <h3 className="text-lg font-bold">{tier.name}</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-bold">
                        {formatCurrency(tier.monthlyPrice)}
                      </span>
                      {tier.monthlyPrice > 0 && (
                        <span className="text-sm text-muted-foreground">
                          /month
                        </span>
                      )}
                    </div>
                  </div>
                  <ul className="space-y-2.5 text-sm">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full gap-2"
                    variant={
                      tier.name === "Standard"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => {
                      if (tier.name !== "Standard") {
                        alert(`Upgrading to \${tier.name} plan... Redirecting to payment gateway.`);
                      }
                    }}
                  >
                    {tier.name === "Standard" ? (
                      <>
                        Current Plan
                        <Check className="h-4 w-4" />
                      </>
                    ) : tier.name === "Free" ? (
                      "Downgrade"
                    ) : (
                      <>
                        Upgrade to Pro
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Meter explanation */}
          <Card className="max-w-5xl">
            <CardHeader>
              <CardTitle className="text-base">
                How the Live Meter Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  {
                    title: "Base Rate",
                    desc: "Your plan's monthly fee covers included usage. Like a taxi's flag drop fee.",
                    icon: Receipt,
                  },
                  {
                    title: "Usage Tracking",
                    desc: "The meter tracks API calls, AI queries, and storage in real-time. Stay within limits — no surprises.",
                    icon: Gauge,
                  },
                  {
                    title: "Overage Billing",
                    desc: "Exceed your plan limits? Pay small per-unit overages instead of upgrading. Fair and transparent.",
                    icon: TrendingUp,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-3">
                      <Icon className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Billing History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead className="text-right">Base</TableHead>
                    <TableHead className="text-right">Overage</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs">
                        {item.id}
                      </TableCell>
                      <TableCell className="text-sm">{item.period}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">
                          {item.plan}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatCurrency(item.baseCharge)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {item.overage > 0 ? (
                          <span className="text-amber-400">
                            +{formatCurrency(item.overage)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium text-sm">
                        {formatCurrency(item.total)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={cn(
                            "border-0 text-[10px] capitalize",
                            item.status === "paid"
                              ? "bg-green-500/20 text-green-400"
                              : item.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          )}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

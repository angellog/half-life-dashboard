import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gauge, Zap, TrendingUp, Clock } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold tracking-tight">Live Meter Billing</h1>
          <Badge variant="secondary">Coming Soon</Badge>
        </div>
        <p className="text-muted-foreground mt-1">
          Usage-based billing — pay for what you use, like a taxi meter.
        </p>
      </div>

      {/* Meter Preview */}
      <Card className="max-w-2xl">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent mx-auto">
            <Gauge className="h-10 w-10 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
              Current Usage
            </p>
            <p className="text-5xl font-bold font-mono tracking-wider">
              UGX 0
            </p>
            <p className="text-sm text-muted-foreground mt-2">Free Plan — No charges</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            {[
              { label: "API Calls", value: "0 / 100", icon: Zap },
              { label: "AI Queries", value: "0 / 10", icon: TrendingUp },
              { label: "Posts Managed", value: "16 / 50", icon: Clock },
              { label: "Storage", value: "0 MB / 500 MB", icon: Gauge },
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="bg-accent rounded-lg p-3">
                  <Icon className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className="text-sm font-medium mt-0.5">{metric.value}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Tiers */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Subscription Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
          {[
            {
              name: "Free",
              price: "UGX 0",
              features: [
                "50 managed posts",
                "100 API calls/month",
                "10 AI queries/month",
                "500 MB storage",
                "Basic analytics",
              ],
              current: true,
            },
            {
              name: "Standard",
              price: "UGX 50,000/mo",
              features: [
                "500 managed posts",
                "5,000 API calls/month",
                "100 AI queries/month",
                "5 GB storage",
                "Full analytics",
                "Competitor tracking",
              ],
              popular: true,
            },
            {
              name: "Pro",
              price: "UGX 150,000/mo",
              features: [
                "Unlimited posts",
                "Unlimited API calls",
                "Unlimited AI queries",
                "50 GB storage",
                "Full analytics",
                "AI Agent (OpenClaw)",
                "WhatsApp Billboard",
                "Priority support",
              ],
            },
          ].map((tier) => (
            <Card
              key={tier.name}
              className={tier.popular ? "border-primary/50 relative" : ""}
            >
              {tier.popular && (
                <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Popular
                </Badge>
              )}
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold">{tier.name}</h3>
                  <p className="text-2xl font-bold mt-1">{tier.price}</p>
                </div>
                <ul className="space-y-2 text-sm">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={tier.current ? "outline" : "default"}
                  disabled
                >
                  {tier.current ? "Current Plan" : "Coming Soon"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

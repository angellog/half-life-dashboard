import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Upload, Clock, BarChart3, Megaphone } from "lucide-react";

export default function WhatsAppBillboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold tracking-tight">
            WhatsApp Status Billboard
          </h1>
          <Badge variant="secondary">Coming Soon</Badge>
        </div>
        <p className="text-muted-foreground mt-1">
          Advertise through WhatsApp Status — reach thousands of viewers
          daily.
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
        {[
          {
            step: "1",
            title: "Create Campaign",
            description:
              "Set up your ad campaign with target audience and budget",
            icon: Megaphone,
          },
          {
            step: "2",
            title: "Upload Creative",
            description:
              "Upload your image or video creative for WhatsApp Status",
            icon: Upload,
          },
          {
            step: "3",
            title: "Schedule",
            description:
              "Set posting times, frequency, and campaign duration",
            icon: Clock,
          },
          {
            step: "4",
            title: "Track Results",
            description:
              "Monitor views, reach, and engagement in real-time",
            icon: BarChart3,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.step}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-sm font-bold">
                    {item.step}
                  </div>
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Coming Soon CTA */}
      <Card className="max-w-2xl">
        <CardContent className="p-8 text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mx-auto">
            <MessageCircle className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-xl font-bold">
            WhatsApp Billboard is coming soon
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Reach thousands of potential customers through WhatsApp Status
            advertising. Create campaigns, upload creatives, and track your
            results — all from one dashboard.
          </p>
          <Button disabled className="mt-2">
            Get Notified When It Launches
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

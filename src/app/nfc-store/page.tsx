import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Sparkles, Shield, Smartphone } from "lucide-react";

export default function NFCStorePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold tracking-tight">NFC Card Store</h1>
          <Badge variant="secondary">Coming Soon</Badge>
        </div>
        <p className="text-muted-foreground mt-1">
          Smart NFC business cards — tap your phone, get the brand.
        </p>
      </div>

      {/* Product Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        {/* Standard Card */}
        <Card className="relative overflow-hidden border-primary/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="p-6 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Standard Smart Card</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Premium NFC-enabled business card with 2 custom branded profiles. Tap to share your digital presence instantly.
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">UGX 100,000</span>
              <span className="text-sm text-muted-foreground">one-time</span>
            </div>
            <ul className="space-y-2 text-sm">
              {[
                "2 custom branded profiles",
                "NFC tap-to-share technology",
                "Premium card design",
                "QR code backup",
                "Unlimited taps",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        {/* Metallic Upgrade */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="p-6 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
              <Shield className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <Badge className="bg-amber-500/20 text-amber-400 border-0 mb-2">
                Upgrade
              </Badge>
              <h3 className="text-xl font-bold">Metallic Smart Card</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Premium metal finish upgrade. Stand out with a sleek, durable metallic card that makes a lasting impression.
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">UGX 35,000</span>
              <span className="text-sm text-muted-foreground">upgrade</span>
            </div>
            <ul className="space-y-2 text-sm">
              {[
                "Premium metallic finish",
                "Enhanced durability",
                "Executive look & feel",
                "Same NFC technology",
                "Custom engraving option",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* How it works */}
      <Card className="max-w-3xl">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">How It Works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Design Your Profiles",
                description: "Create 2 branded profiles with your logo, links, and contact info",
                icon: Sparkles,
              },
              {
                step: "2",
                title: "Get Your Card",
                description: "Receive your premium NFC smart card with custom branding",
                icon: CreditCard,
              },
              {
                step: "3",
                title: "Tap & Share",
                description: "Tap any smartphone to instantly share your digital profiles",
                icon: Smartphone,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center space-y-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold mx-auto">
                    {item.step}
                  </div>
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

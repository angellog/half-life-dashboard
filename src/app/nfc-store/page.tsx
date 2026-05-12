"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  CreditCard,
  Sparkles,
  Shield,
  Smartphone,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Check,
  Wifi,
  QrCode,
  Palette,
  Globe,
  User,
  Link2,
  Mail,
  Phone,
  Building2,
} from "lucide-react";
import { nfcProducts, recentOrders, nfcStats } from "@/lib/data/nfc-store";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ORDER_STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  designing: "bg-blue-500/20 text-blue-400",
  printing: "bg-purple-500/20 text-purple-400",
  shipped: "bg-orange-500/20 text-orange-400",
  delivered: "bg-green-500/20 text-green-400",
};

function OrderFormDialog({ trigger }: { trigger?: React.ReactElement }) {
  const [open, setOpen] = useState(false);
  const [addMetallic, setAddMetallic] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    business: "",
    phone: "",
    email: "",
  });

  const handleOrder = () => {
    if (!formData.name || !formData.email) return;
    alert(`Order placed successfully for ${formData.name}! Total: ${addMetallic ? 'UGX 135,000' : 'UGX 100,000'}`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger || (
            <Button className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Order Now
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Order NFC Smart Card</DialogTitle>
          <DialogDescription>
            Fill in your details to order your custom branded NFC card.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="business">Business Name</Label>
              <Input 
                id="business" 
                placeholder="Your Brand" 
                value={formData.business}
                onChange={(e) => setFormData({ ...formData, business: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                placeholder="+256 7XX XXX XXX" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@email.com" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <Separator />
          {/* Product selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-accent rounded-lg p-3">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Standard Smart Card</p>
                  <p className="text-xs text-muted-foreground">
                    2 profiles, NFC + QR code
                  </p>
                </div>
              </div>
              <span className="font-semibold">UGX 100,000</span>
            </div>
            <button
              className={cn(
                "flex w-full items-center justify-between rounded-lg p-3 border transition-colors text-left",
                addMetallic
                  ? "border-amber-500/50 bg-amber-500/5"
                  : "border-border hover:border-amber-500/30"
              )}
              onClick={() => setAddMetallic(!addMetallic)}
            >
              <div className="flex items-center gap-3">
                <Shield
                  className={cn(
                    "h-5 w-5",
                    addMetallic ? "text-amber-400" : "text-muted-foreground"
                  )}
                />
                <div>
                  <p className="text-sm font-medium">
                    Add Metallic Upgrade
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Premium metal finish, laser engraving
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">+ UGX 35,000</span>
                {addMetallic && (
                  <Check className="h-4 w-4 text-amber-400" />
                )}
              </div>
            </button>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatCurrency(addMetallic ? 135000 : 100000)}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleOrder} disabled={!formData.name || !formData.email}>Place Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProfilePreview({ profileNum }: { profileNum: number }) {
  return (
    <Card className="overflow-hidden">
      <div className="h-20 bg-gradient-to-r from-primary/20 to-violet-500/20" />
      <CardContent className="p-4 -mt-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-card border-4 border-card text-lg font-bold">
          {profileNum === 1 ? "HL" : "P2"}
        </div>
        <div className="mt-2">
          <p className="font-semibold text-sm">
            {profileNum === 1 ? "Half Life Brand" : "Personal Profile"}
          </p>
          <p className="text-xs text-muted-foreground">
            {profileNum === 1
              ? "Sneakers & Fashion"
              : "Your personal brand page"}
          </p>
        </div>
        <div className="mt-3 space-y-1.5">
          {[
            {
              icon: Globe,
              text: profileNum === 1 ? "halflife.ug" : "yourname.com",
            },
            {
              icon: Mail,
              text:
                profileNum === 1
                  ? "hello@halflife.ug"
                  : "you@email.com",
            },
            {
              icon: Phone,
              text: "+256 7XX XXX XXX",
            },
            {
              icon: Link2,
              text:
                profileNum === 1
                  ? "instagram.com/halflife"
                  : "linkedin.com/in/you",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.text}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <Icon className="h-3 w-3 shrink-0" />
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function NFCStorePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">NFC Card Store</h1>
          <p className="text-muted-foreground mt-1">
            Smart NFC business cards — tap your phone, get the brand.
          </p>
        </div>
        <OrderFormDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Orders",
            value: nfcStats.totalOrders,
            icon: ShoppingCart,
          },
          {
            label: "Revenue",
            value: formatCurrency(nfcStats.totalRevenue),
            icon: TrendingUp,
          },
          {
            label: "Cards Delivered",
            value: nfcStats.cardsDelivered,
            icon: Package,
          },
          {
            label: "Metallic Upgrade %",
            value: `${nfcStats.metallicUpgradeRate}%`,
            icon: Shield,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <Icon className="h-5 w-5 text-muted-foreground" />
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

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="profiles">2-Profile Preview</TabsTrigger>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {/* Standard Card */}
            <Card className="relative overflow-hidden border-primary/20">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardContent className="p-6 space-y-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <CreditCard className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {nfcProducts[0].name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {nfcProducts[0].description}
                  </p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {formatCurrency(nfcProducts[0].price)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    one-time payment
                  </span>
                </div>
                <ul className="space-y-2.5 text-sm">
                  {nfcProducts[0].features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <OrderFormDialog />
              </CardContent>
            </Card>

            {/* Metallic Upgrade */}
            <Card className="relative overflow-hidden border-amber-500/20">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500/10">
                    <Shield className="h-7 w-7 text-amber-400" />
                  </div>
                  <Badge className="bg-amber-500/20 text-amber-400 border-0">
                    Upgrade Add-on
                  </Badge>
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {nfcProducts[1].name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {nfcProducts[1].description}
                  </p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-amber-400">
                    + {formatCurrency(nfcProducts[1].price)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    upgrade
                  </span>
                </div>
                <ul className="space-y-2.5 text-sm">
                  {nfcProducts[1].features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                      <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <OrderFormDialog 
                  trigger={
                    <Button
                      variant="outline"
                      className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                    >
                      Add to Order
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          </div>

          {/* How it works */}
          <Card className="max-w-4xl">
            <CardHeader>
              <CardTitle className="text-base">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                {[
                  {
                    step: "1",
                    title: "Place Your Order",
                    description:
                      "Fill in your details and choose your card type",
                    icon: ShoppingCart,
                  },
                  {
                    step: "2",
                    title: "Design Your Profiles",
                    description:
                      "We create 2 branded profiles with your logo and links",
                    icon: Palette,
                  },
                  {
                    step: "3",
                    title: "Card Production",
                    description:
                      "Your card is printed with NFC chip and QR code",
                    icon: CreditCard,
                  },
                  {
                    step: "4",
                    title: "Tap & Share",
                    description:
                      "Tap any phone to instantly share your brand",
                    icon: Smartphone,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.step} className="text-center space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold mx-auto">
                        {item.step}
                      </div>
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Tech specs */}
          <Card className="max-w-4xl">
            <CardHeader>
              <CardTitle className="text-base">Card Technology</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: Wifi,
                    title: "NFC Chip",
                    desc: "NTAG216 — works with all modern smartphones. No app needed.",
                  },
                  {
                    icon: QrCode,
                    title: "QR Code Backup",
                    desc: "Fallback QR code on reverse for older devices.",
                  },
                  {
                    icon: User,
                    title: "2 Profiles",
                    desc: "Switch between business and personal profiles instantly.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-3 bg-accent rounded-lg p-4">
                      <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
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

        {/* 2-Profile Preview Tab */}
        <TabsContent value="profiles" className="space-y-6">
          <div>
            <h3 className="font-semibold mb-1">
              2 Profiles, 1 Card
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Every NFC Smart Card comes with 2 fully customizable profiles.
              Switch between your brand and personal identity with a single tap.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div>
              <Badge className="mb-3 bg-primary/20 text-primary border-0">
                Profile 1 — Brand
              </Badge>
              <ProfilePreview profileNum={1} />
            </div>
            <div>
              <Badge className="mb-3 bg-violet-500/20 text-violet-400 border-0">
                Profile 2 — Personal
              </Badge>
              <ProfilePreview profileNum={2} />
            </div>
          </div>
          <Card className="max-w-2xl">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">
                    The Half Life Moat
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Create 2 profiles with top-notch branding. The standard card
                    sells at UGX 100,000. The metallic upgrade is only UGX
                    35,000. Every card buyer becomes a potential subscriber for
                    your dashboard and ad services.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Metallic</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        {order.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">
                            {order.customerName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {order.businessName}
                      </TableCell>
                      <TableCell className="text-sm">
                        Standard
                      </TableCell>
                      <TableCell className="text-center">
                        {order.addMetallic ? (
                          <Badge className="bg-amber-500/20 text-amber-400 border-0 text-[10px]">
                            Yes
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium text-sm">
                        {formatCurrency(order.total)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={cn(
                            "border-0 text-[10px] capitalize",
                            ORDER_STATUS_STYLES[order.status]
                          )}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {formatDate(order.orderDate)}
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

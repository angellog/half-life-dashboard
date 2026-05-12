"use client";

// ============================================================
// Settings Page — 7 tabbed sections controlling the dashboard
// ============================================================

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  User,
  Settings,
  Users,
  Link2,
  CreditCard,
  Bot,
  Shield,
  Camera,
  Save,
  Trash2,
  Plus,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  Crown,
  ArrowRight,
  Monitor,
  Smartphone,
  Globe,
  Wifi,
  WifiOff,
  Zap,
  Loader2,
  RotateCcw,
  Brain,
  Mail,
  LogOut,
  LogIn,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { getPreferences, savePreferences, resetPreferences } from "@/lib/settings-store";
import {
  getSettings as getOpenClawSettings,
  saveSettings as saveOpenClawSettings,
  clearSettings as clearOpenClawSettings,
} from "@/lib/openclaw/settings";
import {
  getMockTeamMembers,
  getMockConnectedAccounts,
  getMockSubscription,
  getMockInvoices,
  getMockLoginSessions,
} from "@/lib/data/settings";
import type {
  DashboardPreferences,
  SettingsSection,
  TeamMember,
  ConnectedAccount,
  SubscriptionInfo,
  Invoice,
  LoginSession,
} from "@/types/settings";
import {
  SETTINGS_SECTIONS,
  TIMEZONE_OPTIONS,
  PAGE_OPTIONS,
} from "@/types/settings";

// ================================================================
// Sidebar Navigation for Settings
// ================================================================

const SECTION_ICONS: Record<SettingsSection, typeof User> = {
  profile: User,
  preferences: Settings,
  team: Users,
  connections: Link2,
  billing: CreditCard,
  ai: Bot,
  security: Shield,
};

function SettingsNav({
  active,
  onChange,
}: {
  active: SettingsSection;
  onChange: (s: SettingsSection) => void;
}) {
  return (
    <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
      {SETTINGS_SECTIONS.map((section) => {
        const Icon = SECTION_ICONS[section.value];
        const isActive = active === section.value;
        return (
          <button
            key={section.value}
            onClick={() => onChange(section.value)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="hidden md:inline">{section.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ================================================================
// Section: Profile & Account
// ================================================================

function ProfileSection() {
  const { data: session } = useSession();
  const user = session?.user;
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent mx-auto">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Sign in to manage your profile</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Connect with Google, GitHub, or Instagram to personalize your dashboard.
            </p>
          </div>
          <Button onClick={() => signIn()} className="gap-2">
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Avatar & Name */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar size="lg" className="h-20 w-20">
                {user.image && (
                  <AvatarImage src={user.image} alt={user.name || ""} />
                )}
                <AvatarFallback className="text-lg">
                  {user.name?.slice(0, 2).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <p className="font-semibold text-lg">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge className="mt-1.5 bg-muted text-muted-foreground border-0 text-[10px]">
                Free Plan
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} className="gap-2" size="sm">
              {saved ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/20">
        <CardHeader>
          <CardTitle className="text-base text-red-400">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Sign Out</p>
              <p className="text-xs text-muted-foreground">
                Sign out of your account on this device.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="gap-1.5 text-red-400 border-red-500/30 hover:bg-red-500/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-red-400 border-red-500/30 hover:bg-red-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ================================================================
// Section: Dashboard Preferences
// ================================================================

function PreferencesSection() {
  const [prefs, setPrefs] = useState<DashboardPreferences | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPrefs(getPreferences());
  }, []);

  function updatePref<K extends keyof DashboardPreferences>(
    key: K,
    value: DashboardPreferences[K]
  ) {
    if (!prefs) return;
    const updated = savePreferences({ [key]: value });
    setPrefs(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function handleReset() {
    const defaults = resetPreferences();
    setPrefs(defaults);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  if (!prefs) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Dashboard Preferences</CardTitle>
          {saved && (
            <span className="text-xs text-green-400 flex items-center gap-1">
              <Check className="h-3 w-3" /> Saved
            </span>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Default page */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Default Page</p>
              <p className="text-xs text-muted-foreground">
                Page shown when you open the dashboard
              </p>
            </div>
            <select
              value={prefs.defaultPage}
              onChange={(e) => updatePref("defaultPage", e.target.value)}
              className="bg-input/30 border border-input rounded-lg px-3 py-1.5 text-sm outline-none focus:border-ring"
            >
              {PAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <Separator />

          {/* Timezone */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Timezone</p>
              <p className="text-xs text-muted-foreground">
                Used for content scheduling and analytics
              </p>
            </div>
            <select
              value={prefs.timezone}
              onChange={(e) => updatePref("timezone", e.target.value)}
              className="bg-input/30 border border-input rounded-lg px-3 py-1.5 text-sm outline-none focus:border-ring max-w-[240px]"
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          <Separator />

          {/* Currency */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Currency</p>
              <p className="text-xs text-muted-foreground">
                Display format for monetary values
              </p>
            </div>
            <select
              value={prefs.currency}
              onChange={(e) => updatePref("currency", e.target.value)}
              className="bg-input/30 border border-input rounded-lg px-3 py-1.5 text-sm outline-none focus:border-ring"
            >
              <option value="UGX">UGX — Uganda Shillings</option>
              <option value="USD">USD — US Dollars</option>
              <option value="KES">KES — Kenyan Shillings</option>
              <option value="EUR">EUR — Euros</option>
            </select>
          </div>

          <Separator />

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Push Notifications</p>
              <p className="text-xs text-muted-foreground">
                Browser notifications for important events
              </p>
            </div>
            <Switch
              checked={prefs.notificationsEnabled}
              onCheckedChange={(checked) =>
                updatePref("notificationsEnabled", checked)
              }
            />
          </div>

          <Separator />

          {/* Email digest */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email Digest</p>
              <p className="text-xs text-muted-foreground">
                Summary of analytics and activity
              </p>
            </div>
            <select
              value={prefs.emailDigest}
              onChange={(e) =>
                updatePref(
                  "emailDigest",
                  e.target.value as "daily" | "weekly" | "never"
                )
              }
              className="bg-input/30 border border-input rounded-lg px-3 py-1.5 text-sm outline-none focus:border-ring"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="never">Never</option>
            </select>
          </div>

          <Separator />

          {/* Compact mode */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Compact Mode</p>
              <p className="text-xs text-muted-foreground">
                Reduce spacing and card sizes
              </p>
            </div>
            <Switch
              checked={prefs.compactMode}
              onCheckedChange={(checked) =>
                updatePref("compactMode", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="gap-1.5 text-xs"
        >
          <RotateCcw className="h-3 w-3" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}

// ================================================================
// Section: Team & Access Control
// ================================================================

function TeamSection() {
  const [members] = useState<TeamMember[]>(getMockTeamMembers);
  const [inviteEmail, setInviteEmail] = useState("");

  const roleColors: Record<string, string> = {
    owner: "bg-violet-500/20 text-violet-400",
    admin: "bg-blue-500/20 text-blue-400",
    editor: "bg-green-500/20 text-green-400",
    viewer: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-6">
      {/* Invite */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invite Team Member</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="team@halflife.ug"
              type="email"
              className="flex-1"
            />
            <Button
              size="sm"
              className="gap-1.5"
              disabled={!inviteEmail.includes("@")}
            >
              <Mail className="h-3.5 w-3.5" />
              Invite
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            Invited members will receive an email with a link to join.
          </p>
        </CardContent>
      </Card>

      {/* Members list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Team Members ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 px-5 py-3"
              >
                <Avatar size="sm">
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">
                      {member.name}
                    </p>
                    {member.status === "invited" && (
                      <Badge className="bg-amber-500/20 text-amber-400 border-0 text-[10px]">
                        Pending
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {member.email}
                  </p>
                </div>
                <Badge
                  className={cn(
                    "border-0 text-[10px] capitalize",
                    roleColors[member.role]
                  )}
                >
                  {member.role}
                </Badge>
                {member.role !== "owner" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-red-400"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Roles explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Roles & Permissions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {[
              {
                role: "Owner",
                desc: "Full access including billing, team management, and account deletion",
              },
              {
                role: "Admin",
                desc: "Manage content, settings, and connections. Cannot manage billing or delete the account",
              },
              {
                role: "Editor",
                desc: "Create and edit content, view analytics. Cannot change settings or manage team",
              },
              {
                role: "Viewer",
                desc: "Read-only access to analytics and content. Cannot create or edit anything",
              },
            ].map((r) => (
              <div key={r.role} className="px-5 py-3">
                <p className="text-sm font-medium">{r.role}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ================================================================
// Section: API Connections
// ================================================================

const PLATFORM_META: Record<
  string,
  { color: string; bg: string; icon: string }
> = {
  instagram: { color: "text-pink-400", bg: "bg-pink-500/10", icon: "IG" },
  tiktok: { color: "text-cyan-400", bg: "bg-cyan-500/10", icon: "TT" },
  youtube: { color: "text-red-400", bg: "bg-red-500/10", icon: "YT" },
  twitter: { color: "text-blue-400", bg: "bg-blue-500/10", icon: "X" },
  facebook: { color: "text-blue-500", bg: "bg-blue-600/10", icon: "FB" },
};

function ConnectionsSection() {
  const [accounts] = useState<ConnectedAccount[]>(getMockConnectedAccounts);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Connected Platforms</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {accounts.map((account) => {
              const meta = PLATFORM_META[account.platform];
              return (
                <div
                  key={account.id}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold",
                      meta.bg,
                      meta.color
                    )}
                  >
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium capitalize">
                        {account.platform === "twitter"
                          ? "X / Twitter"
                          : account.platform}
                      </p>
                      {account.connected ? (
                        <Badge className="bg-green-500/20 text-green-400 border-0 text-[10px]">
                          Connected
                        </Badge>
                      ) : (
                        <Badge className="bg-muted text-muted-foreground border-0 text-[10px]">
                          Not Connected
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {account.connected
                        ? `${account.handle} — ${account.displayName}`
                        : "Click connect to link your account"}
                    </p>
                  </div>
                  {account.connected ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-xs text-muted-foreground"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs text-red-400 border-red-500/30 hover:bg-red-500/10"
                      >
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" className="gap-1.5 text-xs">
                      <Plus className="h-3 w-3" />
                      Connect
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Metricool API</p>
              <p className="text-xs text-muted-foreground">
                Analytics aggregation and scheduling
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Plus className="h-3 w-3" />
              Add Key
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">RSS Feed URLs</p>
              <p className="text-xs text-muted-foreground">
                Custom feeds for the News Consolidator
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Plus className="h-3 w-3" />
              Add Feed
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ================================================================
// Section: Billing & Plan
// ================================================================

function BillingSection() {
  const [subscription] = useState<SubscriptionInfo>(getMockSubscription);
  const [invoices] = useState<Invoice[]>(getMockInvoices);

  const plans = [
    {
      name: "Free",
      price: 0,
      features: [
        "Basic dashboard",
        "10 AI queries/month",
        "Manual scheduling",
      ],
      current: subscription.plan === "free",
    },
    {
      name: "Standard",
      price: 50000,
      features: [
        "Full dashboard access",
        "NFC card ordering",
        "Basic analytics",
        "50 AI queries/month",
      ],
      current: subscription.plan === "standard",
      popular: true,
    },
    {
      name: "Pro",
      price: 150000,
      features: [
        "Everything in Standard",
        "Unlimited AI queries",
        "Autonomous scheduling",
        "Competitor reports",
        "WhatsApp Billboard",
        "Priority support",
      ],
      current: subscription.plan === "pro",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Current plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold capitalize">
                  {subscription.plan} Plan
                </p>
                <Badge className="bg-green-500/20 text-green-400 border-0 text-[10px] capitalize">
                  {subscription.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(subscription.monthlyPrice)}/month
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              plan.current && "border-primary/30",
              plan.popular && !plan.current && "border-violet-500/20"
            )}
          >
            <CardContent className="p-5 space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{plan.name}</h3>
                  {plan.popular && (
                    <Badge className="bg-violet-500/20 text-violet-400 border-0 text-[10px]">
                      Popular
                    </Badge>
                  )}
                  {plan.current && (
                    <Badge className="bg-green-500/20 text-green-400 border-0 text-[10px]">
                      Current
                    </Badge>
                  )}
                </div>
                <p className="text-2xl font-bold mt-1">
                  {plan.price === 0
                    ? "Free"
                    : formatCurrency(plan.price)}
                  {plan.price > 0 && (
                    <span className="text-sm font-normal text-muted-foreground">
                      /mo
                    </span>
                  )}
                </p>
              </div>
              <ul className="space-y-1.5">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="text-xs text-muted-foreground flex items-center gap-1.5"
                  >
                    <Check className="h-3 w-3 text-green-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.current ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  disabled
                >
                  Current Plan
                </Button>
              ) : (
                <Button
                  size="sm"
                  className={cn(
                    "w-full text-xs gap-1.5",
                    plan.popular
                      ? "bg-violet-600 hover:bg-violet-700"
                      : ""
                  )}
                >
                  {plan.price > subscription.monthlyPrice
                    ? "Upgrade"
                    : "Switch"}
                  <ArrowRight className="h-3 w-3" />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          {subscription.paymentMethod ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium capitalize">
                    {subscription.paymentMethod.type.replace("_", " ")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {subscription.paymentMethod.provider} ****
                    {subscription.paymentMethod.last4}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                Change
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                No payment method on file.
              </p>
              <Button size="sm" className="mt-3 gap-1.5 text-xs">
                <Plus className="h-3 w-3" />
                Add Payment Method
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{inv.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(inv.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {formatCurrency(inv.amount)}
                  </span>
                  <Badge
                    className={cn(
                      "border-0 text-[10px] capitalize",
                      inv.status === "paid"
                        ? "bg-green-500/20 text-green-400"
                        : inv.status === "pending"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-red-500/20 text-red-400"
                    )}
                  >
                    {inv.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ================================================================
// Section: AI Config (OpenClaw Gateway)
// ================================================================

function AIConfigSection() {
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [mode, setMode] = useState<"gateway" | "native">("native");
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    const settings = getOpenClawSettings();
    setUrl(settings.gatewayUrl);
    setToken(settings.authToken);
    setMode(settings.mode || "native");
  }, []);

  function handleSave() {
    saveOpenClawSettings({ gatewayUrl: url, authToken: token, mode: mode });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleClear() {
    clearOpenClawSettings();
    setUrl("ws://127.0.0.1:18789");
    setToken("");
    setMode("native");
  }

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    try {
      const ws = new WebSocket(url);
      const result = await new Promise<string>((resolve) => {
        const timeout = setTimeout(() => {
          ws.close();
          resolve("Timeout — Gateway did not respond within 5 seconds");
        }, 5000);
        ws.onopen = () => {
          clearTimeout(timeout);
          ws.close();
          resolve("Gateway is reachable");
        };
        ws.onerror = () => {
          clearTimeout(timeout);
          resolve(
            "Cannot reach Gateway — check the URL and ensure it is running"
          );
        };
      });
      setTestResult(result);
    } catch {
      setTestResult("Connection test failed");
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-violet-400" />
            AI Operation Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <button
                onClick={() => setMode("native")}
                className={cn(
                  "flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all",
                  mode === "native"
                    ? "bg-violet-500/10 border-violet-500 ring-1 ring-violet-500"
                    : "bg-accent/30 border-border hover:border-muted-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                   <div className={cn("p-1.5 rounded-lg", mode === "native" ? "bg-violet-500 text-white" : "bg-muted")}>
                      <Zap className="h-4 w-4" />
                   </div>
                   <span className="font-bold text-sm">Dashboard Native</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Fast, integrated AI strategist. Always online, zero configuration required. Recommended for most users.
                </p>
              </button>

              <button
                onClick={() => setMode("gateway")}
                className={cn(
                  "flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all",
                  mode === "gateway"
                    ? "bg-violet-500/10 border-violet-500 ring-1 ring-violet-500"
                    : "bg-accent/30 border-border hover:border-muted-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                   <div className={cn("p-1.5 rounded-lg", mode === "gateway" ? "bg-violet-500 text-white" : "bg-muted")}>
                      <Wifi className="h-4 w-4" />
                   </div>
                   <span className="font-bold text-sm">OpenClaw Gateway</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                   Connect to your local workstation for full control over tools, memory, and model overrides.
                </p>
              </button>
          </div>
        </CardContent>
      </Card>

      <Card className={cn(mode === "native" && "opacity-60 pointer-events-none")}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bot className="h-4 w-4 text-violet-400" />
            Gateway Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="gateway-url">Gateway URL</Label>
            <Input
              id="gateway-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="ws://127.0.0.1:18789"
              className="font-mono text-xs"
            />
            <p className="text-[10px] text-muted-foreground">
              Default: ws://127.0.0.1:18789 — or wss:// for remote servers
              with TLS
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gateway-token">Auth Token</Label>
            <Input
              id="gateway-token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              type="password"
              placeholder="Gateway auth token"
              className="font-mono text-xs"
            />
            <p className="text-[10px] text-muted-foreground">
              Found in ~/.openclaw/openclaw.json under gateway.auth.token
            </p>
          </div>

          {/* Test result */}
          {testResult && (
            <div
              className={cn(
                "text-xs rounded-lg px-3 py-2",
                testResult.includes("reachable")
                  ? "bg-green-500/10 text-green-400"
                  : "bg-amber-500/10 text-amber-400"
              )}
            >
              {testResult}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTest}
                disabled={testing || !url || mode === "native"}
                className="gap-1.5 text-xs"
              >
                {testing ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Wifi className="h-3 w-3" />
                )}
                Test Connection
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="gap-1.5 text-xs text-muted-foreground"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>
            </div>
            <Button
              size="sm"
              onClick={handleSave}
              className="gap-1.5 text-xs bg-violet-600 hover:bg-violet-700"
            >
              {saved ? (
                <>
                  <Check className="h-3 w-3" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-3 w-3" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Memory info */}
      <Card className={cn(mode === "native" && "opacity-60")}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-4 w-4 text-violet-400" />
            Agent Memory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Session Persistence</p>
              <p className="text-xs text-muted-foreground">
                Single persistent session (half-life-main) accumulates business
                context across conversations
              </p>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-0 text-[10px]">
              Active
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">REM Vector Memory</p>
              <p className="text-xs text-muted-foreground">
                Cross-session recall using embeddings — requires an embedding
                provider configured in openclaw.json
              </p>
            </div>
            <Badge className="bg-muted text-muted-foreground border-0 text-[10px]">
              Not Configured
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Workspace Files</p>
              <p className="text-xs text-muted-foreground">
                SOUL.md and AGENTS.md injected into every system prompt
              </p>
            </div>
            <Badge className="bg-muted text-muted-foreground border-0 text-[10px]">
              Needs Setup
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ================================================================
// Section: Security & Sessions
// ================================================================

function SecuritySection() {
  const { data: session } = useSession();
  const [sessions] = useState<LoginSession[]>(getMockLoginSessions);
  const [twoFactor, setTwoFactor] = useState(false);
  const [loginNotifs, setLoginNotifs] = useState(true);

  const deviceIcons: Record<string, typeof Monitor> = {
    MacBook: Monitor,
    iPhone: Smartphone,
    Windows: Monitor,
    Android: Smartphone,
  };

  function getDeviceIcon(device: string) {
    for (const [key, Icon] of Object.entries(deviceIcons)) {
      if (device.includes(key)) return Icon;
    }
    return Globe;
  }

  return (
    <div className="space-y-6">
      {/* Security toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={twoFactor}
              onCheckedChange={setTwoFactor}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Login Notifications</p>
              <p className="text-xs text-muted-foreground">
                Get notified when a new device logs into your account
              </p>
            </div>
            <Switch
              checked={loginNotifs}
              onCheckedChange={setLoginNotifs}
            />
          </div>
        </CardContent>
      </Card>

      {/* Active sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            Active Sessions ({sessions.length})
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs text-red-400 border-red-500/30 hover:bg-red-500/10"
          >
            Revoke All Others
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {sessions.map((sess) => {
              const DeviceIcon = getDeviceIcon(sess.device);
              return (
                <div
                  key={sess.id}
                  className="flex items-center gap-4 px-5 py-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                    <DeviceIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{sess.device}</p>
                      {sess.current && (
                        <Badge className="bg-green-500/20 text-green-400 border-0 text-[10px]">
                          This Device
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {sess.browser} &middot; {sess.ip}
                      {sess.location && ` &middot; ${sess.location}`}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Last active:{" "}
                      {new Date(sess.lastActive).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {!sess.current && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-red-400 border-red-500/30 hover:bg-red-500/10"
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Login history info */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Login History</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Full login history with timestamps and IP addresses is available
                once your account is connected to a database. Currently using
                session-based auth with no persistent storage.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ================================================================
// Main Settings Page
// ================================================================

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");

  const sectionComponents: Record<SettingsSection, React.ReactNode> = {
    profile: <ProfileSection />,
    preferences: <PreferencesSection />,
    team: <TeamSection />,
    connections: <ConnectionsSection />,
    billing: <BillingSection />,
    ai: <AIConfigSection />,
    security: <SecuritySection />,
  };

  const currentSection = SETTINGS_SECTIONS.find(
    (s) => s.value === activeSection
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account, dashboard preferences, team, and integrations.
        </p>
      </div>

      {/* Layout: sidebar nav + content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Nav */}
        <div className="md:w-48 shrink-0">
          <SettingsNav active={activeSection} onChange={setActiveSection} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Section header */}
          {currentSection && (
            <div className="mb-5">
              <h2 className="text-lg font-semibold">{currentSection.label}</h2>
              <p className="text-sm text-muted-foreground">
                {currentSection.description}
              </p>
            </div>
          )}

          {/* Section content */}
          {sectionComponents[activeSection]}
        </div>
      </div>
    </div>
  );
}

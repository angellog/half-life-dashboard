"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Camera,
  BarChart3,
  CalendarDays,
  Users,
  Newspaper,
  CreditCard,
  Gauge,
  MessageCircle,
  Bot,
  ChevronLeft,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/auth/UserMenu";
import { useDashboardMode } from "@/hooks/useDashboardMode";

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Social Manager", href: "/social", icon: Camera },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Calendar", href: "/calendar", icon: CalendarDays },
  { title: "Competitors", href: "/competitors", icon: Users },
  { title: "News", href: "/news", icon: Newspaper },
  { title: "NFC Store", href: "/nfc-store", icon: CreditCard },
  { title: "Billing", href: "/billing", icon: Gauge },
  {
    title: "WhatsApp Billboard",
    href: "/whatsapp-billboard",
    icon: MessageCircle,
  },
  { title: "AI Agent", href: "/ai-agent", icon: Bot, badge: "Pro" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { mode, toggleMode } = useDashboardMode();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300 flex flex-col",
          collapsed ? "w-[70px]" : "w-[260px]",
          "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo / Brand */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4 shrink-0">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm transition-colors",
                mode === "business" ? "bg-primary text-primary-foreground" : "bg-violet-600 text-white"
              )}>
                {mode === "business" ? "HL" : "P"}
              </div>
              <span className="font-semibold text-lg tracking-tight">
                {mode === "business" ? "Half Life" : "Personal OS"}
              </span>
            </Link>
          )}
          {collapsed && (
            <Link href="/" className="mx-auto">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm transition-colors",
                mode === "business" ? "bg-primary text-primary-foreground" : "bg-violet-600 text-white"
              )}>
                {mode === "business" ? "HL" : "P"}
              </div>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "hidden md:flex h-8 w-8",
              collapsed && "mx-auto mt-2"
            )}
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </Button>
        </div>

        {/* Dashboard Mode Switcher */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center justify-between p-1 bg-accent/50 rounded-lg border border-border">
              <button
                onClick={() => toggleMode("business")}
                className={cn(
                  "flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all",
                  mode === "business"
                    ? "bg-card text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Business
              </button>
              <button
                onClick={() => toggleMode("personal")}
                className={cn(
                  "flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all",
                  mode === "personal"
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Personal
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          item.badge === "Pro"
                            ? "bg-violet-500/20 text-violet-400"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}

          {/* Settings link */}
          <div className="mt-auto pt-2">
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname.startsWith("/settings")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <Settings className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="flex-1">Settings</span>}
            </Link>
          </div>
        </nav>

        {/* Bottom section — User Menu */}
        <div className="shrink-0">
          <UserMenu collapsed={collapsed} />
        </div>
      </aside>
    </>
  );
}

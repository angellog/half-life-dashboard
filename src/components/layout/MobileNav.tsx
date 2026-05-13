"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Camera,
  Bot,
  Settings,
  PlusCircle
} from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { icon: LayoutDashboard, href: "/", label: "Home" },
    { icon: Camera, href: "/social", label: "Social" },
    { icon: PlusCircle, href: "/calendar", label: "Plan", primary: true },
    { icon: Bot, href: "/ai-agent", label: "AI" },
    { icon: Settings, href: "/settings", label: "Set" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-t border-border px-4 pb-safe-area-inset-bottom">
      <div className="flex items-center justify-between h-16">
        {items.map((item) => {
          const isActive = item.href === "/" 
            ? pathname === "/" 
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[60px] h-full transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
                item.primary && "text-primary-foreground"
              )}
            >
              <div className={cn(
                "flex items-center justify-center",
                item.primary && "h-10 w-10 bg-primary rounded-full -mt-8 shadow-lg shadow-primary/20 border-4 border-background"
              )}>
                <Icon className={cn("h-5 w-5", item.primary && "h-6 w-6")} />
              </div>
              {!item.primary && <span className="text-[10px] font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

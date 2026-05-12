"use client";

// ============================================================
// UserMenu — Sidebar bottom section with auth state
// ============================================================

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  LogOut,
  LogIn,
  ChevronsUpDown,
  User,
  Crown,
} from "lucide-react";

function getInitials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

export function UserMenu({ collapsed }: { collapsed: boolean }) {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuth = status === "authenticated" && session?.user;

  if (isLoading) {
    return (
      <div className={cn("border-t border-border p-4", collapsed && "p-2")}>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-accent animate-pulse" />
          {!collapsed && (
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-24 rounded bg-accent animate-pulse" />
              <div className="h-2.5 w-16 rounded bg-accent animate-pulse" />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className={cn("border-t border-border p-4", collapsed && "p-2")}>
        <button
          onClick={() => signIn()}
          className={cn(
            "flex items-center gap-3 w-full rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
            collapsed && "justify-center px-0"
          )}
        >
          <LogIn className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sign In</span>}
        </button>
      </div>
    );
  }

  const user = session!.user!;

  return (
    <div className={cn("border-t border-border", collapsed ? "p-2" : "p-3")}>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "flex items-center gap-3 w-full rounded-lg px-2 py-2 text-sm hover:bg-accent transition-colors outline-none",
            collapsed && "justify-center px-0"
          )}
        >
          <Avatar size="sm">
            {user.image && <AvatarImage src={user.image} alt={user.name || ""} />}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium truncate">
                  {user.name || "User"}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  Free Plan
                </p>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="start"
          sideOffset={8}
          className="w-56"
        >
          <DropdownMenuLabel>
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                {user.image && (
                  <AvatarImage src={user.image} alt={user.name || ""} />
                )}
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.name || "User"}
                </p>
                <p className="text-[11px] text-muted-foreground truncate font-normal">
                  {user.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/settings" className="flex items-center gap-2 w-full">
              <User className="h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/settings" className="flex items-center gap-2 w-full">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/settings" className="flex items-center gap-2 w-full">
              <Crown className="h-4 w-4" />
              Upgrade Plan
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="text-red-400 focus:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

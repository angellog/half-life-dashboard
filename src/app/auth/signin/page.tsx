"use client";

// ============================================================
// Custom Sign-In Page — Half Life branded OAuth login
// ============================================================

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const providers = [
  {
    id: "google",
    name: "Google",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
    bg: "bg-white hover:bg-gray-50",
    text: "text-gray-800",
  },
  {
    id: "github",
    name: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    bg: "bg-[#24292f] hover:bg-[#1b1f23]",
    text: "text-white",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    bg: "bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743] hover:opacity-90",
    text: "text-white",
  },
];

export default function SignInPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSignIn(providerId: string) {
    setLoading(providerId);
    await signIn(providerId, { callbackUrl: "/" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 -mt-20 md:-ml-[260px]">
      <Card className="w-full max-w-sm border-border/50">
        <CardContent className="p-8 space-y-8">
          {/* Brand */}
          <div className="text-center space-y-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl mx-auto">
              HL
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Half Life Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Sign in to manage your brand
              </p>
            </div>
          </div>

          {/* Provider buttons */}
          <div className="space-y-3">
            {providers.map((provider) => (
              <Button
                key={provider.id}
                variant="outline"
                className={cn(
                  "w-full h-11 gap-3 text-sm font-medium border-0 transition-all",
                  provider.bg,
                  provider.text
                )}
                onClick={() => handleSignIn(provider.id)}
                disabled={loading !== null}
              >
                {loading === provider.id ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  provider.icon
                )}
                Continue with {provider.name}
              </Button>
            ))}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">
                or continue without signing in
              </span>
            </div>
          </div>

          {/* Skip */}
          <div className="text-center">
            <a
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Continue as guest
            </a>
            <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
              Some features require authentication.
              <br />
              You can sign in later from Settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

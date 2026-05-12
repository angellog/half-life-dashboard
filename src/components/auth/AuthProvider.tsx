"use client";

// ============================================================
// Auth Session Provider — wraps the app for useSession() access
// ============================================================

import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

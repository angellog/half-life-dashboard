import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Half Life Dashboard",
  description:
    "AI-powered content management platform for Sneakers & Fashion brands",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark h-full antialiased"
    >
      <body className="min-h-full bg-background text-foreground">
        <AuthProvider>
          <TooltipProvider>
            <Sidebar />
            <main className="md:pl-[260px] min-h-screen">
              <div className="p-6 pt-20 md:pt-6">{children}</div>
            </main>
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

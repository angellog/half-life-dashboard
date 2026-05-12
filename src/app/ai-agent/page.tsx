import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, MessageSquare, Lightbulb, BarChart3, CalendarDays, Lock } from "lucide-react";

export default function AIAgentPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold tracking-tight">
            AI Agent — OpenClaw Pro
          </h1>
          <Badge className="bg-violet-500/20 text-violet-400 border-0">
            Pro Feature
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1">
          Your AI-powered content strategist and autonomous assistant.
        </p>
      </div>

      {/* Pro Gate */}
      <Card className="max-w-2xl border-violet-500/20">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 mx-auto">
            <Lock className="h-8 w-8 text-violet-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Upgrade to Pro</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              OpenClaw Pro is an autonomous AI agent that helps you create
              content, analyze competitors, schedule posts, and grow your brand
              — all through a simple chat interface.
            </p>
          </div>

          {/* Capabilities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
            {[
              {
                icon: MessageSquare,
                title: "Content Suggestions",
                description: "Get AI-generated post ideas and captions tailored to your niche",
              },
              {
                icon: BarChart3,
                title: "Competitor Analysis",
                description: "Automated insights on competitor strategies and gaps",
              },
              {
                icon: CalendarDays,
                title: "Smart Scheduling",
                description: "AI recommends optimal posting times for maximum reach",
              },
              {
                icon: Lightbulb,
                title: "Strategy Consulting",
                description: "Get agency-level marketing advice powered by AI",
              },
            ].map((cap) => {
              const Icon = cap.icon;
              return (
                <div key={cap.title} className="flex gap-3 bg-accent rounded-lg p-3">
                  <Icon className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{cap.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {cap.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 pt-2">
            <Button disabled className="bg-violet-600 hover:bg-violet-700">
              Upgrade to Pro — UGX 150,000/mo
            </Button>
            <p className="text-xs text-muted-foreground">
              Includes unlimited AI queries, WhatsApp Billboard, and priority support.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Chat Preview */}
      <Card className="max-w-2xl opacity-60">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Bot className="h-5 w-5 text-violet-400" />
            <span className="font-medium text-sm">OpenClaw Pro</span>
            <Badge variant="secondary" className="text-[10px]">
              Preview
            </Badge>
          </div>
          {/* Fake chat messages */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold">
                U
              </div>
              <div className="bg-accent rounded-lg px-3 py-2 text-sm max-w-[80%]">
                What type of content should I post this week for maximum engagement?
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs">
                <Bot className="h-4 w-4 text-violet-400" />
              </div>
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg px-3 py-2 text-sm max-w-[80%]">
                Based on your analytics, Reels are driving 2.5x more engagement than other formats. I recommend posting 3 Reels this week focusing on sneaker unboxings and fit checks — your audience engages most with these topics.
              </div>
            </div>
          </div>
          {/* Input preview */}
          <div className="flex gap-2 pt-2">
            <div className="flex-1 bg-accent rounded-lg px-3 py-2 text-sm text-muted-foreground">
              Ask OpenClaw anything...
            </div>
            <Button size="sm" disabled className="bg-violet-600">
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

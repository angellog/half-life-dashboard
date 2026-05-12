"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bot,
  Send,
  MessageSquare,
  BarChart3,
  CalendarDays,
  Lightbulb,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Crown,
  ArrowRight,
  Check,
} from "lucide-react";
import { ChatMessage } from "@/types";
import { getSampleConversation, getSuggestedPrompts } from "@/lib/data/ai-agent";
import { cn } from "@/lib/utils";

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-violet-500/20 text-violet-400"
        )}
      >
        {isUser ? "U" : <Bot className="h-4 w-4" />}
      </div>

      {/* Message */}
      <div
        className={cn(
          "rounded-2xl px-4 py-3 text-sm max-w-[85%] leading-relaxed whitespace-pre-wrap",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-md"
            : "bg-accent rounded-tl-md"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>(
    getSampleConversation()
  );
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prompts = getSuggestedPrompts();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  function handleSend() {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content:
          "Thanks for your question! As a demo, I'm showing you a preview of the OpenClaw Pro chat interface. In the full version, I would analyze your account data, competitor insights, and industry trends to give you a detailed, actionable response.\n\nUpgrade to Pro to unlock real-time AI-powered content strategy, competitor analysis, and automated scheduling recommendations.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  }

  function handlePromptClick(prompt: string) {
    setInput(prompt);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] max-h-[700px]">
      {/* Chat header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20">
          <Bot className="h-5 w-5 text-violet-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">OpenClaw Pro</h3>
            <Badge className="bg-violet-500/20 text-violet-400 border-0 text-[10px]">
              AI Agent
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Your AI content strategist
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-green-400" />
          <span className="text-xs text-muted-foreground">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-4 space-y-4 scroll-smooth"
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-400">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-accent rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex gap-1">
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested prompts */}
      {messages.length <= 3 && (
        <div className="pb-3">
          <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {prompts[0].prompts.slice(0, 3).map((prompt) => (
              <button
                key={prompt}
                onClick={() => handlePromptClick(prompt)}
                className="text-xs bg-accent hover:bg-accent/80 rounded-full px-3 py-1.5 transition-colors text-muted-foreground hover:text-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ask OpenClaw anything..."
          className="flex-1"
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="bg-violet-600 hover:bg-violet-700 gap-2"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function CapabilitiesPanel() {
  const prompts = getSuggestedPrompts();

  return (
    <div className="space-y-6">
      {/* Capability cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            icon: MessageSquare,
            title: "Content Creation",
            description:
              "Generate post ideas, captions, hashtags, and content calendars tailored to the sneaker & fashion niche.",
            color: "text-pink-400",
            bg: "bg-pink-500/10",
          },
          {
            icon: BarChart3,
            title: "Competitor Analysis",
            description:
              "Get automated insights on competitor strategies, content gaps, and opportunities for your brand.",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            icon: CalendarDays,
            title: "Smart Scheduling",
            description:
              "AI recommends optimal posting times based on your audience activity and historical engagement data.",
            color: "text-green-400",
            bg: "bg-green-500/10",
          },
          {
            icon: Lightbulb,
            title: "Strategy Consulting",
            description:
              "Agency-level marketing advice: growth strategies, brand positioning, monetization tactics.",
            color: "text-amber-400",
            bg: "bg-amber-500/10",
          },
          {
            icon: Target,
            title: "Audience Insights",
            description:
              "Understand your followers: demographics, interests, peak activity times, and content preferences.",
            color: "text-purple-400",
            bg: "bg-purple-500/10",
          },
          {
            icon: TrendingUp,
            title: "Trend Detection",
            description:
              "Stay ahead of sneaker drops, fashion trends, and viral content opportunities before they peak.",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
        ].map((cap) => {
          const Icon = cap.icon;
          return (
            <Card key={cap.title} className="hover:border-violet-500/20 transition-colors">
              <CardContent className="p-5">
                <div className="flex gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      cap.bg
                    )}
                  >
                    <Icon className={cn("h-5 w-5", cap.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{cap.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Suggested Prompts by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Suggested Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {prompts.map((group) => (
              <div key={group.category}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  {group.category}
                </h4>
                <ul className="space-y-2">
                  {group.prompts.map((prompt) => (
                    <li
                      key={prompt}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    >
                      <Sparkles className="h-3 w-3 text-violet-400 shrink-0" />
                      {prompt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AIAgentPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">
              AI Agent — OpenClaw Pro
            </h1>
            <Badge className="bg-violet-500/20 text-violet-400 border-0">
              Pro
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Your AI-powered content strategist and autonomous assistant.
          </p>
        </div>
      </div>

      <Tabs defaultValue="chat">
        <TabsList>
          <TabsTrigger value="chat" className="gap-1.5">
            <Bot className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="capabilities" className="gap-1.5">
            <Zap className="h-4 w-4" />
            Capabilities
          </TabsTrigger>
          <TabsTrigger value="upgrade" className="gap-1.5">
            <Crown className="h-4 w-4" />
            Upgrade
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat">
          <Card>
            <CardContent className="p-4">
              <ChatInterface />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Capabilities Tab */}
        <TabsContent value="capabilities">
          <CapabilitiesPanel />
        </TabsContent>

        {/* Upgrade Tab */}
        <TabsContent value="upgrade" className="space-y-6">
          <Card className="max-w-2xl border-violet-500/20">
            <CardContent className="p-8 text-center space-y-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 mx-auto">
                <Crown className="h-8 w-8 text-violet-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Upgrade to Pro</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  Unlock the full power of OpenClaw Pro — unlimited AI queries,
                  autonomous content scheduling, and agency-level strategy
                  consulting.
                </p>
              </div>

              {/* What you get */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
                {[
                  "Unlimited AI chat queries",
                  "Autonomous content scheduling",
                  "Competitor auto-analysis",
                  "Trend detection alerts",
                  "Content calendar auto-fill",
                  "Brand strategy reports",
                  "WhatsApp Billboard access",
                  "Priority support",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Check className="h-4 w-4 text-violet-400 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">UGX 150,000</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <Button className="bg-violet-600 hover:bg-violet-700 gap-2 px-8">
                  Upgrade Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="text-xs text-muted-foreground">
                  Cancel anytime. No long-term contracts.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Comparison */}
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle className="text-base">Free vs Pro</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {[
                  {
                    feature: "AI Chat Queries",
                    free: "10/month",
                    pro: "Unlimited",
                  },
                  {
                    feature: "Content Suggestions",
                    free: "Basic",
                    pro: "Advanced + Auto-schedule",
                  },
                  {
                    feature: "Competitor Analysis",
                    free: "Manual only",
                    pro: "Automated reports",
                  },
                  {
                    feature: "Trend Detection",
                    free: "—",
                    pro: "Real-time alerts",
                  },
                  {
                    feature: "WhatsApp Billboard",
                    free: "—",
                    pro: "Full access",
                  },
                  {
                    feature: "Support",
                    free: "Community",
                    pro: "Priority (24hr)",
                  },
                ].map((row) => (
                  <div
                    key={row.feature}
                    className="grid grid-cols-3 px-5 py-3 text-sm"
                  >
                    <span className="font-medium">{row.feature}</span>
                    <span className="text-muted-foreground text-center">
                      {row.free}
                    </span>
                    <span className="text-violet-400 text-center font-medium">
                      {row.pro}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

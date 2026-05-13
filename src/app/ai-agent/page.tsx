"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Settings,
  Wifi,
  WifiOff,
  Loader2,
  Square,
  Plus,
  Brain,
  AlertCircle,
  X,
} from "lucide-react";
import type { ChatMessage } from "@/types";
import type { ToolCallInfo } from "@/types/openclaw";
import { getSampleConversation, getSuggestedPrompts } from "@/lib/data/ai-agent";
import { getSettings, saveSettings, clearSettings } from "@/lib/openclaw/settings";
import { useOpenClaw } from "@/hooks/useOpenClaw";
import { useNativeAI } from "@/hooks/useNativeAI";
import { ToolCallCard } from "@/components/shared/ToolCallCard";
import { cn } from "@/lib/utils";

// ================================================================
// Chat Bubble — shared between mock and live modes
// ================================================================

function ChatBubble({
  role,
  content,
  tool_calls,
}: {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  tool_calls?: ToolCallInfo[];
}) {
  const isUser = role === "user";
  if (role === "system" || role === "tool") return null;

  return (
    <div className="space-y-2">
      <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
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
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm max-w-[85%] leading-relaxed whitespace-pre-wrap",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-md"
              : "bg-accent rounded-tl-md"
          )}
        >
          {content}
        </div>
      </div>
      {tool_calls && tool_calls.length > 0 && (
        <div className="pl-11 space-y-2">
          {tool_calls.map((tool) => (
            <ToolCallCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}

// ================================================================
// Streaming Bubble — shows partial text while assistant is typing
// ================================================================

function StreamingBubble({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-400">
        <Bot className="h-4 w-4" />
      </div>
      <div className="bg-accent rounded-2xl rounded-tl-md px-4 py-3 text-sm max-w-[85%] leading-relaxed whitespace-pre-wrap">
        {text}
        <span className="inline-block w-1.5 h-4 bg-violet-400 ml-0.5 animate-pulse" />
      </div>
    </div>
  );
}

// ================================================================
// Typing Indicator (bouncing dots)
// ================================================================

function TypingIndicator() {
  return (
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
  );
}

// ================================================================
// Settings Dialog
// ================================================================

function SettingsDialog({
  open,
  onClose,
  onConnect,
  onDisconnect,
  isConnected,
  isConnecting,
  mode,
  onModeChange,
}: {
  open: boolean;
  onClose: () => void;
  onConnect: (url: string, token: string) => Promise<void>;
  onDisconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  mode: "gateway" | "native";
  onModeChange: (mode: "gateway" | "native") => void;
}) {
  const settings = getSettings();
  const [url, setUrl] = useState(settings.gatewayUrl);
  const [token, setToken] = useState(settings.authToken);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);

  if (!open) return null;

  async function handleConnect() {
    if (mode === "native") {
      onModeChange("native");
      saveSettings({ mode: "native" });
      onClose();
      return;
    }

    setConnectError(null);
    try {
      await onConnect(url, token);
      saveSettings({ mode: "gateway" });
      onClose();
    } catch (err) {
      setConnectError(err instanceof Error ? err.message : String(err));
    }
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
          resolve("Cannot reach Gateway — check the URL and ensure it is running");
        };
      });
      setTestResult(result);
    } catch {
      setTestResult("Connection test failed");
    } finally {
      setTesting(false);
    }
  }

  function handleDisconnect() {
    onDisconnect();
    clearSettings();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">AI Configuration</h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-2">
              Operation Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onModeChange("native")}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg border text-center transition-colors",
                  mode === "native"
                    ? "bg-violet-500/10 border-violet-500 text-violet-400"
                    : "bg-accent/50 border-border text-muted-foreground hover:border-muted-foreground"
                )}
              >
                <Zap className="h-4 w-4" />
                <div className="text-[10px] font-semibold">Dashboard Native</div>
              </button>
              <button
                onClick={() => onModeChange("gateway")}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg border text-center transition-colors",
                  mode === "gateway"
                    ? "bg-violet-500/10 border-violet-500 text-violet-400"
                    : "bg-accent/50 border-border text-muted-foreground hover:border-muted-foreground"
                )}
              >
                <Wifi className="h-4 w-4" />
                <div className="text-[10px] font-semibold">Local Gateway</div>
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              {mode === "native" 
                ? "Runs AI directly in the dashboard. Always online, zero setup required."
                : "Connects to your local OpenClaw Gateway for maximum control."}
            </p>
          </div>

          {mode === "gateway" && (
            <>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                  Gateway URL
                </label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="ws://127.0.0.1:18789"
                  className="font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                  Auth Token
                </label>
                <Input
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  type="password"
                  placeholder="Gateway auth token"
                  className="font-mono text-xs"
                />
              </div>
            </>
          )}

          {/* Test result */}
          {mode === "gateway" && testResult && (
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

          {/* Connect error */}
          {connectError && (
            <div className="text-xs rounded-lg px-3 py-2 bg-red-500/10 text-red-400">
              {connectError}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-4 border-t border-border gap-2">
          {mode === "gateway" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleTest}
              disabled={testing || !url}
              className="gap-1.5 text-xs mr-auto"
            >
              {testing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Wifi className="h-3 w-3" />
              )}
              Test
            </Button>
          )}

          <div className="flex gap-2">
            {isConnected && mode === "gateway" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="gap-1.5 text-xs text-red-400 hover:text-red-300"
              >
                <WifiOff className="h-3 w-3" />
                Disconnect
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleConnect}
              disabled={mode === "gateway" && (!url || isConnecting)}
              className="gap-1.5 text-xs bg-violet-600 hover:bg-violet-700"
            >
              {isConnecting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Check className="h-3 w-3" />
              )}
              {mode === "native" ? "Save Settings" : isConnected ? "Reconnect" : "Connect"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================================================================
// Live Chat Interface — hybrid Gateway + Native
// ================================================================

function LiveChatInterface() {
  const [mode, setMode] = useState<"gateway" | "native">("native");
  const [isLoaded, setIsLoaded] = useState(false);
  
  const gatewayApi = useOpenClaw();
  const nativeApi = useNativeAI();

  useEffect(() => {
    const settings = getSettings();
    setMode(settings.mode || "native");
    setIsLoaded(true);
  }, []);

  const api = mode === "native" ? nativeApi : gatewayApi;

  const {
    status,
    error,
    connect,
    disconnect,
    messages,
    streamingText,
    isStreaming,
    sendMessage,
    abort,
    activeToolCalls,
    newSession,
    memoryStatus,
    serverVersion,
  } = api;

  const [input, setInput] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prompts = getSuggestedPrompts();

  const isConnected = status === "connected";
  const isConnecting = status === "connecting";

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText, activeToolCalls, isStreaming]);

  function handleSend() {
    if (!input.trim() || !isConnected) return;
    sendMessage(input.trim());
    setInput("");
  }

  function handlePromptClick(prompt: string) {
    if (isConnected) {
      sendMessage(prompt);
    } else {
      setInput(prompt);
    }
  }

  function handleModeChange(newMode: "gateway" | "native") {
    setMode(newMode);
    saveSettings({ mode: newMode });
  }

  if (!isLoaded) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-card/50 backdrop-blur-sm shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/20">
          <Bot className="h-4 w-4 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm truncate">OpenClaw Pro</h3>
            <Badge className={cn(
              "border-0 text-[10px] h-4 px-1",
              mode === "native" ? "bg-emerald-500/20 text-emerald-400" : "bg-violet-500/20 text-violet-400"
            )}>
              {mode === "native" ? "Native" : isConnected ? "Live" : "Offline"}
            </Badge>
          </div>
          <p className="text-[10px] text-muted-foreground truncate">
            {mode === "native" ? "AI Strategist Online" : isConnected ? "Connected to Gateway" : "Disconnected"}
          </p>
        </div>
        <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
          {/* Settings button */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* New topic button */}
          {isConnected && (
            <button
              onClick={newSession}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="New Topic"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
      >
        {/* Welcome message when empty and connected */}
        {messages.length === 0 && isConnected && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10 mb-3">
              <Bot className="h-6 w-6 text-violet-400" />
            </div>
            <h3 className="text-base font-semibold mb-1">
              Ready to strategize
            </h3>
            <p className="text-xs text-muted-foreground max-w-[240px]">
              Ask me about your brand, competitors, or campaign performance.
            </p>
          </div>
        )}

        {/* Chat history */}
        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} content={msg.content} tool_calls={msg.tool_calls} />
        ))}

        {/* Active tool calls (Gateway mode only) */}
        {mode === "gateway" && activeToolCalls.length > 0 && (
          <div className="space-y-2 pl-11">
            {activeToolCalls.map((tool) => (
              <ToolCallCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}

        {/* Streaming text (Gateway mode only) */}
        {mode === "gateway" && streamingText && <StreamingBubble text={streamingText} />}

        {/* Typing indicator */}
        {isStreaming && mode === "gateway" && !streamingText && activeToolCalls.length === 0 && (
          <TypingIndicator />
        )}
        
        {isStreaming && mode === "native" && messages[messages.length-1]?.role !== "assistant" && (
           <TypingIndicator />
        )}
      </div>

      {/* Input area sticky bottom */}
      <div className="p-4 border-t border-border bg-card/80 backdrop-blur-md shrink-0">
        {messages.length === 0 && (
          <div className="mb-3 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 whitespace-nowrap">
              {prompts[0].prompts.slice(0, 3).map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handlePromptClick(prompt)}
                  className="text-[10px] bg-accent/50 hover:bg-accent rounded-full px-3 py-1.5 transition-colors text-muted-foreground hover:text-foreground border border-border"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={isConnected ? "Message OpenClaw..." : "AI Offline"}
            disabled={!isConnected}
            className="flex-1 h-11 bg-background"
          />
          {isStreaming ? (
            <Button
              onClick={abort}
              variant="outline"
              className="h-11 w-11 p-0 text-amber-400 border-amber-500/30"
            >
              <Square className="h-4 w-4 fill-current" />
            </Button>
          ) : (
            <Button
              onClick={handleSend}
              disabled={!input.trim() || !isConnected}
              className="h-11 w-11 p-0 bg-violet-600 hover:bg-violet-700 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onConnect={connect}
        onDisconnect={disconnect}
        isConnected={isConnected}
        isConnecting={isConnecting}
        mode={mode}
        onModeChange={handleModeChange}
      />
    </div>
  );
}

// ================================================================
// Mock Chat Interface — fallback when Gateway is not available
// ================================================================

function MockChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>(
    getSampleConversation()
  );
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prompts = getSuggestedPrompts();

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

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content:
          "This is a demo preview of OpenClaw Pro. Connect a local gateway in Settings for full autonomous capabilities.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b border-border bg-card/50 shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/20">
          <Bot className="h-4 w-4 text-violet-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">OpenClaw Pro</h3>
            <Badge className="bg-amber-500/20 text-amber-400 border-0 text-[10px]">
              Demo
            </Badge>
          </div>
          <p className="text-[10px] text-muted-foreground">Demo Mode</p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      <div className="p-4 border-t border-border bg-card/80 shrink-0">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask OpenClaw (demo)..."
            className="flex-1 h-11 bg-background"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="h-11 w-11 p-0 bg-violet-600 hover:bg-violet-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ================================================================
// Capabilities Panel (unchanged)
// ================================================================

function CapabilitiesPanel() {
  const prompts = getSuggestedPrompts();

  return (
    <div className="space-y-6">
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
            <Card
              key={cap.title}
              className="hover:border-violet-500/20 transition-colors"
            >
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

// ================================================================
// Main Page
// ================================================================

export default function AIAgentPage() {
  // Detect if this is a browser environment for the live interface
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  return (
    <div className="flex flex-col h-[calc(100dvh-80px)] md:h-auto md:space-y-6 -mx-4 -mt-20 md:mx-0 md:mt-0">
      {/* Header — Hidden on mobile to save space, but kept for desktop */}
      <div className="hidden md:flex items-center justify-between flex-wrap gap-4 px-4 md:px-0">
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
            Your AI-powered content strategist.
          </p>
        </div>
      </div>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="md:inline-flex w-full md:w-auto grid grid-cols-3 rounded-none md:rounded-lg bg-accent/30 md:bg-muted p-1 h-12 md:h-10">
          <TabsTrigger value="chat" className="gap-1.5 data-[state=active]:bg-card md:data-[state=active]:bg-background">
            <Bot className="h-4 w-4" />
            <span className="text-xs md:text-sm">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="capabilities" className="gap-1.5 data-[state=active]:bg-card md:data-[state=active]:bg-background">
            <Zap className="h-4 w-4" />
            <span className="text-xs md:text-sm">Skills</span>
          </TabsTrigger>
          <TabsTrigger value="upgrade" className="gap-1.5 data-[state=active]:bg-card md:data-[state=active]:bg-background">
            <Crown className="h-4 w-4" />
            <span className="text-xs md:text-sm">Pro</span>
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 flex flex-col m-0 border-0 outline-none">
          <Card className="flex-1 rounded-none md:rounded-xl border-x-0 md:border-x border-b-0 md:border-b shadow-none bg-transparent md:bg-card">
            <CardContent className="p-0 md:p-4 h-full">
              {isClient ? <LiveChatInterface /> : <MockChatInterface />}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Capabilities Tab */}
        <TabsContent value="capabilities" className="px-4 py-4 md:px-0 overflow-y-auto">
          <CapabilitiesPanel />
        </TabsContent>

        {/* Upgrade Tab */}
        <TabsContent value="upgrade" className="space-y-6 px-4 py-4 md:px-0 overflow-y-auto">
          <Card className="max-w-2xl border-violet-500/20 mx-auto">
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

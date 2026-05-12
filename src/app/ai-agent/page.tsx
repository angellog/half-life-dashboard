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
import type { ChatHistoryMessage, ToolCallInfo } from "@/types/openclaw";
import { getSampleConversation, getSuggestedPrompts } from "@/lib/data/ai-agent";
import { getSettings, saveSettings, clearSettings } from "@/lib/openclaw/settings";
import { useOpenClaw } from "@/hooks/useOpenClaw";
import { ToolCallCard } from "@/components/shared/ToolCallCard";
import { cn } from "@/lib/utils";

// ================================================================
// Chat Bubble — shared between mock and live modes
// ================================================================

function ChatBubble({
  role,
  content,
}: {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
}) {
  const isUser = role === "user";
  if (role === "system" || role === "tool") return null;

  return (
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
}: {
  open: boolean;
  onClose: () => void;
  onConnect: (url: string, token: string) => Promise<void>;
  onDisconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
}) {
  const settings = getSettings();
  const [url, setUrl] = useState(settings.gatewayUrl);
  const [token, setToken] = useState(settings.authToken);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);

  if (!open) return null;

  async function handleConnect() {
    setConnectError(null);
    try {
      await onConnect(url, token);
      onClose();
    } catch (err) {
      setConnectError(err instanceof Error ? err.message : String(err));
    }
  }

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    try {
      // Quick connectivity test — try to open a WebSocket
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
            <h3 className="font-semibold text-sm">Gateway Connection</h3>
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
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              Gateway URL
            </label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="ws://127.0.0.1:18789"
              className="font-mono text-xs"
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              Default: ws://127.0.0.1:18789 — or wss:// for remote servers
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              Auth Token
            </label>
            <Input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              type="password"
              placeholder="Gateway auth token (if configured)"
              className="font-mono text-xs"
            />
            <p className="text-[10px] text-muted-foreground mt-1">
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

          {/* Connect error */}
          {connectError && (
            <div className="text-xs rounded-lg px-3 py-2 bg-red-500/10 text-red-400">
              {connectError}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-border gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={testing || !url}
            className="gap-1.5 text-xs"
          >
            {testing ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Wifi className="h-3 w-3" />
            )}
            Test
          </Button>

          <div className="flex gap-2">
            {isConnected && (
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
              disabled={!url || isConnecting}
              className="gap-1.5 text-xs bg-violet-600 hover:bg-violet-700"
            >
              {isConnecting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Wifi className="h-3 w-3" />
              )}
              {isConnected ? "Reconnect" : "Connect"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================================================================
// Live Chat Interface — connected to OpenClaw Gateway
// ================================================================

function LiveChatInterface() {
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
  } = useOpenClaw();

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
              {isConnected ? "Live" : "Offline"}
            </Badge>
            {serverVersion && (
              <span className="text-[10px] text-muted-foreground">
                v{serverVersion}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isConnected
              ? "Connected to OpenClaw Gateway"
              : "Not connected — configure Gateway to enable AI"}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {/* Memory status */}
          {isConnected && memoryStatus && (
            <div className="flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5 text-muted-foreground" />
              <span
                className={cn(
                  "text-[10px]",
                  memoryStatus.available
                    ? "text-green-400"
                    : "text-muted-foreground"
                )}
              >
                {memoryStatus.available ? "Memory active" : "No memory"}
              </span>
            </div>
          )}

          {/* Connection indicator */}
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                isConnected
                  ? "bg-green-400"
                  : isConnecting
                    ? "bg-amber-400 animate-pulse"
                    : "bg-red-400"
              )}
            />
            <span className="text-xs text-muted-foreground">
              {isConnected
                ? "Online"
                : isConnecting
                  ? "Connecting..."
                  : "Offline"}
            </span>
          </div>

          {/* Settings button */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* New topic button */}
          {isConnected && (
            <button
              onClick={newSession}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="New Topic"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Connection banner (when disconnected) */}
      {!isConnected && !isConnecting && (
        <div className="flex items-center gap-3 px-4 py-3 my-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-amber-300">
              Connect to an OpenClaw Gateway for real AI-powered responses.
            </p>
            {error && (
              <p className="text-[10px] text-amber-400/70 mt-0.5">{error}</p>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSettingsOpen(true)}
            className="text-xs shrink-0"
          >
            Configure
          </Button>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-4 space-y-4 scroll-smooth"
      >
        {/* Welcome message when empty and connected */}
        {messages.length === 0 && isConnected && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 mb-4">
              <Bot className="h-8 w-8 text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold mb-1">
              OpenClaw Pro is ready
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              I&apos;m your AI business strategist for Half Life. Ask me about
              content strategy, competitors, analytics, or anything else.
            </p>
          </div>
        )}

        {/* Chat history */}
        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} content={msg.content} />
        ))}

        {/* Active tool calls */}
        {activeToolCalls.length > 0 && (
          <div className="space-y-2 pl-11">
            {activeToolCalls.map((tool) => (
              <ToolCallCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}

        {/* Streaming text */}
        {streamingText && <StreamingBubble text={streamingText} />}

        {/* Typing indicator (streaming with no text yet) */}
        {isStreaming && !streamingText && activeToolCalls.length === 0 && (
          <TypingIndicator />
        )}
      </div>

      {/* Suggested prompts */}
      {messages.length === 0 && (
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
          placeholder={
            isConnected
              ? "Ask OpenClaw anything..."
              : "Connect to Gateway to start chatting..."
          }
          disabled={!isConnected}
          className="flex-1"
        />
        {isStreaming ? (
          <Button
            onClick={abort}
            variant="outline"
            className="gap-2 text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
          >
            <Square className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button
            onClick={handleSend}
            disabled={!input.trim() || !isConnected}
            className="bg-violet-600 hover:bg-violet-700 gap-2"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onConnect={connect}
        onDisconnect={disconnect}
        isConnected={isConnected}
        isConnecting={isConnecting}
      />
    </div>
  );
}

// ================================================================
// Mock Chat Interface — fallback when Gateway is not available
// (kept for demo / Vercel deployment)
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
          "Thanks for your question! This is a demo preview of the OpenClaw Pro interface. Connect to an OpenClaw Gateway for real AI-powered responses with persistent memory, tool execution, and business context awareness.\n\nConfigure the Gateway connection using the settings icon above.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] max-h-[700px]">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20">
          <Bot className="h-5 w-5 text-violet-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">OpenClaw Pro</h3>
            <Badge className="bg-amber-500/20 text-amber-400 border-0 text-[10px]">
              Demo
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Demo mode — connect Gateway for real AI
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="text-xs text-muted-foreground">Demo</span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-4 space-y-4 scroll-smooth"
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {messages.length <= 3 && (
        <div className="pb-3">
          <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {prompts[0].prompts.slice(0, 3).map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="text-xs bg-accent hover:bg-accent/80 rounded-full px-3 py-1.5 transition-colors text-muted-foreground hover:text-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-3 border-t border-border">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ask OpenClaw anything (demo)..."
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
            Your AI-powered content strategist and autonomous assistant,
            backed by the OpenClaw runtime.
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
              {isClient ? <LiveChatInterface /> : <MockChatInterface />}
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

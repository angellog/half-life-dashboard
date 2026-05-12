import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useCallback } from "react";
import type { UseOpenClawReturn } from "@/hooks/useOpenClaw";
import type { ChatHistoryMessage, ToolCallInfo, ConnectionStatus, MemoryStatus } from "@/types/openclaw";
import { DefaultChatTransport } from "ai";

export function useNativeAI(): UseOpenClawReturn {
  const {
    messages: sdkMessages,
    sendMessage: sendChatMessage,
    status: chatStatus,
    stop,
  } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [status, setStatus] = useState<ConnectionStatus>("connected");
  const [activeToolCalls, setActiveToolCalls] = useState<ToolCallInfo[]>([]);

  // Map SDK messages to OpenClaw format
  // Note: SDK v6 uses 'parts' in UIMessage. We might need to map differently but let's see.
  const messages: ChatHistoryMessage[] = sdkMessages.map((m) => ({
    role: m.role as "user" | "assistant" | "system" | "tool",
    content: m.parts
      .map((p) => (p.type === "text" ? p.text : ""))
      .join(""),
    timestamp: new Date().toISOString(), // Mock timestamp for now
    tool_calls: [], // Tool calls are handled differently in SDK v6 parts
  }));

  const sendMessage = async (text: string) => {
    await sendChatMessage({ text });
  };

  const connect = async () => {
    setStatus("connected");
  };

  const disconnect = () => {
    setStatus("disconnected");
  };

  const newSession = async () => {
    // Clear chat or start new thread logic
    window.location.reload(); // Simple way to reset state for now
  };

  const isLoading = chatStatus === "streaming" || chatStatus === "submitted";

  return {
    status,
    error: null,
    connect,
    disconnect,
    messages,
    streamingText: "", // useChat handles streaming internally in messages
    isStreaming: isLoading,
    sendMessage,
    abort: stop,
    activeToolCalls: [], // Tool calls are handled within messages in SDK
    currentSession: "native-session",
    newSession,
    isHealthy: true,
    memoryStatus: { available: true, status: "cloud-native" },
    serverVersion: "2.0.0-integrated",
  };
}

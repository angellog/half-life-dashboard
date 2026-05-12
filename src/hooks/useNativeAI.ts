import { useChat } from "ai/react";
import { useState, useEffect, useCallback } from "react";
import type { UseOpenClawReturn } from "@/hooks/useOpenClaw";
import type { ChatHistoryMessage, ToolCallInfo, ConnectionStatus, MemoryStatus } from "@/types/openclaw";

export function useNativeAI(): UseOpenClawReturn {
  const {
    messages: sdkMessages,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload,
  } = useChat({
    api: "/api/chat",
  });

  const [status, setStatus] = useState<ConnectionStatus>("connected");
  const [activeToolCalls, setActiveToolCalls] = useState<ToolCallInfo[]>([]);

  // Map SDK messages to OpenClaw format
  const messages: ChatHistoryMessage[] = sdkMessages.map((m) => ({
    role: m.role as "user" | "assistant" | "system" | "tool",
    content: m.content,
    timestamp: m.createdAt?.toISOString(),
    tool_calls: m.toolInvocations?.map((ti) => ({
      id: ti.toolCallId,
      name: ti.toolName,
      status: ti.state as "running" | "completed" | "error",
      args: JSON.stringify(ti.args),
      result: "result" in ti ? JSON.stringify(ti.result) : undefined,
      startedAt: Date.now(), // Placeholder
    })),
  }));

  const sendMessage = async (text: string) => {
    await append({ role: "user", content: text });
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

"use client";

// ============================================================
// useOpenClaw — React hook for OpenClaw Gateway integration
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  ConnectionStatus,
  ChatHistoryMessage,
  ToolCallInfo,
  SessionInfo,
  MemoryStatus,
} from "@/types/openclaw";
import { getOpenClawClient } from "@/lib/openclaw/client";
import { getSettings, saveSettings } from "@/lib/openclaw/settings";

const SESSION_KEY = "half-life-main";

export interface UseOpenClawReturn {
  // Connection
  status: ConnectionStatus;
  error: string | null;
  connect: (gatewayUrl?: string, authToken?: string) => Promise<void>;
  disconnect: () => void;

  // Chat
  messages: ChatHistoryMessage[];
  streamingText: string;
  isStreaming: boolean;
  sendMessage: (text: string) => Promise<void>;
  abort: () => void;

  // Tool calls
  activeToolCalls: ToolCallInfo[];

  // Sessions
  currentSession: string | null;
  newSession: () => Promise<void>;

  // Health & Memory
  isHealthy: boolean;
  memoryStatus: MemoryStatus | null;

  // Server info
  serverVersion: string | null;
}

export function useOpenClaw(): UseOpenClawReturn {
  const client = useRef(getOpenClawClient());

  // Connection state
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [error, setError] = useState<string | null>(null);

  // Chat state
  const [messages, setMessages] = useState<ChatHistoryMessage[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  // Tool calls
  const [activeToolCalls, setActiveToolCalls] = useState<ToolCallInfo[]>([]);

  // Session
  const [currentSession, setCurrentSession] = useState<string | null>(null);

  // Health & memory
  const [isHealthy, setIsHealthy] = useState(false);
  const [memoryStatus, setMemoryStatus] = useState<MemoryStatus | null>(null);
  const [serverVersion, setServerVersion] = useState<string | null>(null);

  // Track the current streaming buffer with a ref so event callbacks
  // always see the latest value without re-subscribing.
  const streamingRef = useRef("");

  // ------------------------------------------------------------------
  // Event Listeners — subscribe once on mount
  // ------------------------------------------------------------------

  useEffect(() => {
    const c = client.current;

    const onStatus = (s: ConnectionStatus) => {
      setStatus(s);
      if (s === "connected") {
        setError(null);
        setIsHealthy(true);
      }
      if (s === "disconnected" || s === "error") {
        setIsHealthy(false);
      }
    };

    const onError = (msg: string) => {
      setError(msg);
    };

    const onChatDelta = (data: { text: string; runId?: string }) => {
      setIsStreaming(true);
      streamingRef.current += data.text;
      setStreamingText(streamingRef.current);
    };

    const onChatFinal = (_data: { runId?: string }) => {
      // Flush streaming text into messages as an assistant message
      if (streamingRef.current.trim()) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant" as const,
            content: streamingRef.current,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
      streamingRef.current = "";
      setStreamingText("");
      setIsStreaming(false);
      setActiveToolCalls([]);

      // Refresh history from Gateway to get canonical state
      refreshHistory();
    };

    const onToolCall = (tool: ToolCallInfo) => {
      setActiveToolCalls((prev) => {
        const idx = prev.findIndex((t) => t.id === tool.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = tool;
          return updated;
        }
        return [...prev, tool];
      });
    };

    c.on("connection:status", onStatus);
    c.on("connection:error", onError);
    c.on("chat:delta", onChatDelta);
    c.on("chat:final", onChatFinal);
    c.on("agent:tool", onToolCall);

    return () => {
      c.off("connection:status", onStatus);
      c.off("connection:error", onError);
      c.off("chat:delta", onChatDelta);
      c.off("chat:final", onChatFinal);
      c.off("agent:tool", onToolCall);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------------------------
  // Refresh history from Gateway
  // ------------------------------------------------------------------

  const refreshHistory = useCallback(async () => {
    try {
      const c = client.current;
      if (c.connectionStatus !== "connected") return;
      const history = await c.getHistory(currentSession || undefined);
      setMessages(history);
    } catch {
      // non-fatal — keep local messages
    }
  }, [currentSession]);

  // ------------------------------------------------------------------
  // Connect
  // ------------------------------------------------------------------

  const connect = useCallback(
    async (gatewayUrl?: string, authToken?: string) => {
      const settings = getSettings();
      const url = gatewayUrl || settings.gatewayUrl;
      const token = authToken || settings.authToken;

      setError(null);

      try {
        const hello = await client.current.connect(url, token);
        setServerVersion(hello.server?.version || null);

        // Save working settings
        saveSettings({ gatewayUrl: url, authToken: token });

        // Ensure session exists
        const storedKey = settings.activeSessionKey || SESSION_KEY;
        let sessionKey = storedKey;

        const existing = await client.current.describeSession(storedKey);
        if (!existing) {
          // Create the persistent business session
          sessionKey =
            (await client.current.createSession("Half Life — Main")) ||
            SESSION_KEY;
        }

        setCurrentSession(sessionKey);
        saveSettings({ activeSessionKey: sessionKey });

        // Load history
        const history = await client.current.getHistory(sessionKey);
        setMessages(history);

        // Check memory status (non-blocking)
        client.current.getMemoryStatus().then(setMemoryStatus).catch(() => {
          setMemoryStatus({ available: false });
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        throw err;
      }
    },
    []
  );

  // ------------------------------------------------------------------
  // Disconnect
  // ------------------------------------------------------------------

  const disconnect = useCallback(() => {
    client.current.disconnect();
    setMessages([]);
    setStreamingText("");
    setIsStreaming(false);
    setActiveToolCalls([]);
    setCurrentSession(null);
    setMemoryStatus(null);
    setServerVersion(null);
  }, []);

  // ------------------------------------------------------------------
  // Send Message
  // ------------------------------------------------------------------

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      // Optimistically add user message
      setMessages((prev) => [
        ...prev,
        {
          role: "user" as const,
          content: text.trim(),
          timestamp: new Date().toISOString(),
        },
      ]);

      // Reset streaming state
      streamingRef.current = "";
      setStreamingText("");
      setIsStreaming(true);
      setActiveToolCalls([]);

      try {
        await client.current.sendMessage(
          text.trim(),
          currentSession || undefined
        );
      } catch (err) {
        setIsStreaming(false);
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);

        // Add error as assistant message
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant" as const,
            content: `Error: ${msg}`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    },
    [currentSession]
  );

  // ------------------------------------------------------------------
  // Abort
  // ------------------------------------------------------------------

  const abort = useCallback(() => {
    client.current.abort(currentSession || undefined).catch(() => {
      // ignore abort errors
    });
    setIsStreaming(false);
  }, [currentSession]);

  // ------------------------------------------------------------------
  // New Session
  // ------------------------------------------------------------------

  const newSession = useCallback(async () => {
    try {
      const key =
        (await client.current.createSession("Half Life — New Topic")) ||
        `session-${Date.now()}`;
      setCurrentSession(key);
      saveSettings({ activeSessionKey: key });
      setMessages([]);
      setStreamingText("");
      setIsStreaming(false);
      setActiveToolCalls([]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    }
  }, []);

  // ------------------------------------------------------------------
  // Auto-connect on mount (if settings exist)
  // ------------------------------------------------------------------

  useEffect(() => {
    const settings = getSettings();
    if (settings.gatewayUrl && settings.authToken) {
      connect().catch(() => {
        // Don't throw on auto-connect failure — user can retry manually
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
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
    currentSession,
    newSession,
    isHealthy,
    memoryStatus,
    serverVersion,
  };
}

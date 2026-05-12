// ============================================================
// OpenClaw Gateway WebSocket Client
// ============================================================
//
// Implements the OpenClaw wire protocol:
//   1. Open WebSocket to Gateway
//   2. Wait for connect.challenge event
//   3. Send connect request with auth
//   4. Receive hello-ok response
//   5. Exchange req/res frames + receive server events
//
// Reference: https://docs.openclaw.ai/gateway/protocol

import type {
  ConnectionStatus,
  OpenClawFrame,
  OpenClawResponse,
  ConnectChallenge,
  HelloOkPayload,
  ChatHistoryMessage,
  ChatSendResult,
  SessionInfo,
  GatewayHealth,
  MemoryStatus,
  ToolCallInfo,
  AgentLifecycleEvent,
  OpenClawEventName,
  OpenClawClientEvents,
} from "@/types/openclaw";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type EventCallback<T = unknown> = (data: T) => void;

interface PendingRequest {
  resolve: (payload: Record<string, unknown>) => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export class OpenClawClient {
  private ws: WebSocket | null = null;
  private status: ConnectionStatus = "disconnected";
  private requestId = 0;
  private pending = new Map<string, PendingRequest>();
  private listeners = new Map<string, Set<EventCallback>>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private tickTimer: ReturnType<typeof setTimeout> | null = null;
  private backoffMs = 1000;
  private tickIntervalMs = 30000;
  private shouldReconnect = false;
  private challengeNonce: string | null = null;
  private helloOk: HelloOkPayload | null = null;

  // Config
  private gatewayUrl = "";
  private authToken = "";

  // Request timeout
  private static REQUEST_TIMEOUT_MS = 30_000;
  private static MAX_BACKOFF_MS = 30_000;
  private static INITIAL_BACKOFF_MS = 1000;

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  get connectionStatus(): ConnectionStatus {
    return this.status;
  }

  get serverInfo(): HelloOkPayload | null {
    return this.helloOk;
  }

  /**
   * Connect to the OpenClaw Gateway.
   */
  async connect(gatewayUrl: string, authToken: string): Promise<HelloOkPayload> {
    if (this.ws) {
      this.closeWebSocket();
    }

    this.gatewayUrl = gatewayUrl;
    this.authToken = authToken;
    this.shouldReconnect = true;
    this.backoffMs = OpenClawClient.INITIAL_BACKOFF_MS;

    return this.doConnect();
  }

  /**
   * Disconnect and stop reconnecting.
   */
  disconnect(): void {
    this.shouldReconnect = false;
    this.clearReconnectTimer();
    this.clearTickTimer();
    this.closeWebSocket();
    this.setStatus("disconnected");
  }

  /**
   * Get Gateway health.
   */
  async getHealth(): Promise<GatewayHealth> {
    const res = await this.request("health", {});
    return res as unknown as GatewayHealth;
  }

  /**
   * Get chat history for the current or specified session.
   */
  async getHistory(sessionKey?: string): Promise<ChatHistoryMessage[]> {
    const params: Record<string, unknown> = {};
    if (sessionKey) params.sessionKey = sessionKey;
    const res = await this.request("chat.history", params);
    const messages = (res as Record<string, unknown>).messages;
    if (Array.isArray(messages)) {
      return messages as ChatHistoryMessage[];
    }
    return [];
  }

  /**
   * Send a chat message. Non-blocking — returns runId immediately.
   * Listen for chat:delta and agent:lifecycle events for the response.
   */
  async sendMessage(
    text: string,
    sessionKey?: string
  ): Promise<ChatSendResult> {
    const params: Record<string, unknown> = {
      message: text,
      idempotencyKey: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };
    if (sessionKey) params.sessionKey = sessionKey;
    const res = await this.request("chat.send", params);
    return res as unknown as ChatSendResult;
  }

  /**
   * Abort the active agent run for a session.
   */
  async abort(sessionKey?: string): Promise<void> {
    const params: Record<string, unknown> = {};
    if (sessionKey) params.sessionKey = sessionKey;
    await this.request("chat.abort", params);
  }

  /**
   * List sessions.
   */
  async listSessions(): Promise<SessionInfo[]> {
    const res = await this.request("sessions.list", {});
    const sessions = (res as Record<string, unknown>).sessions;
    if (Array.isArray(sessions)) {
      return sessions as SessionInfo[];
    }
    return [];
  }

  /**
   * Create a new session.
   */
  async createSession(title?: string): Promise<string> {
    const params: Record<string, unknown> = {};
    if (title) params.title = title;
    const res = await this.request("sessions.create", params);
    return (res as Record<string, unknown>).key as string || (res as Record<string, unknown>).sessionKey as string || "";
  }

  /**
   * Describe a session (check if it exists).
   */
  async describeSession(
    sessionKey: string
  ): Promise<SessionInfo | null> {
    try {
      const res = await this.request("sessions.describe", {
        key: sessionKey,
      });
      return res as unknown as SessionInfo;
    } catch {
      return null;
    }
  }

  /**
   * Check memory status.
   */
  async getMemoryStatus(): Promise<MemoryStatus> {
    try {
      const res = await this.request("doctor.memory.status", {});
      return {
        available: true,
        status: (res as Record<string, unknown>).status as string || "active",
        embeddingProvider: (res as Record<string, unknown>).provider as string,
      };
    } catch {
      return { available: false };
    }
  }

  // -----------------------------------------------------------------------
  // Event Emitter
  // -----------------------------------------------------------------------

  on<K extends OpenClawEventName>(
    event: K,
    callback: EventCallback<OpenClawClientEvents[K]>
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback as EventCallback);
  }

  off<K extends OpenClawEventName>(
    event: K,
    callback: EventCallback<OpenClawClientEvents[K]>
  ): void {
    this.listeners.get(event)?.delete(callback as EventCallback);
  }

  private emit<K extends OpenClawEventName>(
    event: K,
    data: OpenClawClientEvents[K]
  ): void {
    this.listeners.get(event)?.forEach((cb) => cb(data));
  }

  // -----------------------------------------------------------------------
  // Connection Internals
  // -----------------------------------------------------------------------

  private doConnect(): Promise<HelloOkPayload> {
    return new Promise<HelloOkPayload>((resolve, reject) => {
      this.setStatus("connecting");

      let settled = false;

      try {
        this.ws = new WebSocket(this.gatewayUrl);
      } catch (err) {
        this.setStatus("error");
        this.emit("connection:error", String(err));
        reject(new Error(`WebSocket creation failed: ${err}`));
        return;
      }

      // Overall connect timeout
      const connectTimeout = setTimeout(() => {
        if (!settled) {
          settled = true;
          this.closeWebSocket();
          this.setStatus("error");
          const msg = "Connection timeout — Gateway did not respond";
          this.emit("connection:error", msg);
          reject(new Error(msg));
        }
      }, 15_000);

      this.ws.onopen = () => {
        // Wait for connect.challenge event from server
      };

      this.ws.onmessage = (event) => {
        let frame: OpenClawFrame;
        try {
          frame = JSON.parse(event.data as string) as OpenClawFrame;
        } catch {
          return; // ignore malformed frames
        }

        // --- Pre-connect: handle challenge ---
        if (
          frame.type === "event" &&
          frame.event === "connect.challenge" &&
          !settled
        ) {
          const challenge = frame.payload as unknown as ConnectChallenge;
          this.challengeNonce = challenge.nonce;
          this.sendConnectRequest();
          return;
        }

        // --- Pre-connect: handle connect response ---
        if (frame.type === "res" && !settled) {
          clearTimeout(connectTimeout);
          settled = true;

          if (frame.ok && frame.payload) {
            this.helloOk = frame.payload as unknown as HelloOkPayload;
            this.tickIntervalMs =
              this.helloOk.policy?.tickIntervalMs || 30000;
            this.setStatus("connected");
            this.backoffMs = OpenClawClient.INITIAL_BACKOFF_MS;
            this.startTickMonitor();
            resolve(this.helloOk);
          } else {
            const errMsg =
              frame.error?.message || "Connection rejected by Gateway";
            this.setStatus("error");
            this.emit("connection:error", errMsg);
            this.closeWebSocket();

            // Don't auto-reconnect on auth failure
            const code = frame.error?.details?.code as string | undefined;
            if (
              code === "AUTH_TOKEN_MISMATCH" ||
              code === "AUTH_SCOPE_MISMATCH" ||
              errMsg.includes("pairing")
            ) {
              this.shouldReconnect = false;
            }

            reject(new Error(errMsg));
          }
          return;
        }

        // --- Post-connect: route frames ---
        if (settled || this.status === "connected") {
          this.handleFrame(frame);
        }
      };

      this.ws.onerror = () => {
        if (!settled) {
          clearTimeout(connectTimeout);
          settled = true;
          this.setStatus("error");
          const msg = "WebSocket error — cannot reach Gateway";
          this.emit("connection:error", msg);
          reject(new Error(msg));
        }
      };

      this.ws.onclose = (event) => {
        this.clearTickTimer();

        if (!settled) {
          clearTimeout(connectTimeout);
          settled = true;
          this.setStatus("error");
          const msg = event.reason || "Connection closed before handshake";
          this.emit("connection:error", msg);
          reject(new Error(msg));
          return;
        }

        if (this.status === "connected") {
          this.setStatus("disconnected");
          this.scheduleReconnect();
        }
      };
    });
  }

  private sendConnectRequest(): void {
    const req: OpenClawFrame = {
      type: "req",
      id: this.nextId(),
      method: "connect",
      params: {
        minProtocol: 3,
        maxProtocol: 4,
        client: {
          id: "half-life-dashboard",
          version: "1.0.0",
          platform: "web",
          mode: "operator",
        },
        role: "operator",
        scopes: ["operator.read", "operator.write"],
        caps: [],
        commands: [],
        permissions: {},
        auth: this.authToken
          ? { token: this.authToken }
          : {},
        locale: typeof navigator !== "undefined" ? navigator.language : "en-US",
        userAgent: "half-life-dashboard/1.0.0",
      },
    };
    this.send(req);
  }

  // -----------------------------------------------------------------------
  // Frame Handling (post-connect)
  // -----------------------------------------------------------------------

  private handleFrame(frame: OpenClawFrame): void {
    // --- Response to a pending request ---
    if (frame.type === "res") {
      const pending = this.pending.get(frame.id);
      if (pending) {
        this.pending.delete(frame.id);
        clearTimeout(pending.timer);
        if (frame.ok) {
          pending.resolve(frame.payload || {});
        } else {
          pending.reject(
            new Error(frame.error?.message || "Request failed")
          );
        }
      }
      return;
    }

    // --- Server events ---
    if (frame.type === "event") {
      this.handleEvent(frame.event, frame.payload);
    }
  }

  private handleEvent(
    event: string,
    payload: Record<string, unknown> | undefined
  ): void {
    // Tick — keepalive
    if (event === "tick") {
      this.resetTickTimer();
      this.emit("tick", undefined as unknown as void);
      return;
    }

    // Chat events — streaming assistant text
    if (event === "chat") {
      if (!payload) return;

      // Delta (streaming text)
      const type = payload.type as string;
      if (type === "delta" || type === "message") {
        const text =
          (payload.text as string) ||
          (payload.content as string) ||
          "";
        if (text) {
          this.emit("chat:delta", {
            text,
            runId: payload.runId as string | undefined,
          });
        }
      }

      // Final (run completed)
      if (type === "final" || type === "end") {
        this.emit("chat:final", {
          runId: payload.runId as string | undefined,
        });
      }
      return;
    }

    // Session message events (subscribed sessions)
    if (event === "session.message") {
      if (!payload) return;
      const role = payload.role as string;
      const content =
        (payload.text as string) ||
        (payload.content as string) ||
        "";
      if (role === "assistant" && content) {
        this.emit("chat:delta", {
          text: content,
          runId: payload.runId as string | undefined,
        });
      }
      return;
    }

    // Agent events — tool calls, lifecycle
    if (event === "agent") {
      if (!payload) return;
      const stream = payload.stream as string;

      if (stream === "tool") {
        const tool: ToolCallInfo = {
          id:
            (payload.toolCallId as string) ||
            (payload.id as string) ||
            `tool-${Date.now()}`,
          name: (payload.name as string) || (payload.tool as string) || "unknown",
          status: mapToolStatus(payload.status as string),
          args: payload.args as string | undefined,
          result: payload.result
            ? typeof payload.result === "string"
              ? payload.result
              : JSON.stringify(payload.result).slice(0, 500)
            : undefined,
          startedAt: (payload.startedAt as number) || Date.now(),
          completedAt: payload.completedAt as number | undefined,
        };
        this.emit("agent:tool", tool);
      }

      if (stream === "lifecycle") {
        const lifecycle: AgentLifecycleEvent = {
          phase: (payload.phase as "start" | "end" | "error") || "end",
          runId: (payload.runId as string) || "",
          status: payload.status as string | undefined,
          error: payload.error as string | undefined,
        };
        this.emit("agent:lifecycle", lifecycle);

        // lifecycle:end → also emit chat:final
        if (lifecycle.phase === "end" || lifecycle.phase === "error") {
          this.emit("chat:final", { runId: lifecycle.runId });
        }
      }
      return;
    }

    // Session tool events
    if (event === "session.tool") {
      if (!payload) return;
      const tool: ToolCallInfo = {
        id: (payload.toolCallId as string) || `tool-${Date.now()}`,
        name: (payload.name as string) || (payload.tool as string) || "unknown",
        status: mapToolStatus(payload.status as string),
        args: payload.args as string | undefined,
        result: payload.result
          ? typeof payload.result === "string"
            ? payload.result
            : JSON.stringify(payload.result).slice(0, 500)
          : undefined,
        startedAt: (payload.startedAt as number) || Date.now(),
        completedAt: payload.completedAt as number | undefined,
      };
      this.emit("agent:tool", tool);
      return;
    }
  }

  // -----------------------------------------------------------------------
  // RPC Layer
  // -----------------------------------------------------------------------

  private request(
    method: string,
    params: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return new Promise((resolve, reject) => {
      if (this.status !== "connected" || !this.ws) {
        reject(new Error("Not connected to Gateway"));
        return;
      }

      const id = this.nextId();
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Request timeout: ${method}`));
      }, OpenClawClient.REQUEST_TIMEOUT_MS);

      this.pending.set(id, { resolve, reject, timer });

      const frame: OpenClawFrame = {
        type: "req",
        id,
        method,
        params,
      };
      this.send(frame);
    });
  }

  // -----------------------------------------------------------------------
  // Transport Helpers
  // -----------------------------------------------------------------------

  private send(frame: OpenClawFrame): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(frame));
    }
  }

  private nextId(): string {
    this.requestId += 1;
    return `req-${this.requestId}`;
  }

  private closeWebSocket(): void {
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onerror = null;
      this.ws.onclose = null;
      if (
        this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING
      ) {
        this.ws.close();
      }
      this.ws = null;
    }

    // Reject all pending requests
    this.pending.forEach((p) => {
      clearTimeout(p.timer);
      p.reject(new Error("Connection closed"));
    });
    this.pending.clear();
  }

  // -----------------------------------------------------------------------
  // Status
  // -----------------------------------------------------------------------

  private setStatus(status: ConnectionStatus): void {
    if (this.status !== status) {
      this.status = status;
      this.emit("connection:status", status);
    }
  }

  // -----------------------------------------------------------------------
  // Reconnection
  // -----------------------------------------------------------------------

  private scheduleReconnect(): void {
    if (!this.shouldReconnect) return;

    this.clearReconnectTimer();
    this.reconnectTimer = setTimeout(async () => {
      try {
        await this.doConnect();
      } catch {
        // doConnect will set error status; backoff and retry
        this.backoffMs = Math.min(
          this.backoffMs * 2,
          OpenClawClient.MAX_BACKOFF_MS
        );
        this.scheduleReconnect();
      }
    }, this.backoffMs);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  // -----------------------------------------------------------------------
  // Tick Monitoring
  // -----------------------------------------------------------------------

  private startTickMonitor(): void {
    this.resetTickTimer();
  }

  private resetTickTimer(): void {
    this.clearTickTimer();
    this.tickTimer = setTimeout(() => {
      // No tick received in 2× interval — connection is stale
      if (this.status === "connected") {
        this.closeWebSocket();
        this.setStatus("disconnected");
        this.scheduleReconnect();
      }
    }, this.tickIntervalMs * 2);
  }

  private clearTickTimer(): void {
    if (this.tickTimer) {
      clearTimeout(this.tickTimer);
      this.tickTimer = null;
    }
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mapToolStatus(
  status: string | undefined
): "running" | "completed" | "error" {
  if (!status) return "running";
  if (status === "completed" || status === "success" || status === "done")
    return "completed";
  if (status === "error" || status === "failed") return "error";
  return "running";
}

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

let clientInstance: OpenClawClient | null = null;

export function getOpenClawClient(): OpenClawClient {
  if (!clientInstance) {
    clientInstance = new OpenClawClient();
  }
  return clientInstance;
}

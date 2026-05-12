// ============================================================
// OpenClaw Gateway Protocol — Type Definitions
// ============================================================

// --- Connection ---

export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export interface OpenClawSettings {
  gatewayUrl: string;
  authToken: string;
  activeSessionKey: string | null;
}

// --- Wire Protocol Frames ---

export interface OpenClawRequest {
  type: "req";
  id: string;
  method: string;
  params?: Record<string, unknown>;
}

export interface OpenClawResponse {
  type: "res";
  id: string;
  ok: boolean;
  payload?: Record<string, unknown>;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
}

export interface OpenClawEvent {
  type: "event";
  event: string;
  payload?: Record<string, unknown>;
  seq?: number;
  stateVersion?: number;
}

export type OpenClawFrame = OpenClawRequest | OpenClawResponse | OpenClawEvent;

// --- Connect Handshake ---

export interface ConnectChallenge {
  nonce: string;
  ts: number;
}

export interface ConnectClientInfo {
  id: string;
  version: string;
  platform: string;
  mode: string;
}

export interface ConnectParams {
  minProtocol: number;
  maxProtocol: number;
  client: ConnectClientInfo;
  role: "operator" | "node";
  scopes: string[];
  caps: string[];
  commands: string[];
  permissions: Record<string, boolean>;
  auth: { token?: string; password?: string };
  locale: string;
  userAgent: string;
}

export interface HelloOkPayload {
  type: "hello-ok";
  protocol: number;
  server: { version: string; connId: string };
  features: { methods: string[]; events: string[] };
  snapshot: Record<string, unknown>;
  auth: {
    role: string;
    scopes: string[];
    deviceToken?: string;
  };
  policy: {
    maxPayload: number;
    maxBufferedBytes: number;
    tickIntervalMs: number;
  };
}

// --- Chat ---

export interface ChatHistoryMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  timestamp?: string;
  tool_calls?: ToolCallInfo[];
}

export interface ChatSendResult {
  runId: string;
  status: "started" | "in_flight" | "ok";
}

// --- Agent Events ---

export interface ToolCallInfo {
  id: string;
  name: string;
  status: "running" | "completed" | "error";
  args?: string;
  result?: string;
  startedAt: number;
  completedAt?: number;
}

export interface AgentLifecycleEvent {
  phase: "start" | "end" | "error";
  runId: string;
  status?: string;
  error?: string;
}

// --- Sessions ---

export interface SessionInfo {
  key: string;
  title?: string;
  agentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// --- Health ---

export interface GatewayHealth {
  ok: boolean;
  version?: string;
  uptime?: number;
  channels?: Record<string, unknown>;
}

// --- Memory ---

export interface MemoryStatus {
  available: boolean;
  embeddingProvider?: string;
  status?: string;
}

// --- Client Event Map ---

export interface OpenClawClientEvents {
  "connection:status": ConnectionStatus;
  "connection:error": string;
  "chat:delta": { text: string; runId?: string };
  "chat:final": { runId?: string };
  "agent:tool": ToolCallInfo;
  "agent:lifecycle": AgentLifecycleEvent;
  tick: void;
}

export type OpenClawEventName = keyof OpenClawClientEvents;

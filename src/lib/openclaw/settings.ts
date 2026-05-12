// ============================================================
// OpenClaw Settings — localStorage persistence
// ============================================================

import type { OpenClawSettings } from "@/types/openclaw";

const KEYS = {
  gatewayUrl: "openclaw_gateway_url",
  authToken: "openclaw_auth_token",
  activeSessionKey: "openclaw_active_session_key",
} as const;

const ENV_GATEWAY_URL =
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_OPENCLAW_GATEWAY_URL
    : undefined;

const ENV_AUTH_TOKEN =
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_OPENCLAW_AUTH_TOKEN
    : undefined;

const DEFAULT_GATEWAY_URL = "ws://127.0.0.1:18789";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getSettings(): OpenClawSettings {
  if (!isBrowser()) {
    return {
      gatewayUrl: ENV_GATEWAY_URL || DEFAULT_GATEWAY_URL,
      authToken: ENV_AUTH_TOKEN || "",
      activeSessionKey: null,
    };
  }

  return {
    gatewayUrl:
      localStorage.getItem(KEYS.gatewayUrl) ||
      ENV_GATEWAY_URL ||
      DEFAULT_GATEWAY_URL,
    authToken:
      localStorage.getItem(KEYS.authToken) || ENV_AUTH_TOKEN || "",
    activeSessionKey:
      localStorage.getItem(KEYS.activeSessionKey) || null,
  };
}

export function saveSettings(
  settings: Partial<OpenClawSettings>
): void {
  if (!isBrowser()) return;

  if (settings.gatewayUrl !== undefined) {
    localStorage.setItem(KEYS.gatewayUrl, settings.gatewayUrl);
  }
  if (settings.authToken !== undefined) {
    localStorage.setItem(KEYS.authToken, settings.authToken);
  }
  if (settings.activeSessionKey !== undefined) {
    if (settings.activeSessionKey === null) {
      localStorage.removeItem(KEYS.activeSessionKey);
    } else {
      localStorage.setItem(KEYS.activeSessionKey, settings.activeSessionKey);
    }
  }
}

export function clearSettings(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(KEYS.gatewayUrl);
  localStorage.removeItem(KEYS.authToken);
  localStorage.removeItem(KEYS.activeSessionKey);
}

export function hasSettings(): boolean {
  if (!isBrowser()) return false;
  const settings = getSettings();
  return settings.gatewayUrl !== DEFAULT_GATEWAY_URL || !!settings.authToken;
}

export function hasGatewayConfigured(): boolean {
  const settings = getSettings();
  return !!settings.gatewayUrl;
}

// ============================================================
// Dashboard Preferences — localStorage persistence
// ============================================================

import type { DashboardPreferences } from "@/types/settings";
import { DEFAULT_PREFERENCES } from "@/types/settings";

const STORAGE_KEY = "hl_dashboard_preferences";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getPreferences(): DashboardPreferences {
  if (!isBrowser()) return DEFAULT_PREFERENCES;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(
  prefs: Partial<DashboardPreferences>
): DashboardPreferences {
  if (!isBrowser()) return DEFAULT_PREFERENCES;

  const current = getPreferences();
  const updated = { ...current, ...prefs };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function resetPreferences(): DashboardPreferences {
  if (!isBrowser()) return DEFAULT_PREFERENCES;
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_PREFERENCES;
}

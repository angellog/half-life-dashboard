"use client";

import { useState, useEffect } from "react";
import { getPreferences, savePreferences } from "@/lib/settings-store";
import { DashboardPreferences } from "@/types/settings";

export function useDashboardMode() {
  const [mode, setMode] = useState<"business" | "personal">("business");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const prefs = getPreferences();
    setMode(prefs.dashboardMode || "business");
    setIsLoaded(true);
    
    // Listen for storage changes in other tabs
    const handleStorage = () => {
      const updatedPrefs = getPreferences();
      setMode(updatedPrefs.dashboardMode || "business");
    };
    
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleMode = (newMode: "business" | "personal") => {
    setMode(newMode);
    savePreferences({ dashboardMode: newMode });
    // Trigger storage event for same-tab listeners
    window.dispatchEvent(new Event("storage"));
  };

  return { mode, toggleMode, isLoaded };
}

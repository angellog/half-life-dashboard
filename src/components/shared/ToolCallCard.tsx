"use client";

import { useState } from "react";
import type { ToolCallInfo } from "@/types/openclaw";
import {
  Terminal,
  Globe,
  FileText,
  Search,
  Code,
  ChevronDown,
  ChevronRight,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TOOL_ICONS: Record<string, typeof Terminal> = {
  terminal: Terminal,
  bash: Terminal,
  shell: Terminal,
  browser: Globe,
  web_search: Search,
  web_extract: Globe,
  read_file: FileText,
  write_file: FileText,
  patch: FileText,
  search_files: Search,
  execute_code: Code,
};

function getToolIcon(name: string) {
  const normalized = name.toLowerCase().replace(/[^a-z_]/g, "");
  for (const [key, Icon] of Object.entries(TOOL_ICONS)) {
    if (normalized.includes(key)) return Icon;
  }
  return Terminal;
}

function formatElapsed(startedAt: number, completedAt?: number): string {
  const end = completedAt || Date.now();
  const ms = end - startedAt;
  if (ms < 1000) return `${ms}ms`;
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

export function ToolCallCard({ tool }: { tool: ToolCallInfo }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = getToolIcon(tool.name);

  const statusIcon =
    tool.status === "running" ? (
      <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
    ) : tool.status === "completed" ? (
      <Check className="h-3.5 w-3.5 text-green-400" />
    ) : (
      <X className="h-3.5 w-3.5 text-red-400" />
    );

  const hasResult = !!tool.result;

  return (
    <div
      className={cn(
        "rounded-lg border text-xs transition-colors",
        tool.status === "running"
          ? "border-blue-500/30 bg-blue-500/5"
          : tool.status === "error"
            ? "border-red-500/30 bg-red-500/5"
            : "border-border bg-accent/50"
      )}
    >
      <button
        onClick={() => hasResult && setExpanded(!expanded)}
        className={cn(
          "flex w-full items-center gap-2 px-3 py-2",
          hasResult && "cursor-pointer hover:bg-accent/80"
        )}
      >
        <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="font-mono font-medium truncate">{tool.name}</span>
        <span className="text-muted-foreground ml-auto shrink-0">
          {formatElapsed(tool.startedAt, tool.completedAt)}
        </span>
        {statusIcon}
        {hasResult && (
          expanded ? (
            <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
          )
        )}
      </button>

      {expanded && tool.result && (
        <div className="border-t border-border px-3 py-2">
          <pre className="text-[11px] text-muted-foreground whitespace-pre-wrap break-all max-h-32 overflow-y-auto leading-relaxed">
            {tool.result.slice(0, 1000)}
            {tool.result.length > 1000 && "\n…truncated"}
          </pre>
        </div>
      )}
    </div>
  );
}

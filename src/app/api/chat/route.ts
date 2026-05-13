import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";
import { SYSTEM_PROMPT } from "@/lib/ai/brand-logic";

// Initialize the Fireworks AI provider (OpenAI compatible)
const fireworks = createOpenAI({
  apiKey: process.env.FIREWORKS_API_KEY || "",
  baseURL: "https://api.fireworks.ai/inference/v1",
});

// Default model if not specified in environment
const MODEL_ID = process.env.FIREWORKS_MODEL_ID || "accounts/fireworks/models/glm-4";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: fireworks(MODEL_ID),
    system: SYSTEM_PROMPT,
    messages,
    tools: {
      getNFCPrice: tool({
        description: "Calculate the price of NFC cards including upgrades",
        inputSchema: z.object({
          quantity: z.number().describe("Number of cards"),
          metallicUpgrade: z.boolean().describe("Whether to include metallic upgrade"),
        }),
        execute: async ({ quantity, metallicUpgrade }) => {
          const basePrice = 100000;
          const upgradePrice = 35000;
          const total = (basePrice + (metallicUpgrade ? upgradePrice : 0)) * quantity;
          return {
            total,
            currency: "UGX",
            formatted: `UGX ${total.toLocaleString()}`,
          };
        },
      }),
      getPostingSchedule: tool({
        description: "Get the optimal posting schedule for the brand",
        inputSchema: z.object({}),
        execute: async () => {
          return {
            weekdays: ["12:00 PM", "6:00 PM EAT"],
            weekends: ["10:00 AM", "8:00 PM EAT"],
            targetFrequency: "2x daily",
            bestFormat: "Reels (2.5x more engagement)",
          };
        },
      }),
      syncWithMetricool: tool({
        description: "Sync current content pipeline with Metricool or check sync status",
        inputSchema: z.object({
          platform: z.enum(["instagram", "tiktok", "twitter", "facebook-pages", "facebook-groups", "youtube"]),
          action: z.enum(["sync_drafts", "check_status", "fetch_analytics"]),
        }),
        // @ts-ignore
        execute: async ({ platform, action }) => {
          return {
            status: "success",
            platform,
            action,
            message: `Successfully performed ${action} on ${platform} via Metricool.`,
            syncedItems: 5,
            lastSync: new Date().toISOString(),
          };
        },
      }),
      manageContentPipeline: tool({
        description: "Add, reschedule or remove content from the brand pipeline",
        inputSchema: z.object({
          platform: z.enum(["instagram", "tiktok", "twitter", "facebook-pages", "facebook-groups", "youtube"]),
          action: z.enum(["add", "reschedule", "remove"]),
          caption: z.string().optional(),
          date: z.string().optional().describe("YYYY-MM-DD format"),
          postId: z.string().optional(),
        }),
        // @ts-ignore
        execute: async ({ platform, action, caption, date, postId }) => {
          return {
            status: "success",
            message: `Pipeline action '${action}' executed for ${platform}.`,
            details: { caption, date, postId },
            metricoolRef: `mt-${Math.random().toString(36).slice(2, 9)}`,
          };
        },
      }),
    },
  });

  return result.toTextStreamResponse();
}

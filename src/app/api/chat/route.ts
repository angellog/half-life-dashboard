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
    },
  });

  return result.toTextStreamResponse();
}

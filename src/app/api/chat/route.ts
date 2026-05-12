import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";
import { SYSTEM_PROMPT } from "@/lib/ai/brand-logic";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o"),
    system: SYSTEM_PROMPT,
    messages,
    tools: {
      getNFCPrice: tool({
        description: "Calculate the price of NFC cards including upgrades",
        parameters: z.object({
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
            formatted: `UGX \${total.toLocaleString()}`,
          };
        },
      }),
      getPostingSchedule: tool({
        description: "Get the optimal posting schedule for the brand",
        parameters: z.object({}),
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

  return result.toDataStreamResponse();
}

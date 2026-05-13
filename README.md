# Half Life Dashboard ⚡️

The AI-powered command center for Sneakers & Fashion brands in East Africa. Built with Next.js 16, React 19, and Tailwind CSS v4.

## Features
- **Social Command Center**: Unified management for Instagram, TikTok, Twitter, YouTube, and Facebook.
- **Always-On AI**: Integrated GLM-4 strategist powered by Fireworks AI.
- **Dynamic Analytics**: Real-time performance tracking and audience growth insights.
- **Content Calendar**: Omni-channel scheduling and planning.
- **Business Tools**: NFC Smart Card store and WhatsApp Status Billboard management.

## Getting Started

1. **Install Dependencies**:
```bash
npm install
```

2. **Run Development Server**:
```bash
npm run dev
```

3. **AI Setup Wizard**:
```bash
npm run ai:setup
```

## Strategic Handover — Production Checklist

To ensure full functionality in a production environment (e.g., Vercel), the following environment variables **must** be configured:

1. **`AUTH_SECRET`**: A secure string for session encryption. Generate one using `openssl rand -base64 32`.
2. **`FIREWORKS_API_KEY`**: Your API key from [fireworks.ai](https://fireworks.ai) to power the "Always-On" AI brain.
3. **`FIREWORKS_MODEL_ID`**: (Optional) Set to your preferred model (e.g., `accounts/fireworks/models/glm-4`). Defaults to GLM-4.
4. **`NEXT_PUBLIC_AI_MODE`**: Set to `native` for integrated cloud AI or `gateway` for local OpenClaw connection.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19
- **Styling**: Tailwind CSS v4
- **AI**: Vercel AI SDK + Fireworks AI (GLM-4)
- **Auth**: Auth.js (NextAuth v5)
- **State**: Zustand

---
Built for the future of streetwear culture. 👟🇺🇬

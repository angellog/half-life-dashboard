# OpenClaw Gateway — Setup Guide for Half Life Dashboard

This guide walks you through installing and configuring the OpenClaw Gateway
so the Half Life Dashboard's AI Agent page connects to a real AI backend
with persistent memory.

## Prerequisites

- **Node.js 24** (recommended) or Node.js 22.16+
- **An API key** from a model provider (OpenAI, Anthropic, Google, etc.)

Check your Node version:
```bash
node --version
```

## Step 1: Install OpenClaw

```bash
# macOS / Linux
npm install -g openclaw@latest

# Run the onboarding wizard
openclaw onboard --install-daemon
```

The wizard will ask you to:
1. Choose a model provider (OpenAI, Anthropic, Google, etc.)
2. Enter your API key
3. Configure the Gateway

## Step 2: Copy Workspace Files

Copy the SOUL.md and AGENTS.md files from this directory into your
OpenClaw workspace:

```bash
cp openclaw/SOUL.md ~/.openclaw/workspace/SOUL.md
cp openclaw/AGENTS.md ~/.openclaw/workspace/AGENTS.md
```

These files give the agent its identity as the Half Life brand strategist
and provide persistent business context for every conversation.

## Step 3: Configure the Gateway

Edit `~/.openclaw/openclaw.json` to set your model and auth:

```json
{
  "agent": {
    "model": "anthropic/claude-sonnet-4-20250514"
  },
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "YOUR_GATEWAY_TOKEN_HERE"
    }
  }
}
```

Generate a secure token:
```bash
openssl rand -hex 32
```

## Step 4: Start the Gateway

```bash
# Foreground (for testing)
openclaw gateway --port 18789 --verbose

# Or install as a system service (recommended for production)
openclaw gateway install
openclaw gateway start
```

Verify it's running:
```bash
openclaw gateway status
```

## Step 5: Connect the Dashboard

1. Open the Half Life Dashboard → AI Agent page
2. Click the **Settings** (gear) icon in the chat header
3. Enter your Gateway URL:
   - **Local dev**: `ws://127.0.0.1:18789`
   - **Same server**: `ws://127.0.0.1:18789`
   - **Remote (with TLS)**: `wss://your-domain.com/api/openclaw`
4. Enter your auth token (from Step 3)
5. Click **Connect**

## Step 6: Enable Vector Memory (Optional but Recommended)

For cross-session recall (the agent remembers facts from past conversations),
you need an embedding provider configured.

Add to `~/.openclaw/openclaw.json`:

```json
{
  "memory": {
    "enabled": true,
    "provider": "openai"
  }
}
```

This requires an OpenAI API key (for embeddings). The agent will then
autonomously save important business facts to vector memory and retrieve
them in future conversations.

## Step 7: Production Deployment (Self-Hosted Server)

When hosting the dashboard and Gateway on the same server:

```
┌─────────────────────────────────────────────┐
│  Your Server                                │
│                                             │
│  Next.js App (:3000)  ◄──►  OpenClaw (:18789)  │
│           │                                 │
│     Nginx/Caddy reverse proxy (:443)        │
└─────────────────────────────────────────────┘
```

### Nginx Configuration Example

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    # SSL certs (use certbot/Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Dashboard (Next.js)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # OpenClaw Gateway (WebSocket)
    location /api/openclaw {
        proxy_pass http://127.0.0.1:18789;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }
}
```

Set the environment variable at deploy time:
```bash
NEXT_PUBLIC_OPENCLAW_GATEWAY_URL=wss://your-domain.com/api/openclaw
```

### Install Gateway as System Service

```bash
# Linux (systemd)
sudo openclaw gateway install --system
sudo openclaw gateway start --system

# macOS (launchd)
openclaw gateway install
openclaw gateway start
```

## Troubleshooting

### "Cannot reach Gateway"
- Is the Gateway running? Check: `openclaw gateway status`
- Is the port correct? Default is 18789
- Is a firewall blocking the port?

### "Connection rejected" / "pairing required"
- On localhost, connections are auto-approved
- On remote servers, you need to approve the browser device:
  ```bash
  openclaw devices list
  openclaw devices approve <requestId>
  ```

### "Auth token mismatch"
- Check that the token in the dashboard matches `gateway.auth.token` in openclaw.json
- Regenerate: `openssl rand -hex 32` and update both places

### Run diagnostics
```bash
openclaw doctor
```

## Updating OpenClaw

```bash
openclaw update
# or
npm update -g openclaw@latest
```

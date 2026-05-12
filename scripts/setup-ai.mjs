import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const HOME = os.homedir();
const OPENCLAW_DIR = path.join(HOME, ".openclaw");
const WORKSPACE_DIR = path.join(OPENCLAW_DIR, "workspace");
const PROJECT_ROOT = process.cwd();

async function run() {
  console.clear();
  console.log("==========================================");
  console.log("   🚀 Half Life AI Agent Setup Wizard   ");
  console.log("==========================================");
  console.log("\nThis will help you set up your OpenClaw AI agent.");
  console.log("Even if you've never used a terminal before, just follow the prompts!\n");

  // 1. Check for OpenClaw installation
  try {
    execSync("openclaw --version", { stdio: "ignore" });
    console.log("✅ OpenClaw is already installed.");
  } catch (e) {
    console.log("❌ OpenClaw is not installed yet.");
    console.log("Installing OpenClaw globally (this may take a moment)...");
    try {
      execSync("npm install -g openclaw@latest", { stdio: "inherit" });
      console.log("✅ OpenClaw installed successfully.");
    } catch (err) {
      console.log("\n⚠️ Global installation failed. Let's try another way.");
      console.log("Please run this command manually if this script fails: npm install -g openclaw@latest");
    }
  }

  // 2. Create workspace directories
  if (!fs.existsSync(WORKSPACE_DIR)) {
    console.log(`\n📂 Creating your AI workspace at ${WORKSPACE_DIR}...`);
    fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
  }

  // 3. Copy Brand Logic
  console.log("\n🧠 Injecting Half Life brand intelligence...");
  try {
    const soulPath = path.join(PROJECT_ROOT, "openclaw", "SOUL.md");
    const agentsPath = path.join(PROJECT_ROOT, "openclaw", "AGENTS.md");
    
    fs.copyFileSync(soulPath, path.join(WORKSPACE_DIR, "SOUL.md"));
    fs.copyFileSync(agentsPath, path.join(WORKSPACE_DIR, "AGENTS.md"));
    console.log("✅ Brand identity (SOUL.md) and Business context (AGENTS.md) ready.");
  } catch (err) {
    console.log("❌ Error copying brand files. Make sure you are in the project root.");
    process.exit(1);
  }

  // 4. Token Generation
  console.log("\n🔐 Generating your secure connection token...");
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  console.log(`Your Token: ${token}`);
  console.log("(Save this! You will need to paste it into the dashboard.)");

  // 5. Onboarding Prompt
  console.log("\n------------------------------------------");
  const ready = await question("Ready to connect your AI API key? (Press Enter to continue)");
  
  console.log("\nNow we will run the OpenClaw onboarding wizard.");
  console.log("1. Select your provider (e.g., OpenAI or Anthropic)");
  console.log("2. Paste your API Key when asked\n");
  
  try {
    execSync("openclaw onboard", { stdio: "inherit" });
  } catch (e) {
    console.log("⚠️ Onboarding was skipped or failed. You can run 'openclaw onboard' later.");
  }

  // 6. Update openclaw.json with token
  const configPath = path.join(OPENCLAW_DIR, "openclaw.json");
  let config = {};
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    } catch (e) {}
  }
  
  config.gateway = config.gateway || {};
  config.gateway.auth = { mode: "token", token: token };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log("\n✅ Configuration saved to ~/.openclaw/openclaw.json");

  // 7. Final Instructions
  console.log("\n==========================================");
  console.log("🎉 SETUP COMPLETE!");
  console.log("==========================================");
  console.log("\nTo start your AI Agent, run this command:");
  console.log("   \x1b[32mopenclaw gateway start\x1b[0m");
  console.log("\nThen, go to the Half Life Dashboard AI Page:");
  console.log("1. Click the Gear icon ⚙️");
  console.log(`2. Paste your token: \x1b[33m${token}\x1b[0m`);
  console.log("3. Click Connect!");
  console.log("\nPress any key to finish.");
  
  await question("");
  process.exit(0);
}

run();

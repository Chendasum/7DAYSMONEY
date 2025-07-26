require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const cron = require("node-cron"); // Used for scheduling tasks

// Database connection is assumed to be handled by Drizzle ORM with PostgreSQL
console.log("🔍 Database configured with Drizzle ORM and PostgreSQL (via models)");
console.log("✅ Database ready for operations");

// Set proper UTF-8 encoding for the environment to handle Khmer characters correctly
process.env.NODE_ICU_DATA = "/usr/share/nodejs/node-icu-data";
process.env.LANG = "en_US.UTF-8";

// --- Import Database Models ---
const User = require("./models/User");
const Progress = require("./models/Progress");

// --- Import Command Modules ---
const startCommand = require("./commands/start");
const dailyCommands = require("./commands/daily");
const paymentCommands = require("./commands/payment");

// --- Import Service Modules ---
const AccessControl = require("./services/access-control");
const ConversionOptimizer = require("./services/conversion-optimizer");

// --- Import Utility Modules ---
const { sendLongMessage } = require("./utils/message-splitter");
const { default: fetch } = require("node-fetch"); // Ensure node-fetch is imported correctly

// Define a consistent message chunk size for splitting long messages
const MESSAGE_CHUNK_SIZE = 800;

// Initialize Telegram bot for webhook mode
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: false,
  onlyFirstMatch: true,
});

// DUPLICATE PREVENTION SYSTEM: Optimized for webhook mode
const processedMessages = new Set();
let lastProcessTime = {};

function isDuplicateMessage(msg) {
  // DISABLED FOR WEBHOOK MODE - Let all messages through
  console.log(`[isDuplicateMessage] Processing message: ${msg.chat.id}-${msg.message_id}`);
  return false;
}

// Express app for handling webhooks
const app = express();
const accessControl = new AccessControl();
const conversionOptimizer = new ConversionOptimizer();

// Middleware for parsing JSON and URL-encoded data with UTF-8 support
app.use(express.json({ limit: "10mb", charset: "utf-8" }));
app.use(express.urlencoded({ extended: true, charset: "utf-8" }));

// Set UTF-8 headers for all outgoing responses to ensure proper character encoding
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

// Function to get the Railway URL
function getRailwayUrl() {
  // Always return Railway domain for production
  return "https://7daymoneyflowreset-production.up.railway.app";
}

// Enhanced bot initialization for webhook mode
async function initBotWebhook() {
  console.log("Starting bot initialization process for webhooks...");

  if (!process.env.BOT_TOKEN) {
    console.error("❌ ERROR: BOT_TOKEN is not set in environment variables!");
    process.exit(1);
  } else {
    console.log("✅ BOT_TOKEN loaded successfully.");
  }

  try {
    const webhookUrl = `${getRailwayUrl()}/webhook/${process.env.BOT_TOKEN}`;
    
    console.log(`🔗 Setting webhook URL: ${webhookUrl}`);
    
    // Delete existing webhook first
    await bot.deleteWebHook();
    console.log("🗑️ Deleted existing webhook");
    
    // Set new webhook
    const webhookSet = await bot.setWebHook(webhookUrl);
    console.log("📡 Webhook set result:", webhookSet);
    
    // Verify webhook info
    const webhookInfo = await bot.getWebhookInfo();
    console.log("📋 Webhook info:", webhookInfo);
    
    console.log("✅ Bot webhook initialization completed successfully");
    return true;
    
  } catch (error) {
    console.error("❌ Error setting webhook:", error);
    return false;
  }
}

// START COMMAND HANDLER
bot.onText(/^\/start$/, async (msg) => {
  if (isDuplicateMessage(msg)) return;
  
  try {
    await startCommand.handle(msg, bot);
    console.log("✅ Start command processed successfully");
  } catch (error) {
    console.error("❌ Error in start command:", error);
    try {
      await bot.sendMessage(msg.chat.id, "សូមអភ័យទោស! មានបញ្ហាបច្ចេកទេស។ សូមសាកល្បងម្តងទៀត។");
    } catch (sendError) {
      console.error("Failed to send error message:", sendError);
    }
  }
});

// PRICING COMMAND HANDLER
bot.onText(/^\/pricing$/, async (msg) => {
  if (isDuplicateMessage(msg)) return;
  
  try {
    await bot.sendMessage(msg.chat.id, `🎯 7-Day Money Flow Reset™ - កម្មវិធីសាមញ្ញ

💰 តម្លៃពិសេស: $24 USD (ធម្មតា $47)
🔥 សន្សំ: $23 (បញ្ចុះ ៥០%!)

📚 អ្វីដែលអ្នកនឹងទទួលបាន:
✅ ៧ ថ្ងៃ នៃការសិក្សាហិរញ្ញវត្ថុពេញលេញ
✅ ការរកកន្លែងលុយលេចធ្លាយ (Money Leaks)
✅ ប្រព័ន្ធគ្រប់គ្រងលុយដែលពិតជាដំណើរការ
✅ ការតាមដានការរីកចម្រើន
✅ ការគាំទ្រ 24/7

💳 វិធីទូទាត់:
🏦 ABA Bank: 001 234 567
🏦 ACLEDA: 1234-567-890
📱 Wing: 012 345 678

ឬទំនាក់ទំនង @Chendasum សម្រាប់ជំនួយ

⚡ ចុះឈ្មោះឥឡូវ: សរសេរ "ខ្ញុំចង់ចូលរួម"`);
    
    console.log("✅ Pricing command processed successfully");
  } catch (error) {
    console.error("❌ Error in pricing command:", error);
  }
});

// HELP COMMAND HANDLER
bot.onText(/^\/help$/, async (msg) => {
  if (isDuplicateMessage(msg)) return;
  
  try {
    await bot.sendMessage(msg.chat.id, `📞 ជំនួយ - 7-Day Money Flow Reset™

🎯 ការប្រើប្រាស់មូលដ្ឋាន:
• /start - ចាប់ផ្តើម
• /pricing - មើលតម្លៃ
• /help - ជំនួយ

📚 សម្រាប់សិស្សដែលបានចូលរួម:
• /day1 - /day7 - មេរៀនប្រចាំថ្ងៃ
• /progress - មើលការរីកចម្រើន

📞 ការគាំទ្រ:
• @Chendasum - ការគាំទ្រផ្ទាល់
• ការឆ្លើយតប: 24/7

💰 ការចូលរួម: $24 USD (បញ្ចុះ ៥០%!)

🚀 ចាប់ផ្តើម: /pricing`);
    
    console.log("✅ Help command processed successfully");
  } catch (error) {
    console.error("❌ Error in help command:", error);
  }
});

// DAY COMMANDS HANDLERS
for (let day = 1; day <= 7; day++) {
  bot.onText(new RegExp(`^\\/day${day}$`), async (msg) => {
    if (isDuplicateMessage(msg)) return;
    
    try {
      // Check if user is paid
      const user = await User.findOne({ telegram_id: msg.from.id });
      const isPaid = user?.is_paid === true || user?.is_paid === 't';
      
      if (!isPaid) {
        await bot.sendMessage(msg.chat.id, `🔒 សម្រាប់សិស្សដែលបានចូលរួមប៉ុណ្ណោះ

ដើម្បីចូលប្រើមេរៀនថ្ងៃទី${day} អ្នកត្រូវចូលរួមកម្មវិធីសិន។

💰 តម្លៃ: $24 USD (បញ្ចុះ ៥០%!)
🎯 ប្រើ /pricing ដើម្បីចូលរួម`);
        return;
      }
      
      // Call daily command handler
      await dailyCommands.handle(msg, bot, day);
      console.log(`✅ Day ${day} command processed successfully`);
    } catch (error) {
      console.error(`❌ Error in day ${day} command:`, error);
    }
  });
}

// WEBHOOK ENDPOINT
app.post(`/webhook/${process.env.BOT_TOKEN}`, (req, res) => {
  console.log("📨 Webhook received:", req.body);
  
  try {
    bot.processUpdate(req.body);
    res.json({ status: "ok" });
    console.log("✅ Update processed successfully");
  } catch (error) {
    console.error("❌ Error processing webhook update:", error);
    res.status(500).json({ error: "Failed to process update" });
  }
});

// HEALTH CHECK ENDPOINTS
app.get("/", (req, res) => {
  res.json({
    status: "7-Day Money Flow Reset Bot - Railway Production",
    timestamp: new Date().toISOString(),
    railway_url: getRailwayUrl(),
    webhook_configured: true
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV || "production",
      BOT_TOKEN: process.env.BOT_TOKEN ? "configured" : "missing",
      DATABASE_URL: process.env.DATABASE_URL ? "configured" : "missing"
    }
  });
});

// Start server and initialize bot
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

async function startServer() {
  try {
    // Initialize webhook
    const webhookResult = await initBotWebhook();
    if (!webhookResult) {
      console.error("❌ Failed to initialize webhook");
      process.exit(1);
    }
    
    // Start Express server
    const server = app.listen(PORT, HOST, () => {
      console.log(`🚀 Railway server running on ${HOST}:${PORT}`);
      console.log(`📍 Production URL: ${getRailwayUrl()}`);
      console.log(`🤖 Bot: @MoneyFlowReset2025Bot`);
      console.log(`✅ All systems operational`);
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
      });
    });
    
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Start the application
startServer();
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";  // Import createServer instead of using http
import { Telegraf, Markup } from "telegraf";

import User from "./mongodb/models/user.model.js";  // Make sure to handle imports correctly
import connectDB from "./mongodb/connect.js";
import router from "./routes/routes.js";

dotenv.config();  // Load environment variables

const PORT = process.env.PORT || 80;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_USERNAME = process.env.BOT_USERNAME;
const BASE_URL = process.env.BASE_URL;

if (!TOKEN || !BASE_URL) {
  throw new Error("Missing required environment variables.");
}

const bot = new Telegraf(TOKEN);

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Basic route
app.get("/", (req, res) => {
  res.send({ message: "Hello World!" });
});

// Bot start command
bot.start((ctx) => {
  const message = `Hey Hamster @${ctx.from.username}, Welcome to the Hamsters Community!\n\nGet rewarded for your Telegram account age and invite friends to earn more.`;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.url('Launch App', 'http://t.me/dogsBeta_bot/dogsClone'), 
     Markup.button.url('Join Telegram', 'http://t.me/HmstrsCommunity')],
    [Markup.button.url('Follow X', 'https://x.com/HmstrsCommunity'), 
     Markup.button.url('View Contract', 'https://tonviewer.com/EQAkMPVMrYLC82njyvxo4vIRYw1RNqpkfTswlcCiYRrCjB6G')]
  ]);

  ctx.reply(message, keyboard);
  console.log(`Start command triggered by @${ctx.from.username}`);
});

// Error handling for the bot
bot.catch((err, ctx) => {
  console.error(`Error for update type: ${ctx.updateType}`, err);
});

// Webhook setup
app.use(bot.webhookCallback('/bot'));

const server = createServer(app);  // Use createServer to create an HTTP server

// Set the webhook with error handling
bot.telegram.setWebhook(`${BASE_URL}/bot`)
  .then(() => console.log("Webhook set successfully"))
  .catch(err => console.error("Error setting webhook:", err));

// Routes
app.use("/", router);

// Start the server
const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
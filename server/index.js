import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { createServer } from 'http';  // Import createServer instead of using http
import { Telegraf, Markup } from 'telegraf';

import User from './mongodb/models/user.model.js';

import connectDB from "./mongodb/connect.js";
import router from "./routes/routes.js";

dotenv.config();

const PORT = process.env.PORT || 80;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_USERNAME = process.env.BOT_USERNAME;
const BASE_URL = process.env.BASE_URL;

const bot = new Telegraf(TOKEN);

const app = express();
app.use(cors());
const server = createServer(app);  // Use createServer to create an HTTP server

app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
    res.send({ message: "Hello World!" });
});

app.use("/", router);

// Start command
bot.start((ctx) => {
  const message = `Hey Hamster @${ctx.from.username}, Welcome to the Hamsters Community!\n\nGet rewarded for your Telegram account age and invite friends to earn more.`;
  console.log('chat:', ctx.chat, 'from:', ctx.from, 'message', ctx.message);
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.url('Launch App', 'http://t.me/dogsBeta_bot/dogsClone'), Markup.button.url('Join Telegram', 'http://t.me/HmstrsCommunity')],
    [Markup.button.url('Follow X', 'https://x.com/HmstrsCommunity'), Markup.button.url('View Contract', 'https://tonviewer.com/EQAkMPVMrYLC82njyvxo4vIRYw1RNqpkfTswlcCiYRrCjB6G')]
  ]);

  ctx.reply(message, keyboard);
});

// Error handling
bot.catch((err, ctx) => {
  console.log(`Update ${ctx.updateType} caused error ${err}`);
});

// Express route to handle webhook
app.use(bot.webhookCallback('/bot'));

bot.telegram.setWebhook(`${BASE_URL}/bot`);

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);

    server.listen(PORT, () =>
      console.log("Server started on port http://localhost:8080"),
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
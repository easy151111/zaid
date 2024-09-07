import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { createServer } from 'https';  // Import createServer instead of using http
import fs from 'fs';
//import path from 'path';
import { Telegraf, Markup } from 'telegraf';
//import axios from 'axios';

import connectDB from "./mongodb/connect.js";
import router from "./routes/routes.js";

dotenv.config();

const sslOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/RATS.org/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/RATS.org/fullchain.pem'),
};

const PORT = process.env.PORT || 80;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
//const BOT_USERNAME = process.env.BOT_USERNAME;
const BASE_URL = process.env.BASE_URL;

const bot = new Telegraf(TOKEN);

const app = express();
app.use(cors());

const server = createServer(sslOptions, app);  // Use createServer to create an HTTP server

app.use(express.json({ limit: "50mb" }));

app.use(express.static("/home/ubuntu/RATS-bot/client/dist"));

app.use("/", router);

app.get("/", (req, res) => {
    res.sendFile('/home/ubuntu/RATS-bot/client/dist/index.html');
});

// Start command
bot.start((ctx) => {
  const message = `Hi @${ctx.from.first_name}, Welcome to the Rats Kingdom!

  ✅ Earn $RATS based on the age of your Telegram account. 

  ✅ Complete tasks and invite friends to maximize your earnings.`;
 // console.log('chat:', ctx.chat, 'from:', ctx.from, 'message', ctx.message);
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.url('Launch App', 'http://t.me/RatsKingdom_Bot/join')],
    [Markup.button.url('Join Telegram', 'http://t.me/The_RatsKingdom')],
    [Markup.button.url('Follow X', 'https://x.com/The_RatsKingdom')],
    [Markup.button.url('Subscribe Youtube', 'https://youtube.com/@the_ratskingdom?feature=shared')],
  ]);

  ctx.reply(message, keyboard);
});

// Message handler for non-command messages
bot.on('text', (ctx) => {
  const message = ctx.message.text;

  const reply = `Hi @${ctx.from.first_name}, Welcome to the Rats Kingdom!

  ✅ Earn $RATS based on the age of your Telegram account. 

  ✅ Complete tasks and invite friends to maximize your earnings.`;
 // console.log('chat:', ctx.chat, 'from:', ctx.from, 'message', ctx.message);
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.url('Launch App', 'http://t.me/RatsKingdom_Bot/join')],
    [Markup.button.url('Join Telegram', 'http://t.me/The_RatsKingdom')],
    [Markup.button.url('Follow X', 'https://x.com/The_RatsKingdom')],
    [Markup.button.url('Subscribe Youtube', 'https://youtube.com/@the_ratskingdom?feature=shared')],
  ]);

  if (!message.startsWith('/')) {
    ctx.reply(reply, keyboard);
  }
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
      console.log(`Server started on port http://localhost:${PORT}`),
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { createServer } from 'https';  // Import createServer instead of using http
import { Telegraf, Markup } from 'telegraf';

import User from './mongodb/models/user.model.js';

import connectDB from "./mongodb/connect.js";
import router from "./routes/routes.js";
import fs from 'fs';

dotenv.config();

const PORT = process.env.PORT || 443;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
//const BOT_USERNAME = process.env.BOT_USERNAME;
const BASE_URL = process.env.BASE_URL;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
const ADMIN_ID = process.env.ADMIN_ID


const sslOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/app.ratskingdom.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/app.ratskingdom.com/fullchain.pem'),
};

const bot = new Telegraf(TOKEN);

const app = express();
const corsOptions = {
  origin: 'https://app.ratskingdom.com', // Frontend subdomain
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
const server = createServer(sslOptions, app);  // Use createServer to create an HTTP server

app.use(express.json({ limit: "50mb" }));

app.use(express.static("/home/ubuntu/ratskingdom-bot/client/dist"));

app.use("/", router);


app.get("*", (req, res) => {
  res.sendFile('/home/ubuntu/ratskingdom-bot/client/dist/index.html');
});

// const sendMessageToAllUsers = async (message) => {
//   try {
//     // Fetch only the `id` field of all users
//     const users = await User.find({}).select('id'); 

//     for (const user of users) {
//       try {
//         await bot.telegram.sendMessage(user.id, message);
//       } catch (err) {
//         console.error(`Failed to send message to ${user.id}:`, err);
//       }
//     }
//     console.log(`Message sent to ${users.length} users.`);
//   } catch (err) {
//     console.error('Failed to send messages to all users:', err);
//   }
// };

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

//const adminBroadcastState = {};


// Broadcast command
// bot.command('broadcast', async (ctx) => {
//   const userId = ctx.from.id.toString();
  
//   if (userId === ADMIN_ID) { // Replace with the actual admin ID
//     adminBroadcastState[userId] = { awaitingMessage: true };
//     ctx.reply('Please reply with the message you want to broadcast.');
//   } else {
//     ctx.reply('You are not authorized to use this command.');
//   }
// });

// Handler for reply after /broadcast command
// bot.on('message', async (ctx) => {
//   const userId = ctx.from.id.toString();
//   if (adminBroadcastState[userId]?.awaitingMessage) {
//     delete adminBroadcastState[userId];

//     if (ctx.message.text) {
//       const message = ctx.message.text;
//       await sendMessageToAllUsers(message);
//       ctx.reply('Broadcast message sent!');
//     } else {
//       ctx.reply('Invalid content type. Please send text.');
//     }
//   }
// });



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
app.use(bot.webhookCallback(`/${WEBHOOK_SECRET}`));

bot.telegram.setWebhook(`${BASE_URL}/${WEBHOOK_SECRET}`);

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);

    server.listen(PORT, () =>
      console.log(`Server started on port ${BASE_URL}:${PORT}`),
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
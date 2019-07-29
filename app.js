const Discord = require("discord.js");
const bot = new Discord.Client();
const twitter = new (require('./lib/twitter'))();
require('dotenv').config();

bot.on('message', (msg) => {
  if (msg.channel.id !== process.env.CHANNEL_ID) return;
  if (msg.attachments.size === 0) return;

  msg.attachments.forEach((attachment) => {
    if (!/\.png|\.jpg/i.test(attachment.filename)) return;
    twitter.addImage(attachment.url, msg.id, msg.author);
  });
});

bot.on('messageDelete', msg => {
  if (msg.channel.id !== process.env.CHANNEL_ID) return;
  twitter.deleteImage(msg.id, msg.author);
});

bot.login(process.env.BOT_TOKEN).then(() => console.log(`${bot.user.tag} is running`));
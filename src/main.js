const TelegramBot = require('node-telegram-bot-api')

// TODO: через process
// const token = `${process.env.TELEGRAM_TOKEN}`
const token = "930868978:AAHSZs9SwVWOFXlGWZJKj82ROsvSkL303tk"
const bot = new TelegramBot(token, {polling: true})

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Received your message');
});
import 'dotenv/config'
import './database/queries/database'
import {findUserById, insertId} from './database/queries/user'

const TelegramBot = require('node-telegram-bot-api')

const token = `${process.env.TELEGRAM_TOKEN}`
const bot = new TelegramBot(token, {polling: true})

bot.on('message', (msg) => {
    const chatId = msg.chat.id

    bot.sendMessage(chatId, 'Received your message')
    //bot.sendMessage(chatId, findUserById(1))
    findUserById(1).then(data => console.log(data))
});

bot.onText(/\/echo/, (msg, match) => {
    const chatId = msg.chat.id;
    insertId(2)
    bot.sendMessage(chatId, 'Inserted');
});
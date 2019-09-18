import 'dotenv/config'
import './database/queries/database'
import {findUserById, addNewUser, getRandomTask} from './database/queries/user'

const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true})

/**
 * Добавляет id нового пользователя в базу данных
 *
 * @param ({chat: {id}}) message
 */

bot.onText(/\/start/, ({chat: {id}}) => {
    addNewUser(id)
      .then(() => bot.sendMessage(id, 'Welcome to the club buddy!'))
})

bot.onText(/\/random/, ({chat: {id}}) => {
    getRandomTask()
      .then(task => bot.sendMessage(
        id,
        task.content,
        {parse_mode : 'Markdown'}
        ))
})
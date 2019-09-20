import {path} from 'ramda'
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

/**
 * Предлагает пользователю рандомную задачу
 *
 * @param ({chat: {id}}) message
 */

bot.onText(/\/random/, ({chat: {id}}) => {
    getRandomTask()
      .then(task => bot.sendMessage(
        id,
        task.content,
        {
            parse_mode : 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{text: path(['option1'], task), callback_data: 'option1'}],
                    [{text: path(['option2'], task), callback_data: 'option2'}],
                    [{text: path(['option3'], task), callback_data: 'option3'}],
                    [{text: path(['option4'], task), callback_data: 'option4'}],
                ],
            },
        }
        ))
})
import 'dotenv/config'

import './database/queries/database'
import {addNewUser, getRandomTask, findTaskById} from './database/queries/user'
import {provideKeyboard, resolveAnswer} from './helpers'

const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true})

/**
 * Добавляет id нового пользователя в базу данных
 */

bot.onText(/\/start/, ({chat: {id}}) => {
    addNewUser(id)
      .then(() => bot.sendMessage(id, 'Welcome to the club buddy!'))
})

/**
 * Предлагает пользователю рандомную задачу
 */

bot.onText(/\/random/, ({chat: {id}}) => {
    getRandomTask()
      .then(task => bot.sendMessage(
        id,
        task.content,
        {
            parse_mode : 'Markdown',
            reply_markup: {
                inline_keyboard: provideKeyboard(task),
            },
        }
        ))
})

/**
 * Обрабатывает ответы пользователя
 */

bot.on('callback_query', ({message: {chat, message_id}, data}) => {
  const [taskId, answerId] = data.split('_')
  findTaskById(taskId)
      .then(task => bot.editMessageText(
        resolveAnswer(task, answerId),
      {
        chat_id: chat.id,
        message_id: message_id,
        parse_mode : 'Markdown',
      }
    ))
})

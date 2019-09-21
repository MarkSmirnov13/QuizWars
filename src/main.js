import {path} from 'ramda'
import 'dotenv/config'
import './database/queries/database'
import {findUserById, addNewUser, getRandomTask, findTaskById} from './database/queries/user'

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
                    [{text: path(['option1'], task), callback_data: `${task.id}_1`}],
                    [{text: path(['option2'], task), callback_data: `${task.id}_2`}],
                    [{text: path(['option3'], task), callback_data: `${task.id}_3`}],
                    [{text: path(['option4'], task), callback_data: `${task.id}_4`}],
                ],
            },
        }
        ))
})

bot.on('callback_query', message => {
  const answer = message.data.split('_')
  findTaskById(answer[0])
    .then(task => bot.editMessageReplyMarkup(
      {
        inline_keyboard: [
          [{text: (task.correctOption == answer ? '✅' : '❌') + path(['option1'], task), callback_data: `${task.id}_1`}],
          [{text: (task.correctOption == answer ? '✅' : '❌') + path(['option2'], task), callback_data: `${task.id}_2`}],
          [{text: (task.correctOption == answer ? '✅' : '❌') + path(['option3'], task), callback_data: `${task.id}_3`}],
          [{text: (task.correctOption == answer ? '✅' : '❌') + path(['option4'], task), callback_data: `${task.id}_4`}],
        ],
      },
      {
        chat_id: message.message.chat.id,
        message_id: message.message.message_id,
      }
    ))
})
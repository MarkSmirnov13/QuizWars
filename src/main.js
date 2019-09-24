import 'dotenv/config'
import {ifElse, propEq} from 'ramda'

import './database/queries/database'
import {addNewUser} from './database/queries/user'
import {getRandomTask, findTaskById, addNewTaskToDb} from './database/queries/task'
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
        parse_mode: 'Markdown',
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
    .then(task => {
      bot.editMessageText(
        resolveAnswer(task, answerId),
        {
          chat_id: chat.id,
          message_id: message_id,
          parse_mode: 'Markdown',
        }
      )
    })
})

/**
 * Добавляет новую задачу в базу
 */

const opts = {
    reply_markup: JSON.stringify(
        {
            force_reply: true
        }
)};

const text = [
    'Отлично, напиши условие задачи!',
    'А теперь напиши первый вариант ответа',
    'Теперь напиши второй вариант ответа',
    'Теперь напиши третий вариант ответа',
    'Теперь напиши четвертый вариант ответа',
    'Теперь напиши НОМЕР правильного варианта ответа',
    'Теперь напиши сколько очков будет давать задача',
]

const addNewTask = (id, content = [], i = 0) => bot.sendMessage(id, text[i], opts)
    .then(({chat, message_id}) => {
        bot.onReplyToMessage(chat.id, message_id, message => {
            content.push(message.text)
            if (i < 6)
                addNewTask(id, content, ++i)
            else {
                addNewTaskToDb(content)
                bot.sendMessage(id, 'Молодец! Задача будет добавлена!')
            }
        });
    })

bot.onText(/\/add_new_task/, ({chat: {id}}) => addNewTask(id))
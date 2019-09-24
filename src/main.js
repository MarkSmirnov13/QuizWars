import 'dotenv/config'

import './database/queries/database'

import {addNewUser, getLeadersTable} from './database/queries/user'

import {getRandomTask, findTaskById} from './database/queries/task'
import {addNewTaskMethod, checkUserSolveTask, provideKeyboard, resolveAnswer} from './helpers'
import {replyOptions, keys, text} from './constants'

const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true})

/**
 * Добавляет id нового пользователя в базу данных
 */
bot.onText(/\/start/, ({chat: {id, username}}) => {
  addNewUser(id, username)
    .then(() => bot.sendMessage(id, 'Welcome to the club, buddy!'))
})

/**
 * Отправить задачу пользователю
 * @param id id чата
 * @param task Объект с заданием
 */
export const sendTask = (id, task) => {
  bot.sendMessage(
    id,
    task.content,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: provideKeyboard(task),
      },
    }
  )
}

/**
 * Предлагает пользователю рандомную задачу
 */
bot.onText(/\/random/, ({chat: {id}}) => {
  getRandomTask()
    .then(task => sendTask(id, task))
})

/**
 * Обрабатывает ответы пользователя
 */
bot.on('callback_query', ({message: {chat, message_id}, data}) => {
  const [taskId, answerId] = data.split('_')
  findTaskById(taskId)
    .then(task => {
      checkUserSolveTask(chat, task, answerId)
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
 * Добавляет новую задачу в базу и делаем рассылку новой задачи всем юзерам
 *
 * @param id id чата
 * @param content Объект с задачей
 * @param i Счетчик
 */

const addNewTask = (id, content = {}, i = 0) => bot.sendMessage(id, text[i], replyOptions)
  .then(({chat, message_id}) => {
    bot.onReplyToMessage(chat.id, message_id, message => {
      content[keys[i]] = message.text
      if (i < text.length - 1)
        addNewTask(id, content, ++i)
      else {
        bot.sendMessage(id, 'Молодец! Задача будет добавлена!')
        addNewTaskMethod(content, id).then(() => Promise.resolve())
      }
    })
  })

bot.onText(/\/add_new_task/, ({chat: {id}}) => addNewTask(id))

/**
 * Выводим таблицу лидеров
 */
bot.onText(/\/table/, msg => {
  let raw = 'Таблица лидеров:\n'
  getLeadersTable().then(p => console.log(p))
  getLeadersTable().then(p => p.forEach(p => raw.concat(`@${p.username} - ${p.score} баллов\n`)))
  console.log(raw)
  bot.sendMessage(msg.chat.id, raw)
})
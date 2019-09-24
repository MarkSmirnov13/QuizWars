import 'dotenv/config'
import {pipe, join, map} from 'ramda'

import './database/queries/database'

import {addNewUser, getLeadersTable, getMyPosition} from './database/queries/user'

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
    .then(() => bot.sendMessage(id, 'Welcome to the club, buddy!' +
      '/start - начать взаимодействие с ботом' +
      '/random - решить рандомную задачку' +
      '/add_new_task - добавить новую задачку' +
      '/table - посмотреть таблицу лидеров и свою позицию в рейтинге'))
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
        }
      )
    })
})

/**
 * Добавляет новую задачу в базу и делаем рассылку новой задачи всем юзерам
 *
 * @param id id чата
 * @param username username автора задачи
 * @param content Объект с задачей
 * @param i Счетчик
 */
const addNewTask = (id, username, content = {}, i = 0) => bot.sendMessage(id, text[i], replyOptions)
  .then(({chat, message_id}) => {
    bot.onReplyToMessage(chat.id, message_id, message => {
      content[keys[i]] = message.text
      if (i < text.length - 1)
        addNewTask(id, username, content, ++i)
      else {
        content[keys[0]] += `\n\nАвтор задачи: @${username}\n`
        bot.sendMessage(id, 'Молодец! Задача будет добавлена!')
        addNewTaskMethod(content, id).then(() => Promise.resolve())
      }
    })
  })

bot.onText(/\/add_new_task/, ({chat: {id, username}}) => addNewTask(id, username))

/**
 * Выводим таблицу лидеров и место пользователя в рейтинге
 */
bot.onText(/\/table/, async ({chat: {id}}) => {
  const header = 'Таблица лидеров:\n\n'
  const {total} = await getMyPosition(id)
  const footer = 'Ваше место в рейтинге: '

  getLeadersTable()
    .then(data => bot.sendMessage(id, header + pipe(
      map(({username, score}) => `@${username}: ${score}`),
      join('\n')
    )(data) + '\n\n' + footer + (total + 1)))
})
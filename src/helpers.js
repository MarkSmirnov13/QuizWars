import {
  addScore,
  addSolvedTask,
  addTaskCreated,
  checkUserTaskExist,
  updateSolveTask,
} from './database/queries/userTask'

import {getAllUsers} from './database/queries/user'
import {addNewTaskToDb} from './database/queries/task'
import {sendTask} from './main'

/**
 * возвращает массив кнопок по ответам в задаче
 *
 * @param task
 */
export const provideKeyboard = task => (
  [1, 2, 3, 4]
    .reduce((accum, el) => {
      task[`option${el}`] && accum.push(
        [{text: task[`option${el}`], callback_data: `${task.id}_${el}`}]
      )
      return accum
    }, new Array(0))
)

/**
 * возвращает массив кнопок по ответам в задаче
 *
 * @param content Условие задачи
 * @param correctOption Номер правильного ответа
 * @param task
 * @param answerId Номер ответа пользователя
 */
export const resolveAnswer = ({content, correctOption, ...task}, answerId) =>
  `${content}
  ${correctOption === answerId ? '✅ Верно! ' : '❌ Неверно! '}
  Правильный ответ: ${task[`option${correctOption}`]}`


/**
 * Проверяем решил ли пользователь задачу через таблицу связи User <-> Task
 * Если запись не найдена, то добавляем запись в таблицу связи с пометкой правильности решения
 * задачи и добавляем очки за решенную задачу (либо worth, либо 0)
 * Если запись найдена, например, если пользователь создал задачу, или решил ее ранее, то
 * обновляем запись в таблице связей и ставим правильный флаг isSolved, но только в том случае,
 * если задача до этого не была уже решена/не решена
 *
 * @param chat
 * @param task
 * @param answerId
 */
export const checkUserSolveTask = (chat, task, answerId) => {
  checkUserTaskExist(chat.id, task.id)
    .then(p => {
      if (p === undefined) {
        addSolvedTask(chat.id, task.id, answerId === task.correctOption ? 1 : 0)
        addScore(chat.id, answerId === task.correctOption ? task.worth : 0)
      } else {
        p.isSolved === null
          ? updateSolveTask(chat.id, task.id, answerId === task.correctOption ? 1 : 0)
          : null
      }
    })
}

/**
 * Добавляем новую задачу в БД, при этом проверяем, и так как записей в таблице связи
 * User <-> Task не было (логично - новая же задача), делаем эту запись с пометкой, кто её создал
 * и делаем общую рассылку всем пользователям
 *
 * @param task
 * @param id
 * @returns {Promise<T>}
 */
export const addNewTaskMethod = (task, id) => (
  addNewTaskToDb(task).then(p => {
    task.id = p.insertId
    addTaskCreated(id, task.id)
    getAllUsers().then(p => p.forEach(id => sendTask(id.telegramId, task)))
  })
)
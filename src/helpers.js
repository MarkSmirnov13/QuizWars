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
  `${content}\n${(correctOption === answerId) ?
    '✅ Верно! Правильный ответ: ' + task[`option${correctOption}`] :
    '❌ Неверно! Правильный ответ: ' + task[`option${correctOption}`]}`

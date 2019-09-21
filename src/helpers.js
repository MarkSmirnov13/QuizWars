export const taskToKeyboard = task => (
  [1, 2, 3, 4]
    .reduce((accum, el) => {
      task[`option${el}`] && accum.push(
        [{text: task[`option${el}`], callback_data: `${task.id}_${el}`}]
      )
      return accum
    }, new Array(0))
)

export const provideAnswer = ({content, correctOption, ...task}, answerId) =>
  `${content}\n${(correctOption === answerId) ?
    '✅ Верно! ' + task[`option${correctOption}`] :
    '❌ Неверно! Правильный ответ: ' + task[`option${correctOption}`]}`
import {query, sql} from '../utils'

export const findUserById = userId => query(
  sql`
    select
    id,
    telegramId,
    score
    from user
    where
    id = ${userId}
  `
).then(([p]) => p)

export const addNewUser = userTelegramId => query(
  sql`
    insert ignore into
    user (telegramId)
    values (${userTelegramId})
  `
)

export const getTotalTasks = () => query(
  sql`
    select
    count(id) as total
    from task
  `
).then(([p]) => p)

export const findTaskById = taskId => query(
  sql`
    select
    id,
    name,
    content,
    option1,
    option2,
    option3,
    option4,
    correctOption
    from task
    where
    id = ${taskId}
  `
).then(([p]) => p)

export const getRandomTask = () =>
  getTotalTasks()
    .then(({total}) => findTaskById(Math.floor(1 + Math.random() * total)))

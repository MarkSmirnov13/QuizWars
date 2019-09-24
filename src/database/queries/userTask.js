import {query, sql} from '../utils'

export const checkUserTaskExist = (userId, taskId) => query(
  sql`
    select
    id,
    userId,
    taskId,
    hasCreated, 
    isSolved
    from user_task
    where userId = (select id from user where telegramId = ${userId})
    and taskId = ${taskId} 
  `
).then(([p]) => p)

export const addSolvedTask = (userId, taskId, solved) => query(
  sql`
    insert ignore into
    user_task (userId, taskId, isSolved)
    values ((select id from user where telegramId = ${userId}), ${taskId}, ${solved})
  `
)

export const updateSolveTask = (userId, taskId, solved) => query(
  sql`
    update user_task
    set isSolved = ${solved}
    where userId = (select id from user where telegramId = ${userId})
    and taskId = ${taskId}
  `
)

export const addTaskCreated = (userId, taskId) => query(
  sql`
    insert ignore into
    user_task (userId, taskId, hasCreated)
    values ((select id from user where telegramId = ${userId}), ${taskId}, 1)
  `
)

export const updateTaskCreated = (userId, taskId) => query(
  sql`
    update user_task
    set hasCreated = 1
    where userId = (select id from user where telegramId = ${userId})
    and taskId = ${taskId}
  `
)

export const addScore = (userId, worth) =>  query(
  sql`
    update user as a
    set score = score + ${worth}
    where telegramId = ${userId} 
  `
)
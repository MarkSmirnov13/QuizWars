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

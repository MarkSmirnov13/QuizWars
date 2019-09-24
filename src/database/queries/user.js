import {query, sql} from '../utils'

export const findUserById = userId => query(
  sql`
    select
    id
    from user
    where
    telegramId = ${userId}
  `
).then(([p]) => p)

export const addNewUser = (userTelegramId, username) => query(
  sql`
    insert ignore into
    user (telegramId, username)
    values (${userTelegramId}, ${username})
  `
)

export const getAllUsers = () => query(
  sql`
    select 
    telegramId 
    from user 
  `
)

export const getLeadersTable = () => query(
  sql`
    select
    username,
    score
    from user
    order by score desc
    limit 5
  `
)
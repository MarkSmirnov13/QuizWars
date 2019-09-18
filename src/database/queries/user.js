import {query, sql} from '../utils'

export const findUserById = userId => query(
  sql`
    select
    id,
    telegramId
    from user
    where
    id = ${userId}
  `
).then(([data]) => data)

// export const insertId = id => (
//     connection.query(
//     'INSERT INTO `user`(`telegramId`) VALUES (?)', [id],
//     function (err, results, fields) {
//         console.log(fields)
//         console.log(results)
//     })
// )

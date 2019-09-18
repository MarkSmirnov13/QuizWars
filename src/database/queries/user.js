import connection from './database'

export const findUserById = userId => connection
    .promise()
    .query(
        'SELECT `telegramId` FROM `user` where `id` = ?', [userId]
    ).then(([[rows]]) => rows)

export const insertId = id => (
    connection.query(
    'INSERT INTO `user`(`telegramId`) VALUES (?)', [id],
    function (err, results, fields) {
        console.log(fields)
        console.log(results)
    })
)


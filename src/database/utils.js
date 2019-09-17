import retry from 'bluebird-retry'
import mysql from 'mysql2'
import yn from 'yn'

let conn
let opts

export function connect(options) {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(options)

    connection.connect(error => {
      if (error) {
        reject(error)
        return
      }

      conn = connection
      // Сохраняем параметры подключения для переподключения
      opts = options

      resolve(connection)
    })
  })
}

const checkConnectionAndReconnect = () => new Promise((resolve, reject) => {
  if (!conn) {
    console.error('MYSQL: CONNECTION IS NOT EXISTS')
    console.log('Reconnect with options:', opts)
    connect(opts).then(resolve, reject)
    return
  }

  resolve(true)
})

// При старте приложения может так получится что соединение не успеет создаться, а
// подключения уже пойдут, и чтобы не было ошибки пытаемся подключится пока соединение
// не создатся
const ensureConnectionExists = fn => (...args) => retry(checkConnectionAndReconnect)
  .then(() => fn(...args))
  .catch(e => {
    console.log('MYSQL: CANNOT CREATE CONNECTION')
    console.log(e)
    // Убиваем приложение, чтобы сервис на проде его поднял заново и все само заработало
    // process.exit(1)
  })

export const query = ensureConnectionExists(
  (sqlInputQuery, values) => new Promise((resolve, reject) => {
    const sqlQuery = sqlInputQuery.toSqlString
      ? sqlInputQuery.toSqlString()
      : sqlInputQuery
    const resultSql = mysql.format(sqlQuery, values)

    if (yn(process.env.DB_QUERY_DEGUB)) {
      console.log('Executing (mysql2):', resultSql)
    }

    // TODO: promisify?
    conn.query(resultSql, (error, results) => {
      if (error) {
        console.log('MYSQL: QUERY UNHANDLED ERROR')
        console.log(error)

        // TODO: обрабатывать по error.code === 'EPIPE'
        // Потому что конкретно у нас error.code === 'EPIPE', fatal === true
        // TODO: нужно ли обрабатывать (error.code === 'PROTOCOL_CONNECTION_LOST') {
        // Сбрасываем соединение, если произошла ошибка
        if (error.fatal) {
          conn = null
        }

        reject(error)
        return
      }

      resolve(results)
    })
  })
)
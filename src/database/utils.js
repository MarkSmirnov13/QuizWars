import mysql from 'mysql2'
import connection from './queries/database'

export const query =  (sqlInputQuery, values) =>
  new Promise((resolve, reject) => {
    const sqlQuery = sqlInputQuery['toSqlString']
      ? sqlInputQuery['toSqlString']()
      : sqlInputQuery
    const resultSql = mysql.format(sqlQuery, values)

    connection.query(resultSql, (error, results) => {
      resolve(results)
    })
  }
)

export const sql = (sqlParts, ...args) => {
  const resultSql = mysql.format(sqlParts.join('?'), args)

  return {
    toString() {
      return resultSql
    },
    toSqlString() {
      return resultSql
    },
  }
}

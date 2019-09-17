import {connect} from '.././utils'
import 'dotenv/config'

// Создаем подключение для "сырых запросов"
!(async function establishConnection() {
  await connect({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true,
  })
})()
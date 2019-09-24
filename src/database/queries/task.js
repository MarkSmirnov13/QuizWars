import {query, sql} from '../utils'

export const getTotalTasks = () => query(
  sql`
    select
    count(id) as total
    from task
  `
).then(([p]) => p)

export const getTasks = () => query(
  sql`
    select
    id
    from task
  `
)

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
  getTasks()
    .then(arr => findTaskById(arr[Math.floor(Math.random() * arr.length)].id))

export const addNewTaskToDb = content => query(
  sql`
    insert ignore into
    task (correctOption, content, option1, option2, option3, option4, worth)
    values (${content[5]}, ${content[0]}, ${content[1]}, ${content[2]}, ${content[3]}, ${content[4]}, ${content[6]})
  `
)
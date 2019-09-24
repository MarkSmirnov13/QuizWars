import {query, sql} from '../utils'

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
    correctOption,
    worth
    from task
    where
    id = ${taskId}
  `
).then(([p]) => p)

export const getRandomTask = () =>
  getTotalTasks()
    .then(({total}) => findTaskById(Math.floor(1 + Math.random() * total)))

export const addNewTaskToDb = content => query(
  sql`
    insert ignore into
    task (correctOption, content, option1, option2, option3, option4, worth)
    values (${content['correctOption']}, ${content['content']}, ${content['option1']}, ${content['option2']}, ${content['option3']}, ${content['option4']}, ${content['worth']})
  `
)
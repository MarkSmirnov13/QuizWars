export const replyOptions = {
    reply_markup: JSON.stringify(
        {
            force_reply: true
        }
    )}

export const text = [
    'Отлично, напиши условие задачи!',
    'А теперь напиши первый вариант ответа',
    'Теперь напиши второй вариант ответа',
    'Теперь напиши третий вариант ответа',
    'Теперь напиши четвертый вариант ответа',
    'Теперь напиши НОМЕР правильного варианта ответа',
    'Теперь напиши сколько очков будет давать задача',
]

export const keys = [
    'content',
    'option1',
    'option2',
    'option3',
    'option4',
    'correctOption',
    'worth',
]
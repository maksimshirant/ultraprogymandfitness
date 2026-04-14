# Contact Form Function

Папка содержит шаблон `Yandex Cloud Function`, который принимает JSON с сайта и отправляет заявку по email через SMTP.

## Что делает функция

- принимает `POST` с JSON;
- проверяет обязательные поля и согласие на обработку данных;
- отвечает с CORS-заголовками;
- отправляет письмо на адрес клуба через SMTP.

## Runtime

- `Node.js`
- entrypoint: `index.handler`

## Переменные окружения

Обязательные:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `FORM_TO_EMAIL`

Опциональные:

- `SMTP_SECURE=true|false`
- `FORM_FROM_EMAIL`
- `FORM_FROM_NAME`
- `FORM_SUBJECT`
- `ALLOWED_ORIGINS=https://ultraprofitness.ru,https://www.ultraprofitness.ru`

Если `ALLOWED_ORIGINS` не задан, функция разрешает запросы с любых origin. Для production лучше ограничить список доменом сайта.

## Ожидаемый payload

```json
{
  "name": "Иван",
  "phone": "+7 (999) 999-99-99",
  "topic": "Записаться на пробную тренировку",
  "topicValue": "free_trial",
  "trainer": "Вилков Сергей",
  "trainerValue": "Вилков Сергей",
  "question": "Хочу записаться на вечер",
  "message": "Имя: Иван\nТелефон: +7 (999) 999-99-99\nТема: Записаться на пробную тренировку",
  "consentToPrivacy": true,
  "pageUrl": "https://ultraprofitness.ru/",
  "submittedAt": "2026-04-14T10:00:00.000Z",
  "source": "site-modal"
}
```

## Деплой

1. Перейдите в папку функции:

```bash
cd cloud-functions/contact-form
```

2. Установите зависимости:

```bash
npm install --omit=dev
```

3. Создайте в `Yandex Cloud` функцию на `Node.js` и загрузите содержимое этой папки как исходники.

4. Укажите entrypoint `index.handler`.

5. Добавьте переменные окружения из списка выше.

6. Опубликуйте функцию через публичный HTTP endpoint или API Gateway.

7. URL этого endpoint подставьте во фронтенд как `VITE_CONTACT_FORM_ENDPOINT`.

## Ответы API

Успех:

```json
{
  "ok": true,
  "message": "Заявка отправлена."
}
```

Ошибка:

```json
{
  "ok": false,
  "error": "Не удалось отправить заявку."
}
```

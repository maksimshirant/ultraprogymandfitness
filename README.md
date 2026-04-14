# Ultra Pro Gym & Fitness

Сайт клуба на `React + TypeScript + Vite`.

## Development

```bash
npm install
npm run dev
```

Сборка production:

```bash
npm run build
```

## Contact Form

Форма больше не использует `web3forms`. Теперь фронтенд отправляет JSON в публичный endpoint `Yandex Cloud Function`.

Локальная переменная окружения:

```bash
VITE_CONTACT_FORM_ENDPOINT=https://<your-yandex-cloud-endpoint>
```

Пример есть в [`.env.example`](./.env.example).

Шаблон функции и инструкция по настройке SMTP лежат в [`cloud-functions/contact-form`](./cloud-functions/contact-form/README.md).

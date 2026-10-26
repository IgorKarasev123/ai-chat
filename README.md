# Чат с выбором модели

Учебный проект: Next.js + Polza.ai. Без Express и без базы. История диалога — в памяти клиента, лимит задаётся в `lib/chat.ts`.

## Запуск

```bash
cp .env.example .env.local
# вставь ключ Polza в .env.local

pnpm install
pnpm dev
```

Открой [http://localhost:3000](http://localhost:3000).

## Как устроено

1. Страница держит `messages` и обрезает до `MESSAGE_LIMIT` (сейчас 3).
2. `POST /api/chat` принимает `{ model, messages }` и прокидывает их в Polza.
3. Ответ ассистента снова добавляется в `messages` с тем же лимитом.

Список моделей: `lib/models.ts`. Подставь id из кабинета Polza.

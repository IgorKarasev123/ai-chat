# Чат с выбором модели

Учебный проект: Next.js + Polza.ai. Без Express, без базы, без памяти диалога.

## Запуск

```bash
cp .env.example .env.local
# вставь ключ Polza в .env.local

pnpm install
pnpm dev
```

Открой [http://localhost:3000](http://localhost:3000).

## Как устроено

1. Страница отправляет `POST /api/chat` с `{ model, text }`.
2. Route handler ходит в `https://polza.ai/api/v1/chat/completions`.
3. В Polza уходит только текущее сообщение — истории нет.
4. На экране хранится последняя пара «вопрос — ответ».

Список моделей: `lib/models.ts`. Подставь id из кабинета Polza.

import { NextResponse } from "next/server";

type ChatRequestBody = {
  model?: unknown;
  text?: unknown;
};

type PolzaChoice = {
  message?: {
    content?: string | null;
  };
};

type PolzaResponse = {
  choices?: PolzaChoice[];
  error?: {
    message?: string;
  };
};

export async function POST(request: Request) {
  const apiKey = process.env.POLZA_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Нет POLZA_API_KEY в .env.local" },
      { status: 500 },
    );
  }

  let body: ChatRequestBody;

  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  const model = typeof body.model === "string" ? body.model.trim() : "";
  const text = typeof body.text === "string" ? body.text.trim() : "";

  if (!model) {
    return NextResponse.json({ error: "Выбери модель" }, { status: 400 });
  }

  if (!text) {
    return NextResponse.json({ error: "Введи текст" }, { status: 400 });
  }

  const polzaResponse = await fetch(
    "https://polza.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: text }],
      }),
    },
  );

  const data = (await polzaResponse.json()) as PolzaResponse;

  if (!polzaResponse.ok) {
    const message =
      data.error?.message ??
      (polzaResponse.status === 401
        ? "Неверный ключ Polza"
        : polzaResponse.status === 402
          ? "Недостаточно средств или лимит ключа"
          : polzaResponse.status === 502 || polzaResponse.status === 503
            ? "Модель сейчас недоступна, попробуй другую"
            : `Ошибка Polza (${polzaResponse.status})`);

    return NextResponse.json({ error: message }, { status: polzaResponse.status });
  }

  const reply = data.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    return NextResponse.json(
      { error: "Модель вернула пустой ответ" },
      { status: 502 },
    );
  }

  return NextResponse.json({ reply });
}

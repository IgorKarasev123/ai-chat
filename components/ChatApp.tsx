"use client";

import { FormEvent, useState } from "react";

import { MODELS } from "@/lib/models";

import { MessageBubble } from "./MessageBubble";

type Exchange = {
  question: string;
  answer: string;
  modelId: string;
  modelLabel: string;
};

export function ChatApp() {
  const [modelId, setModelId] = useState(MODELS[0]?.id ?? "");
  const [text, setText] = useState("");
  const [exchange, setExchange] = useState<Exchange | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedModel = MODELS.find((model) => model.id === modelId);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = text.trim();

    if (!trimmed || !modelId || loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: modelId, text: trimmed }),
      });

      const data = (await response.json()) as {
        reply?: string;
        error?: string;
      };

      if (!response.ok || !data.reply) {
        setError(data.error ?? "Не удалось получить ответ");
        return;
      }

      setExchange({
        question: trimmed,
        answer: data.reply,
        modelId,
        modelLabel: selectedModel?.label ?? modelId,
      });
      setText("");
    } catch {
      setError("Сеть недоступна или сервер не отвечает");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--chat-bg)] text-[var(--foreground)]">
      <header className="border-b border-[var(--line)] bg-[var(--panel)] px-4 py-3">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-base font-semibold tracking-tight">
              Чат с выбором модели
            </h1>
            <p className="text-xs text-[var(--muted)]">
              Без памяти диалога · один вопрос → один ответ
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <span className="text-[var(--muted)]">Модель</span>
            <select
              className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-1.5 text-sm outline-none focus:border-[var(--accent)]"
              value={modelId}
              onChange={(event) => setModelId(event.target.value)}
              disabled={loading}
            >
              {MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-4">
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4">
          {!exchange && !error ? (
            <div className="m-auto max-w-sm rounded-2xl bg-[var(--panel)] px-5 py-4 text-center text-sm text-[var(--muted)] shadow-sm">
              Напиши сообщение и отправь. Следующая отправка не помнит
              предыдущую — в Polza уходит только текущий текст.
            </div>
          ) : null}

          {exchange ? (
            <>
              <MessageBubble role="user" text={exchange.question} />
              <MessageBubble
                role="assistant"
                text={exchange.answer}
                modelLabel={exchange.modelLabel}
              />
            </>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="text-sm text-[var(--muted)]">Модель думает…</div>
          ) : null}
        </div>

        <form
          onSubmit={onSubmit}
          className="sticky bottom-0 border-t border-[var(--line)] bg-[var(--panel)] pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          <div className="flex items-end gap-2 rounded-2xl border border-[var(--line)] bg-white p-2 shadow-sm">
            <textarea
              className="max-h-40 min-h-[2.75rem] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
              placeholder="Напиши сообщение…"
              value={text}
              rows={1}
              disabled={loading}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
            />
            <button
              type="submit"
              disabled={loading || !text.trim() || !modelId}
              className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Отправить
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export type ChatModel = {
  id: string;
  label: string;
};

/** Подставь id моделей из кабинета Polza.ai */
export const MODELS: ChatModel[] = [
  { id: "openai/gpt-4o-mini", label: "GPT-4o mini" },
  { id: "anthropic/claude-sonnet-5.5", label: "Claude Sonnet 5.5" },
  { id: "google/gemini-3.8-flash", label: "Gemini 3.8 Flash" },
];

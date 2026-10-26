export const MESSAGE_LIMIT = 3;

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function trimMessages<T>(messages: T[]): T[] {
  return messages.slice(-MESSAGE_LIMIT);
}

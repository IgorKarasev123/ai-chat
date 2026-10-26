import { readdir } from "node:fs/promises";
import path from "node:path";

export const WORKDIR = path.join(process.cwd(), "workdir");

export type ListFilesEntry = {
  name: string;
  type: "file" | "directory";
};

/** Список файлов и папок в директории внутри workdir. */
export async function listFiles(
  relativePath: string = ".",
): Promise<ListFilesEntry[]> {
  const target = path.resolve(WORKDIR, relativePath || ".");
  const relative = path.relative(WORKDIR, target);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Путь должен быть внутри workdir");
  }

  const entries = await readdir(target, { withFileTypes: true });

  return entries
    .map((entry) => ({
      name: entry.name,
      type: entry.isDirectory() ? ("directory" as const) : ("file" as const),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Схема tool для Ollama / OpenAI-совместимого chat API. */
export const listFilesTool = {
  type: "function" as const,
  function: {
    name: "list_files",
    description:
      "Возвращает список файлов и папок в выбранной директории внутри workdir. " +
      "Путь относительный: '.' или пустая строка — корень workdir.",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description:
            "Относительный путь внутри workdir (например '.' или 'docs')",
        },
      },
    },
  },
};

export async function runListFilesTool(
  args: { path?: string } | string,
): Promise<string> {
  const parsed =
    typeof args === "string"
      ? (JSON.parse(args || "{}") as { path?: string })
      : args;

  try {
    const files = await listFiles(parsed.path ?? ".");
    return JSON.stringify({ path: parsed.path ?? ".", files });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Неизвестная ошибка";
    return JSON.stringify({ error: message });
  }
}

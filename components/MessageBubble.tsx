type MessageBubbleProps = {
  role: "user" | "assistant";
  text: string;
  modelLabel?: string;
};

export function MessageBubble({ role, text, modelLabel }: MessageBubbleProps) {
  const isOwn = role === "user";

  return (
    <div className={`flex w-full ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[min(100%,32rem)] rounded-2xl px-3.5 py-2.5 text-[0.95rem] leading-relaxed break-words shadow-sm",
          isOwn
            ? "rounded-br-md bg-[var(--bubble-own)] text-[var(--bubble-own-text)]"
            : "rounded-bl-md bg-[var(--bubble-other)] text-[var(--bubble-other-text)]",
        ].join(" ")}
      >
        {!isOwn && modelLabel ? (
          <div className="mb-1 text-xs font-medium text-[var(--muted)]">
            {modelLabel}
          </div>
        ) : null}
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
}

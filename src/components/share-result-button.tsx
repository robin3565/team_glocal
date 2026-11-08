"use client";

import { useState } from "react";
import { shareLadderText } from "@/lib/share-result";

export function ShareResultButton({ title, text }: { title: string; text: string }) {
  const [message, setMessage] = useState("");
  const [fallback, setFallback] = useState("");

  async function share() {
    try {
      const outcome = await shareLadderText(title, text);
      setFallback("");
      setMessage(outcome === "copied" ? "결과를 복사했습니다. 카카오톡 등에 붙여넣기 해 주세요." : "");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setFallback(text);
      setMessage("공유 창을 열지 못했습니다. 아래 글을 길게 눌러 복사해 주세요.");
    }
  }

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={() => void share()}
        className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-card"
      >
        결과 공유
      </button>
      {message ? <p className="text-sm text-muted">{message}</p> : null}
      {fallback ? (
        <p className="rounded-2xl border border-line bg-card px-4 py-3 text-sm leading-6 whitespace-pre-wrap select-all">
          {fallback}
        </p>
      ) : null}
    </div>
  );
}

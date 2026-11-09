"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { useTeam } from "@/lib/team-store";

const pips: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

export default function DicePage() {
  const { addDice } = useTeam();
  const [count, setCount] = useState(1);
  const [faces, setFaces] = useState<number[] | null>(null);
  const [rolling, setRolling] = useState(false);
  const [rollCount, setRollCount] = useState(0);
  const timerRef = useRef<number | null>(null);
  const total = faces?.reduce((sum, face) => sum + face, 0) ?? 0;

  function stopRoll() {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  useLayoutEffect(() => {
    return () => {
      stopRoll();
      setCount(1);
      setFaces(null);
      setRolling(false);
      setRollCount(0);
    };
  }, []);

  function changeCount(next: number) {
    stopRoll();
    setRolling(false);
    setCount(next);
    setFaces(null);
  }

  function roll() {
    if (rolling) return;
    const finalFaces = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * 6));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stopRoll();
    setRollCount((current) => current + 1);
    if (reduceMotion) {
      setFaces(finalFaces);
      setRolling(false);
      addDice(finalFaces);
      return;
    }

    setRolling(true);
    setFaces(Array.from({ length: count }, () => 1 + Math.floor(Math.random() * 6)));
    let ticks = 0;
    timerRef.current = window.setInterval(() => {
      ticks += 1;
      if (ticks < 8) {
        setFaces(Array.from({ length: count }, () => 1 + Math.floor(Math.random() * 6)));
        return;
      }
      stopRoll();
      setFaces(finalFaces);
      setRolling(false);
      addDice(finalFaces);
    }, 70);
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        kicker="DICE"
        title="주사위 던지기"
        description="굴린 주사위는 추첨 기록 맨 아래에 남습니다. 다시 굴려도 이전 눈은 지워지지 않습니다."
      />

      <section className="grid gap-2">
        <p className="text-sm font-semibold">주사위 개수</p>
        <div className="flex items-center justify-between rounded-2xl border border-line bg-card px-3 py-2">
          <button
            type="button"
            onClick={() => changeCount(Math.max(1, count - 1))}
            disabled={count <= 1}
            className="grid size-10 place-items-center rounded-full border border-line text-lg disabled:opacity-40"
            aria-label="주사위 줄이기"
          >
            −
          </button>
          <p className="text-base font-bold">{count}개</p>
          <button
            type="button"
            onClick={() => changeCount(Math.min(3, count + 1))}
            disabled={count >= 3}
            className="grid size-10 place-items-center rounded-full border border-line text-lg disabled:opacity-40"
            aria-label="주사위 늘리기"
          >
            +
          </button>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={roll}
          disabled={rolling}
          className="rounded-xl bg-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {rolling ? "굴리는 중" : faces ? "다시 던지기" : "던지기"}
        </button>
        <Link href="/events" className="rounded-full border border-line px-4 py-2 text-sm font-semibold">
          추첨으로
        </Link>
      </div>

      {faces ? (
        <section className="grid justify-items-center gap-4" aria-live="polite">
          <div className="flex h-32 flex-wrap items-end justify-center gap-3">
            {faces.map((face, index) => (
              <DieFace key={`${rollCount}-${index}`} value={face} rolling={rolling} delay={index * 60} />
            ))}
          </div>
          <p className="text-center text-sm text-muted">
            {rolling ? "굴리는 중" : faces.join(" · ")}
            {!rolling && faces.length > 1 ? (
              <span className="mt-1 block text-lg font-bold text-foreground">합계 {total}</span>
            ) : null}
          </p>
        </section>
      ) : null}
    </div>
  );
}

function DieFace({ value, rolling, delay }: { value: number; rolling: boolean; delay: number }) {
  const dots = pips[value] ?? [];
  return (
    <div
      className={`dice-face grid size-24 grid-cols-3 grid-rows-3 rounded-2xl bg-ink p-3 shadow-[0_16px_30px_-20px_#172033] ${
        rolling ? "is-rolling" : "is-landed"
      }`}
      style={{ animationDelay: `${delay}ms` }}
      role="img"
      aria-label={rolling ? "굴리는 중" : `${value} 눈`}
    >
      {Array.from({ length: 9 }, (_, index) => (
        <span key={index} className="grid place-items-center">
          {dots.includes(index) ? <span className="size-3 rounded-full bg-white" /> : null}
        </span>
      ))}
    </div>
  );
}

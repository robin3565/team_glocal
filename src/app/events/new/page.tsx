"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { LadderBoard } from "@/components/ladder-board";
import { ShareResultButton } from "@/components/share-result-button";
import { APP_TODAY, memberName } from "@/lib/format";
import { createLadder, winningResults } from "@/lib/ladder";
import { ladderShareText } from "@/lib/share-result";
import { useTeam } from "@/lib/team-store";

export default function NewLadderPage() {
  const { members, addLadder } = useTeam();
  const activeMembers = members.filter((member) => member.active);
  const [title, setTitle] = useState(formatDayTitle(APP_TODAY));
  const [selected, setSelected] = useState<string[]>(activeMembers.map((member) => member.id));
  const [winnerCount, setWinnerCount] = useState(1);
  const [drawn, setDrawn] = useState<ReturnType<typeof createLadder> | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const locked = drawn !== null;

  function applySelection(next: string[]) {
    if (locked) return;
    setSelected(next);
    setWinnerCount((count) => Math.min(count, Math.max(next.length, 1)));
  }

  function toggleMember(memberId: string) {
    const next = selected.includes(memberId)
      ? selected.filter((id) => id !== memberId)
      : [...selected, memberId];
    applySelection(next);
  }

  function selectAll() {
    applySelection(activeMembers.map((member) => member.id));
  }

  function clearAll() {
    applySelection([]);
  }

  function changeWinnerCount(next: number) {
    if (locked) return;
    const limit = Math.max(selected.length, 1);
    setWinnerCount(Math.min(Math.max(next, 1), limit));
  }

  function draw() {
    if (locked) return;
    if (selected.length < 2) {
      setMessage("참가자는 두 명 이상이어야 합니다.");
      return;
    }
    if (winnerCount < 1 || winnerCount > selected.length) {
      setMessage("당첨 인원은 참가자 수 안에서 정해 주세요.");
      return;
    }
    setMessage("");
    const prizes = [
      ...Array.from({ length: winnerCount }, () => "당첨"),
      ...Array.from({ length: selected.length - winnerCount }, () => "꽝"),
    ];
    setDrawn(createLadder(selected, prizes, Date.now()));
  }

  function showResult() {
    if (!drawn || savedId) return;
    const id = `l_${crypto.randomUUID().slice(0, 8)}`;
    const recordTitle = title.trim() || "이름 없는 사다리";
    addLadder({
      id,
      title: recordTitle,
      date: APP_TODAY,
      ...drawn,
    });
    setSavedId(id);
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        kicker="NEW LADDER"
        title="새 사다리"
        description="사다리를 탄 뒤 결과를 열면 바로 저장됩니다. 한 번 연 결과는 다시 탈 수 없습니다."
      />

      <label className="grid gap-2 text-sm font-semibold">
        제목
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={locked}
          className="rounded-xl border border-line bg-card px-3 py-2 font-normal disabled:opacity-60"
        />
      </label>

      <fieldset disabled={locked} className="disabled:opacity-60">
        <div className="flex items-center justify-between gap-3">
          <legend className="text-sm font-semibold">참가자</legend>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={selectAll}
              disabled={selected.length === activeMembers.length}
              className="rounded-full border border-line bg-card px-2.5 py-1 text-xs font-semibold disabled:opacity-40"
            >
              전체 선택
            </button>
            <button
              type="button"
              onClick={clearAll}
              disabled={selected.length === 0}
              className="rounded-full border border-line bg-card px-2.5 py-1 text-xs font-semibold disabled:opacity-40"
            >
              전체 해제
            </button>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {activeMembers.map((member) => {
            const on = selected.includes(member.id);
            return (
              <button
                key={member.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggleMember(member.id)}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  on ? "bg-ink text-card" : "border border-line bg-card"
                }`}
              >
                {member.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <section className="grid gap-2">
        <p className="text-sm font-semibold">당첨 인원 설정</p>
        <div className="flex items-center justify-between rounded-2xl border border-line bg-card px-3 py-2">
          <button
            type="button"
            onClick={() => changeWinnerCount(winnerCount - 1)}
            disabled={locked || winnerCount <= 1}
            className="grid size-10 place-items-center rounded-full border border-line text-lg disabled:opacity-40"
            aria-label="당첨 인원 줄이기"
          >
            −
          </button>
          <p className="text-base font-bold">{winnerCount}명</p>
          <button
            type="button"
            onClick={() => changeWinnerCount(winnerCount + 1)}
            disabled={locked || winnerCount >= selected.length}
            className="grid size-10 place-items-center rounded-full border border-line text-lg disabled:opacity-40"
            aria-label="당첨 인원 늘리기"
          >
            +
          </button>
        </div>
        <p className="text-xs text-muted">
          {selected.length === 0
            ? "참가자를 골라 주세요."
            : `참가자 ${selected.length}명 중 ${winnerCount}명이 당첨됩니다.`}
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        {savedId && drawn ? (
          <ShareResultButton
            title={title.trim() || "이름 없는 사다리"}
            text={ladderShareText(title.trim() || "이름 없는 사다리", drawn.results, members)}
          />
        ) : drawn ? (
          <button
            type="button"
            onClick={showResult}
            className="rounded-full bg-green px-4 py-2 text-sm font-semibold text-white"
          >
            결과 보기
          </button>
        ) : (
          <button
            type="button"
            onClick={draw}
            className="rounded-full bg-persimmon px-4 py-2 text-sm font-semibold text-white"
          >
            사다리 타기
          </button>
        )}
        <Link href="/events" className="rounded-full border border-line px-4 py-2 text-sm font-semibold">
          {savedId ? "사다리로" : "취소"}
        </Link>
      </div>
      {drawn && !savedId ? <p className="text-sm text-muted">결과를 열면 저장되고, 다시 탈 수 없습니다.</p> : null}
      {savedId ? <p className="text-sm text-muted">결과를 저장했습니다. 이 사다리는 다시 탈 수 없습니다.</p> : null}
      {message ? <p className="text-sm text-persimmon">{message}</p> : null}

      {drawn && savedId ? (
        <section className="rounded-2xl border border-ink bg-card p-4 shadow-[4px_4px_0_#241c14]">
          <LadderBoard
            names={drawn.order.map((memberId) => memberName(members, memberId))}
            prizes={drawn.prizes}
            links={drawn.links}
            reveal
          />
          <p className="mt-4 text-xs font-semibold tracking-[0.14em] text-green">당첨</p>
          <ul className="mt-2 grid gap-2">
            {winningResults(drawn.results).map((result) => (
              <li key={result.memberId} className="rounded-2xl bg-green-soft px-4 py-3 text-lg font-bold text-green">
                {memberName(members, result.memberId)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function formatDayTitle(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(year, month - 1, day));
}

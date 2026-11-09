"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { PageHeader } from "@/components/app-shell";
import { formatClock, formatDate, memberName } from "@/lib/format";
import { tallyByMember, tallyEntries, winningResults } from "@/lib/ladder";
import { useTeam } from "@/lib/team-store";
import type { DiceRecord, LadderRecord } from "@/lib/types";

type FeedItem =
  | { kind: "ladder"; at: string; item: LadderRecord }
  | { kind: "dice"; at: string; item: DiceRecord };

export default function EventsPage() {
  const { ladders, dice, members } = useTeam();
  const feedEnd = useRef<HTMLDivElement>(null);
  const feed: FeedItem[] = [
    ...ladders.map((item) => ({ kind: "ladder" as const, at: item.createdAt, item })),
    ...dice.map((item) => ({ kind: "dice" as const, at: item.createdAt, item })),
  ].sort((a, b) => a.at.localeCompare(b.at) || a.item.id.localeCompare(b.item.id));

  useEffect(() => {
    feedEnd.current?.scrollIntoView({ block: "end" });
  }, [feed.length]);
  const tallies = tallyByMember(ladders);
  const rankedMembers = members
    .filter((member) => member.active || tallies.has(member.id))
    .sort((a, b) => {
      const wins = (id: string) => tallies.get(id)?.get("당첨") ?? 0;
      return wins(b.id) - wins(a.id) || members.indexOf(a) - members.indexOf(b);
    });

  return (
    <div className="grid gap-6">
      <PageHeader
        kicker="DRAW"
        title="추첨"
        description="이전 기록은 위에 남고, 새로 연 사다리와 주사위는 아래에 쌓입니다. 테스트 사다리만 저장하지 않습니다."
      />

      <div className="grid gap-2">
        <Link href="/events/new" className="rounded-2xl bg-green px-4 py-3 text-white">
          <span className="block text-sm font-bold">새 사다리</span>
          <span className="mt-1 block text-xs text-white/80">결과를 열면 기록 맨 아래에 추가됩니다.</span>
        </Link>
        <Link href="/events/test" className="rounded-2xl border border-line bg-card px-4 py-3">
          <span className="block text-sm font-bold">테스트 사다리</span>
          <span className="mt-1 block text-xs text-muted">저장하지 않고 타 봅니다.</span>
        </Link>
        <Link href="/events/dice" className="rounded-2xl border border-line bg-card px-4 py-3">
          <span className="block text-sm font-bold">주사위 던지기</span>
          <span className="mt-1 block text-xs text-muted">굴릴 때마다 기록 맨 아래에 남습니다.</span>
        </Link>
      </div>

      <section>
        <h2 className="px-1 text-sm font-semibold text-muted">기록</h2>
        {feed.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-line px-4 py-8 text-sm text-muted">
            아직 저장된 추첨이 없습니다.
          </p>
        ) : (
          <ol className="mt-3 grid gap-3">
            {feed.map((entry, index) => (
              <li key={entry.item.id}>
                {entry.kind === "ladder" ? (
                  <Link
                    href={`/events/${entry.item.id}`}
                    className="block rounded-2xl border border-line bg-card p-4 shadow-[0_12px_30px_-24px_#172033] hover:border-green"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-lg font-bold">{entry.item.title}</h3>
                      <p className="shrink-0 text-xs text-muted">
                        {index + 1} · {formatDate(entry.item.date)} {formatClock(entry.item.createdAt)}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {winningResults(entry.item.results)
                        .map((result) =>
                          result.prize === "당첨"
                            ? memberName(members, result.memberId)
                            : `${memberName(members, result.memberId)} ${result.prize}`,
                        )
                        .join(" · ")}
                    </p>
                  </Link>
                ) : (
                  <article className="rounded-2xl border border-line bg-card p-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-lg font-bold">주사위</h3>
                      <p className="shrink-0 text-xs text-muted">
                        {index + 1} · {formatClock(entry.item.createdAt)}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-muted">
                      {entry.item.faces.join(" · ")}
                      {entry.item.faces.length > 1 ? (
                        <span className="ml-2 font-bold text-foreground">
                          합계 {entry.item.faces.reduce((sum, face) => sum + face, 0)}
                        </span>
                      ) : null}
                    </p>
                  </article>
                )}
              </li>
            ))}
          </ol>
        )}
        <div ref={feedEnd} />
      </section>

      <section>
        <h2 className="px-1 text-sm font-semibold text-muted">누적 결과</h2>
        {rankedMembers.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-line px-4 py-8 text-sm text-muted">
            아직 누적된 결과가 없습니다.
          </p>
        ) : (
          <ul className="mt-3 overflow-hidden rounded-2xl border border-line bg-card">
            {rankedMembers.map((member) => {
              const entries = tallyEntries(tallies.get(member.id));
              return (
                <li
                  key={member.id}
                  className="flex items-start justify-between gap-3 border-b border-line px-4 py-3 last:border-b-0"
                >
                  <p className="shrink-0 font-semibold">{member.name}</p>
                  {entries.length === 0 ? (
                    <p className="text-sm text-muted">아직 없음</p>
                  ) : (
                    <p className="text-right text-sm leading-5">
                      {entries.map(([prize, count], index) => (
                        <span key={prize} className={prize === "당첨" ? "font-bold text-green" : "text-muted"}>
                          {index > 0 ? " · " : ""}
                          {prize} {count}
                        </span>
                      ))}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

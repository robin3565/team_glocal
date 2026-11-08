"use client";

import Link from "next/link";
import { useMemo } from "react";
import { LadderBoard } from "@/components/ladder-board";
import { ShareResultButton } from "@/components/share-result-button";
import { formatFullDate, memberName } from "@/lib/format";
import { winningResults } from "@/lib/ladder";
import { ladderShareText } from "@/lib/share-result";
import { useTeam } from "@/lib/team-store";

export function LadderDetail({ id }: { id: string }) {
  const { ladders, members } = useTeam();
  const game = ladders.find((item) => item.id === id);
  const names = useMemo(() => {
    if (!game) return [];
    return game.order.map((memberId) => memberName(members, memberId));
  }, [game, members]);
  const winnersOnly = game ? winningResults(game.results).length < game.results.length : false;

  if (!game) {
    return (
      <div className="grid gap-3">
        <h1 className="text-2xl font-bold">사다리 기록을 찾지 못했습니다</h1>
        <Link href="/events" className="text-sm font-semibold text-green">
          사다리로
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div>
        <Link href="/events" className="text-sm font-semibold text-green">
          사다리
        </Link>
        <h1 className="mt-2 text-3xl font-bold">{game.title}</h1>
        <p className="mt-2 text-sm text-muted">{formatFullDate(game.date)}</p>
        <div className="mt-4">
          <ShareResultButton title={game.title} text={ladderShareText(game.title, game.results, members)} />
        </div>
      </div>

      <section className="rounded-2xl border border-line bg-card p-4">
        <LadderBoard names={names} prizes={game.prizes} links={game.links} reveal />
      </section>
      {winnersOnly ? (
        <section>
          <h2 className="text-lg font-bold">당첨</h2>
          <ul className="mt-3 grid gap-2">
            {winningResults(game.results).map((result) => (
              <li key={result.memberId} className="rounded-2xl bg-green-soft px-4 py-3 text-lg font-bold text-green">
                {memberName(members, result.memberId)}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section>
          <h2 className="text-lg font-bold">결과</h2>
          <ul className="mt-3 grid gap-2">
            {game.results.map((result) => (
              <li key={result.memberId} className="flex items-center justify-between rounded-2xl border border-line bg-card px-4 py-3">
                <span className="font-semibold">{memberName(members, result.memberId)}</span>
                <span>{result.prize}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
